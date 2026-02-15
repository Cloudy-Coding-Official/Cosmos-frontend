import { useState } from "react";
import { Package } from "lucide-react";

type ProductImageProps = {
  src: string | null | undefined;
  alt: string;
  className?: string;
  wrapperClassName?: string;
};

/** Muestra la imagen del producto o un placeholder si no hay URL o falla la carga. */
export function ProductImage({ src, alt, className = "", wrapperClassName = "" }: ProductImageProps) {
  const [failed, setFailed] = useState(false);
  const showPlaceholder = !src || failed;

  if (showPlaceholder) {
    return (
      <div
        className={`bg-gradient-to-br from-cosmos-surface-elevated to-cosmos-surface flex items-center justify-center text-cosmos-muted ${wrapperClassName}`}
        aria-hidden
      >
        <Package size={32} className="opacity-50" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}
