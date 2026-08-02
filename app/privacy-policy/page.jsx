import LegalDocumentPage from "@/components/legal/legal-document-page";
import { privacyPolicyDocument } from "@/lib/legal-content";

export const metadata = {
  title: "Privacy Policy - ITrustLD",
  description: privacyPolicyDocument.description,
};

export default function PrivacyPolicyPage() {
  return <LegalDocumentPage document={privacyPolicyDocument} />;
}
