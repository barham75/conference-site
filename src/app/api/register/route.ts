import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
    }

    const email = String(body.email || "").trim().toLowerCase();
    const nameAr = String(body.nameAr || "").trim();
    const nameEn = String(body.nameEn || "").trim();
    const orgAr = String(body.orgAr || "").trim();
    const orgEn = String(body.orgEn || "").trim();

    if (!email) return NextResponse.json({ ok: false, error: "missing email" }, { status: 400 });

    const scriptUrl = process.env.GOOGLE_SCRIPT_URL;
    const secret = process.env.GOOGLE_SCRIPT_SECRET;

    if (!scriptUrl || !secret) {
      return NextResponse.json(
        { ok: false, error: "server env missing GOOGLE_SCRIPT_URL/GOOGLE_SCRIPT_SECRET" },
        { status: 500 }
      );
    }

    const gsRes = await fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      redirect: "follow",
      cache: "no-store",
      body: JSON.stringify({ secret, email, nameAr, nameEn, orgAr, orgEn }),
    });

    const raw = await gsRes.text();

    let data: any = null;
    try {
      data = JSON.parse(raw);
    } catch {
      // ✅ هنا سنعرض لك جزء من الـ HTML لمعرفة السبب
      return NextResponse.json(
        {
          ok: false,
          error: "Google Script returned non-JSON",
          gsStatus: gsRes.status,
          sample: raw.slice(0, 1200),
        },
        { status: 500 }
      );
    }

    const msg = String(data?.message || data?.error || "");
    const isAlreadyRegistered =
      msg.toLowerCase().includes("already registered") ||
      msg.toLowerCase().includes("email already registered");

    if ((!gsRes.ok || !data?.ok) && !isAlreadyRegistered) {
      return NextResponse.json(
        { ok: false, error: data?.message || data?.error || "Google Script error", gsStatus: gsRes.status, gsData: data },
        { status: 500 }
      );
    }

    const res = NextResponse.json({ ok: true, existed: isAlreadyRegistered });

    res.headers.append(
      "Set-Cookie",
      `conf_email=${email}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 30}`
    );

    return res;
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || "server error" }, { status: 500 });
  }
}
