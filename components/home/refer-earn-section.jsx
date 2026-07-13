import PrimaryButton from "@/components/ui/primary-button";

export default function ReferEarnSection() {
  return (
    <section className="relative overflow-hidden bg-[#F5F7FC] py-16 sm:py-20">
      <div className="pointer-events-none absolute -left-14 top-6 h-64 w-64 rounded-full bg-theme-green-shaded/18 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-10 h-72 w-72 rounded-full bg-theme-blue-darkshade/12 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-44 w-44 -translate-x-1/2 rounded-full bg-theme-green-action/10 blur-3xl" />

      <div className="container-shell relative">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl bg-transparent">
          <div className="relative p-8 text-center sm:p-12">
            <h2 className="text-3xl font-semibold tracking-tight text-theme-blue-dark sm:text-4xl">
              Refer and <span className="text-theme-green-action">Earn</span>
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-md-lg leading-8 text-theme-blue-darkshade">
              Join our referral program and start earning points by inviting friends to join our platform. Each referral brings
              you closer to exciting rewards. Spread the word and reap the benefits of our Refer &amp; Earn program today.
            </p>
            <div className="mt-8 flex items-center justify-center">
              <PrimaryButton className="px-14 py-3.5 text-md shadow-[0_10px_22px_rgba(13,159,27,0.35)]">Start Now</PrimaryButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
