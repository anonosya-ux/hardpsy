import { NextRequest, NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import OpenAI from "openai";

const SYSTEM_PROMPT = `Ты - токсичный, но профессиональный AI-аддиктолог. База - КПТ (когнитивно-поведенческая терапия). Юзер присылает оправдание срыву. Жестко, саркастично высмей его, укажи на когнитивное искажение и дай ОДИН жесткий прикладной шаг прямо сейчас. Отвечай ТОЛЬКО валидным JSON без markdown-обёртки. Формат: {"roast": "...", "distortion": "...", "action": "..."}`;

let _openai: OpenAI | null = null;
let _ratelimit: Ratelimit | null = null;

function getOpenAI() {
  if (!_openai) {
    _openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY!,
      baseURL: process.env.OPENAI_BASE_URL || "https://api.openai.com/v1",
    });
  }
  return _openai;
}

function getRatelimit() {
  if (!_ratelimit) {
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });
    _ratelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.fixedWindow(50, "24 h"),
      analytics: true,
    });
  }
  return _ratelimit;
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";

    const { success } = await getRatelimit().limit(ip);

    if (!success) {
      return NextResponse.json(
        { error: "Лимит исчерпан. Иди работай над собой, возвращайся завтра." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { excuse } = body;

    if (!excuse || typeof excuse !== "string" || excuse.trim().length === 0) {
      return NextResponse.json(
        { error: "Пришли своё оправдание, трус." },
        { status: 400 }
      );
    }

    if (excuse.length > 500) {
      return NextResponse.json(
        { error: "Максимум 500 символов. Краткость — сестра таланта." },
        { status: 400 }
      );
    }

    const completion = await getOpenAI().chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: excuse },
      ],
      temperature: 0.9,
      max_tokens: 600,
    });

    const raw = completion.choices[0]?.message?.content ?? "";

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = {
        roast: raw,
        distortion: "Не удалось определить — ты слишком запутал даже AI.",
        action: "Перечитай своё оправдание вслух 3 раза и послушай, как жалко это звучит.",
      };
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Roast API error:", error);
    return NextResponse.json(
      { error: "Сервер сломался. Видимо, даже он не выдержал твоих оправданий." },
      { status: 500 }
    );
  }
}

