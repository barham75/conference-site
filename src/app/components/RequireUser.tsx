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
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(
    null
  );

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
      const r = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({
          email: cleanEmail,
          nameAr: nameAr.trim(),
          nameEn: nameEn.trim(),
          orgAr: orgAr.trim(),
          orgEn: orgEn.trim(),
        }),
      });

      const data = await r.json().catch(() => null);

      if (!r.ok || !data?.ok) {
        setMsg({
          type: "err",
          text:
            (data?.error || "حدث خطأ أثناء التسجيل") +
            " / " +
            (data?.error || "Registration error"),
        });
        return;
      }

      // ✅ نجاح التسجيل: نخزن المستخدم فقط (بدون أي شرط regNo)
      localStorage.setItem(
        "conf_user",
        JSON.stringify({
          email: cleanEmail,
          nameAr: nameAr.trim(),
          nameEn: nameEn.trim(),
          orgAr: orgAr.trim(),
          orgEn: orgEn.trim(),
        })
      );

      setMsg({ type: "ok", text: "تم التسجيل بنجاح / Registration successful" });

      // الذهاب للصفحة الرئيسية
      router.push("/");
    } catch (err: any) {
      setMsg({ type: "err", text: (err?.message || "server error") });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container" style={{ paddingTop: 20, paddingBottom: 20 }}>
      <div className="card" style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ fontSize: 28, fontWeight: 900, marginBottom: 8 }}>
          التسجيل / Registration
        </div>
        <div className="muted" style={{ marginBottom: 16 }}>
          أدخل بياناتك (عربي/إنجليزي). يمكنك الدخول لاحقًا بنفس البريد.
          <br />
          Enter your details (AR/EN). You can log in later with the same email.
        </div>

        <form onSubmit={submit}>
          <div className="grid grid-2">
            <div>
              <label>الاسم (عربي)</label>
              <input value={nameAr} onChange={(e) => setNameAr(e.target.value)} />
            </div>
            <div>
              <label>Name (English)</label>
              <input value={nameEn} onChange={(e) => setNameEn(e.target.value)} />
            </div>
          </div>

          <div style={{ height: 12 }} />

          <div>
            <label>البريد الإلكتروني / Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div style={{ height: 12 }} />

          <div className="grid grid-2">
            <div>
              <label>المؤسسة / الجامعة (عربي)</label>
              <input value={orgAr} onChange={(e) => setOrgAr(e.target.value)} />
            </div>
            <div>
              <label>Organization (English)</label>
              <input value={orgEn} onChange={(e) => setOrgEn(e.target.value)} />
            </div>
          </div>

          <div style={{ height: 16 }} />

          {msg && (
            <div
              className="card"
              style={{
                border: "1px solid",
                borderColor: msg.type === "ok" ? "#9ae6b4" : "#feb2b2",
                background: msg.type === "ok" ? "#f0fff4" : "#fff5f5",
              }}
            >
              {msg.text}
            </div>
          )}

          <div style={{ height: 12 }} />

          <button className="btn" disabled={loading} type="submit">
            {loading ? "..." : "دخول / Continue"}
          </button>
        </form>
      </div>
    </main>
  );
}
