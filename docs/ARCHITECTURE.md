# Architecture

## Prototype deployment
- GitHub is the source of truth.
- Cloudflare Workers hosts API logic.
- Cloudflare Pages/Workers serves the web app, depending on the selected Next.js adapter and current platform support.
- Cloudflare D1 is the initial prototype database.
- Cloudflare R2 stores product/service images when needed.
- Telegram Bot API sends administrator notifications.

## Portability
- Keep domain rules independent of Cloudflare-specific request/context objects.
- Put database access behind repository/data-access modules.
- Keep schema changes in SQL migration files.
- Keep secrets in Cloudflare environment secrets or ignored local .dev.vars.
- Avoid hard-coding Cloudflare URLs/bindings throughout the UI.
- Document a later migration path to PostgreSQL on a VPS. D1 is SQLite-compatible, not PostgreSQL; SQL and data-access differences must be handled deliberately.

## Initial modules
Identity/roles; customers/addresses/motorcycles; motorcycle catalog/fitment; parts catalog; suppliers/quotes; customer orders/quote approvals; services/fixed prices; mechanics/service jobs; delivery/installation; offline collections; Telegram notifications; admin audit/localization.

## Reliability and security
- Validate all input on the server.
- Use idempotency for order submission and cash collection.
- Never trust browser-submitted prices, stock or role claims.
- Store money as integer Rial; label Toman/Rial explicitly in UI.
- Store timestamps in UTC and display Iran local time (Asia/Tehran).
- Rate-limit OTP/login and public order endpoints.
- Back up/export D1 data regularly; a free prototype database must not be the only copy.
