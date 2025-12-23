import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { taxId } = await req.json();

  const user = await prisma.user.findUnique({
    where: { taxId },
  });

  if (!user) {
    return NextResponse.json({ exists: false });
  }

  return NextResponse.json({
    exists: true,
    taxId: user.taxId,
    emails: user.emails,
  });
}
