import Link from "next/link";
import { siteConfig } from "@/config/site";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div>
            <p className="text-sm font-semibold">{siteConfig.name}</p>
            <p className="text-xs text-muted-foreground">{siteConfig.tagline}</p>
          </div>
          <nav className="flex gap-6 text-xs text-muted-foreground">
            <Link href="/categories" className="hover:text-foreground">
              Shop
            </Link>
            <Link href="/account" className="hover:text-foreground">
              Account
            </Link>
          </nav>
        </div>
        <p className="mt-8 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
