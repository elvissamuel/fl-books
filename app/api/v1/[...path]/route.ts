import http from "node:http";
import https from "node:https";
import { NextResponse, type NextRequest } from "next/server";
import { cookieSessionStore } from "@/infrastructure/auth/cookie-session";
import { destroyCustomerSession, getCustomerSession } from "@/infrastructure/auth/customer-session";
import { getAdminSession } from "@/infrastructure/auth/require-admin-session";
import { apiBaseUrl } from "@/infrastructure/http/api-client";

export const dynamic = "force-dynamic";

const expiredMessage = "Session expired or invalid; please log in again";

function isCustomerPrivate(path: string[]) {
  if (path[0] === "cart" && (path[1] === "private" || path[1] === "public" || path[1] === "items")) return true;
  if (path[0] === "currencies" && path[1] === "public") return true;
  if (path[0] === "payments" && path[1] === "private" && path[2] === "customer") return true;
  if (
    path[0] === "orders" &&
    path[1] === "private" &&
    (path[2] === "customer" || path[2] === "checkout" || path[2] === "calculate")
  ) {
    return true;
  }
  return path[0] === "customer" && path[1] === "private" && path[2] !== "admin";
}

function isPickupLocationList(path: string[]) {
  return path[0] === "pickup-locations" && path[1] === "private" && path.length === 2;
}

function isPaymentVerify(path: string[]) {
  return path[0] === "payments" && path[1] === "private" && path[2] === "verify";
}

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

  let usedCustomerSession = false;
  if (isCustomerPrivate(path)) {
    const customer = await getCustomerSession();
    if (customer) {
      headers.set("Authorization", `Bearer ${customer.accessToken}`);
      usedCustomerSession = true;
    } else if (clientAuthorization) {
      headers.set("Authorization", clientAuthorization);
    } else {
      return NextResponse.json(
        { success: false, message: expiredMessage, sessionExpired: true },
        { status: 401 },
      );
    }
  } else if (clientAuthorization) {
    headers.set("Authorization", clientAuthorization);
  } else if (isPaymentVerify(path)) {
    const customer = await getCustomerSession();
    if (customer) {
      headers.set("Authorization", `Bearer ${customer.accessToken}`);
      usedCustomerSession = true;
    } else {
      const admin = await getAdminSession();
      if (!admin) {
        return NextResponse.json(
          { success: false, message: expiredMessage, sessionExpired: true },
          { status: 401 },
        );
      }
      headers.set("Authorization", `Bearer ${admin.accessToken}`);
    }
  } else if (isPickupLocationList(path) && request.method.toUpperCase() === "GET") {
    const admin = await getAdminSession();
    if (admin) {
      headers.set("Authorization", `Bearer ${admin.accessToken}`);
    } else {
      const customer = await getCustomerSession();
      if (!customer) {
        return NextResponse.json(
          { success: false, message: expiredMessage, sessionExpired: true },
          { status: 401 },
        );
      }
      headers.set("Authorization", `Bearer ${customer.accessToken}`);
      usedCustomerSession = true;
    }
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

  let upstream: { status: number; body: string };
  try {
    upstream = await requestUpstream(`${baseUrl}${upstreamPath}`, method, headers, body);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Request failed.";
    console.error("[api]", method, upstreamPath, message);
    return NextResponse.json(
      { success: false, message: `Could not reach ${upstreamPath}. ${message}`, path: upstreamPath },
      { status: 502 },
    );
  }

  const text = upstream.body;
  const usedAdminSession = isPrivate && !isCustomerPrivate(path) && !clientAuthorization && !usedCustomerSession;
  const tokenRejected = upstream.status === 401 && /expired|invalid|missing token/i.test(text);
  if (tokenRejected && usedCustomerSession) {
    await destroyCustomerSession();
  } else if (upstream.status === 401 && usedAdminSession) {
    await cookieSessionStore.destroy();
  }

  let responseText = text;
  if (upstream.status === 401 && (tokenRejected || usedAdminSession)) {
    const parsed = readJson(text);
    const message =
      parsed && typeof parsed.message === "string" && parsed.message.trim()
        ? parsed.message
        : expiredMessage;
    responseText = JSON.stringify({ success: false, message, sessionExpired: true });
  } else if (!text) {
    responseText = JSON.stringify({
      success: upstream.status >= 200 && upstream.status < 300,
      message:
        upstream.status >= 200 && upstream.status < 300
          ? ""
          : `Request to ${upstreamPath} failed (${upstream.status}).`,
      data: null,
    });
  }

  if (upstream.status < 200 || upstream.status >= 300) {
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

function requestUpstream(url: string, method: string, headers: Headers, body?: ArrayBuffer) {
  const target = new URL(url);
  const client = target.protocol === "https:" ? https : http;
  const headerRecord: Record<string, string | number> = {};
  headers.forEach((value, key) => {
    headerRecord[key] = value;
  });
  const payload = body ? Buffer.from(body) : undefined;
  if (payload) headerRecord["content-length"] = payload.length;

  return new Promise<{ status: number; body: string }>((resolve, reject) => {
    const req = client.request(
      {
        protocol: target.protocol,
        hostname: target.hostname,
        port: target.port || undefined,
        path: `${target.pathname}${target.search}`,
        method,
        family: 4,
        headers: headerRecord,
        servername: target.hostname,
      },
      (res) => {
        const chunks: Buffer[] = [];
        res.on("data", (chunk: Buffer) => chunks.push(chunk));
        res.on("end", () => {
          resolve({
            status: res.statusCode ?? 500,
            body: Buffer.concat(chunks).toString("utf8"),
          });
        });
      },
    );
    req.on("error", reject);
    if (payload) req.write(payload);
    req.end();
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
