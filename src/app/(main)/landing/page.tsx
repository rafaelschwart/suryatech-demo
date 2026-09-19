import type { Metadata } from "next";

import { SiteLanding } from "@/app/(main)/dashboard/landing/_components/site-landing";

export const metadata: Metadata = {
  metadataBase: new URL("https://suryatech.demo.arqentia.com"),
  title: "SuryaTech | Solar, storage & EV charging",
  description:
    "Explore SuryaTech's hybrid approach to solar generation, battery storage and EV charging. Start with a site assessment.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "SuryaTech | EV charging with power built in",
    description: "Solar generation, battery storage and EV charging, considered as one system.",
    images: [
      {
        url: "/media/landing-hero-higgsfield-v3.webp",
        width: 1920,
        height: 1086,
        alt: "Illustrative SuryaTech solar EV charger with integrated battery storage",
      },
    ],
  },
};

export default function Page() {
  return <SiteLanding />;
}
