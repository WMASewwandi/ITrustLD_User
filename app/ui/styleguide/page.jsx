import UserGuestLayout from "@/components/layouts/user-guest-layout";
import PrimaryButton from "@/components/ui/primary-button";
import SecondaryButton from "@/components/ui/secondary-button";
import InputLabel from "@/components/ui/input-label";
import TextInput from "@/components/ui/text-input";
import InputError from "@/components/ui/input-error";
import FeatureCard from "@/components/ui/feature-card";

const colors = [
  ["theme-green-action", "#0D9F1B"],
  ["theme-green-dark", "#14535B"],
  ["theme-green-shaded", "#669DA4"],
  ["theme-blue-dark", "#25223E"],
  ["theme-blue-darkshade", "#363351"],
  ["theme-blue-panel", "#302D48"],
  ["theme-black", "#0E1726"],
  ["theme-gray", "#888EA8"],
  ["theme-gray-white", "#F8F8F8"],
  ["theme-gray-border", "#E0E6ED"],
  ["theme-red-action", "#FF0000"],
  ["theme-orange", "#FF8329"]
];

export default function StyleGuidePage() {
  return (
    <UserGuestLayout>
      <section className="container-shell py-10">
        <h1 className="text-3xl font-semibold text-theme-blue-dark">iTrustLD Day 1 Styleguide</h1>

        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-theme-blue-dark">Brand Colors</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {colors.map(([name, hex]) => (
              <div key={name} className="rounded-lg border border-theme-gray-border p-3">
                <div className="h-14 rounded-md" style={{ backgroundColor: hex }} />
                <p className="mt-2 text-sm font-medium">{name}</p>
                <p className="text-xs text-theme-gray">{hex}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-theme-blue-dark">Typography</h2>
          <div className="mt-4 space-y-2 rounded-lg border border-theme-gray-border p-5">
            <p className="text-5-6xl font-semibold">text-5-6xl sample</p>
            <p className="text-4-5xl font-semibold">text-4-5xl sample</p>
            <p className="text-3xl font-semibold">text-3xl sample</p>
            <p className="text-2-3xl">text-2-3xl sample</p>
            <p className="text-2-3lg">text-2-3lg sample</p>
            <p className="text-lg-xl">text-lg-xl sample</p>
            <p className="text-md-lg">text-md-lg sample</p>
            <p className="text-md">text-md sample</p>
          </div>
        </div>

        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-theme-blue-dark">Buttons</h2>
          <div className="mt-4 flex flex-wrap gap-4">
            <PrimaryButton>Primary Action</PrimaryButton>
            <SecondaryButton>Secondary Action</SecondaryButton>
          </div>
        </div>

        <div className="mt-10 rounded-lg border border-theme-gray-border p-5">
          <h2 className="text-2xl font-semibold text-theme-blue-dark">Form Inputs</h2>
          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            <div>
              <InputLabel htmlFor="default-input">Default Input</InputLabel>
              <TextInput id="default-input" placeholder="Type here..." />
            </div>
            <div>
              <InputLabel htmlFor="error-input">Error Input</InputLabel>
              <TextInput id="error-input" defaultValue="invalid@email" className="border-theme-red-action focus:border-theme-red-action focus:ring-theme-red-action" />
              <InputError message="This email field has an error state." />
            </div>
          </div>
        </div>

        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-theme-blue-dark">Feature Cards</h2>
          <div className="mt-4 grid gap-5 md:grid-cols-2">
            <FeatureCard title="Green Filled Card" description="Variant to match callout feature sections." variant="filled" />
            <FeatureCard title="Green Bordered Card" description="Alternative bordered card for less visual weight." variant="bordered" />
          </div>
        </div>

        <div className="mt-10 rounded-lg border border-theme-gray-border p-5">
          <h2 className="text-2xl font-semibold text-theme-blue-dark">
            Section Heading <span className="text-theme-green-action">Highlight Word</span>
          </h2>
          <p className="mt-2 text-md text-theme-gray">Reusable section heading pattern for marketing and support pages.</p>
        </div>
      </section>
    </UserGuestLayout>
  );
}
