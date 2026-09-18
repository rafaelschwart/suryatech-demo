import { SiteLanding } from "./_components/site-landing";

/** Full-bleed inside the dashboard: the layout drops its padding when it finds this attribute. */
export default function Page() {
  return (
    <div data-content-padding="false">
      <SiteLanding />
    </div>
  );
}
