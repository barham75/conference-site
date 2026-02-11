"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();

  const [nameAr, setNameAr] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [email, setEmail] = useState("");
  const [orgAr, setOrgAr] = useState("");
  const [orgEn, setOrgEn] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!email || !nameAr || !nameEn) {
      setError("يرجى تعبئة جميع الحقول المطلوبة");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          nameAr,
          nameEn,
          orgAr,
          orgEn,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data?.ok) {
        setError(data?.error || data?.message || "حدث خطأ أثناء التسجيل");
        setLoading(false);
        return;
      }

      // حفظ المستخدم محليًا (اختياري)
      localStorage.setItem(
        "conf_user",
        JSON.stringify({ email, nameAr, nameEn, orgAr, orgEn })
      );

      setLoading(false);

      // ✅ أهم تعديل: Reload كامل لضمان وصول Set-Cookie قبل صفحة /
      window.location.href = "/";
      return;

    } catch (err) {
      setError("فشل الاتصال بالخادم");
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <form
        onSubmit={submit}
        style={{
          background: "#fff",
          maxWidth: 900,
          width: "100%",
          borderRadius: 16,
          padding: 32,
          boxShadow: "0 10px 30px rgba(0,0,0,.08)",
        }}
      >
        <h2 style={{ marginBottom: 8 }}>
          التسجيل / <span style={{ fontWeight: 600 }}>Registration</span>
        </h2>

        <p style={{ color: "#555", marginBottom: 24 }}>
          أدخل بياناتك (عربي / إنجليزي). يمكنك الدخول لاحقًا بنفس البريد.
          <br />
          Enter your details (AR/EN). You can log in later with the same email.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div>
            <label>الاسم (عربي)</label>
            <input
              value={nameAr}
              onChange={(e) => setNameAr(e.target.value)}
              placeholder="الاسم بالعربية"
              style={inputStyle}
            />
          </div>

          <div>
            <label>Name (English)</label>
            <input
              value={nameEn}
              onChange={(e) => setNameEn(e.target.value)}
              placeholder="Name in English"
              style={inputStyle}
            />
          </div>
        </div>

        <div style={{ marginTop: 16 }}>
          <label>البريد الإلكتروني / Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@email.com"
            style={inputStyle}
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16,
            marginTop: 16,
          }}
        >
          <div>
            <label>المؤسسة / الجامعة (عربي)</label>
            <input
              value={orgAr}
              onChange={(e) => setOrgAr(e.target.value)}
              placeholder="اسم الجامعة أو المؤسسة"
              style={inputStyle}
            />
          </div>

          <div>
            <label>Organization (English)</label>
            <input
              value={orgEn}
              onChange={(e) => setOrgEn(e.target.value)}
              placeholder="University / Organization"
              style={inputStyle}
            />
          </div>
        </div>

        {error && (
          <div
            style={{
              background: "#ffecec",
              color: "#c00",
              padding: 12,
              borderRadius: 8,
              marginTop: 20,
            }}
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            marginTop: 24,
            width: "100%",
            padding: 14,
            fontSize: 16,
            borderRadius: 10,
            border: "none",
            background: "#111",
            color: "#fff",
            cursor: "pointer",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "جارٍ التسجيل..." : "دخول / Enter"}
        </button>
      </form>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 10,
  border: "1px solid #d0d7e2",
  marginTop: 6,
  fontSize: 14,
};
