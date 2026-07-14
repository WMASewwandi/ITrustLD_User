export default function CurrencyWatermarks({ tone = "light" }) {
  const textColor = tone === "dark" ? "text-white/12" : "text-theme-blue-dark/10";
  const glowColor = tone === "dark" ? "bg-white/10" : "bg-theme-green-shaded/15";

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className={`absolute left-[5%] top-[12%] h-28 w-28 rounded-full blur-3xl ${glowColor}`} />
      <div className={`absolute right-[8%] bottom-[16%] h-32 w-32 rounded-full blur-3xl ${glowColor}`} />

      <span className={`wm-float-a absolute left-[7%] top-[10%] text-6xl font-semibold ${textColor}`}>$</span>
      <span className={`wm-float-b absolute right-[9%] top-[16%] text-7xl font-semibold ${textColor}`}>₿</span>
      <span className={`wm-float-c absolute left-[17%] bottom-[18%] text-6xl font-semibold ${textColor}`}>€</span>
      <span className={`wm-float-a absolute right-[23%] bottom-[14%] text-6xl font-semibold ${textColor}`}>¥</span>
      <span className={`wm-float-b absolute left-[46%] top-[42%] text-5xl font-semibold ${textColor}`}>₹</span>
      <span className={`wm-float-c absolute right-[40%] top-[14%] text-4xl font-semibold ${textColor}`}>£</span>
    </div>
  );
}
