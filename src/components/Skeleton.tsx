type SkeletonProps = {
  className?: string;
  /** Si se pasa, se usa como wrapper; si no, es un div. */
  as?: "div" | "span";
};

/** Bloque genérico con animación de carga (shimmer). */
export function Skeleton({ className = "", as: Component = "div" }: SkeletonProps) {
  return (
    <Component
      className={`skeleton-shimmer rounded-lg bg-cosmos-surface-elevated ${className}`}
      aria-hidden
    />
  );
}

/** Variante para líneas de texto (una o varias). */
export function SkeletonText({
  lines = 1,
  className = "",
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={`space-y-2 ${className}`} aria-hidden>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={`h-4 ${i === lines - 1 && lines > 1 ? "w-2/3" : "w-full"}`}
        />
      ))}
    </div>
  );
}

/** Card de producto (imagen + líneas) para grids. */
export function SkeletonProductCard({ className = "" }: { className?: string }) {
  return (
    <div
      className={`bg-cosmos-surface border border-cosmos-border rounded-2xl overflow-hidden ${className}`}
      aria-hidden
    >
      <Skeleton className="aspect-square w-full rounded-none" />
      <div className="p-5 space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/4" />
        <Skeleton className="h-4 w-1/3" />
      </div>
    </div>
  );
}

/** Card genérica (icono + título + líneas). */
export function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <div
      className={`p-6 bg-cosmos-surface border border-cosmos-border rounded-2xl space-y-4 ${className}`}
      aria-hidden
    >
      <Skeleton className="w-12 h-12 rounded-xl" />
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  );
}

/** Fila de lista (para tablas o listas simples). */
export function SkeletonRow({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex items-center gap-4 py-4 border-b border-cosmos-border last:border-b-0 ${className}`}
      aria-hidden
    >
      <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
      <div className="flex-1 min-w-0 space-y-2">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <Skeleton className="h-8 w-20 rounded-lg shrink-0" />
    </div>
  );
}

/** Bloque de página completa (título + contenido). */
export function SkeletonPage({ className = "" }: { className?: string }) {
  return (
    <div className={`space-y-6 ${className}`} aria-hidden>
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>
      <div className="space-y-4">
        <SkeletonRow />
        <SkeletonRow />
        <SkeletonRow />
      </div>
    </div>
  );
}
