import LegalDocumentPage from "@/components/legal/legal-document-page";
import { termsAndConditionsDocument } from "@/lib/legal-content";

export const metadata = {
  title: "Terms & Conditions - ITrustLD",
  description: termsAndConditionsDocument.description,
};

export default function TermsAndConditionsPage() {
  return <LegalDocumentPage document={termsAndConditionsDocument} />;
}
