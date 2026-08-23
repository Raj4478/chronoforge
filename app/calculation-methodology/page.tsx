import { StaticPageTemplate } from "@/components/page/StaticPageTemplate";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Calculation Methodology & Assumptions | ChronoForge",
  description:
    "How ChronoForge calculates work hours, breaks, overtime, decimal conversions, and pay — including rounding rules and what it does not do.",
  path: "/calculation-methodology/",
});

export default function Page() {
  return (
    <StaticPageTemplate
      title="Calculation methodology"
      path="/calculation-methodology/"
      intro="Every ChronoForge calculator is a deterministic, testable formula. Here is exactly how the numbers are produced."
    >
      <h2>Time and duration</h2>
      <p>
        Times are entered as 24-hour <strong>HH:mm</strong> values via your device&rsquo;s native time picker. Internally
        we convert a time of day to minutes since midnight, so 9:30&nbsp;AM becomes 570.
      </p>
      <p>
        A duration is <strong>end − start</strong>. When the end time is earlier than the start (for example 10:00&nbsp;PM to
        6:00&nbsp;AM), we assume the span crosses midnight and add 24 hours.
      </p>

      <h2>Breaks</h2>
      <p>
        Unpaid breaks are subtracted from the shift. A break can be entered as a window (start and end) or as a number of
        minutes. If a break is longer than the shift, it is capped at the shift length and a warning is shown.
      </p>

      <h2>Decimal hours &amp; rounding</h2>
      <p>
        Decimal hours are <strong>minutes ÷ 60</strong>. Displayed results are rounded to two decimal places using
        round-half-up. We total exact time by default; we do not apply employer time-clock rounding unless you ask a tool to.
      </p>

      <h2>Overtime</h2>
      <p>
        Overtime is <strong>arithmetic only</strong>: hours above the threshold you set (default 40 per week). Estimated pay
        applies your rate to regular hours and your multiplier (default 1.5×) to overtime hours. This is not a determination
        of legal overtime eligibility, which depends on your role, employer, and jurisdiction.
      </p>

      <h2>Pay conversions</h2>
      <ul>
        <li>Annual salary = hourly rate × hours per week × weeks per year (default 52).</li>
        <li>Hourly rate = annual salary ÷ (hours per week × weeks per year).</li>
        <li>All pay figures are gross estimates before taxes, benefits, and withholdings.</li>
      </ul>

      <h2>Business days</h2>
      <p>
        Business days are calendar days in the range minus weekend days (Saturday and Sunday by default) minus any holidays
        you add. Dates are handled in UTC to avoid timezone off-by-one errors. You choose whether the start and end dates are
        included.
      </p>

      <h2>What we don&rsquo;t do</h2>
      <ul>
        <li>No tax, legal, or employment-law determinations.</li>
        <li>No payroll processing or filing.</li>
        <li>No storage of your time-card values or pay on our servers.</li>
      </ul>
    </StaticPageTemplate>
  );
}
