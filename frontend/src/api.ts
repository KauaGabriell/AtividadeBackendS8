const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export interface PublicUser {
  id: string;
  name: string;
  email: string;
}

interface ApiErrorBody {
  error?: string;
}

export class ApiError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...init,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...init.headers,
      },
    });
  } catch {
    throw new ApiError("Não foi possível conectar à API. Confira se o backend está ativo.", 0);
  }

  const body = await response.json().catch(() => ({})) as ApiErrorBody & T;
  if (!response.ok) {
    throw new ApiError(body.error ?? "Não foi possível concluir a solicitação.", response.status);
  }

  return body;
}
