import Link from "next/link";

export function MenuCard({
  href,
  titleAr,
  titleEn,
  descAr,
  descEn,
}: {
  href: string;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
}) {
  return (
    <Link href={href} className="card" style={{ display: "block" }}>
      <div style={{ fontWeight: 900, fontSize: 18 }}>
        {titleAr} / {titleEn}
      </div>
      <div className="muted" style={{ marginTop: 6 }}>
        {descAr} — {descEn}
      </div>
    </Link>
  );
}
