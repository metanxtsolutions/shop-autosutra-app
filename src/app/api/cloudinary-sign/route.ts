import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { cloudinary } from "@/services/cloudinary";

// The API secret never reaches the browser: the client uploads directly to
// Cloudinary using a short-lived signature generated here, only for
// authenticated admins.
export async function GET() {
  const session = await auth();
  if (session?.user.role !== "ADMIN" && session?.user.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const timestamp = Math.round(Date.now() / 1000);
  const folder = "autosutra-shop/products";

  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder },
    process.env.CLOUDINARY_API_SECRET ?? "",
  );

  return NextResponse.json({
    signature,
    timestamp,
    folder,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
  });
}
