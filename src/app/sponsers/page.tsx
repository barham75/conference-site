"use client";

import RequireUser from "../components/RequireUser";
import FooterNav from "../components/FooterNav";
import Image from "next/image";

const sponsors = [
  { nameAr: "شركة داعمة 1", nameEn: "Sponsor Company 1", logo: "/conference.png" },
  { nameAr: "شركة داعمة 2", nameEn: "Sponsor Company 2", logo: "/conference.png" },
  { nameAr: "شركة داعمة 3", nameEn: "Sponsor Company 3", logo: "/conference.png" },
];

export default function SponsorsPage() {
  return (
    <RequireUser>
      <main className="container" style={{ paddingTop: 20, paddingBottom: 20 }}>
        <div className="card">
          <h2 style={{ marginTop: 0 }}>الداعمون / Sponsors</h2>
          <div className="muted">ضع شعارات الشركات وأسمائها هنا.</div>

          <hr className="hr" />

          <div className="grid grid-3">
            {sponsors.map((s) => (
              <div key={s.nameEn} className="card" style={{ textAlign: "center" }}>
                <Image src={s.logo} alt={s.nameEn} width={90} height={90} />
                <div style={{ fontWeight: 900, marginTop: 8 }}>{s.nameAr}</div>
                <div className="muted">{s.nameEn}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <FooterNav />
    </RequireUser>
  );
}
