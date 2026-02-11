import { NextResponse } from "next/server";

function getVoteConfig() {
  const scriptUrl =
    process.env.GOOGLE_SCRIPT_URL_VOTE || process.env.GOOGLE_SCRIPT_URL || "";
  const secret =
    process.env.GOOGLE_SCRIPT_SECRET_VOTE || process.env.GOOGLE_SCRIPT_SECRET || "";
  return { scriptUrl, secret };
}

export async function GET() {
  // ✅ التشخيص داخل GET (مسموح)
  const { scriptUrl, secret } = getVoteConfig();

  return NextResponse.json({
    ok: true,
    using: {
      scriptUrl,
      secretLen: secret.length,
      secretPreview: secret ? `${secret.slice(0, 4)}...${secret.slice(-4)}` : "",
    },
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
    }

    const email = String(body.email || "").trim().toLowerCase();
    const posterId = String(body.posterId || "").trim();

    const { scriptUrl, secret } = getVoteConfig();

    if (!scriptUrl) {
      return NextResponse.json({ ok: false, error: "Missing GOOGLE_SCRIPT_URL_VOTE" }, { status: 500 });
    }
    if (!secret) {
      return NextResponse.json({ ok: false, error: "Missing GOOGLE_SCRIPT_SECRET_VOTE" }, { status: 500 });
    }

    // ✅ مطابق لسكربت Apps Script الذي عندك (action + payload)
    const r = await fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      body: JSON.stringify({
        secret,
        action: "vote",
        payload: { email, posterId },
      }),
    });

    const data = await r.json().catch(() => null);

    return NextResponse.json(
      data ?? { ok: false, error: "Invalid JSON from Apps Script" },
      { status: r.ok ? 200 : 502 }
    );
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "POST failed" }, { status: 500 });
  }
}
