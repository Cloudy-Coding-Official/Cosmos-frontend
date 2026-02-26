import { Link, useLocation } from "react-router-dom";
import { Menu, X, ShoppingCart, User } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { BrandLogo } from "./BrandLogo";
import { getNavigationItems } from "../data/navigationItems";

const linkClass = (isActive: boolean) =>
  `px-3 py-2 text-[0.9375rem] font-medium rounded-lg transition-colors ${
    isActive ? "text-cosmos-text bg-cosmos-surface-elevated" : "text-cosmos-muted hover:text-cosmos-text hover:bg-cosmos-surface-elevated"
  }`;

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { isLoggedIn, user } = useAuth();
  const { itemCount } = useCart();
  const navItems = getNavigationItems(user ?? null);

  return (
    <header className="sticky top-0 z-[100] h-[72px] bg-cosmos-surface/80 border-b border-cosmos-border backdrop-blur-xl">
      <div className="w-full max-w-[1200px] mx-auto px-6 h-full flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-cosmos-text" aria-label="Cosmos inicio">
          <BrandLogo variant="full" className="h-8 w-auto" alt="Cosmos - Inicio" />
          <span className="text-cosmos-text text-xl">Cosmos</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = item.href === "/" ? location.pathname === "/" : location.pathname === item.href || (item.href !== "/" && location.pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                to={item.href}
                className={linkClass(!!isActive)}
              >
                {item.title}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link to="/carrito" className="relative flex items-center justify-center w-10 h-10 text-cosmos-text hover:text-cosmos-accent hover:bg-cosmos-surface-elevated rounded-lg transition-colors" aria-label="Carrito">
            <ShoppingCart size={20} />
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[1.25rem] h-5 px-1 flex items-center justify-center text-xs font-semibold bg-cosmos-accent text-cosmos-bg rounded-full">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </Link>
          {isLoggedIn ? (
            <Link to="/perfil" className="flex items-center justify-center w-10 h-10 text-cosmos-text hover:text-cosmos-accent hover:bg-cosmos-surface-elevated rounded-lg transition-colors" aria-label="Perfil">
              <User size={20} />
            </Link>
          ) : (
            <Link
              to="/login"
              className="hidden md:inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-cosmos-accent text-cosmos-bg rounded-lg hover:bg-cosmos-accent-hover transition-colors"
            >
              Iniciar sesión
            </Link>
          )}
          <button
            type="button"
            className="flex md:hidden items-center justify-center w-10 h-10 p-0 bg-transparent border-0 text-cosmos-text rounded-lg hover:bg-cosmos-surface-elevated transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="absolute top-[72px] left-0 right-0 p-4 md:hidden bg-cosmos-surface border-b border-cosmos-border flex flex-col gap-1 rounded-b-xl shadow-xl">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => setMenuOpen(false)}
              className="px-3 py-3 font-medium text-cosmos-text rounded-lg hover:bg-cosmos-surface-elevated"
            >
              {item.title}
            </Link>
          ))}
          <Link to="/carrito" onClick={() => setMenuOpen(false)} className="px-3 py-3 font-medium text-cosmos-text rounded-lg hover:bg-cosmos-surface-elevated">Carrito</Link>
          {isLoggedIn ? (
            <Link to="/perfil" onClick={() => setMenuOpen(false)} className="px-3 py-3 font-medium text-cosmos-text rounded-lg hover:bg-cosmos-surface-elevated">Perfil</Link>
          ) : (
            <Link to="/login" onClick={() => setMenuOpen(false)} className="px-3 py-3 font-medium text-cosmos-accent rounded-lg">Iniciar sesión</Link>
          )}
        </div>
      )}
    </header>
  );
}
