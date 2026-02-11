"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function RequireUser({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ok, setOk] = useState(false);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const res = await fetch("/api/session", { cache: "no-store" });
        if (!res.ok) {
          router.replace(`/register?next=${encodeURIComponent(pathname || "/")}`);
          return;
        }
        if (alive) setOk(true);
      } catch {
        router.replace(`/register?next=${encodeURIComponent(pathname || "/")}`);
      }
    })();

    return () => {
      alive = false;
    };
  }, [router, pathname]);

  if (!ok) {
    return (
      <div style={{ minHeight: "60vh", display: "grid", placeItems: "center" }}>
        Checking session...
      </div>
    );
  }

  return <>{children}</>;
}
