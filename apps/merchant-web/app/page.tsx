"use client";

import { useEffect, useMemo, useState } from "react";

type Quote = { rate: string; quotedAt: string; expiresInSeconds: number; source: string };

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";
const merchantId = "demo-merchant";

function formatArs(value: string) {
  if (!value) return "0";
  return new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 }).format(Number(value));
}

function formatUsdc(value: number) {
  return new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
}

export default function Home() {
  const [amount, setAmount] = useState("");
  const [quote, setQuote] = useState<Quote | null>(null);
  const [quoteError, setQuoteError] = useState("");
  const [review, setReview] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const arsAmount = Number(amount) || 0;
  const usdcAmount = useMemo(() => (quote ? arsAmount / Number(quote.rate) : 0), [arsAmount, quote]);

  async function refreshQuote() {
    setRefreshing(true);
    try {
      const response = await fetch(`${apiUrl}/merchant/quotes/usdc-ars`, { cache: "no-store" });
      if (!response.ok) throw new Error("La cotización no está disponible");
      setQuote(await response.json());
      setQuoteError("");
    } catch (error) {
      setQuoteError(error instanceof Error ? error.message : "La cotización no está disponible");
    } finally {
      setRefreshing(false);
    }
  }

  useEffect(() => {
    void refreshQuote();
    const interval = window.setInterval(() => void refreshQuote(), 30_000);
    return () => window.clearInterval(interval);
  }, []);

  function startReview() {
    if (arsAmount > 0 && quote) setReview(true);
  }

  return (
    <main className="shell">
      <header className="topbar">
        <div className="brand"><span className="brand-mark">A</span><span>ArcPOS</span></div>
        <div className="network"><span className="live-dot" /> Arc Testnet <span className="network-separator">/</span> Sandbox</div>
      </header>

      <section className="workspace">
        <div className="intro">
          <p className="eyebrow">Nuevo cobro</p>
          <h1>Cobrá en pesos.<br /><em>Liquidá en dólares.</em></h1>
          <p className="intro-copy">Ingresá el total de la venta y revisá cuánto USDC recibiría tu comercio antes de generar el cobro.</p>
        </div>

        {!review ? (
          <div className="flow-grid">
            <div className="amount-panel">
              <label htmlFor="amount">Total a cobrar</label>
              <div className="amount-input"><span>$</span><input id="amount" inputMode="decimal" placeholder="0" value={amount} onChange={(event) => setAmount(event.target.value.replace(/[^\d]/g, ""))} autoFocus /><span className="currency">ARS</span></div>
              <p className="helper">El cliente pagará este importe en pesos argentinos.</p>
              <button className="primary" disabled={!arsAmount || !quote} onClick={startReview}>Revisar cobro <span>→</span></button>
            </div>
            <QuoteCard amount={usdcAmount} quote={quote} error={quoteError} refreshing={refreshing} onRefresh={refreshQuote} />
          </div>
        ) : (
          <div className="review-panel">
            <div className="review-heading"><button className="back" onClick={() => setReview(false)}>← Editar importe</button><p className="eyebrow">Antes de cobrar</p><h2>Revisá los números.</h2></div>
            <div className="review-total"><span>Cliente paga</span><strong>$ {formatArs(amount)} <small>ARS</small></strong></div>
            <div className="review-arrow">↓</div>
            <div className="review-total highlighted"><span>Tu comercio recibe</span><strong>{formatUsdc(usdcAmount)} <small>USDC</small></strong><p>En tu wallet de Arc</p></div>
            <div className="review-meta"><span>Cotización {quote?.rate} ARS / USDC</span><span>Válida por {quote?.expiresInSeconds}s</span></div>
            <button className="primary" onClick={() => setReview(false)}>Generar cobro <span>→</span></button>
            <p className="disclaimer">La cotización es de referencia para sandbox. El cobro todavía no fue creado ni confirmado.</p>
          </div>
        )}
      </section>

      <footer><span>ArcPOS Argentina</span><span>USDC settlement · Arc Testnet</span></footer>
      <style jsx global>{styles}</style>
    </main>
  );
}

function QuoteCard({ amount, quote, error, refreshing, onRefresh }: { amount: number; quote: Quote | null; error: string; refreshing: boolean; onRefresh: () => void }) {
  return <aside className="quote-card"><div className="quote-head"><span>Cotización en vivo</span><button onClick={onRefresh} aria-label="Actualizar cotización">↻</button></div>{error ? <div className="quote-error"><strong>Sin cotización</strong><p>{error}. Configurá `USDC_ARS_RATE` en la API.</p></div> : <><div className="quote-value">{quote ? formatUsdc(amount) : "--.--"}<span>USDC</span></div><div className="quote-rate"><span>1 USDC</span><strong>{quote?.rate ?? "--"} ARS</strong></div><div className="quote-line"><span className="live-dot" />{refreshing ? "Actualizando..." : `Actualizada ${quote ? new Date(quote.quotedAt).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" }) : "--:--"}`}</div></>}</aside>;
}

const styles = `
:root { color-scheme: light; --ink:#14231f; --muted:#71807b; --line:#dce7e1; --paper:#f4f7f3; --card:#fff; --mint:#b9f08f; --deep:#163e32; }
* { box-sizing:border-box; }
body { margin:0; background:var(--paper); color:var(--ink); font-family:ui-sans-serif, system-ui, sans-serif; }
button,input { font:inherit; }
.shell { min-height:100dvh; display:flex; flex-direction:column; }
.topbar { height:76px; padding:0 clamp(22px,5vw,72px); display:flex; align-items:center; justify-content:space-between; border-bottom:1px solid var(--line); }
.brand { display:flex; align-items:center; gap:10px; font-size:15px; font-weight:800; letter-spacing:-.03em; }
.brand-mark { display:grid; place-items:center; width:28px; height:28px; border-radius:9px; color:var(--deep); background:var(--mint); font-family:'DM Mono',monospace; font-size:14px; }
.network,.quote-line { color:var(--muted); font:11px 'DM Mono',monospace; letter-spacing:.02em; }
.network-separator { margin:0 8px; color:#b5c2bc; }
.live-dot { display:inline-block; width:7px; height:7px; margin-right:7px; border-radius:50%; background:#78c668; box-shadow:0 0 0 3px #dff4d7; }
.workspace { width:min(100%,1080px); flex:1; margin:0 auto; padding:clamp(58px,9vw,112px) 24px 72px; }
.intro { max-width:580px; }
.eyebrow { margin:0 0 16px; color:#789087; font:500 11px 'DM Mono',monospace; letter-spacing:.15em; text-transform:uppercase; }
h1,h2 { margin:0; letter-spacing:-.07em; line-height:.98; font-weight:700; }
h1 { font-size:clamp(42px,6vw,72px); }
h1 em { color:#6d857c; font-style:normal; }
.intro-copy { max-width:420px; margin:22px 0 0; color:var(--muted); font-size:15px; line-height:1.7; }
.flow-grid { display:grid; grid-template-columns:minmax(0,1.15fr) minmax(280px,.85fr); gap:22px; margin-top:64px; align-items:stretch; }
.amount-panel,.quote-card,.review-panel { border:1px solid var(--line); background:var(--card); border-radius:18px; }
.amount-panel { padding:32px; }
label { display:block; margin-bottom:13px; color:#6f7e78; font:11px 'DM Mono',monospace; letter-spacing:.1em; text-transform:uppercase; }
.amount-input { display:flex; align-items:center; border-bottom:2px solid var(--deep); padding:4px 0 10px; }
.amount-input > span:first-child { color:#83928b; font-size:28px; }
.amount-input input { width:100%; border:0; outline:0; background:transparent; color:var(--ink); font-size:clamp(44px,6vw,68px); font-weight:700; letter-spacing:-.08em; }
.amount-input input::placeholder { color:#d4dfd9; }
.currency { color:#7d8d86; font:12px 'DM Mono',monospace; }
.helper { min-height:39px; margin:16px 0 26px; color:var(--muted); font-size:13px; line-height:1.5; }
.primary { width:100%; border:0; border-radius:10px; padding:15px 17px; display:flex; justify-content:space-between; align-items:center; cursor:pointer; background:var(--deep); color:white; font-size:14px; font-weight:700; transition:transform .18s,background .18s; }
.primary:hover:not(:disabled) { background:#205846; transform:translateY(-1px); }
.primary:active:not(:disabled) { transform:scale(.985); }
.primary:disabled { cursor:not-allowed; opacity:.35; }
.quote-card { padding:25px; display:flex; flex-direction:column; justify-content:space-between; min-height:255px; background:#e8f5e5; border-color:#d2e9d0; }
.quote-head { display:flex; justify-content:space-between; color:#5b7668; font:11px 'DM Mono',monospace; text-transform:uppercase; letter-spacing:.1em; }
.quote-head button,.back { border:0; background:transparent; color:#658075; cursor:pointer; }
.quote-value { margin:34px 0 22px; font-size:48px; font-weight:700; letter-spacing:-.08em; }
.quote-value span { margin-left:8px; color:#6c8879; font:12px 'DM Mono',monospace; letter-spacing:.04em; }
.quote-rate,.review-meta { display:flex; justify-content:space-between; gap:16px; color:#728b7d; font:12px 'DM Mono',monospace; }
.quote-rate strong { color:var(--ink); font-weight:500; }
.quote-line { padding-top:18px; border-top:1px solid #cfe5ca; }
.quote-error { margin:auto 0; color:#75584b; font-size:13px; line-height:1.5; }
.quote-error strong { display:block; margin-bottom:5px; color:#594239; }
.review-panel { max-width:620px; margin:64px auto 0; padding:34px; }
.review-heading { padding-bottom:32px; border-bottom:1px solid var(--line); }
.back { padding:0; margin-bottom:34px; font:12px 'DM Mono',monospace; }
h2 { font-size:clamp(34px,5vw,52px); }
.review-total { padding:27px 0; display:flex; flex-direction:column; gap:10px; }
.review-total span,.review-total p { margin:0; color:var(--muted); font-size:13px; }
.review-total strong { font-size:40px; letter-spacing:-.07em; }
.review-total small { color:#789087; font:12px 'DM Mono',monospace; letter-spacing:0; }
.review-arrow { color:#96a9a0; font:20px 'DM Mono',monospace; }
.highlighted { margin:0 -12px; padding:27px 12px; border-radius:12px; background:#e8f5e5; }
.highlighted strong { color:#1a5b43; }
.review-meta { margin:25px 0; padding-top:18px; border-top:1px solid var(--line); }
.disclaimer { margin:18px 0 0; color:#8b9993; font-size:11px; line-height:1.5; text-align:center; }
footer { padding:22px clamp(22px,5vw,72px); display:flex; justify-content:space-between; color:#91a099; font:10px 'DM Mono',monospace; border-top:1px solid var(--line); }
@media (max-width:700px) { .topbar { height:64px; } .network { font-size:9px; } .workspace { padding-top:52px; } .flow-grid { grid-template-columns:1fr; margin-top:42px; } .amount-panel { padding:24px; } .quote-card { min-height:230px; } .review-panel { margin-top:42px; padding:24px; } footer { gap:10px; flex-direction:column; } }
@media (prefers-reduced-motion:reduce) { .primary { transition:none; } }
`;
