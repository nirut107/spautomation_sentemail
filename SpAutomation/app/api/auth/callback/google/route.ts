import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const code = new URL(req.url).searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "No code provided" }, { status: 400 });
  }

  const auth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID_TEST,
    process.env.GOOGLE_CLIENT_SECRET_TEST,
    process.env.GOOGLE_REDIRECT_URI_TEST
  );

  const { tokens } = await auth.getToken(code);

  if (!tokens.access_token || !tokens.refresh_token) {
    return NextResponse.json(
      { error: "Missing access or refresh token" },
      { status: 400 }
    );
  }

  await prisma.gmailToken.upsert({
    where: { id: 1 },
    update: {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresAt: new Date(
        Date.now() + (tokens.expiry_date ?? 3600_000)
      ),
    },
    create: {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresAt: new Date(
        Date.now() + (tokens.expiry_date ?? 3600_000)
      ),
    },
  });

  // 🔁 กลับ dashboard
  return NextResponse.redirect(new URL("/", req.url));
}
