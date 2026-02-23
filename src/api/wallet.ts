import { apiRequest } from "./client";

export type WalletBackend = {
  id: string;
  userId: string;
  currency: string;
  availableBalance: number;
  heldBalance: number;
  pendingBalance: number;
  createdAt: string;
  updatedAt: string;
  transactions?: Array<{
    id: string;
    type: string;
    amount: number;
    createdAt: string;
  }>;
};

export async function getWallets(): Promise<WalletBackend[]> {
  return apiRequest<WalletBackend[]>("/wallets", { method: "GET" });
}

export async function createWallet(currency: string): Promise<WalletBackend> {
  return apiRequest<WalletBackend>("/wallets", {
    method: "POST",
    body: JSON.stringify({ currency }),
  });
}

