import { Suspense } from "react";
import { SignInForm } from "@/components/auth/sign-in-form";

export const metadata = {
  title: "Sign In | AutoSutra Shop",
};

export default function SignInPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <h1 className="text-center text-2xl font-semibold tracking-tight">
          Sign in to AutoSutra Shop
        </h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Use Google or a one-time email code.
        </p>
        <div className="mt-8 flex justify-center">
          <Suspense fallback={<div className="h-64 w-full max-w-sm animate-pulse rounded-lg bg-muted" />}>
            <SignInForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
