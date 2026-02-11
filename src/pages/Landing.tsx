import { Link } from "react-router-dom";
import { Wrench, Building2, Wallet, ArrowRight, Shield, Zap, Globe } from "lucide-react";

export function Landing() {
  return (
    <div>
      <section className="relative pt-20 pb-16 bg-cosmos-bg overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[140%] h-[70%] bg-[radial-gradient(ellipse_at_center,var(--color-cosmos-accent-soft)_0%,transparent_60%)] pointer-events-none" />
        <div className="relative w-full max-w-[1200px] mx-auto px-6 text-center max-w-[720px]">
          <h1 className="font-display font-medium leading-tight text-cosmos-text text-[clamp(2rem,5vw,3.25rem)] m-0 mb-6">
            Donde todos tienen igualdad de oportunidades
          </h1>
          <p className="text-lg text-cosmos-muted leading-relaxed m-0 mb-8">
            Cosmos democratiza la compra, venta y producción de bienes y servicios.
            Opera como vendedor sin necesidad de capital, conecta con productores
            regionales e internacionales y protege cada transacción de punta a punta.
          </p>
          <div className="flex flex-wrap gap-4 justify-center mb-6">
            <Link
              to="/registro"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 font-medium bg-cosmos-accent text-cosmos-bg border-0 rounded-lg hover:bg-cosmos-accent-hover transition-all shadow-lg hover:shadow-xl"
            >
              Empezar a vender
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/tienda"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 font-medium bg-transparent text-cosmos-text border border-cosmos-border hover:border-cosmos-accent hover:text-cosmos-accent rounded-lg transition-colors"
            >
              Explorar productos
            </Link>
          </div>
          <p className="text-sm text-cosmos-muted m-0">Solo 1% + US$ 0,10 por transacción. Protección estándar incluida.</p>
        </div>
        <div className="pt-10 pb-10 mt-10 border-t border-cosmos-border">
          <div className="w-full max-w-[1200px] mx-auto px-6">
            <p className="text-xs font-medium uppercase tracking-wider text-cosmos-muted text-center block mb-4">Conectando productores y vendedores en Latinoamérica</p>
            <div className="flex flex-wrap justify-center items-center gap-4">
              {["Productor A", "Productor B", "Importador C", "Retail D", "Marca E"].map((name) => (
                <span key={name} className="text-sm text-cosmos-muted px-4 py-2.5 bg-cosmos-surface border border-cosmos-border rounded-lg">{name}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-cosmos-surface/50 border-y border-cosmos-border">
        <div className="w-full max-w-[1200px] mx-auto px-6 pt-4 pb-4">
          <div className="grid gap-6 md:grid-cols-3">
            <article className="flex flex-col h-full p-8 bg-cosmos-surface border border-cosmos-border rounded-xl text-cosmos-text transition-all hover:-translate-y-1 hover:border-cosmos-border-strong hover:shadow-xl hover:shadow-black/20">
              <div className="w-12 h-12 rounded-xl bg-cosmos-accent-soft flex items-center justify-center mb-5">
                <Wrench className="text-cosmos-accent" size={24} />
              </div>
              <h3 className="font-display text-xl m-0 mb-3">Para vendedores</h3>
              <p className="text-[0.9375rem] text-cosmos-muted flex-1 m-0 mb-6 leading-relaxed">
                Vende sin invertir en stock. Conecta con proveedores y productores, elige productos y llega a tus clientes con la garantía de Cosmos.
              </p>
              <Link
                to="/registro"
                className="self-start inline-flex items-center gap-2 px-5 py-2.5 font-medium bg-transparent text-cosmos-text border border-cosmos-border rounded-lg hover:border-cosmos-accent hover:text-cosmos-accent transition-colors"
              >
                Empezar a vender
                <ArrowRight size={16} />
              </Link>
            </article>
            <article className="flex flex-col h-full p-8 bg-cosmos-surface border border-cosmos-border rounded-xl text-cosmos-text transition-all hover:-translate-y-1 hover:border-cosmos-border-strong hover:shadow-xl hover:shadow-black/20">
              <div className="w-12 h-12 rounded-xl bg-cosmos-accent-soft flex items-center justify-center mb-5">
                <Building2 className="text-cosmos-accent" size={24} />
              </div>
              <h3 className="font-display text-xl m-0 mb-3">Para productores e importadores</h3>
              <p className="text-[0.9375rem] text-cosmos-muted flex-1 m-0 mb-6 leading-relaxed">
                Llega a más actores en el mercado y moviliza tus ventas más rápido. Precios y condiciones para retailers. Un solo flujo protegido.
              </p>
              <Link
                to="/proveedores"
                className="self-start inline-flex items-center gap-2 px-5 py-2.5 font-medium bg-transparent text-cosmos-text border border-cosmos-border rounded-lg hover:border-cosmos-accent hover:text-cosmos-accent transition-colors"
              >
                Ver soluciones
                <ArrowRight size={16} />
              </Link>
            </article>
            <article className="flex flex-col h-full p-8 bg-cosmos-surface border border-cosmos-border rounded-xl text-cosmos-text transition-all hover:-translate-y-1 hover:border-cosmos-border-strong hover:shadow-xl hover:shadow-black/20">
              <div className="w-12 h-12 rounded-xl bg-cosmos-accent-soft flex items-center justify-center mb-5">
                <Wallet className="text-cosmos-accent" size={24} />
              </div>
              <h3 className="font-display text-xl m-0 mb-3">Para compradores</h3>
              <p className="text-[0.9375rem] text-cosmos-muted flex-1 m-0 mb-6 leading-relaxed">
                Compra con confianza. Tus fondos están asegurados y el producto llega a tus manos con garantía de entrega.
              </p>
              <Link
                to="/tienda"
                className="self-start inline-flex items-center gap-2 px-5 py-2.5 font-medium bg-transparent text-cosmos-text border border-cosmos-border rounded-lg hover:border-cosmos-accent hover:text-cosmos-accent transition-colors"
              >
                Comprar ahora
                <ArrowRight size={16} />
              </Link>
            </article>
          </div>
        </div>
      </section>

      <section className="py-20 bg-cosmos-bg">
        <div className="w-full max-w-[1200px] mx-auto px-6">
          <span className="block mb-2 text-xs font-medium uppercase tracking-wider text-cosmos-accent">Protección</span>
          <h2 className="font-display font-medium text-cosmos-text text-[clamp(1.75rem,4vw,2.5rem)] m-0 mb-4">Protección de punta a punta</h2>
          <p className="text-[1.0625rem] text-cosmos-muted max-w-[640px] m-0 mb-10 leading-relaxed">
            Cosmos es el intermediario que asegura que todas las operaciones finalicen de forma exitosa: fondos del comprador, entrega al cliente y pagos a vendedores y proveedores.
          </p>
          <div className="grid grid-cols-1 gap-4 mb-10 sm:grid-cols-3">
            <div className="flex flex-col gap-2 p-6 bg-cosmos-surface border border-cosmos-border rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-cosmos-accent-soft flex items-center justify-center">
                <Shield size={20} className="text-cosmos-accent" />
              </div>
              <span className="font-semibold text-base text-cosmos-text">Fondos asegurados</span>
              <span className="text-sm text-cosmos-muted">Sabemos que el dinero existe</span>
            </div>
            <div className="flex flex-col gap-2 p-6 bg-cosmos-surface border border-cosmos-border rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-cosmos-accent-soft flex items-center justify-center">
                <Zap size={20} className="text-cosmos-accent" />
              </div>
              <span className="font-semibold text-base text-cosmos-text">Entrega garantizada</span>
              <span className="text-sm text-cosmos-muted">El producto llega a tus manos</span>
            </div>
            <div className="flex flex-col gap-2 p-6 bg-cosmos-surface-elevated border border-cosmos-accent/30 rounded-xl ">
              <div className="w-10 h-10 rounded-lg bg-cosmos-accent-soft flex items-center justify-center">
                <Globe size={20} className="text-cosmos-accent" />
              </div>
              <span className="font-semibold text-base text-cosmos-text">Un solo flujo</span>
              <span className="text-sm text-cosmos-muted">Protección para todos los actores</span>
            </div>
          </div>
          <div className="text-center">
            <Link
              to="/como-funciona"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 font-medium bg-cosmos-accent text-cosmos-bg border-0 rounded-lg hover:bg-cosmos-accent-hover transition-all shadow-lg"
            >
              Cómo funciona
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-cosmos-surface border-t border-cosmos-border">
        <div className="w-full max-w-[1200px] mx-auto px-6 text-center max-w-[560px]">
          <h2 className="font-display text-cosmos-text text-[clamp(1.5rem,3vw,2rem)] m-0 mb-3">Listo para democratizar tu negocio</h2>
          <p className="text-cosmos-muted m-0 mb-6 leading-relaxed">Únete a Cosmos y opera con igualdad de oportunidades. Sin monopolios, sin barreras de capital.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              to="/registro"
              className="inline-flex items-center justify-center px-6 py-3.5 font-medium bg-cosmos-accent text-cosmos-bg border-0 rounded-lg hover:bg-cosmos-accent-hover transition-all shadow-lg"
            >
              Crear cuenta
            </Link>
            <Link
              to="/tienda"
              className="inline-flex items-center justify-center px-6 py-3.5 font-medium bg-cosmos-surface-elevated text-cosmos-text border border-cosmos-border rounded-lg hover:border-cosmos-accent hover:text-cosmos-accent transition-colors"
            >
              Ver tienda
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
