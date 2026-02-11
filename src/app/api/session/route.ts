import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const email = cookieStore.get("conf_email")?.value ?? "";
  const clean = String(email).trim().toLowerCase();

  if (!clean) {
    return NextResponse.json(
      { ok: false, error: "not logged in" },
      { status: 401 }
    );
  }

  return NextResponse.json({ ok: true, email: clean }, { status: 200 });
}
