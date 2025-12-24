import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file" }, { status: 400 });
    }

    const ocrForm = new FormData();
    ocrForm.append("file", file);
    ocrForm.append("language", "tha");
    ocrForm.append("filetype", "PNG");
    ocrForm.append("isOverlayRequired", "false");
    ocrForm.append("OCREngine", "2");
    ocrForm.append("scale", "true");
    ocrForm.append("detectOrientation", "true");

    const res = await fetch("https://api.ocr.space/parse/image", {
      method: "POST",
      headers: {
        apikey: process.env.OCR_SPACE_API_KEY!,
      },
      body: ocrForm,
    });

    const data = await res.json();

    const text =
      data?.ParsedResults?.[0]?.ParsedText ?? "";

    return NextResponse.json({ text });
  } catch (err) {
    console.error("OCR.space error:", err);
    return NextResponse.json(
      { error: "OCR failed" },
      { status: 500 }
    );
  }
}
