import { createContext, useContext, useState, useCallback, useRef } from "react";

const STELLAR_WALLET_KEY = "cosmos_stellar_address";
const STELLAR_WALLET_NAME_KEY = "cosmos_stellar_wallet_name";
const STELLAR_WALLET_ID_KEY = "cosmos_stellar_wallet_id";

type StellarWalletContextType = {
  address: string | null;
  walletName: string | null;
  isConnecting: boolean;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  signMessage: (message: string) => Promise<string | null>;
  signTransaction: (xdr: string, params: { networkPassphrase: string }) => Promise<string | null>;
};

const StellarWalletContext = createContext<StellarWalletContextType | null>(null);

function loadStored(): { address: string | null; walletName: string | null; walletId: string | null } {
  try {
    const a = localStorage.getItem(STELLAR_WALLET_KEY);
    const n = localStorage.getItem(STELLAR_WALLET_NAME_KEY);
    const id = localStorage.getItem(STELLAR_WALLET_ID_KEY);
    return { address: a || null, walletName: n || null, walletId: id || null };
  } catch {
    return { address: null, walletName: null, walletId: null };
  }
}

function saveStored(
  address: string | null,
  walletName: string | null,
  walletId?: string | null
) {
  try {
    if (address) localStorage.setItem(STELLAR_WALLET_KEY, address);
    else localStorage.removeItem(STELLAR_WALLET_KEY);
    if (walletName) localStorage.setItem(STELLAR_WALLET_NAME_KEY, walletName);
    else localStorage.removeItem(STELLAR_WALLET_NAME_KEY);
    if (walletId != null) {
      if (walletId) localStorage.setItem(STELLAR_WALLET_ID_KEY, walletId);
      else localStorage.removeItem(STELLAR_WALLET_ID_KEY);
    }
  } catch {
    // ignore error 
  }
}

export function StellarWalletProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(() => loadStored().address);
  const [walletName, setWalletName] = useState<string | null>(() => loadStored().walletName);
  const [walletId, setWalletId] = useState<string | null>(() => loadStored().walletId);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const kitInitializedRef = useRef(false);

  const TESTNET_PASSPHRASE = "Test SDF Network ; September 2015";

  const initKit = useCallback(async () => {
    if (kitInitializedRef.current) return;
    try {
      const { StellarWalletsKit, Networks } = await import("@creit.tech/stellar-wallets-kit");
      const { defaultModules } = await import("@creit.tech/stellar-wallets-kit/modules/utils");
      StellarWalletsKit.init({
        network: Networks.TESTNET,
        modules: defaultModules(),
        selectedWalletId: loadStored().walletId ?? undefined,
      });
      kitInitializedRef.current = true;
    } catch (e) {
      setError("Stellar Wallet SDK no disponible. Ejecutá: npm install --ignore-scripts");
      throw e;
    }
  }, []);

  const connect = useCallback(async () => {
    setError(null);
    setIsConnecting(true);
    try {
      const { StellarWalletsKit } = await import("@creit.tech/stellar-wallets-kit");
      await initKit();
      const { address: addr } = await StellarWalletsKit.authModal();
      const module = StellarWalletsKit.selectedModule;
      const name = module?.productName ?? module?.productId ?? "Stellar";
      const id = module?.productId ?? null;
      setAddress(addr);
      setWalletName(name);
      setWalletId(id);
      saveStored(addr, name, id);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error al conectar la wallet";
      setError(message);
    } finally {
      setIsConnecting(false);
    }
  }, [initKit]);

  const disconnect = useCallback(() => {
    import("@creit.tech/stellar-wallets-kit")
      .then(({ StellarWalletsKit }) => StellarWalletsKit.disconnect())
      .catch(() => {});
    setAddress(null);
    setWalletName(null);
    setWalletId(null);
    saveStored(null, null, null);
    setError(null);
  }, []);

  const signMessage = useCallback(
    async (message: string): Promise<string | null> => {
      const currentAddress = address ?? loadStored().address;
      const storedWalletId = walletId ?? loadStored().walletId;
      if (!currentAddress) return null;
      try {
        if ((storedWalletId ?? "").toLowerCase() === "freighter") {
          const freighter = await import("@stellar/freighter-api");
          const access = await freighter.requestAccess();
          if (access.error) throw new Error(access.error.message ?? String(access.error));
          const result = await freighter.signMessage(message, {
            address: currentAddress,
            networkPassphrase: TESTNET_PASSPHRASE,
          });
          if (result.error) throw new Error(result.error.message ?? String(result.error));
          const raw = result.signedMessage;
          if (!raw) return null;
          if (typeof raw === "string") return raw;
          const withToString = raw as { toString?: (enc: string) => string };
          if (typeof withToString.toString === "function") return withToString.toString("base64");
          return null;
        }
        await initKit();
        const { StellarWalletsKit } = await import("@creit.tech/stellar-wallets-kit");
        if (storedWalletId) StellarWalletsKit.setWallet(storedWalletId);
        const { signedMessage } = await StellarWalletsKit.signMessage(message, {
          address: currentAddress,
          networkPassphrase: TESTNET_PASSPHRASE,
        });
        return signedMessage ?? null;
      } catch (err) {
        let msg: string;
        if (err instanceof Error) msg = err.message;
        else if (err && typeof (err as { message?: unknown }).message === "string")
          msg = (err as { message: string }).message;
        else if (err && typeof err === "object") msg = "Error al firmar el mensaje";
        else msg = String(err);
        throw new Error(msg || "Error al firmar el mensaje");
      }
    },
    [address, walletId, initKit]
  );

  const signTransaction = useCallback(
    async (xdr: string, params: { networkPassphrase: string }): Promise<string | null> => {
      const currentAddress = address ?? loadStored().address;
      const storedWalletId = walletId ?? loadStored().walletId;
      if (!currentAddress) return null;
      try {
        if ((storedWalletId ?? "").toLowerCase() === "freighter") {
          const freighter = await import("@stellar/freighter-api");
          const access = await freighter.requestAccess();
          if (access.error) throw new Error(access.error.message ?? String(access.error));
          const result = await freighter.signTransaction(xdr, {
            address: currentAddress,
            networkPassphrase: params.networkPassphrase,
          });
          if (result.error) throw new Error(result.error.message ?? String(result.error));
          return result.signedTxXdr ?? null;
        }
        await initKit();
        const { StellarWalletsKit } = await import("@creit.tech/stellar-wallets-kit");
        if (storedWalletId) StellarWalletsKit.setWallet(storedWalletId);
        const { signedTxXdr } = await StellarWalletsKit.signTransaction(xdr, {
          address: currentAddress,
          networkPassphrase: params.networkPassphrase,
        });
        return signedTxXdr ?? null;
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : typeof err === "string" ? err : "Error al firmar la transacción";
        throw new Error(msg || "Error al firmar la transacción");
      }
    },
    [address, walletId, initKit]
  );

  return (
    <StellarWalletContext.Provider
      value={{
        address,
        walletName,
        isConnecting,
        error,
        connect,
        disconnect,
        signMessage,
        signTransaction,
      }}
    >
      {children}
    </StellarWalletContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useStellarWallet() {
  const ctx = useContext(StellarWalletContext);
  if (!ctx) throw new Error("useStellarWallet must be used within StellarWalletProvider");
  return ctx;
}
