import { apiRequest } from "./client";

/** Response from prepare checkout: deploy is done by backend; frontend uses SDK to fund. */
export type CheckoutPrepareResponse = {
  escrowId: string;
  contractId: string;
  amount: number;
  currency: string;
};

export async function prepareCheckoutByOrder(
  orderId: string,
  buyerStellarAddress: string
): Promise<CheckoutPrepareResponse> {
  return apiRequest<CheckoutPrepareResponse>(
    `/escrow/checkout/prepare-by-order/${encodeURIComponent(orderId)}`,
    {
      method: "POST",
      body: JSON.stringify({ buyerStellarAddress }),
    }
  );
}

export type FundConfirmResponse = {
  escrow?: { id: string; status: string };
  txId?: string;
  flow?: string;
};

/** Confirm that the buyer funded the escrow via SDK (updates backend state). */
export async function fundEscrowConfirm(
  escrowId: string,
  payload: { transactionId?: string }
): Promise<FundConfirmResponse> {
  return apiRequest<FundConfirmResponse>(`/escrow/${encodeURIComponent(escrowId)}/fund/confirm`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/** Legacy: submit signed XDR via backend (alternative to SDK submit + fundConfirm). */
export type FundSubmitResponse = {
  escrow?: { id: string; status: string };
  txId?: string;
  flow?: string;
};

export async function fundEscrowSubmit(
  escrowId: string,
  signedXdr: string
): Promise<FundSubmitResponse> {
  return apiRequest<FundSubmitResponse>(`/escrow/${encodeURIComponent(escrowId)}/fund/submit`, {
    method: "POST",
    body: JSON.stringify({ signedXdr }),
  });
}
