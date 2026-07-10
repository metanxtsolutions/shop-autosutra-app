export function otpCodeEmailHtml(code: string) {
  return `
    <div style="font-family:sans-serif;max-width:420px;">
      <h2 style="font-size:18px;margin-bottom:8px;">Your AutoSutra Shop sign-in code</h2>
      <p style="color:#6b7280;font-size:14px;margin-bottom:20px;">
        Enter this code to finish signing in. It expires in 10 minutes.
      </p>
      <div style="font-size:32px;font-weight:700;letter-spacing:8px;background:#f4f4f5;padding:16px 24px;border-radius:8px;text-align:center;">
        ${code}
      </div>
      <p style="color:#9ca3af;font-size:12px;margin-top:20px;">
        If you did not request this code, you can safely ignore this email.
      </p>
    </div>
  `;
}
