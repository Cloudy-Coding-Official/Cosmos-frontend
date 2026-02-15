import { useState, useEffect } from "react";

/**
 * Envuelve el contenido de cada ruta y aplica un fade-in al montar.
 * Al cambiar la key (pathname), se desmonta y vuelve a montar con visible=false,
 * evitando el flash de contenido antes de la animación.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setVisible(true);
      });
    });
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div
      className={`min-h-full transition-opacity duration-300 ease-out ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      {children}
    </div>
  );
}
