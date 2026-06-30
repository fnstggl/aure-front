import { Link } from "react-router-dom";

const footerLinks = [
  { label: "Technical Report", href: "/technical-report" },
  { label: "Get Access", href: "/contact" },
  { label: "Privacy", href: "/privacy" },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-border bg-background">
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
      <div className="relative z-10 pt-10 pb-0">
        <div className="mx-auto max-w-content px-6 lg:px-8">
          <nav aria-label="Footer" className="flex justify-end">
            <ul className="flex flex-wrap gap-x-8 gap-y-3">
              {footerLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className="font-mono text-[11px] uppercase tracking-[0.06em] text-white/48 transition-colors duration-200 hover:text-white/85"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* headline: pl-0 so "F" sits exactly on the grid line */}
        <div className="mx-auto max-w-content pl-0 pr-6 lg:pr-8">
          <p className="mt-4 whitespace-nowrap text-[clamp(2rem,6.5vw,9rem)] font-normal leading-none tracking-[-0.03em] text-foreground">
            Forecast. Simulate. Decide.
          </p>
          <div className="mt-3 pb-8 flex flex-col gap-1">
            <span className="text-[10px] font-normal tracking-[0.02em] text-white/30">
              Predictive orchestration for AI infrastructure.
            </span>
            <span className="text-[10px] font-normal tracking-[0.02em] text-white/30">
              © {new Date().getFullYear()} Aurelius
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
