import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));

    const nameAr = String(body?.nameAr ?? "").trim();
    const nameEn = String(body?.nameEn ?? "").trim();
    const email = String(body?.email ?? "").trim().toLowerCase();
    const orgAr = String(body?.orgAr ?? "").trim();
    const orgEn = String(body?.orgEn ?? "").trim();

    if (!email) {
      return NextResponse.json({ ok: false, error: "missing email" }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ ok: false, error: "invalid email" }, { status: 400 });
    }
    if (!nameAr && !nameEn) {
      return NextResponse.json({ ok: false, error: "missing name (AR or EN)" }, { status: 400 });
    }
    if (!orgAr && !orgEn) {
      return NextResponse.json(
        { ok: false, error: "missing organization (AR or EN)" },
        { status: 400 }
      );
    }

    const scriptUrl = process.env.GOOGLE_SCRIPT_URL;
    const secret = process.env.GOOGLE_SCRIPT_SECRET;

    if (!scriptUrl) {
      return NextResponse.json({ ok: false, error: "missing GOOGLE_SCRIPT_URL" }, { status: 500 });
    }
    if (!secret) {
      return NextResponse.json({ ok: false, error: "missing GOOGLE_SCRIPT_SECRET" }, { status: 500 });
    }

    const gsRes = await fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret,
        nameAr: nameAr || nameEn,
        nameEn: nameEn || nameAr,
        email,
        orgAr: orgAr || orgEn,
        orgEn: orgEn || orgAr,
      }),
    });

    const raw = await gsRes.text();

    let gsData: any = {};
    try {
      gsData = raw ? JSON.parse(raw) : {};
    } catch {
      gsData = {};
    }

    if (!gsRes.ok) {
      return NextResponse.json(
        { ok: false, error: `Google Script HTTP ${gsRes.status}: ${raw?.slice(0, 200) || "no body"}` },
        { status: 500 }
      );
    }

    if (!gsData?.ok) {
      return NextResponse.json(
        { ok: false, error: String(gsData?.message || gsData?.error || raw || "google script error") },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || "server error" }, { status: 500 });
  }
}
