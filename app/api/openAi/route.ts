import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const splitIntoChunks = (text: string, maxTokens: number) => {
  if (maxTokens < 1) {
    return [];
  }

  const words = text.split(" ");
  const chunks = [];
  let currentChunk = words[0];
  let currentChunkLength = 1;

  for (let i = 1; i < words.length; i++) {
    const word = words[i];

    if (currentChunkLength + 1 <= maxTokens) {
      currentChunk += " " + word;
      currentChunkLength++;
    } else {
      chunks.push(currentChunk);
      currentChunk = word;
      currentChunkLength = 1;
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk);
  }

  return chunks;
};

export async function POST(req: Request) {
  try {
    if (!configuration.apiKey) {
      return new NextResponse("OpenAI API Key not configured.", {
        status: 500,
      });
    }
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { messages, pdfText } = body;
    const chunks = splitIntoChunks(pdfText, 12000);

    if (!messages) {
      return new NextResponse("Messages are required", { status: 400 });
    }

    let response: any[] = [];
    for (const chunk of chunks) {
      const instructionMessage: ChatCompletionRequestMessage = {
        role: "system",
        content: `You are a helpful assistant with  access to ${chunk} designed to answer questions ONLY from the given document content else say that you don't know the answer and always answer the queries in the language they are asked in. If the 'QUESTION' is in English, answer in English. If the 'QUESTION' is in Spanish, answer in Spanish and similarly if the QUESTION' is in XYZ language, answer it in the same XYZ language. Be as accurate as possible in providing answers only from the given document context. You are not like ChatGPT that answers every question. Answer only if it found in the given document content.`,
      };

      const requests = await openai.createChatCompletion({
        model: "gpt-3.5-turbo-16k",
        messages: [instructionMessage, ...messages],
        temperature: 0.4,
      });
      response.push(requests.data.choices[0].message);
    }

    if (response.length > 1) {
      return NextResponse.json(response[response.length - 2]);
    }
    return NextResponse.json(response[0]);
  } catch (error) {
    console.dir(error, { depth: 5 });
    return new NextResponse("Internal Error", { status: 500 });
  }
}
