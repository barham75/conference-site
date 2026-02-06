"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [nameAr, setNameAr] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [email, setEmail] = useState("");
  const [orgAr, setOrgAr] = useState("");
  const [orgEn, setOrgEn] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setMsg({ type: "err", text: "يرجى إدخال بريد إلكتروني صحيح / Please enter a valid email." });
      return;
    }
    if (!nameAr.trim() && !nameEn.trim()) {
      setMsg({ type: "err", text: "الاسم مطلوب (عربي أو إنجليزي) / Name is required (AR or EN)." });
      return;
    }
    if (!orgAr.trim() && !orgEn.trim()) {
      setMsg({ type: "err", text: "المؤسسة/الجامعة مطلوبة / Organization is required." });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nameAr: nameAr.trim(),
          nameEn: nameEn.trim(),
          email: cleanEmail,
          orgAr: orgAr.trim(),
          orgEn: orgEn.trim(),
        }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "Failed");

      localStorage.setItem(
        "conf_user",
        JSON.stringify({ nameAr: nameAr.trim(), nameEn: nameEn.trim(), email: cleanEmail, orgAr: orgAr.trim(), orgEn: orgEn.trim() })
      );

      setMsg({ type: "ok", text: "تم التسجيل/الدخول بنجاح ✅ / Registered successfully ✅" });
      router.push("/");
    } catch (err: any) {
      setMsg({ type: "err", text: err?.message || "حدث خطأ" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container" style={{ paddingTop: 20, paddingBottom: 30 }}>
      <div className="card">
        <h2 style={{ marginTop: 0 }}>التسجيل / Registration</h2>
        <div className="muted">
          أدخل بياناتك (عربي/إنجليزي). يمكنك الدخول لاحقاً بنفس البريد.
        </div>

        <hr className="hr" />

        <form onSubmit={submit} className="grid" style={{ gap: 12 }}>
          <div className="grid grid-2">
            <div>
              <label className="label">الاسم (عربي) / Name (AR)</label>
              <input className="input" value={nameAr} onChange={(e) => setNameAr(e.target.value)} placeholder="مثال: محمد برهم" />
            </div>
            <div>
              <label className="label">Name (EN) / الاسم (إنجليزي)</label>
              <input className="input" value={nameEn} onChange={(e) => setNameEn(e.target.value)} placeholder="Example: Mohammad Barham" />
            </div>
          </div>

          <div>
            <label className="label">البريد الإلكتروني / Email</label>
            <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" />
          </div>

          <div className="grid grid-2">
            <div>
              <label className="label">المؤسسة/الجامعة (عربي) / Organization (AR)</label>
              <input className="input" value={orgAr} onChange={(e) => setOrgAr(e.target.value)} placeholder="مثال: جامعة جرش" />
            </div>
            <div>
              <label className="label">Organization (EN) / المؤسسة (إنجليزي)</label>
              <input className="input" value={orgEn} onChange={(e) => setOrgEn(e.target.value)} placeholder="Example: Jerash University" />
            </div>
          </div>

          {msg && <div className={msg.type === "ok" ? "msg-ok" : "msg-err"}>{msg.text}</div>}

          <button className="btn" disabled={loading}>
            {loading ? "..." : "دخول / Enter"}
          </button>
        </form>
      </div>
    </main>
  );
}
