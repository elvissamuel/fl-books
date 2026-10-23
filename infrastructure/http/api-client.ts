import "server-only";

export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function requiredEnv(name: "NEXT_PUBLIC_BASE_URL" | "NEXT_PUBLIC_API_KEY") {
  const raw = process.env[name]?.trim().replace(/^"|"$/g, "");

  if (!raw) {
    throw new Error(`${name} must be set.`);
  }

  return raw;
}

export function apiBaseUrl() {
  return requiredEnv("NEXT_PUBLIC_BASE_URL").replace(/\/$/, "");
}

export async function apiJson<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers);
  headers.set("Accept", "application/json");
  headers.set("X-API-KEY", requiredEnv("NEXT_PUBLIC_API_KEY"));

  if (init?.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${apiBaseUrl()}${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });

  const body = await readJson(response);

  if (!response.ok) {
    const message =
      body && typeof body === "object" && "message" in body && typeof body.message === "string"
        ? body.message
        : `Request to ${path} failed (${response.status}).`;
    throw new ApiError(message, response.status);
  }

  return body as T;
}

async function readJson(response: Response) {
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
}
