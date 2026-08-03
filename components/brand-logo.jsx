"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  DEFAULT_ICON_LOGO_URL,
  DEFAULT_WIDE_LOGO_URL,
  fetchWebsiteLogo,
} from "@/lib/website-logo";

const WebsiteLogoContext = createContext({
  wideLogoUrl: DEFAULT_WIDE_LOGO_URL,
  iconLogoUrl: DEFAULT_ICON_LOGO_URL,
  loading: true,
});

export function WebsiteLogoProvider({ children }) {
  const [logo, setLogo] = useState({
    wideLogoUrl: DEFAULT_WIDE_LOGO_URL,
    iconLogoUrl: DEFAULT_ICON_LOGO_URL,
    loading: true,
  });

  useEffect(() => {
    let active = true;
    fetchWebsiteLogo().then((data) => {
      if (!active) return;
      setLogo({
        wideLogoUrl: data.wideLogoUrl,
        iconLogoUrl: data.iconLogoUrl,
        loading: false,
      });
    });
    return () => {
      active = false;
    };
  }, []);

  const value = useMemo(
    () => ({
      wideLogoUrl: logo.wideLogoUrl,
      iconLogoUrl: logo.iconLogoUrl,
      loading: logo.loading,
    }),
    [logo],
  );

  return <WebsiteLogoContext.Provider value={value}>{children}</WebsiteLogoContext.Provider>;
}

export function useWebsiteLogo() {
  return useContext(WebsiteLogoContext);
}

export function BrandLogoImage({
  variant = "wide",
  className = "",
  alt = "iTrustLD",
}) {
  const { wideLogoUrl, iconLogoUrl } = useWebsiteLogo();
  const src = variant === "icon" ? iconLogoUrl : wideLogoUrl;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className={className} />
  );
}
