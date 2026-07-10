"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { requestOtp } from "@/actions/auth";
import { toast } from "sonner";

export function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";

  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [isPending, setIsPending] = useState(false);

  async function handleRequestCode(e: React.FormEvent) {
    e.preventDefault();
    setIsPending(true);
    const result = await requestOtp(email);
    setIsPending(false);
    if (result.success) {
      toast.success(result.message);
      setStep("code");
    } else {
      toast.error(result.message);
    }
  }

  async function handleVerifyCode(e: React.FormEvent) {
    e.preventDefault();
    setIsPending(true);
    const result = await signIn("otp", { email, code, redirect: false });
    setIsPending(false);
    if (result?.error) {
      toast.error("That code is incorrect or has expired.");
      return;
    }
    toast.success("Signed in.");
    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <div className="w-full max-w-sm space-y-6">
      <Button
        type="button"
        variant="outline"
        className="w-full gap-2"
        onClick={() => signIn("google", { callbackUrl })}
      >
        <svg viewBox="0 0 24 24" className="size-4">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.56c2.08-1.92 3.28-4.74 3.28-8.1z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.77c-.99.66-2.25 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.85A11 11 0 0 0 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.43.34-2.09V7.06H2.18A11 11 0 0 0 1 12c0 1.77.43 3.45 1.18 4.94z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1a11 11 0 0 0-9.82 6.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Continue with Google
      </Button>

      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <div className="h-px flex-1 bg-border" />
        or
        <div className="h-px flex-1 bg-border" />
      </div>

      {step === "email" ? (
        <form onSubmit={handleRequestCode} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full gap-2" disabled={isPending}>
            {isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Mail className="size-4" />
            )}
            Send code
          </Button>
        </form>
      ) : (
        <form onSubmit={handleVerifyCode} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="code">6-digit code</Label>
            <Input
              id="code"
              inputMode="numeric"
              required
              placeholder="000000"
              value={code}
              maxLength={6}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            />
            <p className="text-xs text-muted-foreground">
              Sent to {email}.{" "}
              <button
                type="button"
                className="underline"
                onClick={() => setStep("email")}
              >
                Use a different email
              </button>
            </p>
          </div>
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending && <Loader2 className="size-4 animate-spin" />}
            Verify and sign in
          </Button>
        </form>
      )}
    </div>
  );
}
