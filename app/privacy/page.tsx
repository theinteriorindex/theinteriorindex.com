import LegalShell from "@/components/LegalShell";

export const metadata = {
  title: "Privacy Policy — The Interior Index",
  description:
    "What The Interior Index collects, how we use cookies and analytics, who we share information with, and the choices and rights you have.",
};

export default function PrivacyPage() {
  return (
    <LegalShell title="Privacy Policy" updated="Effective July 2026">
      <p>
        The Interior Index (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) respects your privacy. This
        policy explains what information we collect when you visit theinteriorindex.com, how we use and share it,
        and the choices and rights you have. We&apos;ve written it to be specific about what actually happens on
        our site rather than to cover every hypothetical.
      </p>

      <h2>Scope</h2>
      <p>
        This policy applies to visitors to our website, people who subscribe to our newsletter (the Edit) or join
        a product waitlist, and anyone who contacts us. The Interior Index is an editorial and affiliate
        publication — we do not sell products directly, and we do not take orders or process payments on this
        site. When you buy something, the purchase takes place on the retailer&apos;s own website, under their
        terms and privacy policy.
      </p>

      <h2>Information we collect</h2>
      <p>
        <strong>Information you give us directly.</strong> The only personal information you actively provide is
        your email address, which you give us when you join the Edit or a product waitlist. If you email us, we
        also receive whatever information is contained in your message.
      </p>
      <p>
        <strong>Information collected automatically.</strong> When you visit, we and our analytics tools receive
        limited technical information — the pages you view, the site or link that referred you, and general
        details about your device and browser, such as type and an approximate location derived from your IP
        address. This information is aggregated and is not used to identify you personally.
      </p>

      <h2>How we use your information</h2>
      <ul>
        <li>To send you the Edit newsletter and any waitlist notifications you asked for.</li>
        <li>To understand which pages and pieces resonate, so we can improve the site.</li>
        <li>To measure whether our marketing — such as Pinterest — is working.</li>
        <li>To attribute affiliate purchases so the retailers we link to credit us correctly.</li>
        <li>To respond to your messages.</li>
        <li>To protect the site against fraud, abuse, and technical problems.</li>
      </ul>

      <h2>Cookies, tracking &amp; analytics</h2>
      <p>We use a small number of tracking technologies:</p>
      <ul>
        <li>
          <strong>Pinterest conversion tag</strong> — sets cookies to measure whether visits from Pinterest lead
          to activity on the site, and to help us reach similar audiences.
        </li>
        <li>
          <strong>Analytics</strong> — a privacy-friendly analytics tool measures page views and traffic trends without using cookies.
        </li>
        <li>
          <strong>Affiliate links</strong> — when you click a link to a retailer such as Amazon, or a brand in the
          Awin network, that retailer sets its own cookie so a resulting purchase can be attributed to us. These
          cookies are governed by the retailer&apos;s own privacy policy.
        </li>
      </ul>
      <p>
        You can control or clear cookies through your browser settings; blocking them will not stop you from
        reading the site. Our site does not currently respond to browser &ldquo;Do Not Track&rdquo; signals.
      </p>

      <h2>How we share your information</h2>
      <p>We do not sell your personal information. We share it only as needed to run the site:</p>
      <ul>
        <li>
          <strong>Service providers</strong> who operate the site on our behalf, such as our email delivery, data
          storage, hosting, and analytics providers.
        </li>
        <li>
          <strong>Advertising and affiliate partners</strong> — Pinterest (conversion measurement) and the
          affiliate networks, such as Amazon and Awin, whose links you choose to click.
        </li>
        <li>
          <strong>Legal and safety</strong> — where required by law, or to protect our rights, our users, or the
          public.
        </li>
        <li>
          <strong>Business transfers</strong> — if the site is ever acquired or merged, information may transfer
          as part of that transaction.
        </li>
      </ul>

      <h2>Aggregate and de-identified data</h2>
      <p>
        We may use anonymous, aggregated, or de-identified information — which cannot reasonably be used to
        identify you — for any purpose, including analytics and improving the site.
      </p>

      <h2>Third-party sites</h2>
      <p>
        Our site links to retailers and other websites. Once you leave The Interior Index, we are not responsible
        for the privacy practices or content of those sites, and we encourage you to read their privacy policies.
      </p>

      <h2>Data retention</h2>
      <p>
        We keep your email address until you unsubscribe or ask us to delete it. Aggregated analytics data is
        retained in line with our providers&apos; standard retention periods.
      </p>

      <h2>Security</h2>
      <p>
        We use reasonable safeguards to protect the limited information we hold. No method of transmission or
        storage is completely secure, however, and we cannot guarantee absolute security.
      </p>

      <h2>Your privacy rights and choices</h2>
      <ul>
        <li>Unsubscribe from our emails at any time using the link in any message.</li>
        <li>Control or clear cookies through your browser settings.</li>
        <li>
          Request access to, correction of, or deletion of the information we hold about you by emailing us. If
          you are in the EU or UK (under the GDPR) or in California (under the CCPA), you have additional rights,
          including the right to know what we collect and to request its deletion — we honor these requests for
          all visitors.
        </li>
      </ul>

      <h2>International visitors</h2>
      <p>
        The Interior Index is operated in the United States, and the service providers we use may process data in
        the United States. If you visit from the EU, the UK, or elsewhere, your information may be transferred to
        and processed in the US.
      </p>

      <h2>Children</h2>
      <p>
        Our site is intended for adults and is not directed to children under 16. We do not knowingly collect
        personal information from children. If you believe a child has provided us information, contact us and we
        will delete it.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        We may update this policy from time to time. When we make material changes, we will update the effective
        date shown above. Your continued use of the site after changes take effect means you accept the updated
        policy.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about your privacy, or want to exercise a right described above? Email us at{" "}
        <a href="mailto:hello@theinteriorindex.com">hello@theinteriorindex.com</a>.
      </p>
    </LegalShell>
  );
}
