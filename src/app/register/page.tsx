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

  // لو كان مسجل قبل، حوله للرئيسية
  useEffect(() => {
    try {
      const u = localStorage.getItem("conf_user");
      if (u) router.replace("/");
    } catch {}
  }, [router]);

  function validate() {
    const cleanEmail = email.trim().toLowerCase();
   
