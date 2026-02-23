import { Store, Users, BarChart3, Upload, ArrowRight, Package, TrendingUp, User } from "lucide-react";

type Section = "retailer" | "proveedor";

type SectionPreviewProps = {
  section: Section;
  onExpandAccount: () => void;
};

const RETAILER_PREVIEW = {
  title: "Mi tienda (Retailer)",
  subtitle: "Vendé sin stock: conectás con proveedores y vendés a clientes finales.",
  flow: ["Proveedores", "Tú (Retailer)", "Clientes finales"],
  cards: [
    { icon: Upload, title: "Subir productos", desc: "Productos propios o del catálogo de proveedores." },
    { icon: Users, title: "Proveedores", desc: "Explorá, seleccioná y compará costos." },
    { icon: TrendingUp, title: "Ventas", desc: "Historial de ventas a tus clientes." },
    { icon: Store, title: "Mis tiendas", desc: "Varios perfiles de tienda." },
    { icon: BarChart3, title: "Análisis de mercado", desc: "Próximamente." },
  ],
};

const PROVEEDOR_PREVIEW = {
  title: "Proveedores",
  subtitle: "Vendés a retailers. Ellos revenden a clientes.",
  cards: [
    { icon: Package, title: "Catálogo", desc: "Subí productos para que los retailers los listen." },
    { icon: Users, title: "Retailers", desc: "Tiendas que te compran o a las que podés contactar." },
    { icon: TrendingUp, title: "Ventas", desc: "Pedidos de retailers y cobros." },
    { icon: User, title: "Mi perfil", desc: "Cómo te ven los retailers." },
  ],
};

export function SectionPreview({ section, onExpandAccount }: SectionPreviewProps) {
  const config = section === "retailer" ? RETAILER_PREVIEW : PROVEEDOR_PREVIEW;
  const HeaderIcon = section === "retailer" ? Store : Package;

  return (
    <div className="min-h-screen bg-cosmos-bg py-8 md:py-12">
      <div className="w-full max-w-[1200px] mx-auto px-6">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-14 h-14 rounded-2xl bg-cosmos-accent-soft flex items-center justify-center">
            <HeaderIcon size={28} className="text-cosmos-accent" />
          </div>
          <div>
            <h1 className="font-display font-semibold text-cosmos-text text-2xl md:text-3xl m-0">
              {config.title}
            </h1>
            <p className="text-cosmos-muted text-sm m-0">
              {config.subtitle}
            </p>
          </div>
        </div>

        {section === "retailer" && (
          <div className="mb-12 p-6 bg-cosmos-surface border border-cosmos-border rounded-2xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-cosmos-muted mb-4">
              Tu lugar en Cosmos
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 py-4">
              {RETAILER_PREVIEW.flow.map((label, i) => (
                <span key={label}>
                  <span className="px-4 py-2 bg-cosmos-surface-elevated rounded-xl text-cosmos-text font-medium border border-cosmos-border">
                    {label}
                  </span>
                  {i < RETAILER_PREVIEW.flow.length - 1 && (
                    <ArrowRight size={24} className="inline-block mx-2 text-cosmos-muted shrink-0 align-middle" />
                  )}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className={`grid gap-6 ${section === "retailer" ? "md:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-4"}`}>
          {config.cards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className="p-6 bg-cosmos-surface/60 border border-cosmos-border rounded-2xl opacity-90"
              >
                <div className="w-12 h-12 rounded-xl bg-cosmos-accent-soft/60 flex items-center justify-center mb-4">
                  <Icon className="text-cosmos-accent" size={24} />
                </div>
                <h3 className="font-display font-semibold text-cosmos-text text-lg m-0 mb-2">
                  {card.title}
                </h3>
                <p className="text-sm text-cosmos-muted m-0">
                  {card.desc}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-12 p-6 md:p-8 bg-cosmos-accent-soft border border-cosmos-accent/30 rounded-2xl text-center">
          <p className="text-cosmos-text font-medium m-0 mb-4">
            {section === "retailer"
              ? "Agregá el perfil de retailer a tu cuenta para gestionar tu tienda, productos y ventas."
              : "Agregá el perfil de proveedor para subir tu catálogo y vender a retailers."}
          </p>
          <button
            type="button"
            onClick={onExpandAccount}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 font-medium bg-cosmos-accent text-cosmos-bg rounded-xl hover:bg-cosmos-accent-hover transition-colors"
          >
            Expandir cuenta
          </button>
        </div>
      </div>
    </div>
  );
}
