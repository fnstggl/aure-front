import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ScrambleText } from "@/components/site/ScrambleText";

const navItems = [
  { label: "Platform", href: "/" },
  { label: "How it works", href: "/how-it-works" },
  { label: "Safety", href: "/safety" },
  { label: "Shadow audit", href: "/shadow-audit" },
  { label: "Benchmark", href: "/benchmark" },
  { label: "Docs", href: "/docs" },
];

export function Navigation() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed left-0 right-0 top-0 z-50 glass-nav">
      <nav className="mx-auto flex h-16 max-w-content items-center justify-between px-6 lg:px-8">
        <div className="flex items-center gap-10">
          <Link to="/" className="flex items-center" aria-label="Aurelius — home">
            <img src="/aure_logo.png" alt="Aurelius" className="h-5 w-auto" />
          </Link>
          <ul className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => {
              const active = location.pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className={cn(
                      "relative text-[13.5px] tracking-tight transition-colors duration-200",
                      active ? "text-foreground" : "text-white/48 hover:text-white/85",
                    )}
                  >
                    <ScrambleText text={item.label} />
                    {active && <span className="absolute -bottom-[7px] left-0 h-px w-full bg-signal/80" aria-hidden />}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/contact"
            className="inline-flex h-9 items-center border border-border-strong px-4 text-[13px] tracking-tight text-foreground/90 transition-all duration-200 ease-premium hover:border-signal/45 hover:text-foreground active:translate-y-px"
          >
            Request access
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-border-strong text-foreground/80 transition-colors hover:text-foreground md:hidden"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
              {open ? (
                <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              ) : (
                <path d="M2 4.5h12M2 8h12M2 11.5h12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {open && (
        <div className="border-t border-border bg-background/95 backdrop-blur-md md:hidden">
          <ul className="mx-auto max-w-content px-6 py-3">
            {navItems.map((item) => {
              const active = location.pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-2.5 py-2.5 text-[15px] tracking-tight transition-colors",
                      active ? "text-foreground" : "text-white/55 hover:text-foreground",
                    )}
                  >
                    {active && <span className="h-1 w-1 rounded-full bg-signal" aria-hidden />}
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </header>
  );
}
