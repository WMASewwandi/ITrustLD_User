import LegalDocumentPage from "@/components/legal/legal-document-page";
import { cookiePolicyDocument } from "@/lib/legal-content";

export const metadata = {
  title: "Cookie Policy - ITrustLD",
  description: cookiePolicyDocument.description,
};

export default function CookiePolicyPage() {
  return <LegalDocumentPage document={cookiePolicyDocument} />;
}
