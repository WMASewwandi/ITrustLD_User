import { redirect } from "next/navigation";

export default async function JoinAffiliatePage({ params }) {
  const { affiliate_code: affiliateCode } = await params;
  redirect(`/register?code=${encodeURIComponent(affiliateCode || "")}`);
}
