import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, answers, score100 } = await req.json();

    if (!email || !Array.isArray(answers) || typeof score100 !== "number") {
      return NextResponse.json(
        { ok: false, error: "Missing/invalid fields" },
        { status: 400 }
      );
    }

    const scriptUrl = process.env.GOOGLE_SCRIPT_URL_VOTE; // ✅ نفس السكربت الجديد
    const secret = process.env.GOOGLE_SCRIPT_SECRET_VOTE;

    if (!scriptUrl || !secret) {
      return NextResponse.json(
        { ok: false, error: "Server env not set" },
        { status: 500 }
      );
    }

    const res = await fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret,
        action: "evaluation",
        payload: { email, answers, score100 },
      }),
    });

    const text = await res.text();
    let data: any;
    try {
      data = JSON.parse(text);
    } catch {
      return NextResponse.json(
        { ok: false, error: "Bad response from script", raw: text },
        { status: 502 }
      );
    }

    return NextResponse.json(data, { status: res.ok ? 200 : 400 });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || "Error" },
      { status: 500 }
    );
  }
}
