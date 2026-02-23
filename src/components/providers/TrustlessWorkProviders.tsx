import type { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { development, TrustlessWorkConfig } from "@trustless-work/escrow";
import { StellarWalletProvider } from "../../context/StellarWalletContext.tsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false },
  },
});

const trustlessApiKey = import.meta.env.VITE_TRUSTLESSWORK_API_KEY ?? "";

export function TrustlessWorkProviders({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <TrustlessWorkConfig baseURL={development} apiKey={trustlessApiKey}>
        <StellarWalletProvider>{children}</StellarWalletProvider>
      </TrustlessWorkConfig>
    </QueryClientProvider>
  );
}
