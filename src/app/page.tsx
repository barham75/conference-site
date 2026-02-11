import type { CSSProperties } from "react";
import { cookies } from "next/headers";

export default async function HomePage() {
  const cookieStore = await cookies();   // ✅ مهم await
  const email = cookieStore.get("conf_email")?.value ?? "";

  return (
    <main style={wrap}>
      <h1 style={{ marginTop: 30 }}>Conference Site</h1>

      <p style={{ opacity: 0.8 }}>
        {email
          ? `Logged in as: ${email}`
          : "Please register first at /register"}
      </p>

      <div style={grid}>
        <a style={card} href="/program">Program</a>
        <a style={card} href="/poster-vote">Poster Vote</a>
        <a style={card} href="/evaluation">Evaluation</a>
        <a style={card} href="/lunch-code">Lunch Hall Access</a>
        <a style={card} href="/sponsors">Sponsors</a>
      </div>
    </main>
  );
}

const wrap: CSSProperties = {
  minHeight: "100vh",
  padding: 24,
  background: "#f5f7fb",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 14,
};

const grid: CSSProperties = {
  display: "grid",
  gap: 12,
  width: "min(520px, 100%)",
};

const card: CSSProperties = {
  display: "block",
  background: "#fff",
  padding: "14px 16px",
  borderRadius: 12,
  textDecoration: "none",
  color: "#111",
  boxShadow: "0 10px 25px rgba(0,0,0,.06)",
  border: "1px solid #e6e8ef",
  fontWeight: 700,
  cursor: "pointer",
};
