export const siteConfig = {
  name: "AutoSutra Shop",
  tagline: "India's Automotive Store",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
} as const;

export const mainNav = [
  { label: "Shop", href: "/categories" },
  { label: "Search", href: "/search" },
] as const;
