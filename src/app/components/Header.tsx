import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header style={{ background: "white", boxShadow: "0 2px 10px rgba(0,0,0,.05)" }}>
      <div className="container" style={{ paddingTop: 10, paddingBottom: 10 }}>
        <div
          className="row"
          style={{ justifyContent: "space-between", alignItems: "center" }}
        >
          {/* يمين: شعار الجامعة */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Image src="/jerash.png" alt="Jerash University" width={64} height={64} />
          </div>

          {/* الوسط: اسم المؤتمر */}
          <Link href="/" style={{ textAlign: "center", flex: 1 }}>
            <div style={{ fontWeight: 900, fontSize: 18, lineHeight: 1.25 }}>
              Chemistry Horizons: Innovation for a Sustainable Future
            </div>
            <div className="muted" style={{ fontWeight: 800 }}>
              Second Scientific Conference – Jerash University
            </div>
          </Link>

          {/* يسار: شعار المؤتمر */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Image src="/conference.png" alt="Conference Logo" width={64} height={64} />
          </div>
        </div>
      </div>
    </header>
  );
}
