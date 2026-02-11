import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const day = String(body.day || "1") === "2" ? "2" : "1";

    const cookieStore = await cookies();
    const email = String(cookieStore.get("conf_email")?.value || "")
      .trim()
      .toLowerCase();

    if (!email) {
      return NextResponse.json(
        { ok: false, error: "missing session email (please register first)" },
        { status: 401 }
      );
    }

    const scriptUrl = process.env.GOOGLE_SCRIPT_URL;
    const secret = process.env.GOOGLE_SCRIPT_SECRET;

    if (!scriptUrl || !secret) {
      return NextResponse.json(
        { ok: false, error: "server env missing GOOGLE_SCRIPT_URL/GOOGLE_SCRIPT_SECRET" },
        { status: 500 }
      );
    }

    // ✅ تحقق من قائمة الإيميلات (registrations number)
    const gsRes = await fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      redirect: "follow",
      cache: "no-store",
      body: JSON.stringify({
        action: "checkLunchAccess",
        secret,
        email,
      }),
    });

    const raw = await gsRes.text();

    let data: any = null;
    try {
      data = JSON.parse(raw);
    } catch {
      return NextResponse.json(
        {
          ok: false,
          error: "Google Script returned non-JSON",
          gsStatus: gsRes.status,
          sample: raw.slice(0, 800),
        },
        { status: 500 }
      );
    }

    if (!gsRes.ok || data?.ok !== true) {
      return NextResponse.json(
        { ok: false, error: data?.message || "Google Script error", gsStatus: gsRes.status, gsData: data },
        { status: 500 }
      );
    }

    if (!data?.allowed) {
      return NextResponse.json(
        { ok: false, error: "not allowed (email not in list)" },
        { status: 403 }
      );
    }

    const code =
      day === "2" ? process.env.LUNCH_CODE_DAY2 : process.env.LUNCH_CODE_DAY1;

    if (!code) {
      return NextResponse.json(
        { ok: false, error: "server env missing LUNCH_CODE_DAY1/LUNCH_CODE_DAY2" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      day,
      code,
      regNo: data?.regNo || null,
    });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || "server error" },
      { status: 500 }
    );
  }
}
