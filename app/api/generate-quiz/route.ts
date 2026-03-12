import OpenAI from "openai";
import { NextResponse } from "next/server";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const prompt = body?.prompt;

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Missing prompt." },
        { status: 400 }
      );
    }

    const response = await client.responses.create({
      model: "gpt-5.4",
      input: [
        {
          role: "system",
          content: `
You generate quizzes for a school quiz app.

Return ONLY valid JSON.
Do not include markdown.
Do not include explanation.

The JSON must exactly match this shape:

{
  "title": "string",
  "questions": [
    {
      "id": 1,
      "type": "mcq",
      "prompt": "string",
      "choices": ["string", "string", "string", "string"],
      "answer": 0
    },
    {
      "id": 2,
      "type": "short",
      "prompt": "string",
      "answer": "string"
    }
  ]
}

Rules:
- "type" must be either "mcq" or "short"
- MCQ questions must always have exactly 4 choices
- MCQ "answer" must be 0, 1, 2, or 3
- Short-answer "answer" must be a string
- IDs must be sequential integers starting at 1
- Mix MCQ and short-response if the user asks for both
- Make questions clear and school-appropriate
          `.trim(),
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const text = response.output_text?.trim();

    if (!text) {
      return NextResponse.json(
        { error: "No quiz returned from model." },
        { status: 500 }
      );
    }

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      return NextResponse.json(
        { error: "Model returned invalid JSON.", raw: text },
        { status: 500 }
      );
    }

    return NextResponse.json({ quiz: parsed });
  } catch (error) {
    console.error("generate-quiz route error:", error);
    return NextResponse.json(
      { error: "Failed to generate quiz." },
      { status: 500 }
    );
  }
}