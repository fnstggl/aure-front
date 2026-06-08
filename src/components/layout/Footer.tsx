import { Link } from "react-router-dom";

const footerLinks = [
  { label: "Security", href: "/safety" },
  { label: "Docs", href: "/docs" },
  { label: "Contact", href: "/contact" },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-background py-12">
      <div className="container mx-auto flex flex-col items-center justify-between gap-6 px-6 sm:flex-row lg:px-8">
       <Link to="/" className="flex items-center">
  <img
    src="/aurelius_logo.png"
    alt="Aurelius"
    className="h-6 w-auto opacity-90"
  />
</Link>
        <ul className="flex items-center gap-8">
          {footerLinks.map((item) => (
            <li key={item.href}>
              <Link
                to={item.href}
                className="text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
