import { OAuth2Client } from "google-auth-library";
import { SignJWT, jwtVerify } from "jose";

export type AppSessionPayload = {
  sub: string; // userId
  email: string;
  name?: string;
  picture?: string;
};

function getJwtSecret(): Uint8Array {
  const secret = process.env.APP_JWT_SECRET;
  if (!secret) {
    throw new Error("APP_JWT_SECRET is not set");
  }
  return new TextEncoder().encode(secret);
}

function getAllowedGoogleAudiences(): string[] {
  const ids = [
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_ID_ANDROID,
    process.env.GOOGLE_CLIENT_ID_IOS,
  ].filter(Boolean) as string[];

  if (ids.length === 0) {
    throw new Error(
      "No Google client IDs configured. Set GOOGLE_CLIENT_ID (web) and optionally GOOGLE_CLIENT_ID_ANDROID/GOOGLE_CLIENT_ID_IOS"
    );
  }

  return ids;
}

export async function verifyGoogleIdToken(idToken: string) {
  const client = new OAuth2Client();
  const ticket = await client.verifyIdToken({
    idToken,
    audience: getAllowedGoogleAudiences(),
  });

  const payload = ticket.getPayload();
  if (!payload) {
    throw new Error("Invalid Google token payload");
  }

  const providerUserId = payload.sub;
  const email = payload.email;
  if (!providerUserId) {
    throw new Error("Google token missing sub");
  }
  if (!email) {
    throw new Error("Google token missing email");
  }

  return {
    providerUserId,
    email,
    name: payload.name ?? undefined,
    picture: payload.picture ?? undefined,
  };
}

export async function issueAppSessionToken(payload: AppSessionPayload) {
  return new SignJWT({
    email: payload.email,
    name: payload.name,
    picture: payload.picture,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(getJwtSecret());
}

export async function verifyAppSessionToken(token: string) {
  const result = await jwtVerify(token, getJwtSecret(), {
    algorithms: ["HS256"],
  });

  const userId = result.payload.sub;
  const email = result.payload.email;

  if (!userId || typeof userId !== "string") {
    throw new Error("Invalid session: missing sub");
  }
  if (!email || typeof email !== "string") {
    throw new Error("Invalid session: missing email");
  }

  return {
    userId,
    email,
    name:
      typeof result.payload.name === "string" ? result.payload.name : undefined,
    picture:
      typeof result.payload.picture === "string"
        ? result.payload.picture
        : undefined,
  };
}
