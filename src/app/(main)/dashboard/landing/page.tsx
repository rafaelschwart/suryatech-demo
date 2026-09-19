import type { Metadata } from "next";

import { SiteLanding } from "./_components/site-landing";

export const metadata: Metadata = {
  title: "SuryaTech website preview | Response Desk",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <div data-content-padding="false">
      <SiteLanding embedded />
    </div>
  );
}
