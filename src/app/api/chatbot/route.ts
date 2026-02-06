import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import mammoth from "mammoth";

function tokenize(s: string) {
  return (s || "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]+/gu, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function score(qTokens: string[], cand: string) {
  const cTokens = new Set(tokenize(cand));
  let hit = 0;
  for (const t of qTokens) if (cTokens.has(t)) hit++;
  return hit;
}

function extractQAPairs(text: string) {
  // يتوقع تنسيق بسيط في Word مثل:
  // Q: .... / A: ....
  // أو س: .... / ج: ....
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);

  const pairs: { q: string; a: string }[] = [];
  let curQ = "";
  let curA = "";

  const isQ = (l: string) => /^(\s*(q|question|س)\s*[:：])/i.test(l);
  const isA = (l: string) => /^(\s*(a|answer|ج)\s*[:：])/i.test(l);

  for (const line of lines) {
    if (isQ(line)) {
      if (curQ && curA) pairs.push({ q: curQ.trim(), a: curA.trim() });
      curQ = line.replace(/^(\s*(q|question|س)\s*[:：])/i, "").trim();
      curA = "";
    } else if (isA(line)) {
      curA += (curA ? "\n" : "") + line.replace(/^(\s*(a|answer|ج)\s*[:：])/i, "").trim();
    } else {
      // تكملة
      if (curA) curA += "\n" + line;
      else if (curQ) curQ += " " + line;
    }
  }
  if (curQ && curA) pairs.push({ q: curQ.trim(), a: curA.trim() });
  return pairs;
}

export async function POST(req: Request) {
  try {
    const { question } = await req.json();
    const q = String(question || "").trim();
    if (!q) return NextResponse.json({ ok: false, error: "Empty question" }, { status: 400 });

    const filePath = path.join(process.cwd(), "data", "faq.docx");
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ ok: false, error: "Missing data/faq.docx" }, { status: 500 });
    }

    const buf = fs.readFileSync(filePath);
    const { value } = await mammoth.extractRawText({ buffer: buf });
    const pairs = extractQAPairs(value || "");

    if (!pairs.length) {
      return NextResponse.json({
        ok: true,
        answer: "لم أجد تنسيق Q/A داخل ملف Word. رجاءً اكتب الأسئلة مثل: Q: ... ثم A: ... (أو س:/ج:).",
      });
    }

    const qTokens = tokenize(q);
    let best = { s: -1, a: "" };

    for (const p of pairs) {
      const s = score(qTokens, p.q);
      if (s > best.s) best = { s, a: p.a };
    }

    const answer =
      best.s <= 0
        ? "لا يوجد جواب مطابق حالياً. جرّب صياغة مختلفة أو أضف هذا السؤال إلى ملف Word."
        : best.a;

    return NextResponse.json({ ok: true, answer });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Error" }, { status: 500 });
  }
}
