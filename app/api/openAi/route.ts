import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { messages, pdfText } = body;

    const instructionMessage: ChatCompletionRequestMessage = {
      role: "system",
      content: `You are a helpful assistant with  access to ${pdfText} designed to answer questions ONLY from the given document content else say that you don't know the answer and always answer the queries in the language they are asked in. If the 'QUESTION' is in English, answer in English. If the 'QUESTION' is in Spanish, answer in Spanish and similarly if the QUESTION' is in XYZ language, answer it in the same XYZ language. Be as accurate as possible in providing answers only from the given document context. You are not like ChatGPT that answers every question. Answer only if it found in the given document content.`,
    };

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!configuration.apiKey) {
      return new NextResponse("OpenAI API Key not configured.", {
        status: 500,
      });
    }

    if (!messages) {
      return new NextResponse("Messages are required", { status: 400 });
    }

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [instructionMessage, ...messages],
    });

    return NextResponse.json(response.data.choices[0].message);
  } catch (error) {
    console.log("[CODE_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
