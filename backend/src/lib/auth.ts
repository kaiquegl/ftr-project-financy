import { GraphQLError } from "graphql";
import { env } from "./env";
import type { GraphqlContext } from "./graphql-context";

const AUTH_COOKIE_NAME = "financy_session";
const SECOND_IN_MILLISECONDS = 1000;
const DEFAULT_SESSION_DURATION_SECONDS = 60 * 60 * 24;
const REMEMBER_SESSION_DURATION_SECONDS = 60 * 60 * 24 * 30;
const TEXT_ENCODER = new TextEncoder();

type SessionPayload = {
  exp: number;
  iat: number;
  sub: string;
};

type CookieStoreLike = {
  delete: (name: string, options: Record<string, unknown>) => Promise<void> | void;
  get: (name: string) => { value: string } | undefined;
  set: (name: string, value: string, options: Record<string, unknown>) => Promise<void> | void;
};

type RequestWithCookieStore = Request & {
  cookieStore?: CookieStoreLike;
};

function toBase64Url(value: string): string {
  return Buffer.from(value).toString("base64url");
}

function fromBase64Url(value: string): string {
  return Buffer.from(value, "base64url").toString("utf8");
}

function getAuthSecret(): string {
  return env.AUTH_SECRET;
}

async function createHmacSignature(payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    TEXT_ENCODER.encode(getAuthSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signatureBuffer = await crypto.subtle.sign("HMAC", key, TEXT_ENCODER.encode(payload));
  return Buffer.from(signatureBuffer).toString("base64url");
}

async function verifyHmacSignature(payload: string, signature: string): Promise<boolean> {
  const expectedSignature = await createHmacSignature(payload);
  return expectedSignature === signature;
}

function getCookieStore(request: Request): CookieStoreLike | null {
  const requestWithCookieStore = request as RequestWithCookieStore;
  return requestWithCookieStore.cookieStore ?? null;
}

function decodeSessionPayload(token: string): SessionPayload | null {
  const [encodedPayload] = token.split(".");
  if (!encodedPayload) {
    return null;
  }

  try {
    const decodedPayload = fromBase64Url(encodedPayload);
    const parsedPayload = JSON.parse(decodedPayload) as SessionPayload;
    return parsedPayload;
  } catch {
    return null;
  }
}

function getManualCookieValue(cookieHeader: string | null, cookieName: string): string | null {
  if (!cookieHeader) {
    return null;
  }

  const cookiePairs = cookieHeader.split(";");
  for (const cookiePair of cookiePairs) {
    const [name, ...valueSegments] = cookiePair.trim().split("=");
    if (name === cookieName) {
      return valueSegments.join("=") || null;
    }
  }

  return null;
}

export function getSessionDurationSeconds(rememberMe: boolean): number {
  return rememberMe ? REMEMBER_SESSION_DURATION_SECONDS : DEFAULT_SESSION_DURATION_SECONDS;
}

export function hashPassword(password: string): Promise<string> {
  return Bun.password.hash(password);
}

export function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return Bun.password.verify(password, hashedPassword);
}

export async function createSessionToken(userId: string, sessionDurationSeconds: number): Promise<string> {
  const nowInSeconds = Math.floor(Date.now() / SECOND_IN_MILLISECONDS);
  const payload: SessionPayload = {
    sub: userId,
    iat: nowInSeconds,
    exp: nowInSeconds + sessionDurationSeconds
  };

  const encodedPayload = toBase64Url(JSON.stringify(payload));
  const signature = await createHmacSignature(encodedPayload);
  return `${encodedPayload}.${signature}`;
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  const [encodedPayload, signature] = token.split(".");
  if (!(encodedPayload && signature)) {
    return null;
  }

  const isValidSignature = await verifyHmacSignature(encodedPayload, signature);
  if (!isValidSignature) {
    return null;
  }

  const sessionPayload = decodeSessionPayload(token);
  if (!sessionPayload) {
    return null;
  }

  const nowInSeconds = Math.floor(Date.now() / SECOND_IN_MILLISECONDS);
  if (sessionPayload.exp <= nowInSeconds) {
    return null;
  }

  return sessionPayload;
}

export function getSessionTokenFromRequest(request: Request): string | null {
  const cookieStore = getCookieStore(request);
  const cookieFromStore = cookieStore?.get(AUTH_COOKIE_NAME)?.value;
  if (cookieFromStore) {
    return cookieFromStore;
  }

  return getManualCookieValue(request.headers.get("cookie"), AUTH_COOKIE_NAME);
}

export async function setSessionCookie(request: Request, token: string, rememberMe: boolean): Promise<void> {
  const cookieStore = getCookieStore(request);
  if (!cookieStore) {
    throw new GraphQLError("Armazenamento de cookie não disponível para esta requisição", {
      extensions: { code: "INTERNAL_SERVER_ERROR" }
    });
  }

  await cookieStore.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: env.NODE_ENV === "production",
    maxAge: getSessionDurationSeconds(rememberMe)
  });
}

export async function clearSessionCookie(request: Request): Promise<void> {
  const cookieStore = getCookieStore(request);
  if (!cookieStore) {
    throw new GraphQLError("Armazenamento de cookie não disponível para esta requisição", {
      extensions: { code: "INTERNAL_SERVER_ERROR" }
    });
  }

  await cookieStore.delete(AUTH_COOKIE_NAME, {
    path: "/"
  });
}

export function requireAuthenticatedUser(context: GraphqlContext): NonNullable<GraphqlContext["currentUser"]> {
  if (!context.currentUser) {
    throw new GraphQLError("Autenticação requerida", {
      extensions: { code: "UNAUTHENTICATED" }
    });
  }

  return context.currentUser;
}
