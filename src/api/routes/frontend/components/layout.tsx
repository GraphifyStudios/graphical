import type { Child } from "hono/jsx";
import { useRequestContext } from "hono/jsx-renderer";

const links = [{ href: "/lb", text: "Leaderboard" }];

function Navbar() {
  const c = useRequestContext();
  const { pathname } = new URL(c.req.url);

  return (
    <header className="border-b border-blue-900/80">
      <div class="container flex items-center justify-between px-6 py-3">
        <nav class="flex items-center gap-4">
          <a href="/">
            <p class="text-xl font-bold tracking-tighter text-blue-500 transition-all hover:opacity-80">
              Graphical
            </p>
          </a>
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              class={`text-sm text-slate-50/50 transition-all hover:!text-slate-50/80 ${pathname === link.href ? "font-medium !text-slate-50" : ""}`}
            >
              {link.text}{" "}
            </a>
          ))}
        </nav>
        <div></div>
      </div>
      <div class="font-medium" />
    </header>
  );
}

export function Layout({ children }: { children: Child }) {
  return (
    <html class="bg-black">
      <head>
        <link rel="stylesheet" href="/static/styles.css" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body class="min-h-screen bg-blue-950/50 text-slate-50">
        <Navbar />
        <main class="container px-6 py-4">{children}</main>
      </body>
    </html>
  );
}
