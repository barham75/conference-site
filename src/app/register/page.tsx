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
  const [msg, setMsg] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");

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
      setMsg(data.error || "Error");
      return;
    }

    // حفظ محلي فقط
    localStorage.setItem(
      "conf_user",
      JSON.stringify({ email, nameAr, nameEn, orgAr, orgEn })
    );

    router.replace("/");
  }

  return (
    <form onSubmit={submit}>
      <input value={nameAr} onChange={e => setNameAr(e.target.value)} />
      <input value={nameEn} onChange={e => setNameEn(e.target.value)} />
      <input value={email} onChange={e => setEmail(e.target.value)} />
      <input value={orgAr} onChange={e => setOrgAr(e.target.value)} />
      <input value={orgEn} onChange={e => setOrgEn(e.target.value)} />
      <button type="submit">Enter</button>
      {msg && <div>{msg}</div>}
    </form>
  );
}
