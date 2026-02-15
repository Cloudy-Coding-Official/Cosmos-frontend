import { Link } from "react-router-dom";
import { PartnerLogos } from "../components/PartnerLogos";
import { CosmosPayMockup } from "../components/CosmosPayMockup";
import {
  Wrench,
  Building2,
  Wallet,
  ArrowRight,
  Shield,
  Zap,
  Globe,
  CreditCard,
  TrendingUp,
  Sparkles,
  ChevronRight,
  Leaf,
} from "lucide-react";

export function Landing() {
  return (
    <div className="overflow-hidden">
      <section className="relative min-h-[85vh] flex items-center pt-24 pb-20 bg-cosmos-bg overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(139,92,246,0.25)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_80%_100%,rgba(139,92,246,0.1)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_60%_at_10%_90%,rgba(167,139,250,0.08)_0%,transparent_50%)]" />
        <div className="absolute top-20 left-[10%] w-72 h-72 rounded-full bg-cosmos-accent/5 blur-3xl animate-glow" />
        <div className="absolute bottom-20 right-[15%] w-96 h-96 rounded-full bg-cosmos-accent/5 blur-3xl animate-glow" style={{ animationDelay: "1.5s" }} />

        <div className="relative w-full max-w-[1200px] mx-auto px-6 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium text-cosmos-accent bg-cosmos-accent-soft border border-cosmos-accent/30 rounded-full">
            <Sparkles size={16} className="animate-float" />
            Igualdad de oportunidades en Latinoamérica
          </span>
          <h1 className="font-display font-semibold leading-[1.1] text-cosmos-text text-[clamp(2.5rem,6vw,4rem)] m-0 mb-6 tracking-tight">
            Donde todos tienen
            <br />
            <span className="bg-gradient-to-r from-cosmos-accent via-violet-400 to-cosmos-accent bg-clip-text text-transparent">
              igualdad de oportunidades
            </span>
          </h1>
          <p className="text-lg md:text-xl text-cosmos-muted leading-relaxed max-w-[640px] mx-auto m-0 mb-10">
            Cosmos democratiza la compra, venta y producción de bienes y servicios.
            Opera como vendedor sin necesidad de capital, conecta con productores
            regionales e internacionales y protege cada transacción de punta a punta.
          </p>
          <div className="flex flex-wrap gap-4 justify-center mb-8">
            <Link
              to="/onboard"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 font-semibold bg-cosmos-accent text-cosmos-bg border-0 rounded-xl hover:bg-cosmos-accent-hover transition-all shadow-lg shadow-cosmos-accent/25 hover:shadow-xl hover:shadow-cosmos-accent/30 hover:scale-[1.02]"
            >
              Empezar a vender
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/tienda"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 font-semibold bg-cosmos-surface-elevated/80 text-cosmos-text border border-cosmos-border rounded-xl hover:border-cosmos-accent hover:text-cosmos-accent hover:bg-cosmos-surface transition-all backdrop-blur-sm"
            >
              Explorar productos
            </Link>
          </div>
          <p className="text-sm text-cosmos-muted">
            Solo 1% + US$ 0,10 por transacción · Protección estándar incluida
          </p>

          <div className="mt-16 pt-12 border-t border-cosmos-border/60">
            <p className="text-xs font-medium uppercase tracking-wider text-cosmos-muted mb-8">
              Conectando productores y vendedores en Latinoamérica
            </p>
            <PartnerLogos />
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-b from-cosmos-surface/50 via-cosmos-bg to-cosmos-bg border-y border-cosmos-border">
        <div className="w-full max-w-[1200px] mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 mb-4 text-xs font-semibold uppercase tracking-wider text-cosmos-accent bg-cosmos-accent-soft rounded-lg">
                <CreditCard size={14} />
                Cosmos Pay
              </span>
              <h2 className="font-display font-semibold text-cosmos-text text-[clamp(1.75rem,4vw,2.5rem)] m-0 mb-4 leading-tight">
                Tu pasarela de pagos
                <br />
                <span className="text-cosmos-muted font-normal">On Ramp · Off Ramp</span>
              </h2>
              <p className="text-cosmos-muted leading-relaxed mb-6">
                Convierte moneda local a cripto y viceversa de forma segura. Paga y cobra en USDT,
                recibe en tu cuenta bancaria. Todo integrado en un solo flujo, con protección
                Cosmos en cada transacción.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Depósitos y retiros en moneda local",
                  "Conversión automática USDT ↔ USD/Local",
                  "Tarifas transparentes · Sin sorpresas",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-cosmos-text">
                    <span className="w-1.5 h-1.5 rounded-full bg-cosmos-accent shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                to="/cosmos-pay"
                className="inline-flex items-center gap-2 px-6 py-3.5 font-semibold bg-cosmos-accent text-cosmos-bg rounded-xl hover:bg-cosmos-accent-hover transition-all"
              >
                Conocer Cosmos Pay
                <ChevronRight size={18} />
              </Link>
            </div>
            <div className="relative lg:pl-4">
              <CosmosPayMockup />
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-cosmos-bg">
        <div className="w-full max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 mb-4 text-xs font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
              <TrendingUp size={14} />
              Cosmos Founding
            </span>
            <h2 className="font-display font-semibold text-cosmos-text text-[clamp(1.75rem,4vw,2.5rem)] m-0 mb-4 leading-tight">
              Financia proyectos
              <br />
              en América Latina
            </h2>
            <p className="text-cosmos-muted leading-relaxed max-w-[560px] mx-auto m-0">
              Proyectos de retail, producción y logística validados por la comunidad.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-10">
            {[
              {
                nombre: "BioPack",
                categoria: "Producción",
                pais: "Argentina",
                meta: 15000,
                recaudado: 72,
                desc: "Empaques biodegradables para retail",
              },
              {
                nombre: "Café Andino",
                categoria: "Retail",
                pais: "Colombia",
                meta: 8000,
                recaudado: 45,
                desc: "Cadena de cafeterías de origen local",
              },
              {
                nombre: "LogiSur",
                categoria: "Logística",
                pais: "Chile",
                meta: 25000,
                recaudado: 18,
                desc: "Red de entrega última milla en Cono Sur",
              },
            ].map((p) => (
              <Link
                key={p.nombre}
                to="/cosmos-founding"
                className="group block p-6 bg-cosmos-surface border border-cosmos-border rounded-2xl hover:border-emerald-500/40 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="px-2.5 py-1 text-xs font-semibold text-emerald-400 bg-emerald-500/15 rounded-lg">
                    {p.categoria}
                  </span>
                  <span className="text-xs text-cosmos-muted font-medium">{p.pais}</span>
                </div>
                <h3 className="font-display font-semibold text-cosmos-text text-lg m-0 mb-2 group-hover:text-emerald-400 transition-colors">
                  {p.nombre}
                </h3>
                <p className="text-sm text-cosmos-muted m-0 mb-4 line-clamp-2 leading-relaxed">{p.desc}</p>
                <div className="space-y-2">
                  <div className="h-2 bg-cosmos-bg rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-500"
                      style={{ width: `${p.recaudado}%` }}
                    />
                  </div>
                  <p className="text-xs text-cosmos-muted m-0">
                    <span className="font-semibold text-cosmos-text">
                      US$ {(p.meta * p.recaudado / 100).toLocaleString()}
                    </span>
                    {" · "}meta US$ {p.meta.toLocaleString()}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          <div className="relative max-w-[720px] mx-auto">
            <div className="absolute -inset-[1px] bg-gradient-to-r from-emerald-500/20 via-cosmos-accent/20 to-emerald-500/20 rounded-2xl blur-sm opacity-60" />
            <div className="relative flex flex-col sm:flex-row gap-6 p-8 sm:p-10 bg-gradient-to-br from-cosmos-surface via-cosmos-surface to-cosmos-surface-elevated border border-cosmos-border rounded-2xl">
              <div className="flex shrink-0">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <Leaf className="text-emerald-400" size={32} />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-display font-semibold text-cosmos-text text-xl m-0 mb-2">¿Qué es Cosmos Founding?</h3>
                <p className="text-cosmos-muted leading-relaxed m-0 mb-6">
                  Conecta emprendedores con inversionistas. Apoyá proyectos verificados en América Latina,
                  recibí retornos transparentes y contribuí al ecosistema regional.
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {["Proyectos verificados", "Retornos transparentes", "LATAM first"].map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1.5 text-xs font-medium bg-cosmos-surface-elevated rounded-lg text-cosmos-text border border-cosmos-border"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <Link
                  to="/cosmos-founding"
                  className="inline-flex items-center gap-2 px-6 py-3 font-semibold bg-emerald-600 text-white rounded-xl hover:bg-emerald-500 transition-colors border border-emerald-500/30"
                >
                  Explorar proyectos
                  <ChevronRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-cosmos-surface/50 border-y border-cosmos-border">
        <div className="w-full max-w-[1200px] mx-auto px-6 pt-4 pb-4">
          <span className="block mb-2 text-xs font-semibold uppercase tracking-wider text-cosmos-accent">
            Para cada actor
          </span>
          <h2 className="font-display font-semibold text-cosmos-text text-[clamp(1.75rem,4vw,2.5rem)] m-0 mb-12">
            Una plataforma, múltiples oportunidades
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            <article className="group flex flex-col h-full p-8 bg-cosmos-surface border border-cosmos-border rounded-2xl text-cosmos-text transition-all hover:-translate-y-2 hover:border-cosmos-accent/40 hover:shadow-xl hover:shadow-cosmos-accent/5">
              <div className="w-14 h-14 rounded-xl bg-cosmos-accent-soft flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Wrench className="text-cosmos-accent" size={28} />
              </div>
              <h3 className="font-display text-xl font-semibold m-0 mb-3">Para vendedores</h3>
              <p className="text-cosmos-muted flex-1 m-0 mb-6 leading-relaxed">
                Vende sin invertir en stock. Conecta con proveedores y productores, elige productos y llega a tus clientes con la garantía de Cosmos.
              </p>
              <Link
                to="/onboard"
                className="self-start inline-flex items-center gap-2 px-5 py-2.5 font-medium text-cosmos-accent hover:text-cosmos-accent-hover transition-colors"
              >
                Empezar a vender
                <ArrowRight size={16} />
              </Link>
            </article>
            <article className="group flex flex-col h-full p-8 bg-cosmos-surface border border-cosmos-border rounded-2xl text-cosmos-text transition-all hover:-translate-y-2 hover:border-cosmos-accent/40 hover:shadow-xl hover:shadow-cosmos-accent/5">
              <div className="w-14 h-14 rounded-xl bg-cosmos-accent-soft flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Building2 className="text-cosmos-accent" size={28} />
              </div>
              <h3 className="font-display text-xl font-semibold m-0 mb-3">Para productores e importadores</h3>
              <p className="text-cosmos-muted flex-1 m-0 mb-6 leading-relaxed">
                Llega a más actores en el mercado y moviliza tus ventas más rápido. Precios y condiciones para retailers. Un solo flujo protegido.
              </p>
              <Link
                to="/proveedores"
                className="self-start inline-flex items-center gap-2 px-5 py-2.5 font-medium text-cosmos-accent hover:text-cosmos-accent-hover transition-colors"
              >
                Ver soluciones
                <ArrowRight size={16} />
              </Link>
            </article>
            <article className="group flex flex-col h-full p-8 bg-cosmos-surface border border-cosmos-border rounded-2xl text-cosmos-text transition-all hover:-translate-y-2 hover:border-cosmos-accent/40 hover:shadow-xl hover:shadow-cosmos-accent/5">
              <div className="w-14 h-14 rounded-xl bg-cosmos-accent-soft flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Wallet className="text-cosmos-accent" size={28} />
              </div>
              <h3 className="font-display text-xl font-semibold m-0 mb-3">Para compradores</h3>
              <p className="text-cosmos-muted flex-1 m-0 mb-6 leading-relaxed">
                Compra con confianza. Tus fondos están asegurados y el producto llega a tus manos con garantía de entrega.
              </p>
              <Link
                to="/tienda"
                className="self-start inline-flex items-center gap-2 px-5 py-2.5 font-medium text-cosmos-accent hover:text-cosmos-accent-hover transition-colors"
              >
                Comprar ahora
                <ArrowRight size={16} />
              </Link>
            </article>
          </div>
        </div>
      </section>

      <section className="py-24 bg-cosmos-bg">
        <div className="w-full max-w-[1200px] mx-auto px-6">
          <span className="block mb-2 text-xs font-semibold uppercase tracking-wider text-cosmos-accent">
            Protección
          </span>
          <h2 className="font-display font-semibold text-cosmos-text text-[clamp(1.75rem,4vw,2.5rem)] m-0 mb-4">
            Protección de punta a punta
          </h2>
          <p className="text-cosmos-muted max-w-[640px] m-0 mb-12 leading-relaxed">
            Cosmos es el intermediario que asegura que todas las operaciones finalicen de forma exitosa:
            fondos del comprador, entrega al cliente y pagos a vendedores y proveedores.
          </p>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 mb-12">
            <div className="flex flex-col gap-4 p-8 bg-cosmos-surface border border-cosmos-border rounded-2xl hover:border-cosmos-accent/30 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-cosmos-accent-soft flex items-center justify-center">
                <Shield size={24} className="text-cosmos-accent" />
              </div>
              <span className="font-semibold text-lg text-cosmos-text">Fondos asegurados</span>
              <span className="text-cosmos-muted">Sabemos que el dinero existe</span>
            </div>
            <div className="flex flex-col gap-4 p-8 bg-cosmos-surface border border-cosmos-border rounded-2xl hover:border-cosmos-accent/30 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-cosmos-accent-soft flex items-center justify-center">
                <Zap size={24} className="text-cosmos-accent" />
              </div>
              <span className="font-semibold text-lg text-cosmos-text">Entrega garantizada</span>
              <span className="text-cosmos-muted">El producto llega a tus manos</span>
            </div>
            <div className="flex flex-col gap-4 p-8 bg-cosmos-surface-elevated border border-cosmos-accent/30 rounded-2xl">
              <div className="w-12 h-12 rounded-xl bg-cosmos-accent-soft flex items-center justify-center">
                <Globe size={24} className="text-cosmos-accent" />
              </div>
              <span className="font-semibold text-lg text-cosmos-text">Un solo flujo</span>
              <span className="text-cosmos-muted">Protección para todos los actores</span>
            </div>
          </div>
          <div className="text-center">
            <Link
              to="/como-funciona"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 font-semibold bg-cosmos-accent text-cosmos-bg rounded-xl hover:bg-cosmos-accent-hover transition-all shadow-lg"
            >
              Cómo funciona
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-b from-cosmos-surface to-cosmos-bg border-t border-cosmos-border">
        <div className="w-full max-w-[720px] mx-auto px-6 text-center">
          <h2 className="font-display font-semibold text-cosmos-text text-[clamp(1.5rem,3vw,2.25rem)] m-0 mb-4">
            Listo para democratizar tu negocio
          </h2>
          <p className="text-cosmos-muted m-0 mb-8 leading-relaxed">
            Únete a Cosmos y opera con igualdad de oportunidades. Sin monopolios, sin barreras de capital.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              to="/onboard"
              className="inline-flex items-center justify-center px-8 py-4 font-semibold bg-cosmos-accent text-cosmos-bg rounded-xl hover:bg-cosmos-accent-hover transition-all shadow-lg"
            >
              Crear cuenta
            </Link>
            <Link
              to="/tienda"
              className="inline-flex items-center justify-center px-8 py-4 font-semibold bg-cosmos-surface-elevated text-cosmos-text border border-cosmos-border rounded-xl hover:border-cosmos-accent hover:text-cosmos-accent transition-colors"
            >
              Ver tienda
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
