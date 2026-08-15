import { Injectable, ServiceUnavailableException } from "@nestjs/common";
import { arcTestnet } from "@arcpos/config";

const transferTopic = "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55aebc7f7b4e";

type RpcResponse<T> = { result?: T; error?: { message: string } };

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

  async findPayment({ destination, amount, fromBlock }: { destination: string; amount: string; fromBlock?: string }) {
    const paddedDestination = destination.slice(2).toLowerCase().padStart(64, "0");
    const latestBlock = await this.rpc<string>("eth_blockNumber", []);
    const latest = BigInt(latestBlock);
    const searchFrom = fromBlock ? BigInt(fromBlock) : latest > 1_000n ? latest - 1_000n : 0n;
    const logs = await this.rpc<Array<{ address: string; topics: string[]; transactionHash: string; blockNumber: string }>>(
      "eth_getLogs",
      [{
        address: arcTestnet.usdcAddress,
        fromBlock: `0x${searchFrom.toString(16)}`,
        toBlock: latestBlock,
        topics: [transferTopic, null, `0x${paddedDestination}`],
      }],
    );

    const expected = BigInt(amount);
    const match = logs.find((log) => BigInt(`0x${log.topics[3].slice(2)}`) === expected);
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
