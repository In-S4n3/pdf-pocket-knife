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
      return new NextResponse("Url are required", { status: 400 });
    }

    const buffer = await axios.get(url, {
      responseType: "arraybuffer",
    });

    const pdfObject = await PdfParse(buffer.data);
    const text = pdfObject.text;

    return NextResponse.json(text);
  } catch (error) {
    console.log(["ERROR"], error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
