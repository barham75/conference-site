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

  function validate() {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) return "البريد الإلكتروني مطلوب / Email is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail))
      return "البريد الإلكتروني غير صحيح / Invalid email.";

    if (!nameAr.trim() && !nameEn.trim())
      return "أدخل الاسم بالعربية أو الإنجليزية / Enter name in AR or EN.";

    if (!orgAr.trim() && !orgEn.trim())
      return "أدخل المؤسسة/الجامعة بالعربية أو الإنجليزية / Enter organization in AR or EN.";

    return null;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);

    const err = validate();
    if (err) {
      setMsg({ type: "err", text: err });
      return;
    }

    const payload = {
      nameAr: nameAr.trim(),
      nameEn: nameEn.trim(),
      email: email.trim().toLowerCase(),
      orgAr: orgAr.trim(),
      orgEn: orgEn.trim(),
    };

    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // اقرأ الرد كنص أولاً (حتى لو ليس JSON)
      const raw = await res.text();

      // حاول تحوله JSON لو ممكن
      let data: any = {};
      try {
        data = raw ? JSON.parse(raw) : {};
      } catch {
        data = {};
      }

      // نجاح
      if (res.ok && data?.ok) {
        const displayName = payload.nameEn || payload.nameAr;
        const userToSave = { ...payload, displayName };

        try {
          localStorage.setItem("conf_user", JSON.stringify(userToSave));
        } catch {}

        setMsg({ type: "ok", text: "تم التسجيل ✅ / Registered ✅" });
        router.replace("/");
        return;
      }

      // خطأ: اعرض أفضل رسالة ممكنة
      const reason =
        String(data?.error || data?.message || "").trim() ||
        (raw ? raw.slice(0, 200) : `HTTP ${res.status}`);

      setMsg({
        type: "err",
        text: `حدث خطأ / Error: ${reason}`,
      });
    } catch (e: any) {
      setMsg({ type: "err", text: `Network error: ${e?.message || e}` });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container" style={{ paddingTop: 24, paddingBottom: 24 }}>
      <div className="card" style={{ padding: 22 }}>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 900 }}>
          التسجيل / Registration
        </h1>

        <p className="muted" style={{ marginTop: 8 }}>
          أدخل بياناتك (عربي/إنجليزي). يمكنك الدخول لاحقًا بنفس البريد.
          <br />
          Enter your details (AR/EN). You can log in later with the same email.
        </p>

        <hr className="hr" />

        <form onSubmit={submit} className="grid" style={{ gap: 14 }}>
          <div className="grid grid-2">
            <div>
              <label className="label">الاسم (عربي) / Name (AR)</label>
              <input
                className="input"
                value={nameAr}
                onChange={(e) => setNameAr(e.target.value)}
                placeholder="مثال: محمد برهم"
              />
            </div>

            <div>
              <label className="label">Name (EN) / الاسم (إنجليزي)</label>
              <input
                className="input"
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                placeholder="Example: Mohammed Barham"
              />
            </div>
          </div>

          <div>
            <label className="label">البريد الإلكتروني / Email</label>
            <input
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              inputMode="email"
            />
          </div>

          <div className="grid grid-2">
            <div>
              <label className="label">
                المؤسسة/الجامعة (عربي) / Organization (AR)
              </label>
              <input
                className="input"
                value={orgAr}
                onChange={(e) => setOrgAr(e.target.value)}
                placeholder="مثال: جامعة جرش"
              />
            </div>

            <div>
              <label className="label">
                Organization (EN) / المؤسسة (إنجليزي)
              </label>
              <input
                className="input"
                value={orgEn}
                onChange={(e) => setOrgEn(e.target.value)}
                placeholder="Example: Jerash University"
              />
            </div>
          </div>

          {msg && (
            <div className={msg.type === "ok" ? "msg-ok" : "msg-err"}>
              {msg.text}
            </div>
          )}

          <button className="btn" type="submit" disabled={loading}>
            {loading ? "..." : "دخول / Enter"}
          </button>
        </form>
      </div>
    </div>
  );
}
