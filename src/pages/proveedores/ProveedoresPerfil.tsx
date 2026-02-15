import { Link } from "react-router-dom";
import { User } from "lucide-react";

export function ProveedoresPerfil() {
  return (
    <div className="min-h-screen bg-cosmos-bg py-8 md:py-12">
      <div className="w-full max-w-[1200px] mx-auto px-6">
        <nav className="flex items-center gap-2 text-sm text-cosmos-muted mb-8">
          <Link to="/proveedores" className="hover:text-cosmos-accent">Proveedores</Link>
          <span>/</span>
          <span className="text-cosmos-text">Mi perfil</span>
        </nav>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-lg bg-cosmos-accent-soft flex items-center justify-center">
            <User size={20} className="text-cosmos-accent" />
          </div>
          <div>
            <h1 className="font-display font-semibold text-cosmos-text text-2xl m-0 mb-1">
              Mi perfil
            </h1>
            <p className="text-cosmos-muted text-sm m-0">
              Esto es lo que ven los retailers cuando te buscan.
            </p>
          </div>
        </div>

        <div className="p-6 bg-cosmos-surface border border-cosmos-border rounded-xl mb-8">
          <p className="font-semibold text-cosmos-text m-0 mb-1">ElectroPlus LATAM</p>
          <p className="text-sm text-cosmos-muted m-0 mb-4">Buenos Aires</p>
          <p className="text-cosmos-muted text-sm m-0 leading-relaxed">
            Electrónica y accesorios. 45 productos en catálogo. Envíos a Argentina, Uruguay y Chile.
          </p>
        </div>

        <div className="p-4 bg-cosmos-surface/50 border border-cosmos-border rounded-lg">
          <p className="text-sm text-cosmos-muted m-0">
            Podés ofrecer precios especiales o beneficios (logo, packaging) a retailers que compran seguido. Se configura en cada relación.
          </p>
        </div>
      </div>
    </div>
  );
}
