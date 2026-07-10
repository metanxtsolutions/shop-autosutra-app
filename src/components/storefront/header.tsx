import Link from "next/link";
import { ShoppingCart, User } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { mainNav, siteConfig } from "@/config/site";

export async function Header() {
  const session = await auth();

  let cartCount = 0;
  if (session?.user?.id) {
    const cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
      include: { items: true },
    });
    cartCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
  }

  return (
    <header className="sticky top-0 z-40 h-16 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6 lg:px-8">
        <Link href="/" className="text-lg font-bold tracking-tight">
          {siteConfig.name}
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/cart"
            className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "relative")}
            aria-label="Cart"
          >
            <ShoppingCart className="size-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                {cartCount}
              </span>
            )}
          </Link>
          <Link
            href={session ? "/account" : "/sign-in"}
            className={buttonVariants({ variant: "ghost", size: "icon" })}
            aria-label={session ? "Account" : "Sign in"}
          >
            <User className="size-5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
