import { Link } from "react-router-dom";
import { ScrambleText } from "@/components/site/ScrambleText";

/* Absolutely minimal header: the wordmark, the one secondary destination
   (the technical report), and a single action. No page menu — the landing
   page is the surface. The two nav labels carry the matrix scramble on hover. */
export function Navigation() {
  return (
    <header className="fixed left-0 right-0 top-0 z-50 glass-nav">
      <nav className="mx-auto flex h-16 max-w-content items-center justify-between px-6 lg:px-8">
        <Link to="/" className="flex items-center" aria-label="Aurelius — home">
          <img
            src="/aure_logo.png"
            alt="Aurelius"
            width={1186}
            height={322}
            fetchPriority="high"
            decoding="async"
            className="h-5 w-auto"
          />
        </Link>

        <div className="flex items-center gap-1 sm:gap-3">
          <Link
            to="/technical-report"
            className="px-2 py-2 text-[13px] tracking-tight text-white/52 transition-colors duration-200 hover:text-white/90 sm:px-3"
          >
            <ScrambleText text="Technical Report" />
          </Link>
          <Link
            to="/safety"
            className="px-2 py-2 text-[13px] tracking-tight text-white/52 transition-colors duration-200 hover:text-white/90 sm:px-3"
          >
            <ScrambleText text="Safety" />
          </Link>
          <Link
            to="/contact"
            className="inline-flex h-9 items-center border border-border-strong px-3 text-[13px] tracking-tight text-foreground/90 transition-all duration-200 ease-premium hover:border-white/45 hover:text-foreground active:translate-y-px sm:px-4"
          >
            <ScrambleText text="Request access" />
          </Link>
        </div>
      </nav>
    </header>
  );
}
