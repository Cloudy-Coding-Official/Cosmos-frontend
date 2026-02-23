import { apiRequest, clearStoredTokens, setTokens, getAccessToken } from "./client";

export { getAccessToken, clearStoredTokens };

export type UserRoleBackend = "USER" | "ADMIN" | "SUPPORT" | "OWNER";

export type AuthUser = {
  id: string;
  email: string | null;
  role: UserRoleBackend;
  kycStatus: string;
  country: string;
  providers: string[];
  walletAddresses: string[];
  hasBuyerProfile: boolean;
  hasStoreProfile: boolean;
  hasProviderProfile: boolean;
  buyerProfileId: string | null;
  storeProfileId: string | null;
  providerProfileId: string | null;
  createdAt: string;
};

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
};

export type AuthResponse = {
  user: AuthUser;
  tokens: AuthTokens;
};

export async function register(data: {
  email: string;
  password: string;
  country?: string;
}): Promise<AuthResponse> {
  const res = await apiRequest<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
    skipAuth: true,
  });
  setTokens(res.tokens.accessToken, res.tokens.refreshToken);
  return res;
}

export async function login(data: { email: string; password: string }): Promise<AuthResponse> {
  const res = await apiRequest<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
    skipAuth: true,
  });
  setTokens(res.tokens.accessToken, res.tokens.refreshToken);
  return res;
}

export async function googleAuth(data: { idToken: string; country?: string }): Promise<AuthResponse> {
  const res = await apiRequest<AuthResponse>("/auth/google", {
    method: "POST",
    body: JSON.stringify(data),
    skipAuth: true,
  });
  setTokens(res.tokens.accessToken, res.tokens.refreshToken);
  return res;
}

export async function getWalletNonce(address: string): Promise<{ address: string; nonce: string; message: string }> {
  return apiRequest(`/auth/wallet/nonce?address=${encodeURIComponent(address)}`, {
    method: "GET",
    skipAuth: true,
  });
}

export async function walletVerify(data: {
  address: string;
  signature: string;
  country?: string;
}): Promise<AuthResponse> {
  const res = await apiRequest<AuthResponse>("/auth/wallet/verify", {
    method: "POST",
    body: JSON.stringify(data),
    skipAuth: true,
  });
  setTokens(res.tokens.accessToken, res.tokens.refreshToken);
  return res;
}

export async function linkWallet(data: {
  address: string;
  signature: string;
}): Promise<{ message: string; address: string }> {
  return apiRequest("/auth/wallet/link", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function logoutApi(refreshToken?: string): Promise<void> {
  const token = refreshToken ?? localStorage.getItem("cosmos_refresh_token");
  if (token) {
    try {
      await apiRequest("/auth/logout", {
        method: "POST",
        body: JSON.stringify({ refreshToken: token }),
      });
    } catch {
      // ignore
    }
  }
  clearStoredTokens();
}

export async function logoutAllApi(): Promise<void> {
  try {
    await apiRequest("/auth/logout-all", { method: "POST" });
  } catch {
    // ignore
  }
  clearStoredTokens();
}

export async function me(): Promise<AuthUser> {
  return apiRequest<AuthUser>("/auth/me", { method: "GET" });
}
