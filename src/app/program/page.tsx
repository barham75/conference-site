"use client";

import { useEffect, useState } from "react";
import RequireUser from "../components/RequireUser";
import FooterNav from "../components/FooterNav";

type Row = string[];

export default function ProgramPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/program");
        const data = await res.json();
        if (!data.ok) throw new Error(data.error || "Failed");
        setRows(data.rows || []);
      } catch (e: any) {
        setErr(e?.message || "Error");
      }
    })();
  }, []);

  return (
    <RequireUser>
      <main className="container" style={{ paddingTop: 20, paddingBottom: 20 }}>
        <div className="card">
          <h2 style={{ marginTop: 0 }}>برنامج المؤتمر / Conference Program</h2>
          <div className="muted">الجدول يتم جلبه من Google Sheet بصيغة CSV.</div>

          <hr className="hr" />

          {err && <div className="msg-err">{err}</div>}

          {!err && rows.length > 0 && (
            <div style={{ overflowX: "auto" }}>
              <table className="table">
                <thead>
                  <tr>
                    {rows[0].map((h, i) => (
                      <th key={i}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.slice(1).map((r, idx) => (
                    <tr key={idx}>
                      {r.map((c, i) => (
                        <td key={i}>{c}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!err && rows.length === 0 && <div className="muted">لا توجد بيانات بعد.</div>}
        </div>
      </main>
      <FooterNav />
    </RequireUser>
  );
}
