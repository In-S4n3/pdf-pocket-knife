import { auth } from "@clerk/nextjs";
import axios from "axios";
import { NextResponse } from "next/server";
import PdfParse from "pdf-parse";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { url } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!url) {
      return new NextResponse("Url is required", { status: 400 });
    }

    const buffer = await axios.get(url, {
      responseType: "arraybuffer",
    });

    const pdfObject = await PdfParse(buffer.data);
    const text = pdfObject.text;

    // 1. Remove punctuation
    const cleanText = text.replace(/[.,!;?]/g, "");

    // 2. Remove extra spaces (including new lines and tabs)
    const minimizedText = cleanText.replace(/\s+/g, " ").trim();

    return NextResponse.json(minimizedText);
  } catch (error) {
    console.log(["ERROR"], error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
