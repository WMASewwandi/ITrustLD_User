"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Clock3, Info } from "lucide-react";
import UploadSlot from "@/components/verify/upload-slot";
import VerificationArt from "@/components/verify/verification-art";
import {
  ADDRESS_DOC_TYPES,
  ADDRESS_TYPE_FROM_API,
  ADDRESS_TYPE_TO_API,
  formatVerificationEnum,
  IDENTITY_DOC_TYPES,
  IDENTITY_TYPE_FROM_API,
  IDENTITY_TYPE_TO_API,
  isNationalId,
  needsAddressDocumentUpload,
  needsIdentityDocumentUpload,
  saveVerification,
} from "@/lib/verification";
import {
  fetchVerificationStatus,
  sendVerificationEmail,
  sendVerificationSms,
  updateUserSession,
  uploadVerificationDocuments,
  verifyEmailCode,
  verifyMobileCode,
} from "@/lib/auth";

const inputClass =
  "w-full rounded-lg border border-[#D7DEE8] bg-[#F3F5F8] px-3 py-2.5 text-sm text-theme-black outline-none transition focus:border-theme-blue-dark focus:bg-white";
const labelClass = "mb-1.5 block text-sm font-medium text-theme-black";

function RequiredLabel({ children }) {
  return (
    <label className={labelClass}>
      {children} <span className="text-theme-red-action">*</span>
    </label>
  );
}

function PrimaryButton({ children, className = "", ...props }) {
  return (
    <button
      type="button"
      className={`rounded-lg bg-theme-green-action px-6 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

function SecondaryButton({ children, className = "", ...props }) {
  return (
    <button
      type="button"
      className={`rounded-lg border border-theme-black/80 bg-white px-6 py-2.5 text-sm font-semibold text-theme-black transition hover:bg-[#F7F9FC] ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

function verificationStatusClass(status) {
  if (status === "VERIFIED") return "text-theme-green-dark";
  if (status === "REJECTED") return "text-theme-red-action";
  return "text-theme-orange";
}

function DocumentStatusRows({ accountHolder }) {
  if (!accountHolder) return null;

  const identityReason =
    accountHolder.identity_verification === "REJECTED"
      ? accountHolder.identity_verification_rejection_message ||
        accountHolder.identity_verification_rejection_title
      : null;
  const addressReason =
    accountHolder.address_verification === "REJECTED"
      ? accountHolder.address_verification_rejection_message ||
        accountHolder.address_verification_rejection_title
      : null;

  return (
    <div className="pt-1">
      <p className="font-semibold text-theme-red-action">Document verification</p>
      {accountHolder.identity_document_name ? (
        <div className="mt-2">
          <p className="text-theme-black">
            <span className="inline-flex items-center gap-1.5">
              <Check className="h-4 w-4 text-theme-green-action" />
              Identity: {formatVerificationEnum(accountHolder.identity_document_type)}{" "}
              {formatVerificationEnum(accountHolder.identity_document_status)}
            </span>{" "}
            <span className={`font-semibold ${verificationStatusClass(accountHolder.identity_verification)}`}>
              {formatVerificationEnum(accountHolder.identity_verification)}
            </span>
          </p>
          {identityReason ? (
            <p className="mt-1 pl-6 text-xs text-theme-red-action">{identityReason}</p>
          ) : null}
        </div>
      ) : (
        <p className="mt-2 text-theme-gray">Identity: Not uploaded yet</p>
      )}
      {accountHolder.address_document_name ? (
        <div className="mt-1">
          <p className="text-theme-black">
            <span className="inline-flex items-center gap-1.5">
              <Check className="h-4 w-4 text-theme-green-action" />
              Address: {formatVerificationEnum(accountHolder.address_document_type)}{" "}
              {formatVerificationEnum(accountHolder.address_document_status)}
            </span>{" "}
            <span className={`font-semibold ${verificationStatusClass(accountHolder.address_verification)}`}>
              {formatVerificationEnum(accountHolder.address_verification)}
            </span>
          </p>
          {addressReason ? (
            <p className="mt-1 pl-6 text-xs text-theme-red-action">{addressReason}</p>
          ) : null}
        </div>
      ) : (
        <p className="mt-1 text-theme-gray">Address: Not uploaded yet</p>
      )}
    </div>
  );
}

function SubmittedDocumentCard({ title, documentType, status, reason }) {
  return (
    <div className="min-w-0 rounded-xl border border-[#D7DEE8] bg-[#F7F9FC] px-4 py-5">
      <h2 className="text-base font-semibold text-theme-black">{title}</h2>
      <p className="mt-3 text-sm text-theme-black">
        Previously uploaded:{" "}
        <span className="font-medium">{formatVerificationEnum(documentType) || "Document"}</span>
      </p>
      <p className="mt-2 text-sm">
        Status:{" "}
        <span className={`font-semibold ${verificationStatusClass(status)}`}>
          {formatVerificationEnum(status)}
        </span>
      </p>
      {reason ? <p className="mt-2 text-xs text-theme-red-action">{reason}</p> : null}
      {status === "VERIFIED" ? (
        <p className="mt-3 text-xs text-theme-gray">No re-upload needed for this document.</p>
      ) : null}
    </div>
  );
}

export default function AccountVerification() {
  const router = useRouter();
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [emailCode, setEmailCode] = useState("");
  const [phoneCode, setPhoneCode] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [identityType, setIdentityType] = useState("");
  const [addressType, setAddressType] = useState("");
  const [identityFront, setIdentityFront] = useState(null);
  const [identityBack, setIdentityBack] = useState(null);
  const [identityFile, setIdentityFile] = useState(null);
  const [addressFile, setAddressFile] = useState(null);
  const [accountHolder, setAccountHolder] = useState(null);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [ready, setReady] = useState(false);
  const [sending, setSending] = useState(false);

  const nationalId = useMemo(() => isNationalId(identityType), [identityType]);

  const needIdentityUpload = needsIdentityDocumentUpload(accountHolder);
  const needAddressUpload = needsAddressDocumentUpload(accountHolder);

  function applyCachedUser(user) {
    const ah = user?.account_holder;
    setAccountHolder(ah || null);
    setEmail(ah?.email || user?.email || "");
    setPhone(String(ah?.mobile_number || "").replace(/\s/g, ""));
    setEmailVerified(ah?.email_verification === "VERIFIED");
    setPhoneVerified(ah?.mobile_number_verification === "VERIFIED");
    if (ah?.identity_document_type) {
      setIdentityType(IDENTITY_TYPE_FROM_API[ah.identity_document_type] || "");
    }
    if (ah?.address_document_type) {
      setAddressType(ADDRESS_TYPE_FROM_API[ah.address_document_type] || "");
    }
    if (ah?.email_verification !== "VERIFIED") setStep("email");
    else if (ah?.mobile_number_verification !== "VERIFIED") setStep("phone");
    else if (
      ah?.identity_verification === "REJECTED" ||
      ah?.address_verification === "REJECTED"
    ) {
      setStep("documents");
    } else if (
      ah?.identity_document_status === "RECEIVED" &&
      ah?.address_document_status === "RECEIVED"
    ) {
      setStep("pending");
    } else if (ah?.mobile_number_verification === "VERIFIED") setStep("documents");
    else setStep("email");
  }

  function applyVerificationStep(serverStep, user) {
    const ah = user?.account_holder;
    const emailValue = ah?.email || user?.email || "";
    const phoneValue = ah?.mobile_number || "";

    setAccountHolder(ah || null);
    setEmail(emailValue);
    setPhone(String(phoneValue).replace(/\s/g, ""));
    setEmailVerified(ah?.email_verification === "VERIFIED");
    setPhoneVerified(ah?.mobile_number_verification === "VERIFIED");

    if (ah?.identity_document_type) {
      setIdentityType(IDENTITY_TYPE_FROM_API[ah.identity_document_type] || "");
    }
    if (ah?.address_document_type) {
      setAddressType(ADDRESS_TYPE_FROM_API[ah.address_document_type] || "");
    }

    if (serverStep === "complete") {
      router.replace("/dashboard");
      return;
    }
    if (serverStep === "pending") {
      setStep("pending");
    } else if (serverStep === "documents") {
      setStep("documents");
    } else if (serverStep === "phone") {
      setStep("phone");
    } else {
      setStep("email");
    }
  }

  useEffect(() => {
    let cancelled = false;

    try {
      const raw = localStorage.getItem("itrustld_user");
      const cached = raw ? JSON.parse(raw) : null;
      if (cached) applyCachedUser(cached);
    } catch {
      setStep("email");
    }
    setReady(true);

    async function load() {
      try {
        const res = await fetchVerificationStatus();
        if (cancelled) return;
        if (res.user) updateUserSession(res.user);
        applyVerificationStep(res.step, res.user);
      } catch {
        // Cached form is already visible if the API is unreachable.
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [router]);

  function persist(partial) {
    const next = {
      email,
      phone,
      emailVerified,
      phoneVerified,
      identityType,
      addressType,
      identityFront,
      identityBack,
      identityFile,
      addressFile,
      status: step === "pending" ? "pending" : "unverified",
      ...partial,
    };
    saveVerification(next);
  }

  async function sendEmailCode() {
    setError("");
    setInfo("");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Enter a valid email address.");
      return;
    }
    setSending(true);
    try {
      await sendVerificationEmail(email.trim());
      persist({ email: email.trim() });
      // Temporary: do not show OTP in the UI for email verification — customer receives it by email.
      setInfo(`Verification code sent to ${email.trim()}.`);
      setStep("email-code");
    } catch (err) {
      setError(err.message || "Failed to send verification code.");
    } finally {
      setSending(false);
    }
  }

  async function confirmEmail() {
    setError("");
    if (!emailCode.trim()) {
      setError("Enter the verification code from your email.");
      return;
    }
    setSending(true);
    try {
      const result = await verifyEmailCode(email.trim(), emailCode.trim());
      if (result.user) updateUserSession(result.user);
      setEmailVerified(true);
      persist({ emailVerified: true, email: email.trim() });
      setEmailCode("");
      setInfo("");
      setStep("phone");
    } catch (err) {
      setError(err.message || "Invalid verification code. Please try again.");
    } finally {
      setSending(false);
    }
  }

  async function sendPhoneCode() {
    setError("");
    setInfo("");
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 9) {
      setError("Enter a valid mobile number.");
      return;
    }
    setSending(true);
    try {
      const result = await sendVerificationSms(phone);
      persist({ phone, emailVerified: true });
      if (result.dev_code) {
        setInfo(
          `Development mode: your verification code is ${result.dev_code}. (SMS not sent — configure SMS for real delivery.)`
        );
      } else {
        setInfo(`Verification code sent to ${phone}.`);
      }
      setStep("phone-code");
    } catch (err) {
      setError(err.message || "Failed to send verification code.");
    } finally {
      setSending(false);
    }
  }

  async function confirmPhone() {
    setError("");
    if (!phoneCode.trim()) {
      setError("Enter the verification code from your SMS.");
      return;
    }
    setSending(true);
    try {
      const result = await verifyMobileCode(phone, phoneCode.trim());
      if (result.user) updateUserSession(result.user);
      setPhoneVerified(true);
      persist({ phoneVerified: true, emailVerified: true, phone });
      setPhoneCode("");
      setInfo("");
      setStep("documents");
    } catch (err) {
      setError(err.message || "Invalid verification code. Please try again.");
    } finally {
      setSending(false);
    }
  }

  async function submitDocuments() {
    setError("");
    setInfo("");

    const uploadingIdentity = needIdentityUpload;
    const uploadingAddress = needAddressUpload;

    if (!uploadingIdentity && !uploadingAddress) {
      setStep("pending");
      return;
    }

    if (uploadingIdentity) {
      if (!identityType) {
        setError("Select an identity document type.");
        return;
      }
      if (nationalId) {
        if (!identityFront?.file || !identityBack?.file) {
          setError("Upload both front and back of your National ID.");
          return;
        }
      } else if (!identityFile?.file) {
        setError("Upload your identity document.");
        return;
      }
    }

    if (uploadingAddress) {
      if (!addressType) {
        setError("Select an address document type.");
        return;
      }
      if (!addressFile?.file) {
        setError("Upload your address document.");
        return;
      }
    }

    setSending(true);
    try {
      const result = await uploadVerificationDocuments({
        identity_document_type: uploadingIdentity
          ? IDENTITY_TYPE_TO_API[identityType]
          : undefined,
        address_document_type: uploadingAddress ? ADDRESS_TYPE_TO_API[addressType] : undefined,
        identity_document: uploadingIdentity
          ? nationalId
            ? identityFront.file
            : identityFile.file
          : undefined,
        identity_document_back:
          uploadingIdentity && nationalId ? identityBack.file : undefined,
        address_document: uploadingAddress ? addressFile.file : undefined,
      });

      if (result.user) {
        updateUserSession(result.user);
        setAccountHolder(result.user.account_holder || null);
      }

      persist({
        emailVerified: true,
        phoneVerified: true,
        identityType,
        addressType,
        status: result.step === "pending" ? "pending" : "unverified",
      });

      if (result.step === "pending") {
        setStep("pending");
      } else {
        setIdentityFront(null);
        setIdentityBack(null);
        setIdentityFile(null);
        setAddressFile(null);
        setInfo("Documents uploaded. Please upload the remaining document(s) to complete submission.");
        setStep("documents");
      }
    } catch (err) {
      setError(err.message || "Failed to upload documents.");
    } finally {
      setSending(false);
    }
  }

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white text-sm text-theme-black/60">
        Loading verification…
      </div>
    );
  }

  const showDocsForm = step === "documents";
  const showPending = step === "pending";

  return (
    <div className="min-h-screen bg-white text-theme-black">
      <div className="bg-theme-orange px-4 py-2.5 text-center text-sm font-semibold text-white sm:text-base">
        Your Account is not verified yet! Verify Now.
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
        {!showDocsForm && !showPending ? (
          <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-14">
            <div>
              <h1 className="text-3xl font-bold text-theme-black sm:text-4xl">Account Verification</h1>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-theme-black/75 sm:text-[15px]">
                As a regulated company, These procedures involve the collection of adequate documentation from our
                clients with regards to KYC (Know Your Client), including the collection of a valid ID card and a
                recent (within 6 months) utility bill or bank account statement that confirms the address the client
                has registered.
              </p>
              <VerificationArt className="mt-8 hidden sm:block" />
            </div>

            <div className="min-w-0">
              {emailVerified ? (
                <div className="mb-5">
                  <p className="text-base font-semibold text-theme-black">Your email has been verified!</p>
                  <p className="mt-1 text-sm text-theme-gray">{email}</p>
                </div>
              ) : null}

              {step === "email" || step === "email-code" ? (
                <>
                  <p className="text-sm leading-relaxed text-theme-black/75">
                    Please enter your email address to begin the verification process. Please note that this process
                    may take several minutes.
                  </p>
                  <div className="mt-5">
                    <RequiredLabel>Email</RequiredLabel>
                    <input
                      type="email"
                      className={inputClass}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      readOnly={step === "email-code"}
                    />
                  </div>
                  {step === "email-code" ? (
                    <div className="mt-4">
                      <input
                        className={inputClass}
                        placeholder="Enter verification code"
                        value={emailCode}
                        onChange={(e) => setEmailCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                        inputMode="numeric"
                      />
                    </div>
                  ) : null}
                  {error ? <p className="mt-3 text-sm text-theme-red-action">{error}</p> : null}
                  {info ? <p className="mt-3 text-sm text-theme-green-dark">{info}</p> : null}
                  <div className="mt-6 flex flex-wrap justify-end gap-3">
                    {step === "email" ? (
                      <PrimaryButton onClick={sendEmailCode} disabled={sending}>
                        {sending ? "Sending…" : "Send"}
                      </PrimaryButton>
                    ) : (
                      <>
                        <SecondaryButton
                          onClick={sendEmailCode}
                          disabled={sending}
                        >
                          {sending ? "Sending…" : "Re-Send"}
                        </SecondaryButton>
                        <PrimaryButton onClick={confirmEmail} disabled={sending}>
                          {sending ? "Verifying…" : "Confirm"}
                        </PrimaryButton>
                      </>
                    )}
                  </div>
                </>
              ) : null}

              {step === "phone" || step === "phone-code" ? (
                <>
                  <p className="text-sm leading-relaxed text-theme-black/75">
                    Please enter your mobile number to begin the verification process. Please note that this process
                    may take several minutes.
                  </p>
                  <div className="mt-5">
                    <RequiredLabel>{step === "phone-code" ? "Mobile Number" : "Phone Number"}</RequiredLabel>
                    <input
                      className={inputClass}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/[^\d+]/g, ""))}
                      placeholder="+94757848285"
                      readOnly={step === "phone-code"}
                    />
                  </div>
                  {step === "phone-code" ? (
                    <div className="mt-4">
                      <input
                        className={inputClass}
                        placeholder="Enter verification code"
                        value={phoneCode}
                        onChange={(e) => setPhoneCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                        inputMode="numeric"
                      />
                    </div>
                  ) : null}
                  {error ? <p className="mt-3 text-sm text-theme-red-action">{error}</p> : null}
                  {info ? <p className="mt-3 text-sm text-theme-green-dark">{info}</p> : null}
                  <div className="mt-6 flex flex-wrap justify-end gap-3">
                    {step === "phone" ? (
                      <PrimaryButton onClick={sendPhoneCode} disabled={sending}>
                        {sending ? "Sending…" : "Send"}
                      </PrimaryButton>
                    ) : (
                      <>
                        <SecondaryButton
                          onClick={() => {
                            setPhoneCode("");
                            setError("");
                            setInfo("");
                            setStep("phone");
                          }}
                        >
                          Go Back
                        </SecondaryButton>
                        <PrimaryButton onClick={confirmPhone} disabled={sending}>
                          {sending ? "Verifying…" : "Confirm"}
                        </PrimaryButton>
                      </>
                    )}
                  </div>
                </>
              ) : null}
            </div>
          </div>
        ) : null}

        {showDocsForm || showPending ? (
          <>
            <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-12">
              <div>
                <h1 className="text-3xl font-bold text-theme-black sm:text-4xl">Account Verification</h1>
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-theme-black/75 sm:text-[15px]">
                  As a regulated company, These procedures involve the collection of adequate documentation from our
                  clients with regards to KYC (Know Your Client), including the collection of a valid ID card and a
                  recent (within 6 months) utility bill or bank account statement that confirms the address the
                  client has registered.
                </p>
              </div>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-semibold text-theme-black">Your email has been verified!</p>
                  <p className="mt-1 inline-flex items-center gap-2 text-theme-gray">
                    <Check className="h-4 w-4 text-theme-green-action" />
                    {email}
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-theme-black">Your phone number has been verified!</p>
                  <p className="mt-1 inline-flex items-center gap-2 text-theme-gray">
                    <Check className="h-4 w-4 text-theme-green-action" />
                    {phone}
                  </p>
                </div>
                <DocumentStatusRows accountHolder={accountHolder} />
              </div>
            </div>

            <div className="relative my-10">
              <div className="absolute inset-0 flex items-center" aria-hidden>
                <div className="w-full border-t border-[#D7DEE8]" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-4 text-sm font-medium text-theme-gray">Document Verification</span>
              </div>
            </div>

            {showDocsForm ? (
              <>
                <div className="grid gap-8 lg:grid-cols-2">
                  {needIdentityUpload ? (
                    <div className="min-w-0">
                      <h2 className="text-base font-semibold text-theme-black">Confirm your identity</h2>
                      {accountHolder?.identity_document_name ? (
                        <div className="mt-3 rounded-lg border border-theme-orange/30 bg-theme-orange/5 px-3 py-2 text-xs text-theme-black">
                          <p>
                            Previously uploaded:{" "}
                            <span className="font-medium">
                              {formatVerificationEnum(accountHolder.identity_document_type)}
                            </span>{" "}
                            (
                            <span className={verificationStatusClass(accountHolder.identity_verification)}>
                              {formatVerificationEnum(accountHolder.identity_verification)}
                            </span>
                            )
                          </p>
                          {accountHolder.identity_verification === "REJECTED" &&
                          (accountHolder.identity_verification_rejection_message ||
                            accountHolder.identity_verification_rejection_title) ? (
                            <p className="mt-1 text-theme-red-action">
                              {accountHolder.identity_verification_rejection_message ||
                                accountHolder.identity_verification_rejection_title}
                            </p>
                          ) : null}
                          <p className="mt-1 text-theme-gray">Please upload a new document below.</p>
                        </div>
                      ) : null}
                      <select
                        className={`${inputClass} mt-3`}
                        value={identityType}
                        onChange={(e) => {
                          setIdentityType(e.target.value);
                          setIdentityFront(null);
                          setIdentityBack(null);
                          setIdentityFile(null);
                          setError("");
                        }}
                      >
                        <option value="">Select Document Type</option>
                        {IDENTITY_DOC_TYPES.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>

                      {identityType ? (
                        nationalId ? (
                          <div className="mt-4 grid gap-4 sm:grid-cols-2">
                            <UploadSlot
                              label="Front"
                              value={identityFront}
                              onChange={setIdentityFront}
                              onError={setError}
                            />
                            <UploadSlot
                              label="Back"
                              value={identityBack}
                              onChange={setIdentityBack}
                              onError={setError}
                            />
                          </div>
                        ) : (
                          <div className="mt-4">
                            <UploadSlot
                              value={identityFile}
                              onChange={setIdentityFile}
                              onError={setError}
                            />
                          </div>
                        )
                      ) : null}
                    </div>
                  ) : accountHolder?.identity_document_name ? (
                    <SubmittedDocumentCard
                      title="Identity document"
                      documentType={accountHolder.identity_document_type}
                      status={accountHolder.identity_verification}
                    />
                  ) : null}

                  {needAddressUpload ? (
                    <div className="min-w-0">
                      <h2 className="text-base font-semibold text-theme-black">
                        Confirm your address identity
                      </h2>
                      {accountHolder?.address_document_name ? (
                        <div className="mt-3 rounded-lg border border-theme-orange/30 bg-theme-orange/5 px-3 py-2 text-xs text-theme-black">
                          <p>
                            Previously uploaded:{" "}
                            <span className="font-medium">
                              {formatVerificationEnum(accountHolder.address_document_type)}
                            </span>{" "}
                            (
                            <span className={verificationStatusClass(accountHolder.address_verification)}>
                              {formatVerificationEnum(accountHolder.address_verification)}
                            </span>
                            )
                          </p>
                          {accountHolder.address_verification === "REJECTED" &&
                          (accountHolder.address_verification_rejection_message ||
                            accountHolder.address_verification_rejection_title) ? (
                            <p className="mt-1 text-theme-red-action">
                              {accountHolder.address_verification_rejection_message ||
                                accountHolder.address_verification_rejection_title}
                            </p>
                          ) : null}
                          <p className="mt-1 text-theme-gray">Please upload a new document below.</p>
                        </div>
                      ) : null}
                      <select
                        className={`${inputClass} mt-3`}
                        value={addressType}
                        onChange={(e) => {
                          setAddressType(e.target.value);
                          setAddressFile(null);
                          setError("");
                        }}
                      >
                        <option value="">Select Document Type</option>
                        {ADDRESS_DOC_TYPES.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>

                      {addressType ? (
                        <div className="mt-4">
                          <UploadSlot
                            value={addressFile}
                            onChange={setAddressFile}
                            onError={setError}
                          />
                        </div>
                      ) : null}
                    </div>
                  ) : accountHolder?.address_document_name ? (
                    <SubmittedDocumentCard
                      title="Address document"
                      documentType={accountHolder.address_document_type}
                      status={accountHolder.address_verification}
                    />
                  ) : null}
                </div>

                {error ? <p className="mt-4 text-sm text-theme-red-action">{error}</p> : null}
                {info ? <p className="mt-4 text-sm text-theme-green-dark">{info}</p> : null}

                {needIdentityUpload || needAddressUpload ? (
                  <div className="mt-8 flex justify-end">
                    <PrimaryButton onClick={submitDocuments} disabled={sending}>
                      {sending ? "Uploading…" : "Submit"}
                    </PrimaryButton>
                  </div>
                ) : null}
                <p className="mt-4 text-center text-xs text-theme-gray sm:text-left">
                  Please note that the verification process may take up to 24 hours.
                </p>
              </>
            ) : (
              <div className="flex flex-col items-center py-10 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-[#C5CDD8] text-[#8A94A6]">
                  <Clock3 className="h-9 w-9" strokeWidth={1.5} />
                </div>
                <h2 className="mt-5 text-2xl font-bold text-theme-black">Document Verification Pending</h2>
                <p className="mt-4 flex max-w-xl items-start gap-2 text-left text-sm text-theme-gray">
                  <Info className="mt-0.5 h-4 w-4 shrink-0" />
                  Please note that the verification process may take up to 24 hours. Once the verification is done,
                  you will receive a notification to your email address.
                </p>
                <PrimaryButton className="mt-8" onClick={() => router.push("/dashboard")}>
                  Go to Dashboard
                </PrimaryButton>
              </div>
            )}
          </>
        ) : null}
      </div>
    </div>
  );
}
