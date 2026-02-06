"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Msg = { type: "ok" | "err"; text: string } | null;

export default function RegisterPage() {
  const router = useRouter();

  const [nameAr, setNameAr] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [email, setEmail] = useState("");
  const [orgAr, setOrgAr] = useState("");
  const [orgEn, setOrgEn] = useState("");

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<Msg>(null);

  useEffect(() => {
    try {
      const u = localStorage.getItem("conf_user");
      if (u) router.replace("/");
    } catch {}
  }, [router]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);

    if (!email.trim()) {
      setMsg({ type: "err", text: "البريد الإلكتروني مطلوب / Email required" });
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
          email: email.trim().toLowerCase(),
          orgAr: orgAr.trim(),
          orgEn: orgEn.trim(),
        }),
      });

      const text = await res.text();
      let data: any = {};
      try {
        data = JSON.parse(text);
      } catch {}

      if (!res.ok || !data.ok) {
        setMsg({
          type: "err",
          text: `خطأ: ${data.error || data.message || text}`,
        });
        return;
      }

      localStorage.setItem(
        "conf_user",
        JSON.stringify({ email, nameAr, nameEn, orgAr, orgEn })
      );

      setMsg({ type: "ok", text: "تم التسجيل بنجاح ✅" });
      router.replace("/");
    } catch (err: any) {
      setMsg({ type: "err", text: err.message || "Network error" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <form onSubmit={submit}>
        <input value={nameAr} onChange={e => setNameAr(e.target.value)} />
        <input value={nameEn} onChange={e => setNameEn(e.target.value)} />
        <input value={email} onChange={e => setEmail(e.target.value)} />
        <input value={orgAr} onChange={e => setOrgAr(e.target.value)} />
        <input value={orgEn} onChange={e => setOrgEn(e.target.value)} />

        {msg && <div>{msg.text}</div>}

        <button type="submit" disabled={loading}>
          دخول / Enter
        </button>
      </form>
    </div>
  );
}
