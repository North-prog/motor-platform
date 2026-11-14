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


## App scaffold (first working slice)

The repository now includes a bilingual (Persian/English) responsive landing page, service/parts request form, and a first D1-backed request endpoint.

### Local development
```bash
npm install
npm run dev
```
Open `http://localhost:3000`. The public pages can be reviewed locally. The request API requires the Cloudflare D1 binding and is intended to be tested in the Cloudflare Workers preview/runtime.

### Cloudflare setup
1. Create a D1 database named `motor-platform-db` in your Cloudflare account.
2. Replace `REPLACE_WITH_CLOUDFLARE_D1_DATABASE_ID` in `wrangler.jsonc` with its actual database ID.
3. Apply the schema: `npx wrangler d1 migrations apply motor-platform-db --remote`.
4. Add Worker secrets `TELEGRAM_BOT_TOKEN` and `TELEGRAM_ADMIN_CHAT_ID` with `npx wrangler secret put ...`.
5. Run `npm run preview` and test a service request and a parts inquiry before deploying.
6. Deploy with `npm run deploy`, then connect the GitHub repository to Cloudflare Workers Builds for Git-based deployments.

Do not commit real tokens, database credentials, or `.dev.vars`. The D1 ID is configuration, not a secret.

### Current limitations
- The admin dashboard, supplier quote entry, quote approval screen, customer tracking, authentication, product fitment catalog, and mechanic workflow are not implemented yet.
- Parts inquiries are stored as draft customer orders with the requested part details in the note; they do not create catalog line items until the product catalog/admin flow is built.
- Telegram notification is best-effort in this first slice. The database outbox table exists in the schema, but retry processing is a later task.
- No deployment has been performed from this repository yet. Cloudflare account access, D1 creation, secrets, GitHub build connection, and access testing from inside Iran are still required.
