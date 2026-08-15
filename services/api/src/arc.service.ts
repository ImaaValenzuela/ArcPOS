import { Injectable, ServiceUnavailableException } from "@nestjs/common";
import { arcTestnet } from "@arcpos/config";

/**
 * topic0 de `Transfer(address,address,uint256)`, identico en todo ERC-20.
 * Es keccak256 de la firma del evento, no un valor configurable.
 */
const transferTopic = "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";

/** `Transfer` indexa `from` y `to`: topic0, from, to. El monto viaja en `data`. */
const transferTopicCount = 3;

type RpcResponse<T> = { result?: T; error?: { message: string } };

type TransferLog = {
  address: string;
  topics: string[];
  data: string;
  transactionHash: string;
  blockNumber: string;
};

/** Lee el monto transferido desde `data`. Devuelve null si el log no tiene la forma esperada. */
function readTransferValue(log: TransferLog): bigint | null {
  if (log.topics.length !== transferTopicCount) return null;
  if (!log.data || log.data === "0x") return null;

  try {
    return BigInt(log.data);
  } catch {
    return null;
  }
}

@Injectable()
export class ArcService {
  async getNetwork() {
    const chainId = await this.rpc<string>("eth_chainId", []);

    return {
      network: "arc-testnet",
      chainId: Number.parseInt(chainId, 16),
      rpcUrl: arcTestnet.rpcUrl,
      usdcAddress: arcTestnet.usdcAddress,
      explorerUrl: arcTestnet.explorerUrl,
    };
  }

  async getUsdcBalance(address: string) {
    const data = `0x70a08231${address.slice(2).toLowerCase().padStart(64, "0")}`;
    const raw = await this.rpc<string>("eth_call", [{ to: arcTestnet.usdcAddress, data }, "latest"]);
    const units = BigInt(raw);
    return {
      address,
      token: "USDC",
      network: "arc-testnet",
      units: units.toString(),
      amount: `${units / 1_000_000n}.${(units % 1_000_000n).toString().padStart(6, "0")}`,
      decimals: arcTestnet.usdcDecimals,
      explorerUrl: `${arcTestnet.explorerUrl}/address/${address}`,
    };
  }

  async findPayment({ destination, amount, fromBlock }: { destination: string; amount: string; fromBlock?: string }) {
    const paddedDestination = destination.slice(2).toLowerCase().padStart(64, "0");
    const latestBlock = await this.rpc<string>("eth_blockNumber", []);
    const latest = BigInt(latestBlock);
    const searchFrom = fromBlock ? BigInt(fromBlock) : latest > 1_000n ? latest - 1_000n : 0n;
    const logs = await this.rpc<TransferLog[]>(
      "eth_getLogs",
      [{
        address: arcTestnet.usdcAddress,
        fromBlock: `0x${searchFrom.toString(16)}`,
        toBlock: latestBlock,
        topics: [transferTopic, null, `0x${paddedDestination}`],
      }],
    );

    const expected = BigInt(amount);
    const match = logs.find((log) => readTransferValue(log) === expected);
    return match
      ? { status: "confirmed" as const, txHash: match.transactionHash, blockNumber: Number.parseInt(match.blockNumber, 16) }
      : { status: "pending" as const };
  }

  private async rpc<T>(method: string, params: unknown[]): Promise<T> {
    const response = await fetch(process.env.ARC_TESTNET_RPC_URL ?? arcTestnet.rpcUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ jsonrpc: "2.0", id: Date.now(), method, params }),
    });
    if (!response.ok) throw new ServiceUnavailableException("Arc RPC unavailable");
    const body = (await response.json()) as RpcResponse<T>;
    if (body.error || body.result === undefined) throw new ServiceUnavailableException(body.error?.message ?? "Arc RPC error");
    return body.result;
  }
}
