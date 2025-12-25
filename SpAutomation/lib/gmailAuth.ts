import { google } from "googleapis";
import prisma from "@/lib/prisma";

export async function getGmailAuth() {
  const token = await prisma.gmailToken.findFirst();

  if (!token) {
    throw new Error("GMAIL_NOT_CONNECTED");
  }

  const auth = new google.auth.OAuth2(
    // process.env.GOOGLE_CLIENT_ID,
    // process.env.GOOGLE_CLIENT_SECRET,
    // process.env.GOOGLE_REDIRECT_URI
    process.env.GOOGLE_CLIENT_ID_TEST,
    process.env.GOOGLE_CLIENT_SECRET_TEST,
    process.env.GOOGLE_REDIRECT_URI_TEST
  );

  if (token.expiresAt < new Date()) {
    auth.setCredentials({
      refresh_token: token.refreshToken,
    });

    const { credentials } = await auth.refreshAccessToken();

    if (!credentials.access_token) {
      throw new Error("Failed to refresh Gmail token");
    }

    await prisma.gmailToken.update({
      where: { id: token.id },
      data: {
        accessToken: credentials.access_token,
        expiresAt: new Date(
          Date.now() + (credentials.expiry_date ?? 3600_000)
        ),
      },
    });

    auth.setCredentials({
      access_token: credentials.access_token,
      refresh_token: token.refreshToken,
    });
  } else {
    auth.setCredentials({
      access_token: token.accessToken,
      refresh_token: token.refreshToken,
    });
  }

  return auth;
}
