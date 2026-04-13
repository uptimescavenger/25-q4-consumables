const API_BASE = import.meta.env.DEV ? "http://localhost:4000/api" : "/api";

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export const api = {
  getDashboard: (facilityId = "f1") =>
    fetchJson<any>(`/dashboard?facilityId=${facilityId}`),

  getMetrics: () => fetchJson<any>("/dashboard/metrics"),

  getVendors: () => fetchJson<any>("/dashboard/vendors"),

  getInventory: (params: Record<string, string> = {}) => {
    const qs = new URLSearchParams({ facilityId: "f1", ...params }).toString();
    return fetchJson<any>(`/inventory?${qs}`);
  },

  updateQuantity: (id: string, quantity: number) =>
    fetchJson<any>(`/inventory/${id}/quantity`, {
      method: "PATCH",
      body: JSON.stringify({ quantity }),
    }),

  toggleReminder: (id: string, enabled: boolean) =>
    fetchJson<any>(`/inventory/${id}/reminder`, {
      method: "PATCH",
      body: JSON.stringify({ enabled }),
    }),

  getOrders: (params: Record<string, string> = {}) => {
    const qs = new URLSearchParams({ facilityId: "f1", ...params }).toString();
    return fetchJson<any>(`/orders?${qs}`);
  },

  createOrder: (data: any) =>
    fetchJson<any>("/orders", { method: "POST", body: JSON.stringify(data) }),

  updateOrderStatus: (id: string, status: string) =>
    fetchJson<any>(`/orders/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),

  getAutomations: () => fetchJson<any>("/automations?facilityId=f1"),

  createAutomation: (data: any) =>
    fetchJson<any>("/automations", { method: "POST", body: JSON.stringify(data) }),

  updateAutomation: (id: string, data: any) =>
    fetchJson<any>(`/automations/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  deleteAutomation: (id: string) =>
    fetchJson<any>(`/automations/${id}`, { method: "DELETE" }),
};
