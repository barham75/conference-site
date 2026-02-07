"use client";

import { useEffect, useMemo, useState } from "react";
import RequireUser from "../components/RequireUser";
import FooterNav from "../components/FooterNav";

export default function EvaluationPage() {
  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    const raw = localStorage.getItem("conf_user");
    if (raw) setUser(JSON.parse(raw));
  }, []);

  const questions = useMemo(
    () => [
      "1) التنظيم العام / Overall organization",
      "2) جودة المحتوى / Content quality",
      "3) المتحدثون / Speakers",
      "4) المكان والخدمات / Venue & services",
      "5) التجربة العامة / Overall experience",
    ],
    []
  );

  const [vals, setVals] = useState<number[]>([3, 3, 3, 3, 3]);
  const score100 = useMemo(() => {
    const sum = vals.reduce((a, b) => a + b, 0); // 5..25
    return Math.round((sum / 25) * 100);
  }, [vals]);

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    if (!user?.email) {
      setMsg({ type: "err", text: "يجب التسجيل أولاً / Please register first." });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/evaluation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, answers: vals, score100 }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "Failed");
      setMsg({ type: "ok", text: "تم الإرسال ✅ / Submitted ✅" });
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
          <h2 style={{ marginTop: 0 }}>تقييم المؤتمر / Conference Evaluation</h2>
          <div className="muted">اختر من 1 إلى 5. النتيجة تظهر من 100.</div>

          <hr className="hr" />

          <form onSubmit={submit} className="grid" style={{ gap: 12 }}>
            {questions.map((q, i) => (
              <div key={i} className="card" style={{ boxShadow: "none", border: "1px solid #eee" }}>
                <div style={{ fontWeight: 900 }}>{q}</div>
                <div className="row" style={{ marginTop: 10 }}>
                  <select
                    className="select"
                    value={vals[i]}
                    onChange={(e) => {
                      const v = parseInt(e.target.value, 10);
                      setVals((prev) => prev.map((x, idx) => (idx === i ? v : x)));
                    }}
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                  <span className="badge">Value: {vals[i]}</span>
                </div>
              </div>
            ))}

            <div className="row" style={{ justifyContent: "space-between" }}>
              <span className="badge">Score: {score100}/100</span>
              <span className="muted">Email: {user?.email}</span>
            </div>

            {msg && <div className={msg.type === "ok" ? "msg-ok" : "msg-err"}>{msg.text}</div>}

            <button className="btn" disabled={loading}>
              {loading ? "..." : "إرسال / Submit"}
            </button>
          </form>
        </div>
      </main>
      <FooterNav />
    </RequireUser>
  );
}
