import jwt from "jsonwebtoken";
import type { H3Event } from "h3";
import { User } from "~~/prisma/generated/client";

const SESSION_COOKIE_NAME = "session_token";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

const getAuthSecret = () => {
  const runtimeConfig = useRuntimeConfig();
  const secret = runtimeConfig.authSecret || runtimeConfig.databaseUrl || "";

  if (!secret) {
    throw new Error("Auth secret is not configured. Please set AUTH_SECRET or DATABASE_URL environment variable.");
  }

  return secret;
};

const signSessionToken = ((user: { id: number; username: string; phone: string; shopId: number }) => {
  const token = {
    u: user.id,
    n: user.username,
    p: user.phone,
    si: user.shopId,
  }
  return jwt.sign(token, getAuthSecret(), {
    subject: String(user.id),
    expiresIn: SESSION_MAX_AGE_SECONDS,
  });
});

const verifySessionToken = (token: string) => {
  try {
    const payload = jwt.verify(token, getAuthSecret());

    if (typeof payload === "string" || !payload.sub) {
      return null;
    }

    const userId = Number(payload.sub);
    return Number.isInteger(userId) && userId > 0 ? userId : null;
  } catch {
    return null;
  }
};

export const setSessionCookie = (event: H3Event, user: { id: number; username: string; phone: string; shopId: number }) => {
  setCookie(event, SESSION_COOKIE_NAME, signSessionToken(user), {
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
};

export const clearSessionCookie = (event: H3Event) => {
  deleteCookie(event, SESSION_COOKIE_NAME, {
    path: "/",
  });
};

export const getSessionUserId = (event: H3Event) => {
  const token = getCookie(event, SESSION_COOKIE_NAME);

  if (!token) {
    return null;
  }

  return verifySessionToken(token);
};
