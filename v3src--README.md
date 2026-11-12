# Benson Press Consulting — Website Package

**Version:** November 2026  
**Target:** `https://consulting.bensonpress.com/`  
**Stack:** Static HTML, responsive CSS, vanilla JavaScript, optional PHP backend and Square Checkout API.

This is a complete **design and implementation starter package** for Benson Press Consulting. It contains every published page route in the proposed site, custom kit-cover illustrations, search-engine metadata, accessible navigation, a consultation form handler, and configurable Square-hosted payment creation.

> **Important:** The site is built and packaged, **not deployed to the live domain**. Live contact delivery requires PHP mail transport; live Square checkout requires owner-managed API credentials. The site does not pretend to take payments before those are configured.

## Pages included

| Site page | File |
|---|---|
| Home | `index.html` |
| Services | `consulting.html` |
| Kits and license pricing | `kits.html` |
| About | `about.html` |
| Contact / consultation | `contact.html` |
| Pay | `pay.html` |
| PMO Setup Kit | `pmo-setup-kit.html` |
| AI Governance for PMOs Kit | `ai-governance-for-pmos.html` |
| Privacy | `privacy.html` |
| Terms and licenses | `terms.html` |
| Checkout next steps | `thank-you.html` |
| 404 page | `404.html` |

## Visual design system

- **Midnight navy:** `#071A2D`
- **Bronze-gold:** `#CFA658`
- **Warm paper:** `#F7F5F0`
- **Typography:** Georgia for editorial display headlines; system sans-serif stack for UI.
- **Style:** Clean, premium, executive-facing; purposeful grids, responsible visual hierarchy, strong accessibility.
- **Mobile:** Responsive from desktop to phone; accessible collapsible navigation and reduced-motion support.

## Branding note

The header references the **existing Benson Press logo** from the provided URL:

`https://consulting.bensonpress.com/assets/brand/quill-lockup-600.png?v=20261110`

This exact image URL is referenced, not duplicated in the ZIP. It will load if the existing asset remains on your domain and is publicly available. The site automatically falls back to a text mark if the image is inaccessible. The two kit-cover designs are new **illustrative website mockups** in `assets/img/`, not copies of the current published kit covers. If you require your original kit-cover art instead, replace the SVG files and preserve file names (or update the image paths).

## Try the design locally

1. Extract the entire ZIP.
2. Open `index.html` in a browser to see page layouts and navigation.
3. To test PHP behavior, run `php -S localhost:8000` in the extracted folder and open `http://localhost:8000/`.
4. In preview mode, forms do not send mail or charge cards unless the server has been properly configured.

## Deploy to your hosting

1. **Back up** your existing `consulting.bensonpress.com` site, files, server-side scripts, and database, if used.
2. Upload the files in this package into the **document root for the consulting subdomain**. Preserve your existing `assets/brand/` directory and any existing product files you want to keep.
3. Confirm the host supports PHP 8.1+ with cURL; Apache rules are supplied in `.htaccess`.
4. Set up mail routing/SPF/DKIM and verify the `contact.php` handler. **Do not assume the form sends mail based only on a frontend success state.**
5. Connect Square credentials using the **server environment variables** below. Do not add access tokens to `.html`, `.js`, or publicly readable source files.
6. Test in **Square sandbox** before selecting production.
7. Review legal page language with your own business/legal advisers and validate product licenses and fulfillment process.
8. Verify every navigation link and primary conversion flow over HTTPS on mobile and desktop.
9. Add a production PNG/JPG social preview if your social channels do not support an SVG OG image.

### Square configuration

The PHP endpoint `server/create-checkout.php` creates a **Square-hosted Payment Link** with server-validated kit prices or a validated invoice amount. It never handles card numbers.

Set environment variables in your hosting control panel or server configuration:

```text
BPC_SQUARE_TOKEN=YOUR_SQUARE_ACCESS_TOKEN
BPC_SQUARE_LOCATION_ID=YOUR_SQUARE_LOCATION_ID
BPC_SQUARE_ENV=sandbox
BPC_BASE_URL=https://consulting.bensonpress.com
BPC_CONTACT_TO=sean@bensonpress.com
BPC_FROM_EMAIL=no-reply@consulting.bensonpress.com
```

Change `BPC_SQUARE_ENV=production` **only after** completing sandbox and production tests. The Square application must have the relevant Orders/Payments permissions. Sandbox and production credentials must match their respective endpoints. For Square's documentation, see: https://developer.squareup.com/reference/square/checkout/create-payment-link

**Security / order handling:** The server, not the browser, determines kit prices. The Square checkout collects buyer contact information and returns an order record for manual fulfillment. This package does **not** include a verified webhook handler, digital-delivery automation, tax configuration, refunds automation, merchant dashboard, or reconciliation ledger. Do not issue purchased files based solely on the thank-you page. Verify payment status in your Square account before emailing the kit.

### Consultation form configuration

`server/contact.php` validates required fields, uses a honeypot field and session throttling, and calls PHP `mail()` to submit a plain-text inquiry. Configure outbound mail on your host and run a real test from an external email account. This is not a full CRM or SMTP integration. For improved deliverability, replace the mail transport with a properly authenticated SMTP provider or transactional email service.

### Exact kit prices used (USD)

| Kit | Individual | Team (up to 10) | Enterprise |
|---|---:|---:|---:|
| PMO Setup Kit | $89 | $249 | $599 |
| AI Governance for PMOs | $199 | $399 | $799 |

Digital fulfillment is **manual after verified payment**, normally within one business day, consistent with the current publicly described process. Do not guarantee delivery if this workflow is not staffed.

## Editing the website

- Content: edit the corresponding `.html` page.
- Colors/layout: `assets/css/styles.css`.
- Mobile menu, contact form handling: `assets/js/site.js`.
- Checkout browser handoff: `assets/js/commerce.js`.
- Square price map and payment link creation: `server/create-checkout.php`.
- Logo: existing domain URL in the `brand-image` elements of the HTML files.
- Kit cover illustrations: `assets/img/pmo-kit.svg` and `assets/img/ai-kit.svg`.
- Search appearance: page `<title>`, metadata, `sitemap.xml`, and `robots.txt`.

## Professional background accuracy

The website deliberately describes Sean as a **DBA candidate**, not as having completed a DBA, pending verification of an awarded doctoral degree. Confirm your preferred credential display prior to publication. The reference to National University is descriptive; no institutional endorsement is implied. The site does not claim client testimonials, verified ROI, or a certification/endorsement that has not been supplied.

## Launch caveat

Publishing the files over an existing live site could **replace your current payment/contact handlers**. Preserve and inspect the current server integration first. The package is a new design + ready-to-configure backend, not a byte-for-byte retrofit of any existing backend.
