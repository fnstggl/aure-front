import { Link } from "react-router-dom";

const footerLinks = [
  { label: "Technical Report", href: "/technical-report" },
  { label: "Request access", href: "/contact" },
  { label: "Privacy", href: "/privacy" },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-border bg-background">
      {/* decorative dotted hand, bottom-right corner */}
      <img
        src="/hand-dots.png"
        alt=""
        aria-hidden
        width={2880}
        height={1620}
        loading="lazy"
        decoding="async"
        className="pointer-events-none absolute bottom-0 -right-[80px] z-0 block w-[230px] select-none opacity-80 sm:-right-[120px] sm:w-[360px]"
        onError={(e) => {
          e.currentTarget.style.display = "none";
        }}
      />
      <div className="relative z-10 mx-auto max-w-content px-6 py-14 lg:px-8">
        <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-xs">
            <Link to="/" className="flex items-center" aria-label="Aurelius home">
              <img
                src="/aure_logo.png"
                alt="Aurelius"
                width={1186}
                height={322}
                loading="lazy"
                decoding="async"
                className="h-5 w-auto"
              />
            </Link>
            <p className="mt-4 text-[13.5px] leading-relaxed text-white/42">
              Predictive orchestration for AI infrastructure. Forecast first.
              Simulate before execution.
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

        <div className="mt-12 flex flex-col gap-3 border-t border-border pt-6">
          <span className="font-mono text-[11px] text-white/28">© {new Date().getFullYear()} Aurelius</span>
          <span className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.16em] text-white/30">
            <span className="inline-block h-1 w-1 bg-white/30" aria-hidden />
            Forecast → Simulate → Decide
          </span>
        </div>
      </div>
    </footer>
  );
}
