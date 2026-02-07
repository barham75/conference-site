"use client";

import { useEffect, useMemo, useState } from "react";
import RequireUser from "../components/RequireUser";
import FooterNav from "../components/FooterNav";

type ResultsState = {
  topPoster?: string;
  topCount?: number;
  counts?: Record<string, number>;
};

export default function VotePage() {
  const posters = useMemo(() => Array.from({ length: 30 }, (_, i) => `P${i + 1}`), []);
  const [posterId, setPosterId] = useState("P1");
  const [user, setUser] = useState<any>(null);

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [results, setResults] = useState<ResultsState | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("conf_user");
    if (raw) setUser(JSON.parse(raw));
  }, []);

  function normalizeResults(data: any): ResultsState | null {
    // Apps Script يرجع: { ok:true, results:[{posterId, votes}, ...] }
    if (data?.ok && Array.isArray(data?.results)) {
      const counts: Record<string, number> = {};
      for (const row of data.results) {
        const p = String(row?.posterId ?? "").trim();
        const v = Number(row?.votes ?? 0);
        if (p) counts[p] = v;
      }
      const top = Object.entries(counts).sort((a, b) => (b[1] ?? 0) - (a[1] ?? 0))[0];
      return { counts, topPoster: top?.[0], topCount: top?.[1] ?? 0 };
    }

    // لو رجع شكل آخر: { topPoster, topCount, counts }
    if (data?.ok && data?.counts) {
      return { topPoster: data.topPoster, topCount: data.topCount, counts: data.counts };
    }

    return null;
  }

  async function loadResults() {
    const res = await fetch("/api/poster-vote", { method: "GET" });
    const data = await res.json();
    const r = normalizeResults(data);
    if (r) setResults(r);
  }

  useEffect(() => {
    loadResults().catch(() => {});
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);

    if (!user?.email) {
      setMsg({ type: "err", text: "يجب التسجيل أولاً / Please register first." });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/poster-vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, posterId }),
      });

      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "Failed");

      setMsg({ type: "ok", text: "تم التصويت ✅ / Voted ✅" });
      await loadResults();
    } catch (e: any) {
      setMsg({ type: "err", text: e?.message || "Error" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <RequireUser>
      <main className="container" style={{ paddingTop: 20, paddingBottom: 20 }}>
        <div className="card">
          <h2 style={{ marginTop: 0 }}>تصويت أفضل بوستر / Best Poster Voting</h2>
          <div className="muted">مسموح صوت واحد لكل بريد إلكتروني.</div>

          <hr className="hr" />

          <form onSubmit={submit} className="grid" style={{ gap: 12 }}>
            <div>
              <label className="label">اختر البوستر / Select poster</label>
              <select className="select" value={posterId} onChange={(e) => setPosterId(e.target.value)}>
                {posters.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            {msg && <div className={msg.type === "ok" ? "msg-ok" : "msg-err"}>{msg.text}</div>}

            <button className="btn" disabled={loading}>
              {loading ? "..." : "تصويت / Vote"}
            </button>
          </form>

          <hr className="hr" />

          <div style={{ fontWeight: 900, marginBottom: 8 }}>النتائج / Results</div>

          {results?.topPoster ? (
            <div className="row" style={{ justifyContent: "space-between" }}>
              <span className="badge">Top: {results.topPoster}</span>
              <span className="badge">Votes: {results.topCount ?? 0}</span>
            </div>
          ) : (
            <div className="muted">لا توجد نتائج بعد.</div>
          )}

          {results?.counts && (
            <div style={{ overflowX: "auto", marginTop: 10 }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Poster</th>
                    <th>Votes</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(results.counts)
                    .sort((a, b) => (b[1] ?? 0) - (a[1] ?? 0))
                    .map(([p, c]) => (
                      <tr key={p}>
                        <td>{p}</td>
                        <td>{c}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
      <FooterNav />
    </RequireUser>
  );
}
