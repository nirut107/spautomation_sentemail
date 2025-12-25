import { NextResponse, NextRequest } from "next/server";
import { google } from "googleapis";
import { getGmailAuth } from "@/lib/gmailAuth";

function findPart(parts: any[], mime: string): any | null {
  for (const p of parts) {
    if (p.mimeType === mime && p.body?.data) return p;
    if (p.parts) {
      const found = findPart(p.parts, mime);
      if (found) return found;
    }
  }
  return null;
}

function getMessageBody(message: any) {
  const payload = message.payload;

  const decode = (data: string) =>
    Buffer.from(data.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString(
      "utf-8"
    );

  // simple
  if (payload.body?.data) {
    return { type: "text/plain", content: decode(payload.body.data) };
  }

  if (payload.parts) {
    const html = findPart(payload.parts, "text/html");
    if (html) {
      return { type: "text/html", content: decode(html.body.data) };
    }

    const text = findPart(payload.parts, "text/plain");
    if (text) {
      return { type: "text/plain", content: decode(text.body.data) };
    }
  }

  return { type: "text/plain", content: "" };
}

const getHeader = (m: any, name: string) =>
  m.payload?.headers?.find(
    (h: any) => h.name.toLowerCase() === name.toLowerCase()
  )?.value ?? "";

export async function POST(req: NextRequest) {
  try {
    const { MID } = await req.json();

    if (!MID) {
      return NextResponse.json({ error: "MID is required" }, { status: 400 });
    }
    let auth;
    try {
      auth = await getGmailAuth();
    } catch (e: any) {
      if (e.message === "GMAIL_NOT_CONNECTED") {
        return NextResponse.json({
          needAuth: true,
          authUrl: "/api/auth/google",
        });
      }
    }
    const gmail = google.gmail({ version: "v1", auth });

    // 🔎 หา message จาก Message-ID
    const list = await gmail.users.messages.list({
      userId: "me",
      q: `rfc822msgid:${MID}`,
    });

    const msgId = list.data.messages?.[0]?.id;

    if (!msgId) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    // 📩 ดึง message เพื่อเอา threadId
    const msg = await gmail.users.messages.get({
      userId: "me",
      id: msgId,
    });

    const threadId = msg.data.threadId!;

    // 🧵 ดึงทั้ง thread
    const thread = await gmail.users.threads.get({
      userId: "me",
      id: threadId,
    });

    const messages = thread.data.messages!.map((m) => {
      const body = getMessageBody(m);

      return {
        id: m.id,
        from: getHeader(m, "From"),
        date: getHeader(m, "Date"),
        subject: getHeader(m, "Subject"),
        body,
      };
    });

    return NextResponse.json({
      threadId,
      messages,
    });
  } catch (err) {
    console.error("Get thread error:", err);
    return NextResponse.json(
      { error: "Failed to load email thread" },
      { status: 500 }
    );
  }
}
