"""Generate the SuryaTech sample documents: HTML -> PDF (US Letter) via headless Chrome, plus PNG thumbnails.

Every document is a sample built on the public record. Company constants and the MAPC request are real.
Anything Suryatech has not shared (rates, references, staff, sales) is a sample value and is marked as such.
"""

from __future__ import annotations

import html
import subprocess
from pathlib import Path

OUT = Path(r"C:/dev/suryatech-response-desk/public/documents")
STAGE = Path(__file__).parent / "docs-html"
CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
OUT.mkdir(parents=True, exist_ok=True)
(OUT / "thumbs").mkdir(exist_ok=True)
STAGE.mkdir(exist_ok=True)

CSS = """
@page { size: Letter; margin: 0; }
* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; }
body { font-family: Arial, Helvetica, sans-serif; font-size: 10pt; line-height: 1.5; color: #1C2A44; }
.page { width: 8.5in; height: 11in; padding: 0.7in 0.75in 0.6in; position: relative; page-break-after: always; overflow: hidden; display: flex; flex-direction: column; }
.page:last-child { page-break-after: auto; }
.head { display: flex; align-items: center; justify-content: space-between; border-bottom: 2.5px solid #14284B; padding-bottom: 8px; }
.wm { display: flex; align-items: center; gap: 8px; font-size: 15pt; letter-spacing: 0.02em; }
.wm .bolt { width: 22px; height: 22px; border-radius: 50%; background: #F2A900; display: inline-flex; align-items: center; justify-content: center; }
.wm .bolt svg { width: 12px; height: 12px; }
.wm b { font-weight: 700; color: #14284B; } .wm span.t { color: #8A94A6; font-weight: 500; }
.head .r { text-align: right; font-size: 8pt; color: #5E6C85; line-height: 1.35; }
.sample { display: inline-block; border: 1px solid #B86E00; color: #B86E00; font-size: 7pt; letter-spacing: 0.12em; padding: 1px 6px; border-radius: 3px; font-weight: 700; margin-left: 8px; vertical-align: middle; }
.title { margin: 22px 0 4px; font-size: 18pt; font-weight: 700; color: #14284B; line-height: 1.15; }
.sub { color: #5E6C85; font-size: 10pt; margin: 0 0 14px; }
.meta { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px 16px; border: 1px solid #D5DCE6; border-radius: 6px; padding: 10px 12px; margin: 0 0 14px; background: #F7F9FC; }
.meta .lbl { font-size: 7pt; letter-spacing: 0.1em; text-transform: uppercase; color: #5E6C85; }
.meta .val { font-size: 9.5pt; font-weight: 600; }
h2 { font-size: 11.5pt; color: #14284B; margin: 14px 0 6px; border-left: 3px solid #F2A900; padding-left: 8px; }
p { margin: 0 0 8px; }
table { width: 100%; border-collapse: collapse; margin: 4px 0 10px; font-size: 9.2pt; }
th { text-align: left; font-size: 7.5pt; letter-spacing: 0.08em; text-transform: uppercase; color: #5E6C85; background: #EEF2F7; padding: 6px 8px; border-bottom: 1px solid #D5DCE6; }
td { padding: 6px 8px; border-bottom: 1px solid #E5EAF1; vertical-align: top; }
td.num, th.num { text-align: right; font-variant-numeric: tabular-nums; }
td.k { font-weight: 600; }
.pill { display: inline-block; padding: 1px 7px; border-radius: 3px; font-size: 8pt; font-weight: 600; }
.ok { background: #E4F3EB; color: #1E7F52; } .warn { background: #FBEEDA; color: #B86E00; } .bad { background: #F9E3E1; color: #B3261E; } .info { background: #E8EEF9; color: #22406F; } .ph { background: #EEE9F6; color: #6B5B95; }
.note { border-left: 3px solid #F2A900; background: #FFF8E6; padding: 8px 12px; margin: 10px 0; font-size: 9pt; }
.sig { margin-top: 26px; display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
.sig .line { border-top: 1px solid #1C2A44; padding-top: 4px; font-size: 8.5pt; color: #5E6C85; margin-top: 34px; }
.foot { margin-top: auto; border-top: 1px solid #D5DCE6; padding-top: 6px; font-size: 7.5pt; color: #8A94A6; display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; }
.foot span:first-child { flex: 1; } .foot span:last-child { white-space: nowrap; flex-shrink: 0; }
.two { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.big { font-size: 26pt; font-weight: 700; color: #14284B; line-height: 1; }
.kpi { border: 1px solid #D5DCE6; border-radius: 6px; padding: 10px 12px; }
.kpi .lbl { font-size: 7pt; letter-spacing: 0.1em; text-transform: uppercase; color: #5E6C85; }
.check { font-family: Arial; }
.small { font-size: 8.5pt; color: #5E6C85; }
ul { margin: 0 0 8px 18px; padding: 0; } li { margin: 0 0 3px; }
.letter p { margin: 0 0 10px; font-size: 10.2pt; }
"""

BOLT = '<span class="bolt"><svg viewBox="0 0 24 24"><path d="M13 2 4 14h6l-1 8 9-12h-6z" fill="#14284B"/></svg></span>'
FOOT_NOTE = "Sample document produced by SuryaTech Response Desk for demonstration. Company facts and the request details are public record; values marked SAMPLE are placeholders."


def head(doc_no: str, dated: str) -> str:
    return f"""<div class="head">
      <div class="wm">{BOLT}<b>SURYA</b><span class="t">TECH</span></div>
      <div class="r">Suryatech EV Power LLC · 48 Riley Road, Tyngsboro, MA 01879<br>VEH122 vendor · MBPO PO-25-1080-OSD03-OSD03-37680 · Categories 1 and 4<br>{doc_no} · {dated}</div>
    </div>"""


def foot(page: int, total: int) -> str:
    return f'<div class="foot"><span>{FOOT_NOTE}</span><span>Page {page} of {total}</span></div>'


def page(doc_no: str, dated: str, body: str, n: int, total: int) -> str:
    return f'<div class="page">{head(doc_no, dated)}{body}{foot(n, total)}</div>'


def meta(items: list[tuple[str, str]]) -> str:
    cells = "".join(f'<div><div class="lbl">{html.escape(k)}</div><div class="val">{v}</div></div>' for k, v in items)
    return f'<div class="meta">{cells}</div>'


def table(heads: list[str], rows: list[list[str]], num_cols: set[int] | None = None) -> str:
    num_cols = num_cols or set()
    th = "".join(f'<th class="{"num" if i in num_cols else ""}">{h}</th>' for i, h in enumerate(heads))
    body = ""
    for r in rows:
        body += "<tr>" + "".join(
            f'<td class="{"num" if i in num_cols else ""}{" k" if i == 0 else ""}">{c}</td>' for i, c in enumerate(r)
        ) + "</tr>"
    return f"<table><thead><tr>{th}</tr></thead><tbody>{body}</tbody></table>"


def pill(text: str, kind: str) -> str:
    return f'<span class="pill {kind}">{text}</span>'


SAMPLE = pill("SAMPLE", "ph")

docs: list[tuple[str, str, list[str]]] = []  # (filename, title, pages-html)

# ---------------------------------------------------------------- 01 intake sheet
title = '<div class="title">Opportunity intake sheet <span class="sample">CAPTURED FROM COMMBUYS</span></div><p class="sub">Stage 1 · A buyer posts. Everything on this sheet was read from the public posting the day it appeared.</p>'
m = meta([
    ("Bid number", "BD-26-1217-MAP02-MAP02-121989"),
    ("Buyer", "Metropolitan Area Planning Council"),
    ("Contract", "VEH122, categories 1 and 4"),
    ("Fit verdict", pill("Consider", "warn")),
    ("Posted", "October 27, 2025"),
    ("Closes", "December 15, 2025, 5:00 PM (moved from Nov 24)"),
    ("Ceiling", "$660,000 · no site above $110,000"),
    ("Sites", "6 municipal partners"),
])
body1 = title + m + "<h2>What the buyer asked for</h2>" + \
    "<p>Non-grid-tied charging equipment and services, coupled with EV carshare, at sites in Framingham, Quincy, Natick and the housing authorities of Boston, Chelsea and Somerville. A pilot funded by a MassCEC ACT4All grant. Open to Statewide Contract VEH122 vendors in categories 1 and 4.</p>" + \
    "<h2>Required response, as posted</h2>" + table(
        ["Tab", "Content", "Hard rule"],
        [["1", "Cover letter and Section 11 forms", "13 signed forms, exact order"],
         ["2", "Minimum Quality Requirements Form", "One non-affirmative answer rejects the proposal"],
         ["3", "Experience and qualifications", "5 pages; resumes as appendix"],
         ["4", "Scope of services, approach, equipment", "Per site"],
         ["5", "Technical specifications and warranties", ""],
         ["6", "References", "At least 3; one non-grid-tied, one carshare; called at random"],
         ["7", "Price proposal", "Appendix D template; one price per site; narrative 5 pages max"]]) + \
    "<h2>Why this verdict</h2><ul><li>Asks for non-grid-tied charging, which is the product. Explicitly open to categories 1 and 4.</li><li>Requires a joint venture with an EV carshare operator and a carshare reference, which Suryatech does not hold.</li><li>Seven-tab response with thirteen signed forms: weeks of assembly, about 80 hours.</li></ul>" + \
    '<div class="note">Chase only with a carshare partner on the team. Without one, Tab 2 fails on the operator requirement and the whole proposal is rejected before it is read.</div>'
body2 = '<div class="title">Amendment log</div><p class="sub">Every change the buyer posted while the request was open. Re-read daily by the watcher.</p>' + table(
    ["Date", "Kind", "What changed"],
    [["2025-10-27", "File replaced", "RFP FINAL, corrected, replaces the original file"],
     ["2025-11-06", "Q and A", "Bidders conference held; video and slide deck posted"],
     ["2025-11-12", pill("Date moved", "bad"), "Bid opening moved from 11/24/2025 to 12/15/2025; questions and responses posted"],
     ["2025-11-26", pill("Criteria changed", "warn"), "Amendment 5: evaluation criteria added to Section 8; Framingham and Natick sites revised"],
     ["2025-12-01", "File replaced", "Corrected redlined RFP posted"],
     ["2025-12-02", "Q and A", "Amendment 6: additional response to question 11"]]) + \
    "<h2>Source</h2><p class=\"small\">COMMBUYS bid detail page and the posted RFP, read without an account. Nothing on this sheet required credentials.</p>"
docs.append(("01-opportunity-intake-sheet.pdf", "Opportunity intake sheet", [
    page("DOC 01 · INTAKE", "Captured October 27, 2025", body1, 1, 2),
    page("DOC 01 · INTAKE", "Captured October 27, 2025", body2, 2, 2)]))

# ---------------------------------------------------------------- 02 watch digest
title = '<div class="title">Morning watch digest</div><p class="sub">Stage 2 · The watcher sees it. Reconstructed for Thursday, November 13, 2025, the morning after MAPC moved its due date.</p>'
m = meta([("Run", "07:00, daily"), ("Source", "COMMBUYS public bid search"), ("Credentials used", "None"), ("New postings", "0"),
          ("Open bids re-read", "1"), ("Amendments found", pill("1 new", "warn")), ("Closings in 30 days", "1"), ("Filings owed", "SDP Q2 report, due Feb 14")])
body = title + m + "<h2>Changed since yesterday</h2>" + table(
    ["Bid", "Buyer", "Change", "Action"],
    [["BD-26-1217-MAP02", "MAPC", pill("Due date moved", "bad") + " 11/24 to 12/15. Questions and responses posted.", "Re-plan the assembly calendar: 32 days to closing"]]) + \
    "<h2>Queries run</h2>" + table(["Query", "Matches", "Why it is needed"],
                                   [["VEH122", "8", "Plain keyword. Misses MAPC and MassDOT"], ["VEH 122", "1", "With a space. Catches MAPC"],
                                    ["EV charging", "14", "Broad. Catches c.30B municipal bids outside VEH122"], ["UNSPSC 25-17-50", "6", "Commodity code for EV charging systems"]], {1}) + \
    "<h2>Watch list</h2>" + table(["Bid", "Buyer", "Closes", "Verdict", "Status"],
                                  [["BD-26-1217-MAP02", "MAPC, non-grid-tied and carshare", "2025-12-15", pill("Consider", "warn"), "Assembling, carshare partner unresolved"]]) + \
    '<div class="note">One line to act on today: confirm or drop the carshare partner. Every other item on this digest waits on that decision.</div>'
docs.append(("02-morning-watch-digest.pdf", "Morning watch digest", [page("DOC 02 · WATCH", "November 13, 2025, 07:00", body, 1, 1)]))

# ---------------------------------------------------------------- 03 cover letter
body = '<div class="title">Tab 1 · Cover letter <span class="sample">SAMPLE</span></div><p class="sub">Stage 3 · The response assembles. Drafted from company constants; signatures and the carshare partner are placeholders.</p>' + \
    '<div class="letter"><p>December 12, 2025</p><p>Procurement Office<br>Metropolitan Area Planning Council<br>60 Temple Place<br>Boston, MA 02111</p>' + \
    '<p><b>Re: Request for Proposals, Non-Grid Tied Electric Vehicle Charging and Electric Vehicle Carshare Services, Bid BD-26-1217-MAP02-MAP02-121989</b></p>' + \
    '<p>Suryatech EV Power LLC submits the enclosed proposal in response to the above request. Suryatech is an awarded vendor on Statewide Contract VEH122 under Master Blanket Purchase Order PO-25-1080-OSD03-OSD03-37680 in categories 1 (electric vehicle supply equipment, hardware, software and ancillary services) and 4 (operation and maintenance), and is certified by the Supplier Diversity Office as a Minority Business Enterprise.</p>' + \
    '<p>Our proposal offers non-grid-tied charging built around our hybrid solar and battery charging station, which delivers DC fast charging at sites without a heavy grid connection. The equipment was funded for testing by the Massachusetts Clean Energy Center under an InnovateMass award. Carshare services in this proposal are provided by ' + SAMPLE + ' [carshare operator], our joint venture partner for this program, as described in Tab 3.</p>' + \
    '<p>We confirm that the enclosed proposal follows the tab structure in Section 7.2 of the RFP, that the forms in Section 11 are enclosed in the order listed, and that the price proposal in Tab 7 uses the Appendix D template with one price for each candidate site and none above $110,000. Prompt payment discount terms are 2% 10 days, 1% 15 days, 1% 20 days, as published on our contract record.</p>' + \
    '<p>The primary contact for this proposal is Mayur Kamalakar, Founder, at mayur.kamalakar@suryatechpower.com and 339-244-9464.</p>' + \
    '<p>Respectfully,</p></div>' + \
    '<div class="sig"><div><div class="line">Mayur Kamalakar, Founder, Suryatech EV Power LLC</div></div><div><div class="line">' + SAMPLE + ' Authorized signatory, carshare operator</div></div></div>'
docs.append(("03-tab1-cover-letter.pdf", "Tab 1 cover letter", [page("DOC 03 · TAB 1", "December 12, 2025", body, 1, 1)]))

# ---------------------------------------------------------------- 04 tab 3 experience
body1 = '<div class="title">Tab 3 · Experience and qualifications <span class="sample">SAMPLE</span></div><p class="sub">Stage 3 · The response assembles. Five-page limit. Public facts are filled; team detail is a placeholder until Suryatech supplies it.</p>' + \
    "<h2>3.1 The company</h2>" + table(["Item", "Detail", "Source"],
        [["Legal name", "Suryatech EV Power LLC", "COMMBUYS"], ["Founded", "2022", "LinkedIn"], ["Office", "48 Riley Road, Tyngsboro, MA 01879", "Lowell filing"],
         ["Employees", "2 to 10", "LinkedIn"], ["Statewide contract", "VEH122, categories 1 and 4, through September 30, 2033", "COMMBUYS"],
         ["Diversity certification", "MBE, Supplier Diversity Office", "VEH122 guide"], ["SDP commitment", "30%", "VEH122 guide"]]) + \
    "<h2>3.2 Validation of the product</h2>" + table(["Program", "What it established"],
        [["MassCEC InnovateMass", "$91,000 award to test the hybrid solar and battery EV charger"],
         ["EPRI Incubatenergy Labs", "One of 24 finalists selected from more than 350 applicants"],
         ["City of Lowell", "Municipal application for a hybrid solar EV charging installation at 1460 Middlesex Street"]]) + \
    "<h2>3.3 Relevant past work</h2>" + table(["Project", "Scope", "Status"],
        [["1460 Middlesex Street, Lowell", "Hybrid solar and battery charging at a fuel site; non-grid-tied", SAMPLE + " completion and contact to confirm"],
         [SAMPLE + " Project 2", "Placeholder for a second deployment", "To be supplied"]])
body2 = '<div class="title">Tab 3 · Experience and qualifications, continued</div>' + \
    "<h2>3.4 Key personnel</h2>" + table(["Name", "Role on this program", "Relevant experience"],
        [["Mayur Kamalakar", "Principal, engineering lead, primary contact", "Founder. Named inventor on the patents behind the charger. Led the MassCEC-funded test and the Lowell application."],
         [SAMPLE + " Head of design and execution", "Site design and permitting", "Placeholder. Professional engineer license to be stated."],
         [SAMPLE + " Carshare operator lead", "Carshare operations, enrollment, customer service", "Placeholder from the joint venture partner."]]) + \
    "<h2>3.5 Organization for this program</h2><p>Suryatech leads equipment, installation, commissioning and maintenance under categories 1 and 4. The carshare operator leads vehicle operations, reservations, outreach and customer service under Sections 6.6 to 6.13 of the RFP. One primary contact on each side; one weekly joint review with MAPC and the program partners.</p>" + \
    "<h2>3.6 Availability in the Boston metropolitan area</h2><p>Suryatech is based in Tyngsboro, Middlesex County, within one hour of every program partner site. " + SAMPLE + " Staff presence in Boston to be stated.</p>" + \
    "<h2>Appendices</h2><p class=\"small\">Resumes of key personnel are attached as Appendix 3-A and do not count toward the five-page limit.</p>"
docs.append(("04-tab3-experience.pdf", "Tab 3 experience and qualifications", [
    page("DOC 04 · TAB 3", "December 12, 2025", body1, 1, 2), page("DOC 04 · TAB 3", "December 12, 2025", body2, 2, 2)]))

# ---------------------------------------------------------------- 05 price proposal
sites = [("F-1", 96500, 1), ("F-2", 104800, 3), ("F-3", 89900, 2), ("F-4", 108500, 6), ("F-5", 101200, 4), ("F-6", 93400, 5)]
rows = [[f"Framingham site {s}", f"${p:,.0f}", "$110,000", str(r), SAMPLE] for s, p, r in sites]
total = sum(p for _, p, _ in sites)
body = '<div class="title">Tab 7 · Price proposal summary <span class="sample">SAMPLE</span></div><p class="sub">Stage 3 · The response assembles. One price per candidate site, none above the $110,000 cap, ranked as the Site Selection Form requires. Figures are sample values.</p>' + \
    meta([("Template", "Appendix D, RFP Price Proposal 10.27.2025.xlsx"), ("Program partner", "City of Framingham"), ("Sites priced", "6 of 6"), ("Cap per site", "$110,000")]) + \
    table(["Site", "Price", "Cap", "Rank", ""], rows, {1, 2, 3}) + \
    f'<div class="two"><div class="kpi"><div class="lbl">Total, six sites</div><div class="big">${total:,.0f}</div><div class="small">All under cap. Program ceiling $660,000 across all partners.</div></div>' + \
    '<div class="kpi"><div class="lbl">Cost share, in-kind</div><div class="big">$28,000</div><div class="small">' + SAMPLE + ' Staff time, outreach support and discounted rates for low-income carshare users. Bidders cumulatively contribute not less than $150,000.</div></div></div>' + \
    "<h2>Basis of price variation</h2><p>Sites F-2 and F-4 require longer trenching from the panel array to the bay and a second foundation; F-3 sits on an existing pad. Ranking follows expected utilization from the MAPC geospatial map and the partner's priority order.</p>" + \
    "<h2>Payment</h2><p>Milestone-based per the RFP deliverable schedule, invoiced through MAPC. Prompt payment terms 2% 10, 1% 15, 1% 20 as published on the VEH122 contract record.</p>"
docs.append(("05-tab7-price-proposal.pdf", "Tab 7 price proposal summary", [page("DOC 05 · TAB 7", "December 12, 2025", body, 1, 1)]))

# ---------------------------------------------------------------- 06 pack manifest
files = [("Tab 1 · Cover letter and 13 signed forms", "PDF", pill("Partial", "warn"), "Signatures pending; W9, Certificate of Authority, subcontractor list missing"),
         ("Tab 2 · Minimum Quality Requirements Form", "PDF", pill("Blocked", "bad"), "Carshare operator and insurance lines unanswered"),
         ("Tab 3 · Experience and qualifications", "PDF", pill("Partial", "warn"), "Resumes missing"),
         ("Tab 4 · Scope of services, approach, equipment", "PDF", pill("Partial", "warn"), "Draft"),
         ("Tab 5 · Technical specifications and warranties", "PDF", pill("Partial", "warn"), "Warranty terms missing"),
         ("Tab 6 · Three reference forms", "PDF", pill("Blocked", "bad"), "1 of 3 on file"),
         ("Tab 7 · Price Proposal Template, Appendix D", "XLSX", pill("Ready", "ok"), "Six sites priced, sample values"),
         ("Site Selection Form, six Framingham sites ranked", "PDF", pill("Ready", "ok"), "Ranked 1 to 6")]
body = '<div class="title">Submission pack manifest</div><p class="sub">Stage 4 · The pack is built. The folder, named the way the RFP names it, checked against the buyer\'s own list. Nothing is uploaded while a line is blocked.</p>' + \
    meta([("Bid", "BD-26-1217-MAP02-MAP02-121989"), ("Files", "8"), ("Blocked", pill("2", "bad")), ("Assembled", "December 12, 2025, 16:40 · Mayur Kamalakar")]) + \
    table(["#", "File", "Type", "State", "Note"], [[str(i + 1), n, t, s, note] for i, (n, t, s, note) in enumerate(files)]) + \
    '<div class="note"><b>Gate:</b> the pack is not submitted until every line reads Ready. Two lines are blocked. A person on Suryatech\'s side uploads on COMMBUYS when the gate opens; the system never touches the state portal.</div>' + \
    "<h2>Integrity</h2><p class=\"small\">Each file carries a SHA-256 fingerprint in the pack index so the submitted set can be matched to this manifest later. " + SAMPLE + " Fingerprints appear once files are final.</p>"
docs.append(("06-submission-pack-manifest.pdf", "Submission pack manifest", [page("DOC 06 · PACK", "December 12, 2025", body, 1, 1)]))

# ---------------------------------------------------------------- 07 submission record
body = '<div class="title">Submission record <span class="sample">SAMPLE</span></div><p class="sub">Stage 5 · A person uploads. Recorded by the person who submitted, after the fact. The system did not upload.</p>' + \
    meta([("Bid", "BD-26-1217-MAP02-MAP02-121989"), ("Submitted via", "COMMBUYS, vendor account"), ("Submitted by", "Mayur Kamalakar"), ("Submitted", SAMPLE + " December 15, 2025, 15:12"),
          ("Deadline", "December 15, 2025, 17:00"), ("Margin", "1 h 48 min"), ("Files", "8 of 8"), ("COMMBUYS confirmation", SAMPLE + " Q-25-XXXXXX")]) + \
    table(["#", "File", "Fingerprint (SHA-256, first 16)", "Matches manifest"],
          [[str(i + 1), n, SAMPLE + " 3f9a…", pill("Yes", "ok")] for i, (n, _, _, _) in enumerate(files)]) + \
    "<h2>Notes</h2><p>All eight files matched the pack manifest of December 12 after the two blocked lines were cleared on December 14. Confirmation screenshot attached as Appendix A.</p>" + \
    '<div class="sig"><div><div class="line">Recorded by Mayur Kamalakar</div></div><div><div class="line">Reviewed by ' + SAMPLE + ' second signer</div></div></div>'
docs.append(("07-submission-record.pdf", "Submission record", [page("DOC 07 · SUBMISSION", "December 15, 2025", body, 1, 1)]))

# ---------------------------------------------------------------- 08 SDP spending report
body = '<div class="title">Supplier Diversity Program, Prime Contractor Spending Report <span class="sample">SAMPLE</span></div><p class="sub">Evidence register. Due within 45 days of quarter end to the Commonwealth Contract Manager. Structure follows the OSD form; values are sample.</p>' + \
    meta([("Contractor", "Suryatech EV Power LLC"), ("Contact", "Mayur Kamalakar"), ("Fiscal quarter", "FY2027 Q1, Jul 1 to Sep 30, 2026"), ("Due", "November 14, 2026"),
          ("Annual SDP commitment", "30%"), ("Quarterly contract sales", SAMPLE + " $84,200"), ("Quarterly SDP spend", SAMPLE + " $26,400"), ("Quarter ratio", pill("31.4%", "ok"))]) + \
    "<h2>SDP partners</h2>" + table(["Partner (as in the SDO directory)", "Relationship", "Certification", "Q1 spend"],
        [[SAMPLE + " Sample Electrical Co.", "Subcontracting", "MBE", "$18,900"], [SAMPLE + " Sample Civil Works LLC", "Subcontracting", "WBE", "$7,500"]], {3}) + \
    "<h2>Year-to-date compliance check</h2>" + table(["Quarter", "Contract sales", "SDP spend", "Ratio", "Against 30%"],
        [["Q1 (Jul to Sep)", "$84,200", "$26,400", "31.4%", pill("In compliance", "ok")], ["Q2 (Oct to Dec)", "—", "—", "—", "Not yet due"],
         ["Q3 (Jan to Mar)", "—", "—", "—", "Not yet due"], ["Q4 (Apr to Jun)", "—", "—", "—", "Not yet due"]], {1, 2, 3}) + \
    "<h2>If not in compliance</h2><p class=\"small\">Explanation and corrective actions would appear here. Not applicable this quarter.</p>" + \
    '<div class="sig"><div><div class="line">I certify that the information in this report is accurate. Mayur Kamalakar</div></div><div><div class="line">Date</div></div></div>'
docs.append(("08-sdp-spending-report.pdf", "SDP spending report", [page("DOC 08 · SDP Q1", "Prepared October 6, 2026", body, 1, 1)]))

# ---------------------------------------------------------------- 09 power check report
checks = [("Heartbeat", "received", "within 60 s", pill("pass", "ok")), ("Battery state of charge", "23%", "above 25% reserve", pill("fail", "bad")),
          ("PV production", "10.4 kW of 12 kW", "above 20% of capacity in daylight", pill("pass", "ok")), ("Grid import", "0 kW", "0 kW while battery above reserve", pill("pass", "ok")),
          ("Connector status", "1 faulted", "no faulted connectors", pill("fail", "bad")), ("Enclosure temperature", "33.1 °C", "below 45 °C", pill("pass", "ok")),
          ("Firmware", "3.9.7", "4.0.x", pill("warn", "warn"))]
body = '<div class="title">Station power check report <span class="sample">SIMULATED</span></div><p class="sub">Stations, Phase 2. Produced by one call to the station API. Every reading and threshold is listed so the result can be checked.</p>' + \
    meta([("Station", "ST-SAMPLE-03, Sample site B, state park"), ("Protocol", "OCPP 1.6J via management system"), ("Run", "September 14, 2026, 23:05:22"), ("Duration", "316 ms"),
          ("Result", pill("Fail · 42/100", "bad")), ("Fails", "2"), ("Warnings", "1"), ("Requested by", "Mayur Kamalakar")]) + \
    table(["Check", "Reading", "Expected", "Result"], [[c, r, e, s] for c, r, e, s in checks]) + \
    "<h2>Findings</h2><ul><li>Connector 1 reported GroundFailure at 02:14 and has not cleared. A site visit is required; a remote reset was not attempted because the fault is electrical.</li><li>Battery at 23%, below the 25% reserve, with no grid backup at this site. Output on connector 2 will be limited until solar recovers the pack.</li><li>Firmware 3.9.7 is one release behind the fleet. Schedule the update at the site visit.</li></ul>" + \
    "<h2>Actions</h2>" + table(["#", "Action", "Owner", "By"],
        [["1", "Dispatch electrician for connector 1 ground fault", "Suryatech O&M", "Next business day"], ["2", "Hold connector 2 at reduced output until SoC above 40%", "Automatic", "In effect"],
         ["3", "Update firmware to 4.0.2 during the visit", "Suryatech O&M", "With action 1"]]) + \
    '<div class="note">This report is generated from a simulator standing in for the management system. Nothing here is connected to a live charger.</div>'
docs.append(("09-station-power-check-report.pdf", "Station power check report", [page("DOC 09 · POWER CHECK", "September 14, 2026", body, 1, 1)]))

# ---------------------------------------------------------------- render
manifest = []
for fname, title_txt, pages in docs:
    html_doc = f"<!DOCTYPE html><html><head><meta charset='utf-8'><title>{html.escape(title_txt)}</title><style>{CSS}</style></head><body>{''.join(pages)}</body></html>"
    hpath = STAGE / (fname[:-4] + ".html")
    hpath.write_text(html_doc, encoding="utf-8")
    pdf = OUT / fname
    subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--no-pdf-header-footer", "--virtual-time-budget=8000",
                    f"--print-to-pdf={pdf}", "file:///" + str(hpath.resolve()).replace("\\", "/")], capture_output=True, timeout=120)
    manifest.append((fname, title_txt, len(pages), pdf.stat().st_size))
    print(f"{fname:<38} {len(pages)} page(s)  {pdf.stat().st_size // 1024} KB")

import fitz  # noqa: E402

for fname, _, _, _ in manifest:
    d = fitz.open(OUT / fname)
    pix = d[0].get_pixmap(dpi=72)
    pix.save(OUT / "thumbs" / (fname[:-4] + ".png"))
    if d.page_count != next(len(p) for f, _, p in docs if f == fname):
        print("PAGE COUNT MISMATCH", fname, d.page_count)
print("thumbs written")
