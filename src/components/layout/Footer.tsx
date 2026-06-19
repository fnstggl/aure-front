import { Link } from "react-router-dom";

const footerLinks = [
  { label: "How it works", href: "/how-it-works" },
  { label: "Benchmark", href: "/benchmark" },
  { label: "Safety", href: "/safety" },
  { label: "Shadow audit", href: "/shadow-audit" },
  { label: "Docs", href: "/docs" },
  { label: "Contact", href: "/contact" },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-content px-6 py-14 lg:px-8">
        <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-xs">
            <Link to="/" className="flex items-center" aria-label="Aurelius — home">
              <img src="/aure_logo.png" alt="Aurelius" className="h-5 w-auto" />
            </Link>
            <p className="mt-4 text-[13.5px] leading-relaxed text-white/42">
              The control layer for economically efficient GPU fleets. Shadow-mode first,
              constraint-aware by default.
            </p>
          </div>

          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-8 gap-y-3">
              {footerLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className="text-[13.5px] tracking-tight text-white/48 transition-colors duration-200 hover:text-white/85"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <span className="flex items-center gap-4 font-mono text-[11px] text-white/28">
            <span>© {new Date().getFullYear()} Aurelius</span>
            <Link
              to="/privacy"
              className="tracking-tight transition-colors duration-200 hover:text-white/60"
            >
              Privacy Policy
            </Link>
          </span>
          <span className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.16em] text-white/30">
            <span className="spectrum-dot inline-block h-1 w-1" aria-hidden />
            Shadow-mode · constraint-aware
          </span>
        </div>
      </div>
    </footer>
  );
}
