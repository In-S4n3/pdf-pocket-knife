import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

type ChatCompletionRequest = {
  role: "user" | "assistant";
  content: string;
};

const tokenize = (text: string): string[] => {
  return text
    .toLowerCase()
    .split(/\W+/)
    .filter((token) => token.length > 0);
};

const isNegativeResponse = (response: string): boolean => {
  const negativePhrases = [
    "i don't know",
    "i'm sorry",
    "cannot find",
    "no information",
    "i apologize",
  ];
  return negativePhrases.some((phrase) =>
    response.toLowerCase().includes(phrase)
  );
};

const scoreResponse = (
  userTokensArray: string[][],
  responseContent: string
): number => {
  const responseTokens = tokenize(responseContent);
  let score = 0;
  userTokensArray.forEach((userTokens) => {
    score += userTokens.filter((token) =>
      responseTokens.includes(token)
    ).length;
  });
  return score;
};

const findBestResponse = (
  userMessages: ChatCompletionRequest[],
  possibleResponses: ChatCompletionRequest[]
): ChatCompletionRequest => {
  const userTokensArray = userMessages
    .filter((message) => message.role === "user")
    .map((message) => tokenize(message.content));

  // Check for specific user questions and return respective responses
  if (userMessages[0].content.includes("how many pages")) {
    return possibleResponses[possibleResponses.length - 1];
  }
  if (
    userMessages[0].content.includes("give me a list") ||
    userMessages[0].content.includes("asks for a list")
  ) {
    return possibleResponses.reduce((longest, current) =>
      current.content.length > longest.content.length ? current : longest
    );
  }

  let bestScore = 0;
  let bestResponse: ChatCompletionRequest = { role: "assistant", content: "" };

  possibleResponses.forEach((responseObj) => {
    if (
      responseObj.role === "assistant" &&
      !isNegativeResponse(responseObj.content)
    ) {
      const currentScore = scoreResponse(userTokensArray, responseObj.content);

      if (currentScore > bestScore) {
        bestScore = currentScore;
        bestResponse = responseObj;
      }
    }
  });

  // If no valid response is found, revert to the first one (even if it's negative)
  if (bestResponse.content === "") {
    bestResponse = possibleResponses[0];
  }

  return bestResponse;
};

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
    if (!openai.apiKey) {
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
      const instructionMessage: OpenAI.Chat.CreateChatCompletionRequestMessage =
      {
        role: "system",
        content: `You are an assistant that has thoroughly analyzed the contents of the provided """${chunk}""". You are tasked with providing informative and concise answers to user questions based on the document. Keep the following guidelines in mind:
      
      1. Prioritize context: Understand and use the context from the document to answer questions.
      2. Be informative: Provide detailed and accurate information when answering questions.
      3. Summarize when necessary: Summarize lengthy or complex information from the document.
      4. Answer clearly: Use clear and concise language to ensure user comprehension.
      5. If uncertain, ask for clarification: If a question is ambiguous or requires more context, ask the user for clarification.
      6. Be helpful and user-friendly: Always aim to assist the user effectively and in a friendly manner.
      
      Now, please provide the most relevant and accurate answer to the user's question based on your analysis of the document.`,
      };

      const requests = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-16k",
        messages: [instructionMessage, ...messages],
        temperature: 0.4,
      });
      response.push(requests.choices[0].message);
    }

    return NextResponse.json(findBestResponse(messages, response));
  } catch (error) {
    console.dir(error, { depth: 5 });
    return new NextResponse("Internal Error", { status: 500 });
  }
}
