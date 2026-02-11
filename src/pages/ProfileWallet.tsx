import { useState } from "react";
import { WalletSummary } from "../components/WalletSummary";
import { Link } from "react-router-dom";

type WalletItem = {
  address: string;
  network?: string;
  currency?: string;
  isDefault?: boolean;
};

type IncomingItem = {
  type: string;
  amount: string;
  date: string;
};

type BalanceInfo = {
  nativeAmount: number;
  nativeSymbol: string;
  usdValue: number;
};

// Mock hasta integrar backend
const MOCK_WALLETS: WalletItem[] = [
  { address: "0x742d...8a3f", network: "Polygon", currency: "USDC", isDefault: true },
  { address: "0x9f1b...2c4e", network: "Ethereum", currency: "USDT", isDefault: false },
];

const MOCK_INCOMING: IncomingItem[] = [
  { type: "Venta #1024", amount: "150.00", date: "10 Feb 2026" },
  { type: "Venta #1021", amount: "89.50", date: "8 Feb 2026" },
];

const MOCK_BALANCES: Record<string, BalanceInfo> = {
  "0x742d...8a3f-Polygon": { nativeAmount: 1250.5, nativeSymbol: "USDC", usdValue: 1250.5 },
  "0x9f1b...2c4e-Ethereum": { nativeAmount: 320.25, nativeSymbol: "USDT", usdValue: 320.25 },
};

const ESTIMATED_USDT = 1570.75;

export function ProfileWallet() {
  const [wallets, setWallets] = useState<WalletItem[]>(MOCK_WALLETS);
  const [incoming] = useState<IncomingItem[]>(MOCK_INCOMING);
  const [balancesByWallet] = useState<Record<string, BalanceInfo>>(MOCK_BALANCES);
  const [loadingWallets] = useState(false);
  const [loadingBalances] = useState(false);
  const [loadingIncoming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [errorIncoming] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [addr, setAddr] = useState("");
  const [net, setNet] = useState("");
  const [cur, setCur] = useState("");
  const [isDefault, setIsDefault] = useState(false);
  const [saving, setSaving] = useState(false);

  const onAddWallet = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSaving(true);
    setTimeout(() => {
      setWallets((prev) => [...prev, { address: addr, network: net || undefined, currency: cur || undefined, isDefault }]);
      setSuccess("Wallet agregada correctamente.");
      setAddr("");
      setNet("");
      setCur("");
      setIsDefault(false);
      setSaving(false);
    }, 600);
  };

  return (
    <div className="py-8 bg-cosmos-bg min-h-[calc(100vh-72px-200px)]">
      <div className="w-full max-w-[1200px] mx-auto px-6">
        <div className="flex items-center gap-3 mb-8">
          <Link to="/perfil" className="text-cosmos-muted hover:text-cosmos-accent text-sm transition-colors">
            ← Perfil
          </Link>
          <span className="text-cosmos-muted">/</span>
          <h1 className="font-display font-semibold text-cosmos-text text-2xl m-0">Wallet</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6 lg:col-span-2">
            <WalletSummary
              viewDetails={false}
              estimatedUsdt={ESTIMATED_USDT}
              walletsCount={wallets.length}
              loadingBalances={loadingBalances}
              loadingWallets={loadingWallets}
            />

            <div className="bg-cosmos-surface border border-cosmos-border rounded-2xl p-6">
              <h3 className="text-xl font-display font-semibold text-cosmos-text mb-4">Ingresos</h3>
              {errorIncoming && (
                <div className="mb-3 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-sm text-red-400">
                  {errorIncoming}
                </div>
              )}
              {loadingIncoming ? (
                <p className="text-sm text-cosmos-muted">Cargando ingresos...</p>
              ) : incoming.length === 0 ? (
                <p className="text-sm text-cosmos-muted">No hay ingresos aún.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {incoming.map((i, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-cosmos-surface-elevated rounded-xl border border-cosmos-border"
                    >
                      <p className="font-semibold text-cosmos-text">{i.type}</p>
                      <p className="text-sm text-cosmos-muted">${i.amount}</p>
                      <p className="text-xs text-cosmos-muted mt-1">{i.date}</p>
                    </div>
                  ))}
                </div>
              )}
              <Link
                to="/perfil/wallet/gasto"
                className="inline-flex items-center justify-center mt-4 w-full sm:w-auto bg-cosmos-accent text-cosmos-bg px-6 py-3 rounded-full font-bold hover:bg-cosmos-accent-hover transition-colors"
              >
                Cargar gasto
              </Link>
            </div>

            <div className="bg-cosmos-surface border border-cosmos-border rounded-2xl p-6">
              <h3 className="text-xl font-display font-semibold text-cosmos-text mb-4">Tus wallets</h3>
              {error && (
                <div className="mb-3 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-sm text-red-400">
                  {error}
                </div>
              )}
              {loadingWallets ? (
                <p className="text-sm text-cosmos-muted">Cargando...</p>
              ) : wallets.length === 0 ? (
                <p className="text-sm text-cosmos-muted">No tienes wallets agregadas.</p>
              ) : (
                <div className="space-y-2">
                  {wallets.map((w) => {
                    const id = `${w.address}-${w.network ?? ""}`;
                    const bal = balancesByWallet[id];
                    return (
                      <div key={id} className="p-4 bg-cosmos-surface-elevated rounded-xl border border-cosmos-border">
                        <p className="font-semibold text-cosmos-text break-all">{w.address}</p>
                        <p className="text-xs text-cosmos-muted mt-1">
                          {w.network || "network: N/A"} • {w.currency || "currency: N/A"} {w.isDefault ? "• Principal" : ""}
                        </p>
                        <p className="text-sm text-cosmos-text mt-2">
                          {loadingBalances
                            ? "Cargando balance..."
                            : bal
                              ? `${bal.nativeAmount.toFixed(6)} ${bal.nativeSymbol} ≈ $${bal.usdValue.toFixed(2)} USD`
                              : "Sin datos"}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="bg-cosmos-surface border border-cosmos-border rounded-2xl p-6">
              <h3 className="text-xl font-display font-semibold text-cosmos-text mb-4">Agregar wallet</h3>
              {success && (
                <div className="mb-3 px-4 py-3 rounded-lg bg-green-500/10 border border-green-500/30 text-sm text-green-400">
                  {success}
                </div>
              )}
              <form onSubmit={onAddWallet} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-cosmos-muted mb-2">Dirección</label>
                  <input
                    value={addr}
                    onChange={(e) => setAddr(e.target.value)}
                    placeholder="0x..."
                    required
                    className="w-full px-4 py-3 border border-cosmos-border bg-cosmos-surface-elevated text-cosmos-text placeholder:text-cosmos-muted rounded-lg focus:outline-none focus:border-cosmos-accent focus:ring-1 focus:ring-cosmos-accent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-cosmos-muted mb-2">Red (opcional)</label>
                  <input
                    value={net}
                    onChange={(e) => setNet(e.target.value)}
                    placeholder="Ethereum / Polygon / ..."
                    className="w-full px-4 py-3 border border-cosmos-border bg-cosmos-surface-elevated text-cosmos-text placeholder:text-cosmos-muted rounded-lg focus:outline-none focus:border-cosmos-accent focus:ring-1 focus:ring-cosmos-accent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-cosmos-muted mb-2">Moneda (opcional)</label>
                  <input
                    value={cur}
                    onChange={(e) => setCur(e.target.value)}
                    placeholder="USDC / USDT / ..."
                    className="w-full px-4 py-3 border border-cosmos-border bg-cosmos-surface-elevated text-cosmos-text placeholder:text-cosmos-muted rounded-lg focus:outline-none focus:border-cosmos-accent focus:ring-1 focus:ring-cosmos-accent"
                  />
                </div>
                <div className="sm:col-span-2 flex items-center gap-2">
                  <input
                    id="isDefault"
                    type="checkbox"
                    checked={isDefault}
                    onChange={(e) => setIsDefault(e.target.checked)}
                    className="w-4 h-4 rounded border-cosmos-border bg-cosmos-surface-elevated text-cosmos-accent focus:ring-cosmos-accent"
                  />
                  <label htmlFor="isDefault" className="text-sm text-cosmos-muted">Marcar como principal</label>
                </div>
                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full bg-cosmos-accent text-cosmos-bg px-6 py-3 rounded-full font-bold hover:bg-cosmos-accent-hover transition-colors disabled:opacity-60"
                  >
                    {saving ? "Guardando..." : "Agregar wallet"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
