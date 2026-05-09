import Link from "next/link";
import React from "react";
import { Facebook } from "lucide-react";
import { Instagram } from "lucide-react";
import { usePathname } from "next/navigation";

// Renders Navbar as General Component
const Navbar = ({ item1, item2 }) => {
  const pathname = usePathname();
  return (
    <header className="border-b border-[#eaded8] bg-white shadow-sm">
      <div className="flex flex-row items-center justify-between px-4 py-1.5 md:px-8">
        <div className="relative h-8 w-28 md:h-10 md:w-36">
          <Link href="/" aria-label="Go to College Predictor home">
            <img
              src="https://cdn.avantifellows.org/af_logos/avanti_logo_black_text.webp"
              alt="Avanti Fellows logo"
              className="h-full w-full object-contain cursor-pointer"
            />
          </Link>
        </div>

        <div className="flex gap-1.5">
          <SocialIcon
            socialLink="https://www.facebook.com/avantifellows"
            label="Avanti Fellows on Facebook"
          >
            <Facebook color="#fff" fill="#fff" strokeWidth="0.1" />
          </SocialIcon>
          <SocialIcon
            socialLink="https://www.instagram.com/avantifellows"
            label="Avanti Fellows on Instagram"
          >
            <Instagram color="#fff" />
          </SocialIcon>
        </div>
      </div>
      <div className="w-full bg-[#B52326] px-4 py-2 text-white md:px-8">
        <nav
          className="mx-auto grid max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-2"
          aria-label="Primary navigation"
        >
          <div />
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Link
              href="/"
              aria-current={pathname === "/" ? "page" : undefined}
              className={`rounded-full px-3 py-1.5 text-sm font-semibold transition ${
                pathname === "/"
                  ? "bg-white/20"
                  : "hover:bg-white/10 cursor-pointer"
              }`}
            >
              {item1}
            </Link>
            <Link
              href="/scholarships"
              aria-current={pathname === "/scholarships" ? "page" : undefined}
              className={`rounded-full px-3 py-1.5 text-sm font-semibold transition ${
                pathname === "/scholarships"
                  ? "bg-white/20"
                  : "hover:bg-white/10 cursor-pointer"
              }`}
            >
              {item2}
            </Link>
          </div>
          <Link
            href="https://cv-generator.avantifellows.org/"
            className="ml-auto inline-flex shrink-0 items-center justify-center rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-black transition hover:bg-[#f8efec]"
            target="_blank"
            rel="noopener noreferrer external"
            aria-label="Open Avanti Fellows CV Generator in a new tab"
          >
            CV Generator
          </Link>
        </nav>
      </div>
    </header>
  );
};

const SocialIcon = ({ children, socialLink, label }) => {
  return (
    <a
      href={socialLink}
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer external"
      className="flex h-7 w-7 items-center justify-center rounded-full bg-[#B52326]"
    >
      {children}
    </a>
  );
};

export default Navbar;
