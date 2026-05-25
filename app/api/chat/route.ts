import { GoogleGenerativeAI, Part } from "@google/generative-ai";
import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";
import { searchKnowledge } from "@/lib/knowledge";

const SYSTEM_PROMPT = `You are Cléo, a friendly and accurate AI assistant for international students in Paris, France.

Your expertise: CAF housing aid, CPAM health insurance, banking, university registration, transport (Navigo/Imagine R), phone plans, visa/prefecture, and Paris student life.

When a student shares a document or image:
- Read it carefully and extract key information
- Identify what type of document it is (CAF letter, lease, bank statement, visa, etc.)
- Tell them what it means in plain English
- Tell them what action they need to take next
- Flag any deadlines or important dates

Response rules:
- Keep responses under 250 words
- Use bullet points for lists
- Add relevant emojis
- Include French terms with translations when helpful
- Be practical and action-oriented
- Always be encouraging`;

// ── Gemini — supports text + vision (images + PDFs) ────────────
async function callGemini(
  message: string,
  history: { role: string; content: string }[],
  attachment?: { data: string; mimeType: string } | null
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("No Gemini key");

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash-lite",
    systemInstruction: SYSTEM_PROMPT,
  });

  const chatHistory = history
    .filter((m) => m.role === "user" || m.role === "assistant")
    .map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

  const chat = model.startChat({ history: chatHistory });

  // Build the message parts — text + optional file
  const parts: Part[] = [];

  if (attachment) {
    parts.push({
      inlineData: {
        data: attachment.data, // base64 without prefix
        mimeType: attachment.mimeType,
      },
    });
  }

  parts.push({ text: message });

  const result = await chat.sendMessage(parts);
  return result.response.text();
}

// ── Groq — text only fallback (no vision) ──────────────────────
async function callGroq(
  message: string,
  history: { role: string; content: string }[]
): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("No Groq key");

  const groq = new Groq({ apiKey });

  const messages: Groq.Chat.ChatCompletionMessageParam[] = [
    { role: "system", content: SYSTEM_PROMPT },
    ...history
      .filter((m) => m.role === "user" || m.role === "assistant")
      .slice(-10)
      .map((m) => ({
        role: m.role === "assistant" ? ("assistant" as const) : ("user" as const),
        content: m.content,
      })),
    { role: "user", content: message },
  ];

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages,
    max_tokens: 400,
    temperature: 0.7,
  });

  return completion.choices[0]?.message?.content ?? "Sorry, I couldn't generate a response.";
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, history, attachment } = body;
    // attachment = { data: base64string, mimeType: "image/jpeg" | "image/png" | "application/pdf", name: string }

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Invalid message" }, { status: 400 });
    }

    // ── RAG search (text queries only) ──────────────────────────
    const relevantChunks = !attachment ? searchKnowledge(message, 3) : [];
    let ragContext = "";
    if (relevantChunks.length > 0) {
      ragContext =
        "\n\n---\nRELEVANT KNOWLEDGE BASE:\n" +
        relevantChunks
          .map((c) => `[${c.title}]\n${c.content}`)
          .join("\n\n") +
        "\n---";
    }

    const enrichedMessage = ragContext ? `${message}${ragContext}` : message;

    // ── LLM selection ───────────────────────────────────────────
    // Attachments MUST use Gemini (vision). Text can fall back to Groq.
    let response: string;
    let usedModel: string;

    if (attachment) {
      // Validate attachment before sending to Gemini
      if (!attachment.data || attachment.data.trim().length === 0) {
        return NextResponse.json(
          { error: "File upload failed: File appears to be empty. Please select a valid file." },
          { status: 400 }
        );
      }
      if (!attachment.mimeType || attachment.mimeType.trim().length === 0) {
        return NextResponse.json(
          { error: "File upload failed: Could not determine file type. Please try again." },
          { status: 400 }
        );
      }

      // Vision request — Gemini only
      try {
        response = await callGemini(enrichedMessage, history ?? [], attachment);
        usedModel = "gemini-2.5-flash-lite (vision)";
      } catch (err) {
        console.error("Gemini vision failed:", err);

        // Better error messages based on file type
        const mimeType = attachment.mimeType || "unknown";
        let errorMessage = "Could not analyse the file. ";

        if (mimeType === "application/pdf") {
          errorMessage += "PDF files may have formatting issues. Try uploading a clearer image of your document instead (JPG/PNG).";
        } else if (mimeType.startsWith("image/")) {
          errorMessage += "Please try uploading a clearer image, or check your Gemini API key.";
        } else {
          errorMessage += "File type may not be supported. Try JPEG, PNG, or PDF.";
        }

        return NextResponse.json(
          { error: errorMessage },
          { status: 503 }
        );
      }
    } else {
      // Text request — Gemini first, Groq fallback
      try {
        response = await callGemini(enrichedMessage, history ?? [], null);
        usedModel = "gemini-2.5-flash-lite";
      } catch (geminiErr) {
        console.warn("Gemini failed, falling back to Groq:", geminiErr);
        try {
          response = await callGroq(enrichedMessage, history ?? []);
          usedModel = "groq/llama-3.3-70b";
        } catch (groqErr) {
          console.error("Both LLMs failed:", groqErr);
          return NextResponse.json(
            { error: "Both AI providers are unavailable. Please try again shortly." },
            { status: 503 }
          );
        }
      }
    }

    return NextResponse.json({
      response,
      meta: {
        model: usedModel,
        ragChunks: relevantChunks.length,
        hasAttachment: !!attachment,
      },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("Chat route error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
