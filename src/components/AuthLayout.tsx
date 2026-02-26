import type { ReactNode } from "react";

type AuthLayoutProps = {
  children: ReactNode;
  /** Si true, permite contenido más ancho (ej. onboarding con cards) */
  wide?: boolean;
};

export function AuthLayout({ children, wide }: AuthLayoutProps) {
  return (
    <div className="min-h-[calc(100vh-72px)] flex">
      <div className="flex-1 flex items-center justify-center py-12 px-6 lg:px-12 bg-cosmos-bg">
        <div className={`w-full ${wide ? "max-w-[580px]" : "max-w-[460px]"}`}>
          {children}
        </div>
      </div>

      <div className="hidden lg:flex flex-1 relative overflow-hidden bg-gradient-to-br from-cosmos-surface via-cosmos-bg to-cosmos-bg border-l border-cosmos-border">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_80%_50%,rgba(139,92,246,0.15)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_20%_80%,rgba(139,92,246,0.08)_0%,transparent_50%)]" />
        <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-cosmos-accent/10 blur-3xl" />
        <div className="absolute bottom-1/3 right-1/3 w-48 h-48 rounded-full bg-cosmos-accent/5 blur-2xl" />
        <div className="absolute top-1/2 left-1/4 w-32 h-32 rounded-full bg-cosmos-accent/5 blur-2xl" />
        <div className="relative flex items-center justify-center w-full p-16">
          <div className="text-center max-w-md">
            <p className="font-display font-medium text-cosmos-text/80 text-xl md:text-2xl leading-relaxed m-0">
              Donde todos tienen igualdad de oportunidades para comprar, vender y producir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
