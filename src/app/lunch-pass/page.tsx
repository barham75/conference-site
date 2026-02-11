"use client";

import { useState } from "react";

export default function LunchPassPage() {
  const [day, setDay] = useState<"1" | "2">("1");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const [code, setCode] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(
    null
  );

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setCode(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setMsg({ type: "err", text: "يرجى إدخال بريد إلكتروني صحيح." });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/lunch-pass", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail, day }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.ok) {
        const err = data?.error || "حدث خطأ";
        if (err === "not registered") {
          setMsg({ type: "err", text: "هذا البريد غير مسجل في المؤتمر." });
        } else {
          setMsg({ type: "err", text: err });
        }
        return;
      }

      setCode(String(data.code));
      setMsg({ type: "ok", text: "تم التحقق ✅ أظهر الكود عند بوابة صالة الطعام." });
    } catch (err: any) {
      setMsg({ type: "err", text: err?.message || String(err) });
    } finally {
      setLoading(false);
    }
  }

  async function copyCode() {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setMsg({ type: "ok", text: "تم نسخ الكود ✅" });
    } catch {
      setMsg({ type: "err", text: "فشل النسخ. انسخ يدوياً." });
    }
  }

  return (
    <div style={container}>
      <h1 style={title}>Lunch Hall Access</h1>

      <div style={tabs}>
        <button
          type="button"
          onClick={() => setDay("1")}
          style={day === "1" ? tabActive : tab}
        >
          Day 1
        </button>
        <button
          type="button"
          onClick={() => setDay("2")}
          style={day === "2" ? tabActive : tab}
        >
          Day 2
        </button>
      </div>

      <div style={card}>
        <form onSubmit={submit} style={form}>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your registered email"
            style={input}
            type="email"
          />
          <button style={btn} disabled={loading}>
            {loading ? "Checking..." : "Show Code"}
          </button>
        </form>

        {msg && (
          <div style={{ marginTop: 10, color: msg.type === "err" ? "crimson" : "green" }}>
            {msg.text}
          </div>
        )}

        {code && (
          <div style={{ marginTop: 16 }}>
            <div style={label}>Show this code at the entrance</div>
            <div style={codeBox}>{code}</div>
            <button type="button" onClick={copyCode} style={btn2}>
              Copy Code
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const container: React.CSSProperties = {
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: 20,
  background: "#f5f7fa",
};

const title: React.CSSProperties = { marginBottom: 14 };

const tabs: React.CSSProperties = { display: "flex", gap: 10, marginBottom: 12 };

const tab: React.CSSProperties = {
  padding: "10px 14px",
  borderRadius: 12,
  border: "1px solid #d0d7de",
  background: "#fff",
  cursor: "pointer",
  fontWeight: 700,
};

const tabActive: React.CSSProperties = {
  ...tab,
  background: "#003366",
  color: "#fff",
  border: "1px solid #003366",
};

const card: React.CSSProperties = {
  width: "min(520px, 100%)",
  background: "#fff",
  borderRadius: 14,
  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
  padding: 20,
};

const form: React.CSSProperties = { display: "flex", gap: 10, flexWrap: "wrap" };

const input: React.CSSProperties = {
  flex: "1 1 260px",
  padding: "12px 12px",
  borderRadius: 12,
  border: "1px solid #d0d7de",
  fontSize: 16,
};

const btn: React.CSSProperties = {
  flex: "0 0 140px",
  padding: "12px 12px",
  borderRadius: 12,
  border: "none",
  background: "#003366",
  color: "#fff",
  cursor: "pointer",
  fontWeight: 800,
};

const label: React.CSSProperties = {
  fontSize: 13,
  opacity: 0.75,
  marginBottom: 8,
  textAlign: "center",
};

const codeBox: React.CSSProperties = {
  fontSize: 28,
  fontWeight: 900,
  letterSpacing: 1,
  padding: "16px 12px",
  borderRadius: 12,
  border: "2px dashed #003366",
  textAlign: "center",
  userSelect: "all",
};

const btn2: React.CSSProperties = {
  width: "100%",
  marginTop: 10,
  padding: "12px 12px",
  borderRadius: 12,
  border: "1px solid #003366",
  background: "#fff",
  color: "#003366",
  cursor: "pointer",
  fontWeight: 800,
};
