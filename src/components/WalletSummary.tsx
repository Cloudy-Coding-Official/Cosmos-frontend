import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

type WalletSummaryProps = {
  viewDetails: boolean;
  estimatedUsdt?: number;
  walletsCount?: number;
  loadingBalances?: boolean;
  loadingWallets?: boolean;
};

export function WalletSummary({
  viewDetails,
  estimatedUsdt = 0,
  walletsCount = 0,
  loadingBalances = false,
  loadingWallets = false,
}: WalletSummaryProps) {
  return (
    <div className="bg-cosmos-surface border border-cosmos-border text-cosmos-text p-6 rounded-2xl">
      <p className="text-cosmos-muted text-sm uppercase tracking-wider mb-3">Tu Wallet</p>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-cosmos-muted text-sm">Total estimado</p>
          <p className="text-3xl font-bold">
            {loadingBalances ? "Calculando..." : `${estimatedUsdt.toFixed(2)} USDT`}
          </p>
        </div>
        <div>
          <p className="text-cosmos-muted text-sm">Wallets conectadas</p>
          <p className="text-2xl font-bold">{loadingWallets ? "-" : walletsCount}</p>
        </div>
      </div>

      {viewDetails && (
        <Link
          to="/perfil/wallet"
          className="inline-flex items-center justify-center gap-2 w-full mt-4 bg-cosmos-accent text-cosmos-bg px-6 py-3 rounded-full font-bold hover:bg-cosmos-accent-hover transition-colors"
        >
          Ver detalles
          <ArrowUpRight size={16} />
        </Link>
      )}
    </div>
  );
}
