import { Link } from "react-router-dom";
import { Package, Users, TrendingUp, User, ArrowRight, ClipboardCheck, ShieldCheck, ClipboardList } from "lucide-react";

const SECTIONS = [
  {
    to: "/proveedores/pedidos",
    icon: ClipboardList,
    title: "Pedidos",
    desc: "Ver y gestionar todos los pedidos de tus tiendas en un solo lugar",
  },
  {
    to: "/proveedores/productos",
    icon: Package,
    title: "Catálogo",
    desc: "Subí tus productos para que los retailers los listen en sus tiendas",
  },
  {
    to: "/proveedores/solicitudes",
    icon: ClipboardCheck,
    title: "Solicitudes de tiendas",
    desc: "Aprobá o rechazá tiendas que quieren vender tus productos",
  },
  {
    to: "/proveedores/tiendas-autorizadas",
    icon: ShieldCheck,
    title: "Tiendas autorizadas",
    desc: "Tiendas que pueden añadir cualquier producto sin solicitar",
  },
  {
    to: "/proveedores/retailers",
    icon: Users,
    title: "Retailers",
    desc: "Tiendas que te compran o a las que podés contactar",
  },
  {
    to: "/proveedores/ventas",
    icon: TrendingUp,
    title: "Ventas",
    desc: "Pedidos de retailers y cobros",
  },
  {
    to: "/proveedores/perfil",
    icon: User,
    title: "Mi perfil",
    desc: "Cómo te ven los retailers",
  },
];

export function ProveedoresDashboard() {
  return (
    <div className="min-h-screen bg-cosmos-bg py-8 md:py-12">
      <div className="w-full max-w-[1200px] mx-auto px-6">
        <h1 className="font-display font-semibold text-cosmos-text text-2xl md:text-3xl m-0 mb-2">
          Proveedores
        </h1>
        <p className="text-cosmos-muted m-0 mb-10">
          Vendés a retailers. Ellos revenden a clientes.
        </p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SECTIONS.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className="flex flex-col p-6 bg-cosmos-surface border border-cosmos-border rounded-xl hover:border-cosmos-accent/40 transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-cosmos-accent-soft flex items-center justify-center mb-4">
                  <Icon size={20} className="text-cosmos-accent" />
                </div>
                <h2 className="font-semibold text-cosmos-text m-0 mb-1 group-hover:text-cosmos-accent transition-colors">
                  {item.title}
                </h2>
                <p className="text-sm text-cosmos-muted m-0 mb-4 flex-1">
                  {item.desc}
                </p>
                <span className="text-sm font-medium text-cosmos-accent inline-flex items-center gap-1">
                  Entrar <ArrowRight size={14} />
                </span>
              </Link>
            );
          })}
        </div>

      </div>
    </div>
  );
}
