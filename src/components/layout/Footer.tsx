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
      <div className="relative z-10 mx-auto max-w-content px-6 pt-10 pb-0 lg:px-8">
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

        <p className="mt-6 text-[clamp(3.5rem,10vw,9rem)] font-bold leading-[0.9] tracking-tight text-white">
          Forecast. Simulate. Decide.
        </p>
      </div>
    </footer>
  );
}
