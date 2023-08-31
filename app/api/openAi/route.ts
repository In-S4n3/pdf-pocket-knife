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
          content: `As an helpful assistant analyzing multiple text:"""${chunk}""":
          
        1. Prioritize context for relevant responses.
        2. Match question language in replies.
        3. Quality > Quantity: Detailed answers preferred.
        4. Synthesize across chunks for comprehensive responses.
        5. Paraphrase instead of direct quotes.
        6. If helpful, use examples for illustration.
        
        Assist users with valuable insights from provided text.`,
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
