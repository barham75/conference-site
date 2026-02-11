"use client";

import { useState } from "react";

export default function CopyCode({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(String(code || ""));
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      alert("Copy failed. Please copy manually.");
    }
  }

  return (
    <button onClick={copy} style={btn}>
      {copied ? "Copied ✅" : "Copy Code"}
    </button>
  );
}

const btn: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 12,
  border: "none",
  cursor: "pointer",
  background: "#003366",
  color: "#fff",
  fontSize: 16,
  fontWeight: 700,
};
