import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  const form = await req.formData();

  const to = JSON.parse(form.get("to") as string);
  let subject = form.get("subject") as string;
  const message = form.get("message") as string;
  const DocID = form.getAll("DocID") as string[];

  console.log(DocID);
  const isReply = DocID.length === 2;
  let replyMID: string | null = null;

  if (isReply) {
    const previousDocId: string = DocID[1];

    if (previousDocId.startsWith("QT-")) {
      const q = await prisma.quotation.findUnique({
        where: { QID: previousDocId },
      });
      replyMID = q?.MID ?? null;
      if (q?.subject) subject = q.subject;
    }

    if (previousDocId.startsWith("IN-")) {
      const i = await prisma.invoice.findFirst({
        where: { IID: previousDocId },
      });
      replyMID = i?.MID ?? null;
      if (i?.subject) subject = i.subject;
    }
  }
  replyMID = replyMID?.trim().replace(/^"+|"+$/g, "") || null;
  const files = form.getAll("files") as File[];

  const attachments = await Promise.all(
    files.map(async (file) => ({
      filename: file.name,
      content: Buffer.from(await file.arrayBuffer()),
    }))
  );

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  console.log(replyMID);
  const info = await transporter.sendMail({
    from: `"Sp Automation" <${process.env.SMTP_USER}>`,
    to,
    subject: isReply ? `Re: ${subject}` : subject,
    html: message,
    attachments: [
      {
        filename: "logo.png",
        path: "./public/logo.png",
        cid: "logo",
      },
      ...attachments,
    ],
    headers: replyMID
      ? {
          "In-Reply-To": replyMID,
          References: replyMID,
        }
      : undefined,
  });
  const newMID = info.messageId;
  const newDocId = DocID[0];
  try {
    if (newDocId.startsWith("QT-")) {
      const existing = await prisma.quotation.findUnique({
        where: { QID: newDocId },
      });

      if (existing) {
        await prisma.quotation.update({
          where: { QID: newDocId },
          data: {
            MID: newMID,
            subject,
          },
        });
      } else {
        await prisma.quotation.create({
          data: {
            QID: newDocId,
            MID: newMID,
            subject,
          },
        });
      }
    }

    if (newDocId.startsWith("IN-")) {
      await prisma.invoice.create({
        data: {
          IID: newDocId,
          MID: newMID,
          subject: subject,
        },
      });
    }
  } catch {
    return NextResponse.json(
      { error: "This Email have already sent before" },
      { status: 400 }
    );
  }

  return NextResponse.json({ success: true });
}
