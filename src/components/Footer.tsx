import { Link } from "react-router-dom";
import { Linkedin, Twitter, Youtube, Github, MessageCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-auto bg-cosmos-surface border-t border-cosmos-border">
      <div className="w-full max-w-[1200px] mx-auto px-6 py-16 grid gap-8 md:grid-cols-[1fr_2fr] md:items-start">
        <div className="max-w-[280px]">
          <Link to="/" className="inline-flex items-center gap-2 font-display text-2xl font-semibold text-cosmos-text mb-3 hover:text-cosmos-accent transition-colors">
            <span className="text-cosmos-accent">◇</span>
            Cosmos
          </Link>
          <p className="text-[0.9375rem] text-cosmos-muted leading-normal m-0">
            Igualdad de oportunidades para comprar, vender y producir.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-cosmos-muted m-0 mb-4">NOSOTROS</h4>
            <ul className="list-none m-0 p-0">
              <li className="mb-2"><Link to="/sobre-nosotros" className="text-[0.9375rem] text-cosmos-text/90 hover:text-cosmos-accent transition-colors">Sobre Cosmos</Link></li>
              <li className="mb-2"><Link to="/equipo" className="text-[0.9375rem] text-cosmos-text/90 hover:text-cosmos-accent transition-colors">Equipo</Link></li>
              <li className="mb-2"><Link to="/blog" className="text-[0.9375rem] text-cosmos-text/90 hover:text-cosmos-accent transition-colors">Blog</Link></li>
              <li className="mb-2"><Link to="/prensa" className="text-[0.9375rem] text-cosmos-text/90 hover:text-cosmos-accent transition-colors">Prensa</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-cosmos-muted m-0 mb-4">PLATAFORMA</h4>
            <ul className="list-none m-0 p-0">
              <li className="mb-2"><Link to="/tienda" className="text-[0.9375rem] text-cosmos-text/90 hover:text-cosmos-accent transition-colors">Comprar</Link></li>
              <li className="mb-2"><Link to="/vender" className="text-[0.9375rem] text-cosmos-text/90 hover:text-cosmos-accent transition-colors">Vender</Link></li>
              <li className="mb-2"><Link to="/proveedores" className="text-[0.9375rem] text-cosmos-text/90 hover:text-cosmos-accent transition-colors">Proveedores</Link></li>
              <li className="mb-2"><Link to="/cosmos-pay" className="text-[0.9375rem] text-cosmos-text/90 hover:text-cosmos-accent transition-colors">Cosmos Pay</Link></li>
              <li className="mb-2"><Link to="/cosmos-founding" className="text-[0.9375rem] text-cosmos-text/90 hover:text-cosmos-accent transition-colors">Cosmos Founding</Link></li>
              <li className="mb-2"><Link to="/como-funciona" className="text-[0.9375rem] text-cosmos-text/90 hover:text-cosmos-accent transition-colors">Cómo funciona</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-cosmos-muted m-0 mb-4">LEGAL</h4>
            <ul className="list-none m-0 p-0">
              <li className="mb-2"><Link to="/privacidad" className="text-[0.9375rem] text-cosmos-text/90 hover:text-cosmos-accent transition-colors">Privacidad</Link></li>
              <li className="mb-2"><Link to="/terminos" className="text-[0.9375rem] text-cosmos-text/90 hover:text-cosmos-accent transition-colors">Términos de servicio</Link></li>
              <li className="mb-2"><Link to="/cookies" className="text-[0.9375rem] text-cosmos-text/90 hover:text-cosmos-accent transition-colors">Cookies</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-cosmos-muted m-0 mb-4">CONECTAR</h4>
            <ul className="list-none m-0 p-0">
              <li className="mb-2"><Link to="/comunidad" className="text-[0.9375rem] text-cosmos-text/90 hover:text-cosmos-accent transition-colors">Comunidad</Link></li>
              <li className="mb-2"><Link to="/faq" className="text-[0.9375rem] text-cosmos-text/90 hover:text-cosmos-accent transition-colors">FAQ</Link></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-cosmos-border py-6 px-6">
        <div className="w-full max-w-[1200px] mx-auto flex flex-col items-center gap-4 text-center md:flex-row md:justify-between md:text-left">
          <div className="flex gap-5">
            <a href="#" className="text-cosmos-muted hover:text-cosmos-accent transition-colors" aria-label="LinkedIn"><Linkedin size={20} /></a>
            <a href="#" className="text-cosmos-muted hover:text-cosmos-accent transition-colors" aria-label="X"><Twitter size={20} /></a>
            <a href="#" className="text-cosmos-muted hover:text-cosmos-accent transition-colors" aria-label="YouTube"><Youtube size={20} /></a>
            <a href="#" className="text-cosmos-muted hover:text-cosmos-accent transition-colors" aria-label="GitHub"><Github size={20} /></a>
            <a href="#" className="text-cosmos-muted hover:text-cosmos-accent transition-colors" aria-label="Discord"><MessageCircle size={20} /></a>
          </div>
          <p className="text-[0.8125rem] text-cosmos-muted/80 m-0">© {new Date().getFullYear()} Cosmos. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
