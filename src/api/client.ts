const BASE = "/api";

function getToken() {
  return localStorage.getItem("token");
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
      ...options?.headers,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data as T;
}

export const api = {
  auth: {
    register: (body: { name: string; email: string; password: string }) =>
      request<{ token: string; user: { id: string; name: string; email: string } }>("/auth/register", {
        method: "POST", body: JSON.stringify(body),
      }),
    login: (body: { email: string; password: string }) =>
      request<{ token: string; user: { id: string; name: string; email: string } }>("/auth/login", {
        method: "POST", body: JSON.stringify(body),
      }),
  },
  notes: {
    list: () => request<import("../types").Note[]>("/notes"),
    create: (body: Partial<import("../types").Note>) =>
      request<import("../types").Note>("/notes", { method: "POST", body: JSON.stringify(body) }),
    update: (id: string, body: Partial<import("../types").Note>) =>
      request<import("../types").Note>(`/notes/${id}`, { method: "PUT", body: JSON.stringify(body) }),
    delete: (id: string) => request<{ ok: boolean }>(`/notes/${id}`, { method: "DELETE" }),
  },
};
