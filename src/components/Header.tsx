import { Link, useLocation } from "react-router-dom";
import { Menu, X, ShoppingCart, User, Store } from "lucide-react";
import { useState } from "react";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-[100] h-[72px] bg-cosmos-surface/80 border-b border-cosmos-border backdrop-blur-xl">
      <div className="w-full max-w-[1200px] mx-auto px-6 h-full flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-display text-2xl font-semibold text-cosmos-text" aria-label="Cosmos inicio">
          <span className="text-cosmos-accent text-xl">◇</span>
          <span>Cosmos</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <Link
            to="/tienda"
            className={`px-3 py-2 text-[0.9375rem] font-medium rounded-lg transition-colors ${location.pathname === "/tienda" ? "text-cosmos-text bg-cosmos-surface-elevated" : "text-cosmos-muted hover:text-cosmos-text hover:bg-cosmos-surface-elevated"}`}
          >
            Comprar
          </Link>
          <Link to="/vender" className="px-3 py-2 text-[0.9375rem] font-medium text-cosmos-muted hover:text-cosmos-text hover:bg-cosmos-surface-elevated rounded-lg transition-colors">Vender</Link>
          <Link to="/proveedores" className={`px-3 py-2 text-[0.9375rem] font-medium rounded-lg transition-colors ${location.pathname.startsWith("/proveedores") ? "text-cosmos-text bg-cosmos-surface-elevated" : "text-cosmos-muted hover:text-cosmos-text hover:bg-cosmos-surface-elevated"}`}>Proveedores</Link>
          <Link to="/cosmos-pay" className="px-3 py-2 text-[0.9375rem] font-medium text-cosmos-muted hover:text-cosmos-text hover:bg-cosmos-surface-elevated rounded-lg transition-colors">Cosmos Pay</Link>
          <Link to="/como-funciona" className="px-3 py-2 text-[0.9375rem] font-medium text-cosmos-muted hover:text-cosmos-text hover:bg-cosmos-surface-elevated rounded-lg transition-colors">Cómo funciona</Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link to="/carrito" className="flex items-center justify-center w-10 h-10 text-cosmos-text hover:text-cosmos-accent hover:bg-cosmos-surface-elevated rounded-lg transition-colors" aria-label="Carrito">
            <ShoppingCart size={20} />
          </Link>
          <Link to="/perfil" className="flex items-center justify-center w-10 h-10 text-cosmos-text hover:text-cosmos-accent hover:bg-cosmos-surface-elevated rounded-lg transition-colors" aria-label="Perfil">
            <User size={20} />
          </Link>
          <Link
            to="/retailer"
            className="hidden md:inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-cosmos-text border border-cosmos-border hover:border-cosmos-accent hover:text-cosmos-accent rounded-lg transition-colors bg-cosmos-surface-elevated/50"
          >
            <Store size={18} />
            Mi tienda
          </Link>
          <button
            type="button"
            className="flex md:hidden items-center justify-center w-10 h-10 p-0 bg-transparent border-0 text-cosmos-text cursor-pointer rounded-lg hover:bg-cosmos-surface-elevated"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="absolute top-[72px] left-0 right-0 p-4 md:hidden bg-cosmos-surface border-b border-cosmos-border flex flex-col gap-1 rounded-b-xl shadow-xl">
          <Link to="/tienda" onClick={() => setMenuOpen(false)} className="px-3 py-3 font-medium text-cosmos-text rounded-lg hover:bg-cosmos-surface-elevated">Comprar</Link>
          <Link to="/vender" onClick={() => setMenuOpen(false)} className="px-3 py-3 font-medium text-cosmos-text rounded-lg hover:bg-cosmos-surface-elevated">Vender</Link>
          <Link to="/proveedores" onClick={() => setMenuOpen(false)} className="px-3 py-3 font-medium text-cosmos-text rounded-lg hover:bg-cosmos-surface-elevated">Proveedores</Link>
          <Link to="/cosmos-pay" onClick={() => setMenuOpen(false)} className="px-3 py-3 font-medium text-cosmos-text rounded-lg hover:bg-cosmos-surface-elevated">Cosmos Pay</Link>
          <Link to="/como-funciona" onClick={() => setMenuOpen(false)} className="px-3 py-3 font-medium text-cosmos-text rounded-lg hover:bg-cosmos-surface-elevated">Cómo funciona</Link>
          <Link to="/carrito" onClick={() => setMenuOpen(false)} className="px-3 py-3 font-medium text-cosmos-text rounded-lg hover:bg-cosmos-surface-elevated">Carrito</Link>
          <Link to="/perfil" onClick={() => setMenuOpen(false)} className="px-3 py-3 font-medium text-cosmos-text rounded-lg hover:bg-cosmos-surface-elevated">Perfil</Link>
          <Link to="/retailer" onClick={() => setMenuOpen(false)} className="px-3 py-3 font-medium text-cosmos-text rounded-lg hover:bg-cosmos-surface-elevated">Mi tienda</Link>
        </div>
      )}
    </header>
  );
}
