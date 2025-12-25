import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? 10);
  const skip = (page - 1) * limit;

  const quotations = await prisma.quotation.findMany({
    orderBy: { id: "desc" },
    skip,
    take: limit,
  });

  const total = await prisma.quotation.count();

  const data = await Promise.all(
    quotations.map(async (q) => {
      const invoice = await prisma.invoice.findFirst({
        where: { OID: q.QID },
        orderBy: { id: "desc" },
      });

      const receipt = invoice
        ? await prisma.reciept.findFirst({
            where: { IID: invoice.IID },
            orderBy: { id: "desc" },
          })
        : null;

      return {
        taxId: q.taxId,
        company: q.company,
        OTD: q.QID,
        IID: invoice?.IID ?? null,
        RID: receipt?.RID ?? null,
      };
    })
  );

  return NextResponse.json({
    data,
    page,
    totalPages: Math.ceil(total / limit),
    total,
  });
}
