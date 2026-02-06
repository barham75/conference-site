import { NextResponse } from "next/server";

function parseCSV(csv: string): string[][] {
  // parser بسيط (يكفي لمعظم جداول Google Sheet)
  const lines = csv.split(/\r?\n/).filter(Boolean);
  return lines.map((line) => {
    const out: string[] = [];
    let cur = "";
    let inQ = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"' ) {
        if (inQ && line[i + 1] === '"') { cur += '"'; i++; }
        else inQ = !inQ;
      } else if (ch === "," && !inQ) {
        out.push(cur);
        cur = "";
      } else cur += ch;
    }
    out.push(cur);
    return out.map((x) => x.trim());
  });
}

export async function GET() {
  try {
    const url = process.env.PROGRAM_SHEET_CSV_URL;
    if (!url) return NextResponse.json({ ok: false, error: "PROGRAM_SHEET_CSV_URL missing" }, { status: 500 });

    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch CSV");
    const csv = await res.text();
    const rows = parseCSV(csv);

    return NextResponse.json({ ok: true, rows });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Error" }, { status: 500 });
  }
}
