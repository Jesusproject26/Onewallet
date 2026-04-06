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

export async function apiGet(path: string, token: string) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  export async function initializeAjoPayment(groupId: number, amount: number, email: string, token: string) {
  return apiPost(`/ajo/groups/${groupId}/pay`, { amount, email }, token);
}

export async function verifyAjoPayment(groupId: number, reference: string, token: string) {
  return apiGet(`/ajo/groups/${groupId}/verify/${reference}`, token);
}

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Request failed");
  }
  return res.json();
}
