import { useEffect, useRef, useState, useCallback } from "react";

const GSI_SCRIPT_URL = "https://accounts.google.com/gsi/client";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
            auto_select?: boolean;
          }) => void;
          prompt: (momentListener?: (moment: { displayMode: string }) => void) => void;
        };
      };
    };
  }
}

function loadScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("window is undefined"));
      return;
    }
    if (window.google?.accounts?.id) {
      resolve();
      return;
    }
    const existing = document.querySelector(`script[src="${GSI_SCRIPT_URL}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve());
      return;
    }
    const script = document.createElement("script");
    script.src = GSI_SCRIPT_URL;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Google Sign-In script"));
    document.head.appendChild(script);
  });
}

const GOOGLE_NOT_CONFIGURED = "Autenticación con Google no disponible.";

export function useGoogleSignIn(onCredential: (idToken: string) => void) {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(() =>
    !clientId || typeof clientId !== "string" ? GOOGLE_NOT_CONFIGURED : null
  );
  const onCredentialRef = useRef(onCredential);

  useEffect(() => {
    onCredentialRef.current = onCredential;
  }, [onCredential]);

  useEffect(() => {
    if (!clientId || typeof clientId !== "string") return;

    let cancelled = false;

    loadScript()
      .then(() => {
        if (cancelled || !window.google?.accounts?.id) return;
        window.google.accounts.id.initialize({
          client_id: clientId,
          auto_select: false,
          callback: (response) => {
            if (response?.credential) onCredentialRef.current(response.credential);
          },
        });
        if (!cancelled) setIsReady(true);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Error al cargar Google");
      });

    return () => {
      cancelled = true;
    };
  }, [clientId]);

  const triggerSignIn = useCallback(() => {
    setError(null);
    if (!window.google?.accounts?.id) {
      setError("Google Sign-In aún no está listo");
      return;
    }
    window.google.accounts.id.prompt();
  }, []);

  return { triggerSignIn, isReady, error };
}
