"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/identify", label: "Identify" },
  { href: "/collection", label: "Collection" },
  { href: "/conservation", label: "Conservation" },
];

function getUserLevel(cardCount: number): { label: string; emoji: string } {
  if (cardCount >= 51) return { label: "Legendary", emoji: "🦁" };
  if (cardCount >= 31) return { label: "Expert", emoji: "🏕" };
  if (cardCount >= 16) return { label: "Tracker", emoji: "🥾" };
  if (cardCount >= 6) return { label: "Scout", emoji: "🔭" };
  return { label: "Novice", emoji: "🌱" };
}

const mockUser = { name: "Joyce", avatarInitial: "J", cardCount: 2 };

export default function TopNav() {
  const pathname = usePathname();
  const level = getUserLevel(mockUser.cardCount);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100 h-14">
      <div className="max-w-4xl mx-auto h-full flex items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-black text-green-800 text-lg">
          <span>💩</span>
          <span>Poopidex</span>
        </Link>

        <nav className="hidden sm:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                pathname === link.href
                  ? "bg-green-100 text-green-800"
                  : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <span className="hidden sm:flex items-center gap-1 text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {level.emoji} {level.label}
          </span>
          <span className="hidden sm:block text-sm font-medium text-gray-700">{mockUser.name}</span>
          <div className="w-8 h-8 rounded-full bg-green-700 text-white flex items-center justify-center text-sm font-bold">
            {mockUser.avatarInitial}
          </div>
        </div>
      </div>

      <div className="sm:hidden flex gap-1 px-4 pb-2 overflow-x-auto">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              pathname === link.href ? "bg-green-700 text-white" : "bg-gray-100 text-gray-500"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </header>
  );
}
