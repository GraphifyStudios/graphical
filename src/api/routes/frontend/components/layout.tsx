import type { Child } from "hono/jsx";

function Navbar() {
  return (
    <header className="border-b border-blue-900/80">
      <div class="container px-6 py-3 flex items-center justify-between">
        <nav class="flex items-center gap-4">
          <a href="/">
            <p class="text-xl font-bold tracking-tighter text-blue-500 transition-all hover:opacity-80">
              Graphical
            </p>
          </a>
          <a href="/lb">
            <p class="text-sm transition-all hover:opacity-80">
              Leaderboard
            </p>
          </a>
        </nav>
        <div></div>
      </div>
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
