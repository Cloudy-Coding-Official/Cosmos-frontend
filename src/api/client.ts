const BASE_URL = import.meta.env.VITE_API_URL ?? "";

export type ApiError = { status: number; message: string; detail?: unknown };

export function getErrorMessage(err: unknown, fallback = "Ha ocurrido un error"): string {
  if (err == null) return fallback;
  if (err instanceof Error) {
    const msg = err.message || fallback;
    if (/failed to fetch|network error|load failed/i.test(msg)) {
      return "No se pudo conectar al servidor.";
    }
    return msg;
  }
  const o = err as Record<string, unknown>;
  if (typeof o.message === "string") return o.message;
  if (Array.isArray(o.message)) return o.message[0] ?? fallback;
  if (typeof o.error === "string") return o.error;
  if (typeof o.statusText === "string") return o.statusText;
  return fallback;
}

function getStoredToken(): string | null {
  return localStorage.getItem("cosmos_access_token");
}

function getStoredRefreshToken(): string | null {
  return localStorage.getItem("cosmos_refresh_token");
}

function setStoredTokens(access: string, refresh: string) {
  localStorage.setItem("cosmos_access_token", access);
  localStorage.setItem("cosmos_refresh_token", refresh);
}

export function clearStoredTokens() {
  localStorage.removeItem("cosmos_access_token");
  localStorage.removeItem("cosmos_refresh_token");
}

export function getAccessToken(): string | null {
  return getStoredToken();
}

export function setAccessToken(token: string) {
  localStorage.setItem("cosmos_access_token", token);
}

export function setTokens(access: string, refresh: string) {
  setStoredTokens(access, refresh);
}

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const refresh = getStoredRefreshToken();
  if (!refresh) return null;
  if (refreshPromise) return refreshPromise;
  refreshPromise = (async () => {
    try {
      const res = await fetch(`${BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: refresh }),
      });
      if (!res.ok) {
        clearStoredTokens();
        return null;
      }
      const data = await res.json();
      const access = data.accessToken;
      const newRefresh = data.refreshToken;
      if (access) {
        setStoredTokens(access, newRefresh ?? refresh);
        return access;
      }
      return null;
    } finally {
      refreshPromise = null;
    }
  })();
  return refreshPromise;
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit & { skipAuth?: boolean } = {}
): Promise<T> {
  const { skipAuth, ...fetchOptions } = options;
  const url = path.startsWith("http") ? path : `${BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;

  const doRequest = async (token: string | null): Promise<Response> => {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(fetchOptions.headers as Record<string, string>),
    };
    if (token && !skipAuth) (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
    return fetch(url, { ...fetchOptions, headers });
  };

  let res = await doRequest(skipAuth ? null : getStoredToken());

  if (res.status === 401 && !skipAuth && getStoredRefreshToken()) {
    const newToken = await refreshAccessToken();
    if (newToken) res = await doRequest(newToken);
  }

  if (!res.ok) {
    let message = res.statusText;
    let detail: unknown;
    try {
      const body = await res.json();
      message = body.message ?? body.error ?? message;
      detail = body;
    } catch {
      // ignore error 
    }
    const err: ApiError = { status: res.status, message, detail };
    throw err;
  }

  const contentType = res.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    const body = await res.json();
    if (body != null && typeof body === "object" && "data" in body && body.data !== undefined) {
      return body.data as T;
    }
    return body as T;
  }
  return res.text() as Promise<T>;
}
