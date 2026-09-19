"use client";

import { type FormEvent, useId, useState } from "react";

import { ArrowUpRight } from "lucide-react";

import styles from "./site-landing.module.css";

const ASSESSMENT_EMAIL = "mayur.kamalakar@suryatechpower.com";

export function LandingContact() {
  const formId = useId();
  const [preparedEmail, setPreparedEmail] = useState<string | null>(null);

  function prepareEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    for (const field of ["fullName", "siteLocation"]) {
      const input = form.elements.namedItem(field) as HTMLInputElement;
      input.setCustomValidity(input.value.trim() ? "" : "Please enter a value.");
    }
    if (!form.reportValidity()) return;

    const data = new FormData(form);
    const read = (field: string) => String(data.get(field) ?? "").trim();
    const subject = `SuryaTech site assessment: ${read("siteLocation")}`;
    const body = [
      "Hello SuryaTech,",
      "",
      "I would like to discuss a site assessment.",
      "",
      `Full name: ${read("fullName")}`,
      `Email: ${read("email")}`,
      `Site location: ${read("siteLocation")}`,
      `Site type: ${read("siteType")}`,
      ...(read("projectDetails") ? ["", `Project details: ${read("projectDetails")}`] : []),
    ].join("\r\n");
    const mailto = `mailto:${ASSESSMENT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    setPreparedEmail(mailto);
    window.location.href = mailto;
  }

  return (
    <form
      className={styles.contactForm}
      aria-label="Request a SuryaTech site assessment"
      aria-describedby={`${formId}-note`}
      action={`mailto:${ASSESSMENT_EMAIL}`}
      method="post"
      encType="text/plain"
      onSubmit={prepareEmail}
      onChange={(event) => {
        if (event.target instanceof HTMLInputElement) event.target.setCustomValidity("");
        setPreparedEmail(null);
      }}
    >
      <div className={styles.formGrid}>
        <div className={styles.field}>
          <label htmlFor={`${formId}-name`}>Full name</label>
          <input id={`${formId}-name`} name="fullName" autoComplete="name" maxLength={120} required />
        </div>
        <div className={styles.field}>
          <label htmlFor={`${formId}-email`}>Email</label>
          <input id={`${formId}-email`} name="email" type="email" autoComplete="email" maxLength={254} required />
        </div>
        <div className={styles.field}>
          <label htmlFor={`${formId}-location`}>Site location</label>
          <input
            id={`${formId}-location`}
            name="siteLocation"
            placeholder="Town or site address"
            autoComplete="off"
            maxLength={160}
            required
          />
        </div>
        <div className={styles.field}>
          <label htmlFor={`${formId}-type`}>Site type</label>
          <select id={`${formId}-type`} name="siteType" defaultValue="Municipal or fleet">
            <option>Municipal or fleet</option>
            <option>Commercial property</option>
            <option>Park or destination</option>
            <option>Other</option>
          </select>
        </div>
        <div className={`${styles.field} ${styles.fieldWide}`}>
          <label htmlFor={`${formId}-details`}>Project details (optional)</label>
          <input
            id={`${formId}-details`}
            name="projectDetails"
            placeholder="Vehicles, charging needs or timing"
            maxLength={400}
          />
        </div>
      </div>
      <p id={`${formId}-note`} className={styles.formNote}>
        Name, email and site location are required. Opens a prepared email. Nothing is sent automatically.
      </p>
      <button className={styles.submitButton} type="submit">
        Prepare assessment email
        <ArrowUpRight aria-hidden="true" size={18} />
      </button>
      <div role="status" aria-live="polite" aria-atomic="true">
        {preparedEmail && (
          <p className={styles.formStatus}>
            Your email app should open with the project details. Send the email there to request an assessment.{" "}
            <a className={styles.inlineLink} href={preparedEmail}>
              Open the prepared email
            </a>
          </p>
        )}
      </div>
    </form>
  );
}
