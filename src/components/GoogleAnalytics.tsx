import Script from "next/script";

/**
 * Countries where analytics cookies need consent before they are set (EEA,
 * UK, Switzerland). There is no consent banner, so visitors from these places
 * get Consent Mode's cookieless pings instead of GA cookies.
 */
const CONSENT_REGIONS = [
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR", "HU", "IE", "IT", "LV",
  "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK", "SI", "ES", "SE", "IS", "LI", "NO", "GB", "CH",
];

/**
 * GA4 via gtag.js, loaded only when the owner has entered a measurement ID in
 * Features → Visitor analytics. Advertising signals stay off everywhere: the
 * site runs no ads, and the privacy policy says so.
 */
export default function GoogleAnalytics({ id }: { id: string }) {
  const init = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('consent', 'default', {
  ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied',
  analytics_storage: 'denied', region: ${JSON.stringify(CONSENT_REGIONS)}
});
gtag('consent', 'default', {
  ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied',
  analytics_storage: 'granted'
});
gtag('set', 'ads_data_redaction', true);
gtag('js', new Date());
gtag('config', ${JSON.stringify(id)}, { allow_google_signals: false });
`;
  return (
    <>
      <Script id="ga-init" strategy="afterInteractive">
        {init}
      </Script>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" />
    </>
  );
}
