import { Link, useLocation } from "react-router-dom";

const navItems = [
  { label: "Product", href: "/" },
  { label: "How it works", href: "/how-it-works" },
  { label: "Safety", href: "/safety", emphasis: true },
  { label: "Docs", href: "/docs" },
];

export function Navigation() {
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-nav">
      <nav className="container mx-auto flex h-20 items-center justify-between px-6 lg:px-8">
        <div className="flex items-center gap-12">
        <Link to="/" className="flex items-center">
<img
  src="/aurelius_logo.png"
  alt="Aurelius"
  className="h-7 w-auto translate-y-[1px]"
/>
</Link>
          <ul className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className={`text-sm transition-colors duration-150 ${
                    location.pathname === item.href
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  } ${item.emphasis ? "font-medium hover:underline underline-offset-4" : ""}`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}
