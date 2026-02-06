"use client";

import { useEffect, useMemo, useState } from "react";
import RequireUser from "./components/RequireUser";
import FooterNav from "./components/FooterNav";
import { MenuCard } from "./components/Cards";

export default function HomePage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const raw = localStorage.getItem("conf_user");
    if (raw) setUser(JSON.parse(raw));
  }, []);

  const welcomeName = useMemo(() => {
    if (!user) return "";
    return user.nameEn?.trim() ? user.nameEn : user.nameAr;
  }, [user]);

  return (
    <RequireUser>
      <main className="container" style={{ paddingTop: 20, paddingBottom: 20 }}>
        <div className="card">
          <div className="row" style={{ justifyContent: "space-between" }}>
            <div style={{ fontWeight: 900, fontSize: 18 }}>
              Welcome {welcomeName ? `, ${welcomeName}` : ""}
            </div>
            <span className="badge">{user?.email}</span>
          </div>

          <div className="muted" style={{ marginTop: 6 }}>
            اختر خدمة من القائمة التالية / Choose a service:
          </div>
        </div>

        <div style={{ height: 14 }} />

        <div className="grid grid-2">
          <MenuCard
            href="/program"
            titleAr="برنامج المؤتمر"
            titleEn="Conference Program"
            descAr="عرض الجدول من ملف اكسل/شيت"
            descEn="Schedule imported from Sheet"
          />
          <MenuCard
            href="/vote"
            titleAr="تصويت افضل بوستر"
            titleEn="Best Poster Voting"
            descAr="تصويت واحد لكل بريد + عرض النتائج"
            descEn="One vote per email + show results"
          />
          <MenuCard
            href="/evaluation"
            titleAr="تقييم المؤتمر"
            titleEn="Conference Evaluation"
            descAr="5 أسئلة (1-5) + نتيجة من 100"
            descEn="5 questions (1-5) + score /100"
          />
          <MenuCard
            href="/sponsors"
            titleAr="الداعمون"
            titleEn="Sponsors"
            descAr="شعارات الشركات الداعمة"
            descEn="Sponsor logos"
          />
          <MenuCard
            href="/chatbot"
            titleAr="Chatbot"
            titleEn="Chatbot"
            descAr="إجابات من ملف Word"
            descEn="Answers extracted from Word"
          />
        </div>
      </main>

      <FooterNav />
    </RequireUser>
  );
}
