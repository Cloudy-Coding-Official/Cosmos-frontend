type BrandLogoProps = {
  variant?: "full" | "small";
  className?: string;
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
