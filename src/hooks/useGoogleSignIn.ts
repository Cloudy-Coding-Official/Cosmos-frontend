import { useEffect, useRef, useState, useCallback } from "react";

const GSI_SCRIPT_URL = "https://accounts.google.com/gsi/client";

type GsiButtonConfig = {
  type?: "standard" | "icon";
  theme?: "outline" | "filled_blue" | "filled_black";
  size?: "large" | "medium" | "small";
  text?: "signin_with" | "signup_with" | "continue_with" | "signin";
  callback: (response: { credential: string }) => void;
};

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
          renderButton: (parent: HTMLElement, options: GsiButtonConfig) => void;
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
  const buttonContainerRef = useRef<HTMLDivElement>(null);
  const buttonRenderedRef = useRef(false);

  useEffect(() => {
    onCredentialRef.current = onCredential;
  }, [onCredential]);

  useEffect(() => {
    if (!clientId || typeof clientId !== "string") return;

    let cancelled = false;

    loadScript()
      .then(() => {
        if (cancelled || !window.google?.accounts?.id) return;
        window.google!.accounts.id.initialize({
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

  // Render the official Google button into the container (opens classic account picker popup when clicked)
  useEffect(() => {
    if (!isReady || !clientId || !buttonContainerRef.current || !window.google?.accounts?.id?.renderButton || buttonRenderedRef.current) return;
    buttonRenderedRef.current = true;
    window.google.accounts.id.renderButton(buttonContainerRef.current, {
      type: "standard",
      theme: "outline",
      size: "large",
      text: "continue_with",
      callback: (response) => {
        if (response?.credential) onCredentialRef.current(response.credential);
      },
    });
  }, [isReady, clientId]);

  const triggerSignIn = useCallback(() => {
    setError(null);
    const container = buttonContainerRef.current;
    if (!container) {
      setError("Google Sign-In aún no está listo");
      return;
    }
    const googleButton = container.querySelector<HTMLElement>("div[role='button']");
    if (googleButton) {
      googleButton.click();
    } else {
      setError("Google Sign-In aún no está listo");
    }
  }, []);

  return { triggerSignIn, isReady, error, buttonContainerRef };
}
