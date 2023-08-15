import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";
import axios from "axios";
import pdf from "pdf-parse";

const configuration = new Configuration({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const instructionMessage: ChatCompletionRequestMessage = {
  role: "system",
  content:
    "You are a helpful assistant with limited access to info designed to answer questions ONLY from the given document content else say that you don't know the answer and always answer the queries in the language they are asked in. If the 'QUESTION' is in English, answer in English. If the 'QUESTION' is in Spanish, answer in Spanish and similarly if the QUESTION' is in XYZ language, answer it in the same XYZ language. Be as accurate as possible in providing answers only from the given document context. You are not like ChatGPT that answers every question. Answer only if it found in the given document content.",
};

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { url } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!configuration.apiKey) {
      return new NextResponse("OpenAI API Key not configured.", {
        status: 500,
      });
    }

    const buffer = await axios.get(url, {
      responseType: "arraybuffer",
    });

    const pdfObject = await pdf(buffer.data);
    const text = pdfObject.text;

    if (!url) {
      return new NextResponse("Messages are required", { status: 400 });
    }

    const message = `${text} este bebé está bem?`;

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [instructionMessage, { role: "user", content: message }],
    });

    return NextResponse.json(response.data.choices[0].message);
  } catch (error) {
    console.log("[CODE_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
