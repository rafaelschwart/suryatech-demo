import { ProvenanceBadge, ScreenIntro } from "@/app/(main)/dashboard/_components/screen-intro";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { companyFacts } from "@/data/company";
import { formTemplates, type LibraryEntry, rateCard, references, scopeBlocks } from "@/data/library";
import { cn } from "@/lib/utils";

export default function Page() {
  return (
    <div className="flex flex-col gap-4">
      <ScreenIntro
        eyebrow="Answer library"
        illustration={{ src: "/media/compliance.webp", alt: "Navy folders with gold tabs and a seal", aspect: "16/9" }}
        flow={{ id: "prep", step: "assemble" }}
        title="Answers, written once."
        achieves="Company facts and reusable answers, written once."
        provenance={[
          { kind: "public", text: "Company constants come from COMMBUYS, LinkedIn and the Lowell filing." },
          {
            kind: "sample",
            text: "Scope blocks, rates, references and form templates are Suryatech's own material and have not been seen.",
          },
        ]}
      />
      <Card>
        <CardHeader>
          <CardTitle>Company constants</CardTitle>
          <CardDescription>Fixed facts. They fill Tab 1, Tab 3 and every form.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table className="min-w-[720px]">
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="w-48">Field</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead className="w-52">Used in</TableHead>
                  <TableHead className="w-32">Source</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {companyFacts.map((f) => (
                  <TableRow key={f.key}>
                    <TableCell className="font-medium">{f.label}</TableCell>
                    <TableCell className={cn("whitespace-normal", f.key === "mbpo" && "font-mono text-xs")}>
                      {f.value}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs">{f.usedIn}</TableCell>
                    <TableCell>
                      <ProvenanceBadge kind={f.provenance} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <LibraryCard title="Scope blocks" description="Reusable paragraphs for Tabs 4 and 5." entries={scopeBlocks} />
        <LibraryCard title="Rate card" description="Required in every VEH122 quote." entries={rateCard} />
        <LibraryCard
          title="References"
          description="MAPC wanted three, one non-grid-tied. MBTA wanted them too."
          entries={references}
        />
        <LibraryCard
          title="Form templates"
          description="The signed certifications every response repeats."
          entries={formTemplates}
        />
      </div>
    </div>
  );
}

function LibraryCard({ title, description, entries }: { title: string; description: string; entries: LibraryEntry[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead className="w-28">Last used</TableHead>
              <TableHead className="w-28">Source</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((e) => (
              <TableRow key={e.id}>
                <TableCell className="whitespace-normal">
                  <div className="flex flex-col">
                    <span className="font-medium leading-snug">{e.title}</span>
                    <span className="text-muted-foreground text-xs">{e.detail}</span>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-muted-foreground text-xs">{e.lastUsed ?? "never"}</TableCell>
                <TableCell>
                  <ProvenanceBadge kind={e.provenance} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
