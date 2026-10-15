import Link from "next/link";
import { navLinks, whatsappLink } from "@/lib/site-config";
import { WhatsAppIcon } from "@/components/icons";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";
import { CartButton } from "./cart-button";
import { MobileMenu } from "./mobile-menu";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/90 backdrop-blur supports-[backdrop-filter]:bg-bg/75">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-2 px-3 sm:px-4">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <MobileMenu />
          <Logo />
        </div>

        <nav aria-label="ניווט ראשי" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="rounded-md px-3 py-2 text-sm font-semibold text-fg transition hover:text-brand"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <ThemeToggle />
          <CartButton />
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="התקשרו אלינו בוואטסאפ"
            className="inline-flex h-10 items-center gap-1.5 rounded-full bg-brand px-3 text-sm font-bold sm:gap-2 sm:px-4 text-white shadow-sm transition hover:bg-brand-strong"
          >
            <WhatsAppIcon className="h-5 w-5" />
            <span>התקשרו</span>
          </a>
        </div>
      </div>
    </header>
  );
}
