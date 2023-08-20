import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

type ChatCompletionRequest = {
  role: "user" | "assistant";
  content: string;
};

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/\W+/)
    .filter((token) => token.length > 0);
}

function vectorize(tokens: string[]): Map<string, number> {
  const vector = new Map<string, number>();
  tokens.forEach((token) => {
    vector.set(token, (vector.get(token) || 0) + 1);
  });
  return vector;
}

function cosineSimilarity(
  vecA: Map<string, number>,
  vecB: Map<string, number>
): number {
  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  vecA.forEach((val, key) => {
    dotProduct += val * (vecB.get(key) || 0);
    magnitudeA += val * val;
  });

  vecB.forEach((val) => {
    magnitudeB += val * val;
  });

  return dotProduct / (Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB));
}

function findBestResponse(
  userMessages: ChatCompletionRequest[],
  possibleResponses: ChatCompletionRequest[]
): ChatCompletionRequest {
  // We will consider the last message from the user as the actual question.
  const lastUserMessage = userMessages[userMessages.length - 1];

  const questionTokens = tokenize(lastUserMessage.content);
  const questionVector = vectorize(questionTokens);

  let bestScore = 0;
  let bestResponse: ChatCompletionRequest = { role: "assistant", content: "" };

  possibleResponses.forEach((responseObj) => {
    if (responseObj.role === "assistant") {
      const responseTokens = tokenize(responseObj.content);
      const responseVector = vectorize(responseTokens);

      const score = cosineSimilarity(questionVector, responseVector);

      if (score > bestScore) {
        bestScore = score;
        bestResponse = responseObj;
      }
    }
  });

  return bestResponse;
}

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
    const chunks = splitIntoChunks(pdfText, 10000);

    if (!messages) {
      return new NextResponse("Messages are required", { status: 400 });
    }

    let response: any[] = [];
    for (const chunk of chunks) {
      const instructionMessage: ChatCompletionRequestMessage = {
        role: "system",
        content: `You are a helpful assistant with access to ${chunk} designed to answer questions ONLY from the given document content else say that you don't know the answer and always answer the queries in the language they are asked in. If the 'QUESTION' is in English, answer in English. If the 'QUESTION' is in Spanish, answer in Spanish and similarly if the QUESTION' is in XYZ language, answer it in the same XYZ language. Be as accurate as possible in providing answers only from the given document context. You are not like ChatGPT that answers every question. Answer only if it found in the given document content.`,
      };

      const requests = await openai.createChatCompletion({
        model: "gpt-3.5-turbo-16k",
        messages: [instructionMessage, ...messages],
        temperature: 0.4,
      });
      response.push(requests.data.choices[0].message);
    }

    return NextResponse.json(findBestResponse(messages, response));
  } catch (error) {
    console.dir(error, { depth: 5 });
    return new NextResponse("Internal Error", { status: 500 });
  }
}
