"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";

const navItems = [
  { href: "/", label: "Home", match: (p: string) => p === "/" },
  { href: "/identify", label: "Identify", match: (p: string) => p.startsWith("/identify") },
  { href: "/collection", label: "Collection", match: (p: string) => p.startsWith("/collection") },
  { href: "/conservation", label: "Conservation", match: (p: string) => p.startsWith("/conservation") },
];

export default function TopNav() {
  const pathname = usePathname();

  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 40px",
        borderBottom: "1px solid var(--bone-3)",
        background: "var(--bone)",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <Link
        href="/"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          textDecoration: "none",
          color: "var(--ink)",
        }}
      >
        <Logo />
        <div
          className="sd-display"
          style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em" }}
        >
          Poop<span style={{ color: "var(--forest)" }}>·</span>idex
        </div>
      </Link>
      <div style={{ display: "flex", gap: 4 }}>
        {navItems.map((it) => {
          const active = it.match(pathname);
          return (
            <Link
              key={it.href}
              href={it.href}
              style={{
                padding: "8px 14px",
                borderRadius: 999,
                fontSize: 13.5,
                fontWeight: 600,
                color: active ? "var(--bone)" : "var(--ink-2)",
                background: active ? "var(--ink)" : "transparent",
                textDecoration: "none",
                transition: "background .14s, color .14s",
              }}
            >
              {it.label}
            </Link>
          );
        })}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 999,
            background: "var(--forest)",
            color: "var(--bone)",
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 13,
          }}
        >
          JZ
        </div>
      </div>
    </nav>
  );
}
