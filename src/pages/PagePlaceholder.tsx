import { Link, useLocation } from "react-router-dom";
import { Construction } from "lucide-react";

const TITLES: Record<string, string> = {
  "sobre-nosotros": "Sobre Cosmos",
  "equipo": "Equipo",
  "blog": "Blog",
  "prensa": "Prensa",
  "privacidad": "Privacidad",
  "terminos": "Términos de servicio",
  "cookies": "Cookies",
  "comunidad": "Comunidad",
  "faq": "FAQ",
};

export function PagePlaceholder() {
  const { pathname } = useLocation();
  const path = pathname.slice(1) || "pagina";
  const title = TITLES[path] ?? path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, " ");

  return (
    <div className="min-h-[50vh] bg-cosmos-bg py-20 flex flex-col items-center justify-center px-6">
      <div className="w-16 h-16 rounded-2xl bg-cosmos-accent-soft flex items-center justify-center mb-6">
        <Construction size={32} className="text-cosmos-accent" />
      </div>
      <h1 className="font-display font-semibold text-cosmos-text text-xl m-0 mb-2 text-center">
        {title}
      </h1>
      <p className="text-cosmos-muted text-center m-0 mb-8 max-w-md">
        Esta sección está en construcción. Volvé pronto.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-6 py-3 font-medium bg-cosmos-accent text-cosmos-bg rounded-xl hover:bg-cosmos-accent-hover transition-colors"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
