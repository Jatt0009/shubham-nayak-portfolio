import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-6 py-24 text-center text-foreground">
      <p className="font-mono text-xs font-bold uppercase tracking-[0.35em] text-secondary">404</p>
      <h1 className="mt-4 font-heading text-4xl font-bold tracking-tight md:text-5xl">Page not found</h1>
      <p className="mt-4 max-w-md text-lg text-secondary">
        That URL does not exist on this site. Head back home to explore the portfolio.
      </p>
      <Link
        href="/"
        className="interactive mt-10 inline-flex items-center justify-center rounded-full bg-foreground px-8 py-3.5 text-sm font-semibold text-background transition-opacity hover:opacity-90"
      >
        Back to home
      </Link>
    </main>
  );
}
