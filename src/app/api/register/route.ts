import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      nameAr = "",
      nameEn = "",
      email = "",
      orgAr = "",
      orgEn = "",
    } = body || {};

    // تنظيف
    const cleanEmail = String(email).trim().toLowerCase();

    // تحقق مرن (عربي أو إنجليزي)
    if (!cleanEmail) {
      return NextResponse.json({ ok: false, error: "missing email" }, { status: 400 });
    }

    if (!nameAr.trim() && !nameEn.trim()) {
      return NextResponse.json(
        { ok: false, error: "missing name (AR or EN)" },
        { status: 400 }
      );
    }

    if (!orgAr.trim() && !orgEn.trim()) {
      return NextResponse.json(
        { ok: false, error: "missing organization (AR or EN)" },
        { status: 400 }
      );
    }

    const scriptUrl = process.env.GOOGLE_SCRIPT_URL;
    const secret = process.env.GOOGLE_SCRIPT_SECRET;

    if (!scriptUrl || !secret) {
      return NextResponse.json(
        { ok: false, error: "server config error" },
        { status: 500 }
      );
    }

    const res = await fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret,
        action: "register",
        payload: {
          nameAr: nameAr.trim(),
          nameEn: nameEn.trim(),
          email: cleanEmail,
          orgAr: orgAr.trim(),
          orgEn: orgEn.trim(),
        },
      }),
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || "server error" },
      { status: 500 }
    );
  }
}
