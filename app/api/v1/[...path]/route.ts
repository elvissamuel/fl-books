import { NextResponse, type NextRequest } from "next/server";
import { cookieSessionStore } from "@/infrastructure/auth/cookie-session";
import { getAdminSession } from "@/infrastructure/auth/require-admin-session";
import { apiBaseUrl } from "@/infrastructure/http/api-client";

export const dynamic = "force-dynamic";

const expiredMessage = "Session expired or invalid; please log in again";

async function forward(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  const joined = path.map((segment) => encodeURIComponent(segment)).join("/");
  const upstreamPath = `/api/v1/${joined}${request.nextUrl.search}`;
  const isPrivate = path.includes("private");
  const clientAuthorization = request.headers.get("authorization");

  let baseUrl: string;
  let apiKey: string;
  try {
    baseUrl = apiBaseUrl();
    apiKey = process.env.NEXT_PUBLIC_API_KEY?.trim().replace(/^"|"$/g, "") ?? "";
    if (!apiKey) throw new Error("NEXT_PUBLIC_API_KEY must be set.");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Request failed.";
    console.error("[api]", request.method, upstreamPath, message);
    return NextResponse.json({ success: false, message, path: upstreamPath }, { status: 500 });
  }

  const headers = new Headers();
  headers.set("Accept", "application/json");
  headers.set("X-API-KEY", apiKey);

  if (clientAuthorization) {
    headers.set("Authorization", clientAuthorization);
  } else if (isPrivate) {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json(
        { success: false, message: expiredMessage, sessionExpired: true },
        { status: 401 },
      );
    }
    headers.set("Authorization", `Bearer ${session.accessToken}`);
  }

  const method = request.method.toUpperCase();
  let body: ArrayBuffer | undefined;
  if (method !== "GET" && method !== "HEAD") {
    const contentType = request.headers.get("content-type");
    const buffer = await request.arrayBuffer();
    if (buffer.byteLength > 0) {
      body = buffer;
      if (contentType) headers.set("Content-Type", contentType);
    }
  }

  let upstream: Response;
  try {
    upstream = await fetch(`${baseUrl}${upstreamPath}`, {
      method,
      headers,
      body,
      cache: "no-store",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Request failed.";
    console.error("[api]", method, upstreamPath, message);
    return NextResponse.json(
      { success: false, message: `Could not reach ${upstreamPath}. ${message}`, path: upstreamPath },
      { status: 502 },
    );
  }

  const text = await upstream.text();
  const usedAdminSession = isPrivate && !clientAuthorization;
  if (upstream.status === 401 && usedAdminSession) {
    await cookieSessionStore.destroy();
  }

  let responseText = text;
  if (upstream.status === 401 && usedAdminSession) {
    const parsed = readJson(text);
    const message =
      parsed && typeof parsed.message === "string" && parsed.message.trim()
        ? parsed.message
        : expiredMessage;
    responseText = JSON.stringify({ success: false, message, sessionExpired: true });
  } else if (!text) {
    responseText = JSON.stringify({
      success: upstream.ok,
      message: upstream.ok ? "" : `Request to ${upstreamPath} failed (${upstream.status}).`,
      data: null,
    });
  }

  if (!upstream.ok) {
    console.error("[api]", method, upstreamPath, upstream.status, responseText);
  }

  return new NextResponse(responseText, {
    status: upstream.status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
}

function readJson(text: string) {
  if (!text) return null;
  try {
    return JSON.parse(text) as { message?: unknown };
  } catch {
    return null;
  }
}

export const GET = forward;
export const POST = forward;
export const PUT = forward;
export const PATCH = forward;
export const DELETE = forward;
