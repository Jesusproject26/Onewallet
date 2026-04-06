const BASE_URL = "http://localhost:4000"; // change to your Render backend URL in production

export async function apiPost(path: string, body: any, token?: string) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Request failed");
  }
  return res.json();
}
export async function getBanks() {
  return apiGet("/bank/banks");
}

export async function resolveAccount(account_number: string, bank_code: string) {
  return apiPost("/bank/resolve", { account_number, bank_code });
}

export async function withdrawToBank(data: any, token: string) {
  return apiPost("/bank/withdraw", data, token);
}
export async function getKycStatus(token: string) {
  return apiGet("/kyc/status", token);
}

export async function submitKyc(data: any, token: string) {
  return apiPost("/kyc/submit", data, token);
}

export async function apiGet(path: string, token: string) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  export async function initializeAjoPayment(groupId: number, amount: number, email: string, token: string) {
  return apiPost(`/ajo/groups/${groupId}/pay`, { amount, email }, token);
}
export async function getWalletBalance(token: string) {
  return apiGet("/wallet/balance", token);
}

export async function verifyAjoPayment(groupId: number, reference: string, token: string) {
  return apiGet(`/ajo/groups/${groupId}/verify/${reference}`, token);
}
export async function setPin(pin: string, token: string) {
  return apiPost("/pin/set", { pin }, token);
}

export async function verifyPin(pin: string, token: string) {
  return apiPost("/pin/verify", { pin }, token);
}

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Request failed");
  }
  return res.json();
}
