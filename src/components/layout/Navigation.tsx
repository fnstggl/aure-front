import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Platform", href: "/" },
  { label: "How it works", href: "/how-it-works" },
  { label: "Safety", href: "/safety" },
  { label: "Shadow audit", href: "/shadow-audit" },
  { label: "Docs", href: "/docs" },
];

export function Navigation() {
  const location = useLocation();

  return (
    <header className="fixed left-0 right-0 top-0 z-50 glass-nav">
      <nav className="mx-auto flex h-16 max-w-content items-center justify-between px-6 lg:px-8">
        <div className="flex items-center gap-10">
          <Link to="/" className="flex items-center" aria-label="Aurelius — home">
            <img src="/aurelius_logo.png" alt="Aurelius" className="h-6 w-auto translate-y-[1px]" />
          </Link>
          <ul className="hidden items-center gap-7 md:flex">
            {navItems.map((item) => {
              const active = location.pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className={cn(
                      "relative font-mono text-[12px] uppercase tracking-[0.08em] transition-colors duration-200",
                      active ? "text-foreground" : "text-white/45 hover:text-white/80",
                    )}
                  >
                    {item.label}
                    {active && (
                      <span className="absolute -bottom-1.5 left-0 h-px w-full bg-signal" aria-hidden />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <Link
          to="/contact"
          className="inline-flex h-9 items-center rounded-md border border-border-strong px-4 font-mono text-[12px] uppercase tracking-[0.08em] text-foreground transition-all duration-200 ease-premium hover:border-white/30 hover:bg-white/[0.04] active:translate-y-px"
        >
          Request access
        </Link>
      </nav>
    </header>
  );
}
