import Image from "next/image";

export function LoginHero() {
  return (
    <aside className="relative hidden min-h-screen overflow-hidden bg-slate-950 lg:block lg:w-1/3">
      <Image
        src="/media/login-infrastructure-v2.webp"
        alt="Illustrative municipal fleet charging depot beneath a photovoltaic canopy"
        fill
        priority
        sizes="33vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/25 to-slate-950/60" />
      <div className="relative flex h-full min-h-screen flex-col justify-between p-10 text-white xl:p-12">
        <div>
          <p className="text-xl tracking-tight">
            <span className="font-semibold">SURYA</span>
            <span className="font-normal text-white/75">TECH</span>
          </p>
          <p className="mt-2 text-xs text-white/65">Response Desk</p>
        </div>
        <div className="space-y-5">
          <p className="font-mono text-[11px] text-white/60 uppercase tracking-widest">Massachusetts · VEH122</p>
          <h1 className="max-w-sm text-balance font-medium text-4xl leading-tight tracking-tight">
            From opportunity
            <br />
            to a complete response.
          </h1>
          <p className="max-w-sm text-sm text-white/75 leading-relaxed">
            Track public requests, assemble the required documents, and keep every reporting deadline in view.
          </p>
          <p className="border-t border-white/20 pt-5 text-[10px] text-white/55">
            Illustrative infrastructure concept · Not a project photograph
          </p>
        </div>
      </div>
    </aside>
  );
}
