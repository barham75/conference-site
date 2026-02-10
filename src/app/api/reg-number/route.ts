import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = String(searchParams.get("email") || "").trim().toLowerCase();

    if (!email) {
      return NextResponse.json(
        { ok: false, error: "missing email" },
        { status: 400 }
      );
    }

    const scriptUrl = process.env.GOOGLE_SCRIPT_URL;
    const secret = process.env.GOOGLE_SCRIPT_SECRET;

    // تشخيص (مهم) — يظهر في Terminal فقط
    console.log("ENV SCRIPT URL =", scriptUrl);
    console.log(
      "ENV SECRET LEN =",
      secret?.length,
      "SECRET =",
      JSON.stringify(secret)
    );

    if (!scriptUrl || !secret) {
      return NextResponse.json(
        { ok: false, error: "missing GOOGLE_SCRIPT_URL or GOOGLE_SCRIPT_SECRET" },
        { status: 500 }
      );
    }

    const url =
      `${scriptUrl}?action=getRegNo` +
      `&email=${encodeURIComponent(email)}` +
      `&secret=${encodeURIComponent(secret)}`;

    const r = await fetch(url, {
      cache: "no-store",
      redirect: "follow",
    });

    const text = await r.text();

    // حاول تحويله إلى JSON
    let data: any = null;
    try {
      data = JSON.parse(text);
    } catch {
      return NextResponse.json(
        {
          ok: false,
          error: "script did not return JSON",
          status: r.status,
          sample: text.slice(0, 500),
        },
        { status: 500 }
      );
    }

    // السكربت رجّع خطأ
    if (!data || data.ok !== true) {
      return NextResponse.json(
        {
          ok: false,
          error: data?.message || data?.error || "script returned error",
          data,
        },
        { status: 500 }
      );
    }

    // نجاح
    return NextResponse.json({ ok: true, regNo: data.regNo ?? null });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || "server error" },
      { status: 500 }
    );
  }
}
