# Benson Press Consulting — Launch Checklist

## Before deploying
- [ ] Back up all current subdomain files and database, if any.
- [ ] Confirm new files will not overwrite any operational Square handler that is not reproduced in this ZIP.
- [ ] Verify your brand logo is accessible at `assets/brand/quill-lockup-600.png`.
- [ ] If needed, replace the illustrative kit covers with approved original cover art.
- [ ] Confirm service wording, kit files, product licenses, and prices.
- [ ] Verify the accurate displayed academic credential (DBA candidate vs awarded DBA).
- [ ] Obtain final review of privacy policy and terms; they're draft text.

## Technical setup
- [ ] Deploy to HTTPS-enabled hosting on `consulting.bensonpress.com`.
- [ ] Confirm PHP 8.1+ and cURL are available.
- [ ] Set contact recipient/sender environment variables and configure mail delivery.
- [ ] Configure SPF, DKIM, DMARC for sender domain.
- [ ] Configure Square **sandbox** token and location ID.
- [ ] Test all 6 product/license price combinations in sandbox.
- [ ] Test invoice and custom payment amounts: $1, $25,000, invalid amounts and cents.
- [ ] Verify Square supports your payment methods, taxes, and applicable checkout terms.
- [ ] Inspect Square order details and buyer email for manual kit fulfillment.
- [ ] Switch Square to **production** credentials after successful end-to-end tests.
- [ ] Check no API token exists in frontend source or uploaded public code.
- [ ] Check outgoing consultation email delivery and spam folder.
- [ ] Test that `thank-you.html` does not serve as proof of payment.

## UX and QA
- [ ] Test menu and all navigation across desktop, tablet and mobile.
- [ ] Test keyboard navigation, focus outlines, and reduced-motion behavior.
- [ ] Test contact form validation, submission, blocked spam and error fallback.
- [ ] Confirm contact query-string selection from service and kit CTA links.
- [ ] Test in Chrome, Edge, Safari, and Firefox.
- [ ] Inspect page titles/descriptions and social cards.
- [ ] Submit sitemap to search engine console if desired.
- [ ] Confirm all legal links, email links, and publishing links work.
- [ ] Ensure brand logo and illustrations load with no broken assets.

## Operations
- [ ] Assign who receives consultation inquiries and how quickly you plan to reply.
- [ ] Assign who verifies Square orders and emails kit files.
- [ ] Define how you track license, customer, order, invoice, and delivery status.
- [ ] Establish a routine to review site content, pricing, and operating contacts.
