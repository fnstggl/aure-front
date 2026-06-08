import { Link } from "react-router-dom";

const footerLinks = [
  { label: "How it works", href: "/how-it-works" },
  { label: "Safety", href: "/safety" },
  { label: "Shadow audit", href: "/shadow-audit" },
  { label: "Docs", href: "/docs" },
  { label: "Contact", href: "/contact" },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-content px-6 py-12 lg:px-8">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-xs">
            <Link to="/" className="flex items-center" aria-label="Aurelius — home">
              <img src="/aurelius_logo.png" alt="Aurelius" className="h-6 w-auto opacity-90" />
            </Link>
            <p className="mt-4 text-[13px] leading-relaxed text-white/42">
              The control layer for economically efficient GPU fleets. Shadow-mode first,
              constraint-aware by default.
            </p>
          </div>

          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-7 gap-y-2.5">
              {footerLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className="font-mono text-[12px] uppercase tracking-[0.08em] text-white/45 transition-colors duration-200 hover:text-white/80"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <span className="font-mono text-[11px] text-white/28">
            © {new Date().getFullYear()} Aurelius
          </span>
          <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-white/28">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-signal anim-breathe" aria-hidden />
            Shadow-mode · constraint-aware
          </span>
        </div>
      </div>
    </footer>
  );
}
