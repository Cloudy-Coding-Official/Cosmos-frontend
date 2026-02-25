import { apiRequest } from "./client";

export type WalletTransaction = {
  id: string;
  type: string;
  amount: number | string;
  currency?: string;
  createdAt: string;
  description?: string | null;
};

export type WalletBackend = {
  id: string;
  userId: string;
  currency: string;
  availableBalance: number;
  heldBalance: number;
  pendingBalance: number;
  createdAt: string;
  updatedAt: string;
  transactions?: WalletTransaction[];
};

export async function getMyTransactions(): Promise<WalletTransaction[]> {
  const wallets = await getWallets();
  const withCurrency = wallets.flatMap((w) =>
    (w.transactions ?? []).map((t) => ({
      ...t,
      amount: typeof t.amount === "string" ? parseFloat(t.amount) : t.amount,
      currency: t.currency ?? w.currency,
    }))
  );
  withCurrency.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return withCurrency;
}

export async function getWallets(): Promise<WalletBackend[]> {
  return apiRequest<WalletBackend[]>("/wallets", { method: "GET" });
}

export async function createWallet(currency: string): Promise<WalletBackend> {
  return apiRequest<WalletBackend>("/wallets", {
    method: "POST",
    body: JSON.stringify({ currency }),
  });
}

