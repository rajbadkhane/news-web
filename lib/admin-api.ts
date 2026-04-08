export type AdminRecord = Record<string, any>;

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") || "";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  if (!API_BASE) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured");
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {})
    },
    cache: "no-store"
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(payload?.message || `Request failed for ${path}`);
  }

  return payload;
}

export async function getList<T = AdminRecord>(path: string): Promise<T[]> {
  const payload = await request<{ ok: true; data: T[] }>(path);
  return payload.data;
}

export async function getDashboard() {
  return request<{
    ok: true;
    stats: Record<string, number>;
    recentArticles: AdminRecord[];
  }>("/dashboard");
}

export async function createRecord<T = AdminRecord>(path: string, data: AdminRecord) {
  const payload = await request<{ ok: true; data: T }>(path, {
    method: "POST",
    body: JSON.stringify(data)
  });
  return payload.data;
}

export async function updateRecord<T = AdminRecord>(
  path: string,
  id: number | string,
  data: AdminRecord
) {
  const payload = await request<{ ok: true; data: T }>(`${path}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data)
  });
  return payload.data;
}

export async function deleteRecord(path: string, id: number | string) {
  await request(`${path}/${id}`, {
    method: "DELETE"
  });
}

export { API_BASE };
