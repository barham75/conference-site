"use client";

import { useState } from "react";
import RequireUser from "../components/RequireUser";
import FooterNav from "../components/FooterNav";

export default function ChatbotPage() {
  const [q, setQ] = useState("");
  const [ans, setAns] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function ask(e: React.FormEvent) {
    e.preventDefault();
    setAns(null);
    const question = q.trim();
    if (!question) return;

    setLoading(true);
    try {
      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "Failed");
      setAns(data.answer || "لا يوجد جواب مطابق حالياً / No matched answer yet.");
    } catch (e: any) {
      setAns(e?.message || "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <RequireUser>
      <main className="container" style={{ paddingTop: 20, paddingBottom: 20 }}>
        <div className="card">
          <h2 style={{ marginTop: 0 }}>Chatbot</h2>
          <div className="muted">اسأل بالعربي أو بالإنجليزي. الأجوبة تُستخرج من ملف Word: <b>data/faq.docx</b></div>

          <hr className="hr" />

          <form onSubmit={ask} className="grid" style={{ gap: 12 }}>
            <div>
              <label className="label">سؤالك / Your question</label>
              <textarea className="textarea" rows={4} value={q} onChange={(e) => setQ(e.target.value)} placeholder="اكتب سؤالك هنا..." />
            </div>

            <button className="btn" disabled={loading}>
              {loading ? "..." : "إرسال / Ask"}
            </button>
          </form>

          <hr className="hr" />

          <div style={{ fontWeight: 900, marginBottom: 8 }}>الإجابة / Answer</div>
          {ans ? <div className="card" style={{ boxShadow: "none", border: "1px solid #eee" }}>{ans}</div> : <div className="muted">بانتظار سؤالك...</div>}
        </div>
      </main>
      <FooterNav />
    </RequireUser>
  );
}
