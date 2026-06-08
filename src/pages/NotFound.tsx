import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 bg-dotgrid opacity-50" aria-hidden />
      <div className="pointer-events-none absolute inset-0 hero-vignette" aria-hidden />
      <div className="relative text-center">
        <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-signal">
          404 · route not found
        </div>
        <h1 className="mt-5 text-[clamp(2.5rem,8vw,4rem)] font-medium tracking-tight text-foreground">
          No decision path here
        </h1>
        <p className="mx-auto mt-4 max-w-sm text-[14px] text-white/55">
          The page you requested does not exist. Return to the control layer.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex h-11 items-center rounded-md bg-foreground px-6 text-sm font-medium tracking-tight text-background transition-all duration-200 ease-premium hover:bg-white active:translate-y-px"
        >
          Return home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
