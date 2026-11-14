# Product rules and confirmed decisions

## Market and operating model
- Market: Iran; pilot city: Sari.
- Start with the owner as administrator and first mechanic; support adding mechanics later.
- Two customer journeys: spare-parts catalog/order requests and motorcycle services.
- Persian and English from the beginning. Persian is default RTL; English is LTR.

## Parts ordering: quote-first, no displayed price
1. Customer selects motorcycle make, model, variant and year.
2. Catalog shows compatible parts. Unverified fitment must be clearly marked, never claimed as confirmed.
3. Customer selects parts, quantities, contact details and delivery/installation preference, then submits an initial request.
4. Initial request has no part price and creates no purchase commitment.
5. System notifies administrator through Telegram.
6. Administrator contacts local suppliers/shops in Sari and records current price, availability, supplier, quote time and validity.
7. Administrator prepares a customer quote. Parts, delivery, installation and fixed service labor are itemized separately.
8. Customer approves or rejects. Approval is required before sourcing/fulfillment.
9. If quote expires before approval, refresh supplier prices and issue a new quote.

## Services
- Categories: periodic maintenance, repairs, puncture/tyre, battery.
- Service prices are fixed and editable by administrator.
- Parts used during service are separately quoted/approved; never silently add work or charges.
- Customer provides motorcycle, issue description, location and preferred time.
- Mechanic records diagnosis, work performed, parts used and completion report.

## Payments
- No online payment gateway in MVP.
- Collect offline at delivery or after service.
- Record expected/received amount, time, collector, method (cash/card terminal), receipt reference and discrepancy/refund notes.
- Payment records must be auditable.

## Inventory and suppliers
- Store stock is not limited to physically owned inventory.
- Distinguish owned on-hand stock, reserved stock and supplier-reported availability.
- Supplier availability is not guaranteed until confirmed.
- Store supplier, quoted price, quote timestamp, availability state and lead time.
- Never show part prices on the public catalog.

## Notifications
- Send Telegram notification immediately after a new order request is created.
- Bot token and chat ID are secrets; never commit them.
- Notification failure must not erase/prevent saving the order; log and retry/flag it.

## Invariants
- Snapshot agreed prices into quote/order so future changes do not alter historical agreements.
- Separate order, delivery, installation/service and payment statuses.
- Validate prices, fitment, permissions and stock on the server.
- Use an audit trail for quote edits, approvals, inventory changes and cash collection.
