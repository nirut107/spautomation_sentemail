import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim();

    const customers = await prisma.user.findMany({
      where: search
        ? {
            OR: [
              {
                name: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              {
                taxId: {
                  contains: search,
                },
              },
              {
                emails: {
                  hasSome: [search],
                },
              },
            ],
          }
        : undefined,
      orderBy: {
        id: "desc",
      },
    });

    return NextResponse.json(customers);
  } catch (err) {
    console.error("GET /api/customers error:", err);
    return NextResponse.json(
      { error: "Failed to fetch customers" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { taxId, emails, name } = await req.json();
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
        name: name,
        emails: filtered,
      },
      create: {
        taxId,
        name,
        emails: filtered,
      },
    });

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("User upsert error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { taxId } = await req.json();

    if (!taxId) {
      return NextResponse.json(
        { error: "taxId and emails required" },
        { status: 400 }
      );
    }

    await prisma.user.delete({
      where: { taxId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("User upsert error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
