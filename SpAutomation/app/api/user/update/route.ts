import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(req: NextRequest) {
  try {
    const { taxId, emails } = await req.json();
    console.log(taxId, emails);
    if (!taxId || !emails || !Array.isArray(emails)) {
      return NextResponse.json(
        { error: "taxId and emails required" },
        { status: 400 }
      );
    }
    const filtered = emails.map((e: string) => e.trim()).filter(Boolean);

    const user = await prisma.user.upsert({
      where: { taxId },
      update: {
        emails: {
          set: Array.from(
            new Set([
              ...(await prisma.user
                .findUnique({ where: { taxId } })
                .then((u) => u?.emails ?? [])),
              ...filtered,
            ])
          ),
        },
      },
      create: {
        taxId,
        emails: filtered,
      },
    });

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("User upsert error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
