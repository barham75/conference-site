import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // تثبيت أسماء الحقول
    const payload = {
      email: String(body.email || "").trim().toLowerCase(),
      nameAr: String(body.nameAr || "").trim(),
      nameEn: String(body.nameEn || "").trim(),
      orgAr: String(body.orgAr || "").trim(),
      orgEn: String(body.orgEn || "").trim(),
    };

    if (!payload.email) {
      return NextResponse.json({ ok: false, error: "missing email" }, { status: 400 });
    }

    const scriptUrl = process.env.GOOGLE_SCRIPT_URL;
    const secret = process.env.GOOGLE_SCRIPT_SECRET;

    if (!scriptUrl || !secret) {
      return NextResponse.json(
        { ok: false, error: "missing env config" },
        { status: 500 }
      );
    }

    const res = await fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret,
        email: payload.email,
        nameAr: payload.nameAr,
        nameEn: payload.nameEn,
        orgAr: payload.orgAr,
        orgEn: payload.orgEn,
      }),
    });

    const text = await res.text();
    let data: any = {};
    try {
      data = JSON.parse(text);
    } catch {}

    if (!data.ok) {
      return NextResponse.json(
        { ok: false, error: data.message || "Google Script error" },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err.message || "server error" },
      { status: 500 }
    );
  }
}
