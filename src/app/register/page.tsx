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
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();        // 🔴 يمنع POST الافتراضي
    e.stopPropagation();       // 🔴 مهم جدًا
    setError("");

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

    if (!data.ok) {
      setError(data.error || "Error");
      return;
    }

    localStorage.setItem(
      "conf_user",
      JSON.stringify({ email, nameAr, nameEn, orgAr, orgEn })
    );

    router.replace("/");
  }

  return (
    <form onSubmit={submit} action="">
      <input value={nameAr} onChange={e => setNameAr(e.target.value)} />
      <input value={nameEn} onChange={e => setNameEn(e.target.value)} />
      <input value={email} onChange={e => setEmail(e.target.value)} />
      <input value={orgAr} onChange={e => setOrgAr(e.target.value)} />
      <input value={orgEn} onChange={e => setOrgEn(e.target.value)} />

      <button type="submit">Enter</button>

      {error && <div style={{ color: "red" }}>{error}</div>}
    </form>
  );
}
