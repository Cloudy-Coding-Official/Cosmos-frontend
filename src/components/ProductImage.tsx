import { useState } from "react";
import { Package } from "lucide-react";

type ProductImageProps = {
  src: string | null | undefined;
  alt: string;
  className?: string;
  wrapperClassName?: string;
};

export function ProductImage({ src, alt, className = "", wrapperClassName = "" }: ProductImageProps) {
  const [failed, setFailed] = useState(false);
  const showPlaceholder = !src || failed;

  const wrapperClass = `aspect-square overflow-hidden ${wrapperClassName}`.trim();

  if (showPlaceholder) {
    return (
      <div
        className={`bg-gradient-to-br from-cosmos-surface-elevated to-cosmos-surface flex items-center justify-center text-cosmos-muted ${wrapperClass}`}
        aria-hidden
      >
        <Package size={32} className="opacity-50" />
      </div>
    );
  }

  return (
    <div className={wrapperClass}>
      <img
        src={src}
        alt={alt}
        className={`size-full object-cover object-center ${className}`.trim()}
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
      />
    </div>
  );
}
