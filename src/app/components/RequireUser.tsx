"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RequireUser({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const raw = localStorage.getItem("conf_user");
    if (!raw) router.replace("/register");
  }, [router]);

  return <>{children}</>;
}
