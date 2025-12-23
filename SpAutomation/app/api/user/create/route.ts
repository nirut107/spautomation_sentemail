import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { taxId, emails } = await req.json();
  console.log(taxId, emails);

  const filtered = emails.map((e: string) => e.trim()).filter(Boolean);

  const existing = await prisma.user.findUnique({ where: { taxId } });
  let user;
  if (!existing) {
    user = await prisma.user.create({
      data: { taxId, emails },
    });
  } else {
    const merged = Array.from(new Set([...existing.emails, ...filtered]));

    user = await prisma.user.update({
      where: { taxId },
      data: { emails: merged },
    });
  }

  return NextResponse.json({ success: true, user });
}
