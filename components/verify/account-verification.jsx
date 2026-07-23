"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Clock3, Info } from "lucide-react";
import UploadSlot from "@/components/verify/upload-slot";
import VerificationArt from "@/components/verify/verification-art";
import {
  ADDRESS_DOC_TYPES,
  DEMO_CODE,
  IDENTITY_DOC_TYPES,
  isNationalId,
  loadVerification,
  saveVerification,
} from "@/lib/verification";

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
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [ready, setReady] = useState(false);

  const nationalId = useMemo(() => isNationalId(identityType), [identityType]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("itrustld_user");
      const user = raw ? JSON.parse(raw) : {};
      const saved = loadVerification(user);
      setEmail(saved.email || user.email || "");
      setPhone(String(saved.phone || user.phone || "").replace(/\s/g, ""));
      setEmailVerified(Boolean(saved.emailVerified));
      setPhoneVerified(Boolean(saved.phoneVerified));
      setIdentityType(saved.identityType || "");
      setAddressType(saved.addressType || "");

      if (saved.documentsSubmitted || saved.status === "pending") {
        setStep("pending");
      } else if (saved.phoneVerified) {
        setStep("documents");
      } else if (saved.emailVerified) {
        setStep("phone");
      } else {
        setStep("email");
      }
    } catch {
      setStep("email");
    } finally {
      setReady(true);
    }
  }, []);

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
      documentsSubmitted: step === "pending",
      status: step === "pending" ? "pending" : "unverified",
      ...partial,
    };
    saveVerification(next);
    try {
      const raw = localStorage.getItem("itrustld_user");
      if (raw) {
        const user = JSON.parse(raw);
        localStorage.setItem(
          "itrustld_user",
          JSON.stringify({
            ...user,
            email: next.email || user.email,
            phone: next.phone || user.phone,
            verificationStatus: next.status,
            emailVerified: next.emailVerified,
            phoneVerified: next.phoneVerified,
          })
        );
      }
    } catch {
      /* ignore */
    }
  }

  function sendEmailCode() {
    setError("");
    setInfo("");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Enter a valid email address.");
      return;
    }
    persist({ email: email.trim() });
    setInfo(`Verification code sent to ${email.trim()} (demo code: ${DEMO_CODE}).`);
    setStep("email-code");
  }

  function confirmEmail() {
    setError("");
    if (emailCode.trim() !== DEMO_CODE) {
      setError(`Invalid code. Use demo code ${DEMO_CODE}.`);
      return;
    }
    setEmailVerified(true);
    persist({ emailVerified: true, email: email.trim() });
    setEmailCode("");
    setInfo("");
    setStep("phone");
  }

  function sendPhoneCode() {
    setError("");
    setInfo("");
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 9) {
      setError("Enter a valid mobile number.");
      return;
    }
    persist({ phone, emailVerified: true });
    setInfo(`Verification code sent to ${phone} (demo code: ${DEMO_CODE}).`);
    setStep("phone-code");
  }

  function confirmPhone() {
    setError("");
    if (phoneCode.trim() !== DEMO_CODE) {
      setError(`Invalid code. Use demo code ${DEMO_CODE}.`);
      return;
    }
    setPhoneVerified(true);
    persist({ phoneVerified: true, emailVerified: true, phone });
    setPhoneCode("");
    setInfo("");
    setStep("documents");
  }

  function submitDocuments() {
    setError("");
    if (!identityType) {
      setError("Select an identity document type.");
      return;
    }
    if (!addressType) {
      setError("Select an address document type.");
      return;
    }
    if (nationalId) {
      if (!identityFront || !identityBack) {
        setError("Upload both front and back of your National ID.");
        return;
      }
    } else if (!identityFile) {
      setError("Upload your identity document.");
      return;
    }
    if (!addressFile) {
      setError("Upload your address document.");
      return;
    }

    setStep("pending");
    persist({
      documentsSubmitted: true,
      status: "pending",
      emailVerified: true,
      phoneVerified: true,
      identityType,
      addressType,
    });
  }

  if (!ready) {
    return <div className="min-h-screen bg-white" />;
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
                      <PrimaryButton onClick={sendEmailCode}>Send</PrimaryButton>
                    ) : (
                      <>
                        <SecondaryButton
                          onClick={() => {
                            setInfo(`Code re-sent (demo code: ${DEMO_CODE}).`);
                          }}
                        >
                          Re-Send
                        </SecondaryButton>
                        <PrimaryButton onClick={confirmEmail}>Confirm</PrimaryButton>
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
                      <PrimaryButton onClick={sendPhoneCode}>Send</PrimaryButton>
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
                        <PrimaryButton onClick={confirmPhone}>Confirm</PrimaryButton>
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
                {showPending ? (
                  <div className="pt-1">
                    <p className="font-semibold text-theme-red-action">Document verification</p>
                    <p className="mt-2 text-theme-black">
                      <span className="inline-flex items-center gap-1.5">
                        <Check className="h-4 w-4 text-theme-green-action" />
                        Identity: {identityType || "Document"} Received
                      </span>{" "}
                      <span className="font-semibold text-theme-orange">Not Verified</span>
                    </p>
                    <p className="mt-1 text-theme-black">
                      <span className="inline-flex items-center gap-1.5">
                        <Check className="h-4 w-4 text-theme-green-action" />
                        Address: {addressType || "Document"} Received
                      </span>{" "}
                      <span className="font-semibold text-theme-orange">Not Verified</span>
                    </p>
                  </div>
                ) : (
                  <p className="font-semibold text-theme-red-action">Document verification</p>
                )}
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
                  <div className="min-w-0">
                    <h2 className="text-base font-semibold text-theme-black">Confirm your identity</h2>
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
                          <UploadSlot label="Front" value={identityFront} onChange={setIdentityFront} />
                          <UploadSlot label="Back" value={identityBack} onChange={setIdentityBack} />
                        </div>
                      ) : (
                        <div className="mt-4">
                          <UploadSlot value={identityFile} onChange={setIdentityFile} />
                        </div>
                      )
                    ) : null}
                  </div>

                  <div className="min-w-0">
                    <h2 className="text-base font-semibold text-theme-black">Confirm your address identity</h2>
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
                        <UploadSlot value={addressFile} onChange={setAddressFile} />
                      </div>
                    ) : null}
                  </div>
                </div>

                {error ? <p className="mt-4 text-sm text-theme-red-action">{error}</p> : null}

                <div className="mt-8 flex justify-end">
                  <PrimaryButton onClick={submitDocuments}>Submit</PrimaryButton>
                </div>
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
