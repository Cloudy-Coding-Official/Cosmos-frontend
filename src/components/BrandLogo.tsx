/** Logo principal: logo (tamaño máximo). Usar logo-small en contenedores redondeados para que la esquina no se corte. */
type BrandLogoProps = {
  /** "full" = logo completo (header, footer). "small" = variante para contenedores redondeados. */
  variant?: "full" | "small";
  className?: string;
  /** Alt para accesibilidad (ej. "Cosmos - Inicio") */
  alt?: string;
};

const LOGO_FULL = "/logo.svg";
const LOGO_SMALL = "/logo-small.svg";

export function BrandLogo({ variant = "full", className = "", alt = "Cosmos" }: BrandLogoProps) {
  const src = variant === "small" ? LOGO_SMALL : LOGO_FULL;
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      width={variant === "small" ? 120 : undefined}
      height={variant === "small" ? 32 : undefined}
    />
  );
}
