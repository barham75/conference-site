import Link from "next/link";

const items = [
  { href: "/program", ar: "برنامج المؤتمر", en: "Conference Program" },
  { href: "/vote", ar: "تصويت افضل بوستر", en: "Best Poster Voting" },
  { href: "/evaluation", ar: "تقييم المؤتمر", en: "Conference Evaluation" },
  { href: "/sponsors", ar: "الداعمون", en: "Sponsors" },
  // ❌ تم حذف chatbot نهائيًا
];

export default function FooterNav() {
  return (
    <footer
      style={{
        position: "sticky",
        bottom: 0,
        background: "white",
        borderTop: "1px solid #eee",
      }}
    >
      <div className="container">
        <div className="row" style={{ justifyContent: "space-between" }}>
          {items.map((it) => (
            <Link
              key={it.href}
              href={it.href}
              className="badge"
              style={{ background: "#f2f4ff" }}
            >
              {it.ar} / {it.en}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
