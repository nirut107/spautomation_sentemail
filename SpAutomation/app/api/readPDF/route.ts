// app/api/readPDF/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PdfReader } from "pdfreader";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return new Promise<NextResponse>((resolve) => {
    const lines: Record<number, string[]> = {};

    new PdfReader().parseBuffer(buffer, (err, item) => {
      if (err) {
        console.error(err);
        resolve(NextResponse.json({ error: "PDF failed" }, { status: 500 }));
      } else if (!item) {
        // reading finished
        const output: string[] = [];

        Object.keys(lines)
          .sort((a, b) => Number(a) - Number(b))
          .forEach((y) => {
            output.push(lines[Number(y)].join(" "));
          });

        resolve(NextResponse.json({ lines: output }));
      } else if (item.text) {
        const y = Math.floor(item.y); // normalize Y
        if (!lines[y]) lines[y] = [];
        lines[y].push(item.text);
      }
    });
  });
}
