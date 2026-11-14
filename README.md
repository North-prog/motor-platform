# Motor Platform

Bilingual Persian/English motorcycle parts catalog, quote-based ordering, and on-demand service platform. Initial pilot: Sari, Iran.

## Confirmed product rules
- Parts are catalog items, not priced products. Never display fixed/live part prices.
- Customer submits an initial request without payment.
- Admin obtains current prices and availability from local suppliers, records a quote, and sends it for customer approval.
- Customer approval is required before sourcing/fulfillment.
- Service labor prices are fixed and admin-managed.
- No online payment gateway in MVP. Collect offline at delivery or after service and record it.
- Notify the administrator through Telegram after every new order request.
- Supplier availability is separate from owned stock and must be confirmed.

## Initial technical direction
- Frontend: Next.js + TypeScript
- API: Cloudflare Workers
- Initial database: Cloudflare D1
- Product images: Cloudflare R2 when needed
- Source of truth: this private GitHub repository
- Deployment: GitHub-connected Cloudflare deployment
- Keep business logic portable for a later VPS/PostgreSQL migration.

Repository foundation initialized. See docs/ for product rules, architecture, lifecycle and roadmap.
