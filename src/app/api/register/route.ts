import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nameAr, nameEn, email, orgAr, orgEn } = body || {};

    if (!email) return NextResponse.json({ ok: false, error: "Missing email" }, { status: 400 });

    const scriptUrl = process.env.GOOGLE_SCRIPT_URL;
    const secret = process.env.GOOGLE_SCRIPT_SECRET;
    if (!scriptUrl || !secret) return NextResponse.json({ ok: false, error: "Server env not set" }, { status: 500 });

    const res = await fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret,
        action: "register",
        payload: { nameAr, nameEn, email, orgAr, orgEn },
      }),
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Error" }, { status: 500 });
  }
}
