import { google } from "googleapis";
import { NextResponse } from "next/server";

export async function GET() {
  const auth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID_TEST,
    process.env.GOOGLE_CLIENT_SECRET_TEST,
    process.env.GOOGLE_REDIRECT_URI_TEST
  );

  const url = auth.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/gmail.readonly",
      "https://www.googleapis.com/auth/gmail.send",
    ],
  });

  return NextResponse.redirect(url);
}
