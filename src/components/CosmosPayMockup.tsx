import { useState } from "react";
import { ArrowDownToLine, ArrowUpFromLine, ArrowDownUp, CreditCard, Building2 } from "lucide-react";

export function CosmosPayMockup() {
  const [mode, setMode] = useState<"buy" | "sell">("buy");
  const [amount, setAmount] = useState("500");
  const [payCurrency] = useState("ARS");

  const feePercent = 0.01;
  const feeFixed = 0.1;
  const rate = 1150; // ARS per USDT (mock)
  const numAmount = parseFloat(amount) || 0;
  const receiveUsdt = mode === "buy"
    ? (numAmount - feeFixed) / (1 + feePercent) / rate
    : 0;
  const receiveArs = mode === "sell"
    ? numAmount * rate * (1 - feePercent) - feeFixed
    : 0;
  const receiveDisplay = mode === "buy"
    ? (receiveUsdt > 0 ? receiveUsdt.toFixed(2) : "0.00")
    : (receiveArs > 0 ? receiveArs.toLocaleString("es-AR", { maximumFractionDigits: 0 }) : "0");

  return (
    <div className="w-full max-w-[440px] ml-auto">
      <div className="flex gap-1 p-1 rounded-xl bg-cosmos-surface-elevated border border-cosmos-border mb-6">
        <button
          type="button"
          onClick={() => setMode("buy")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium transition-all ${
            mode === "buy"
              ? "bg-cosmos-accent text-cosmos-bg"
              : "text-cosmos-muted hover:text-cosmos-text hover:bg-cosmos-surface"
          }`}
        >
          <ArrowDownToLine size={18} />
          Comprar
        </button>
        <button
          type="button"
          onClick={() => setMode("sell")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium transition-all ${
            mode === "sell"
              ? "bg-cosmos-accent text-cosmos-bg"
              : "text-cosmos-muted hover:text-cosmos-text hover:bg-cosmos-surface"
          }`}
        >
          <ArrowUpFromLine size={18} />
          Vender
        </button>
      </div>

      <div className="rounded-2xl border border-cosmos-border bg-cosmos-surface overflow-hidden">
        <div className="p-5 border-b border-cosmos-border">
          <p className="text-xs text-cosmos-muted mb-2">
            {mode === "buy" ? "Pagás" : "Vendés"}
          </p>
          <div className="flex gap-3">
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^0-9.,]/g, ""))}
              className="flex-1 bg-transparent text-2xl font-semibold text-cosmos-text outline-none placeholder:text-cosmos-muted"
              placeholder="0.00"
            />
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cosmos-surface-elevated border border-cosmos-border min-w-[100px] justify-center">
              <span className="text-sm font-medium text-cosmos-text">
                {mode === "buy" ? payCurrency : "USDT"}
              </span>
            </div>
          </div>
          <div className="flex gap-2 mt-3 flex-wrap">
            {(mode === "buy" ? ["100", "500", "1000", "5000"] : ["10", "50", "100", "500"]).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setAmount(v)}
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-cosmos-surface-elevated text-cosmos-muted hover:text-cosmos-text hover:bg-cosmos-border transition-colors"
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-center -my-3 relative z-10">
          <div className="w-10 h-10 rounded-full bg-cosmos-surface border-2 border-cosmos-bg flex items-center justify-center">
            <ArrowDownUp size={18} className="text-cosmos-muted" />
          </div>
        </div>

        <div className="p-5 bg-cosmos-surface-elevated/30">
          <p className="text-xs text-cosmos-muted mb-2">Recibís</p>
          <div className="flex gap-3 items-center">
            <span className="flex-1 text-2xl font-semibold text-cosmos-accent">
              {receiveDisplay} {mode === "buy" ? "USDT" : payCurrency}
            </span>
            <div className="px-4 py-2 rounded-xl bg-cosmos-accent/10 border border-cosmos-accent/20">
              <span className="text-sm font-medium text-cosmos-accent">
                {mode === "buy" ? "USDT" : payCurrency}
              </span>
            </div>
          </div>
          <p className="text-xs text-cosmos-muted mt-2">
            ~1 USDT = {rate.toLocaleString()} {payCurrency} · Fee 1% + $0.10
          </p>
        </div>

        <div className="p-5 border-t border-cosmos-border">
          <p className="text-xs text-cosmos-muted mb-3">Método de pago</p>
          <div className="flex gap-2">
            <button
              type="button"
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-cosmos-accent bg-cosmos-accent/10 text-cosmos-accent font-medium text-sm"
            >
              <CreditCard size={18} />
              Tarjeta
            </button>
            <button
              type="button"
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-cosmos-border text-cosmos-muted hover:text-cosmos-text hover:border-cosmos-accent/50 font-medium text-sm transition-colors"
            >
              <Building2 size={18} />
              Transferencia
            </button>
          </div>
        </div>

        <div className="p-5 pt-0">
          <button
            type="button"
            className="w-full py-4 rounded-xl bg-cosmos-accent text-cosmos-bg font-semibold text-base hover:bg-cosmos-accent-hover transition-colors"
          >
            {mode === "buy" ? "Comprar USDT" : "Vender USDT"}
          </button>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-cosmos-muted px-1">
        <span>Protección Cosmos incluida</span>
        <span>1% + US$ 0,10</span>
      </div>
    </div>
  );
}
