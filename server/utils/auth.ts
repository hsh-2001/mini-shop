import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import type { H3Event } from "h3";
import { getPrisma } from "./db";

const SESSION_COOKIE_NAME = "session_token";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7;
const PASSWORD_KEY_LENGTH = 64;

type SessionPayload = {

  userId: number;
  expiresAt: number;
  nonce: string;
};

export type AuthenticatedUser = {
  id: number;
  shopId: number;
  phone: string;
  username: string;
  role: string;
  shop: {
    id: number;
    name: string;
  };
};

const encodeBase64Url = (value: string) => Buffer.from(value, "utf8").toString("base64url");
const decodeBase64Url = (value: string) => Buffer.from(value, "base64url").toString("utf8");

const getAuthSecret = () => {
  const runtimeConfig = useRuntimeConfig();
  const secret = runtimeConfig.authSecret || runtimeConfig.databaseUrl || "";

  if (!secret) {
    throw createError({
      statusCode: 500,
      statusMessage: "Authentication secret is not configured.",
    });
  }

  return secret;
};

const signValue = (value: string) => createHmac("sha256", getAuthSecret()).update(value).digest("base64url");

const normalizePassword = (password: string) => password.trim();

export const hashPassword = (password: string) => {
  const normalizedPassword = normalizePassword(password);
  const salt = randomBytes(16).toString("base64url");
  const hash = scryptSync(normalizedPassword, salt, PASSWORD_KEY_LENGTH).toString("base64url");
  return `${salt}:${hash}`;
};

export const verifyPassword = (password: string, passwordHash: string) => {
  const normalizedPassword = normalizePassword(password);
  const [salt, savedHash] = passwordHash.split(":");

  if (!salt || !savedHash) {
    return false;
  }

  const candidateHash = scryptSync(normalizedPassword, salt, PASSWORD_KEY_LENGTH);
  const savedHashBuffer = Buffer.from(savedHash, "base64url");

  if (candidateHash.length !== savedHashBuffer.length) {
    return false;
  }

  return timingSafeEqual(candidateHash, savedHashBuffer);
};

const serializeSession = (payload: SessionPayload) => {
  const encodedPayload = encodeBase64Url(JSON.stringify(payload));
  const signature = signValue(encodedPayload);
  return `${encodedPayload}.${signature}`;
};

const parseSession = (token: string): SessionPayload | null => {
  const [encodedPayload, signature] = token.split(".");

  if (!encodedPayload || !signature) {
    return null;
  }

  const expectedSignature = signValue(encodedPayload);
  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (signatureBuffer.length !== expectedBuffer.length || !timingSafeEqual(signatureBuffer, expectedBuffer)) {
    return null;
  }

  try {
    const payload = JSON.parse(decodeBase64Url(encodedPayload)) as SessionPayload;

    if (!payload.userId || !payload.expiresAt || payload.expiresAt <= Date.now()) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
};

export const setSessionCookie = (event: H3Event, userId: number) => {
  const token = serializeSession({
    userId,
    expiresAt: Date.now() + SESSION_TTL_MS,
    nonce: randomBytes(8).toString("base64url"),
  });

  setCookie(event, SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_MS / 1000,
  });
};

export const clearSessionCookie = (event: H3Event) => {
  deleteCookie(event, SESSION_COOKIE_NAME, {
    path: "/",
  });
};

const userSelect = {
  id: true,
  shopId: true,
  phone: true,
  username: true,
  role: true,
  shop: {
    select: {
      id: true,
      name: true,
    },
  },
} as const;

export const getAuthenticatedUser = async (event: H3Event): Promise<AuthenticatedUser | null> => {
  const token = getCookie(event, SESSION_COOKIE_NAME);
  if (!token) {
    return null;
  }

  const payload = parseSession(token);

  if (!payload) {
    clearSessionCookie(event);
    return null;
  }

  const prisma = getPrisma();
  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: userSelect,
  });

  if (!user) {
    clearSessionCookie(event);
    return null;
  }

  return user;
};

export const requireAuthenticatedUser = async (event: H3Event) => {
  const user = await getAuthenticatedUser(event);
  if (!user) {
    throw new Error("Authentication required. Please log in to access this resource.");
  }
  return user;
};

export const countUsers = async () => {
  const prisma = getPrisma();
  return prisma.user.count();
};
