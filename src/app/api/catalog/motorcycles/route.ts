import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export const runtime = "nodejs";

type D1Result<T> = { results: T[] };
type D1Statement = {
  bind(...values: unknown[]): D1Statement;
  all<T = Record<string, unknown>>(): Promise<D1Result<T>>;
};
type D1Binding = { prepare(query: string): D1Statement };

export async function GET() {
  try {
    const { env } = getCloudflareContext();
    const db = (env as typeof env & { DB?: D1Binding }).DB;
    if (!db) {
      return NextResponse.json({ error: "پایگاه داده در دسترس نیست." }, { status: 503 });
    }

    const [brands, models] = await Promise.all([
      db.prepare(
        "SELECT id, name_fa, name_en, slug FROM motorcycle_brands WHERE is_active = 1 ORDER BY name_fa"
      ).all<{ id: string; name_fa: string; name_en: string | null; slug: string }>(),
      db.prepare(
        `SELECT m.id, m.brand_id, m.name_fa, m.name_en, m.engine_cc,
                m.style_family, m.body_type, m.catalog_priority,
                b.name_fa AS brand_fa, b.name_en AS brand_en
         FROM motorcycle_models m
         JOIN motorcycle_brands b ON b.id = m.brand_id
         WHERE m.is_active = 1 AND b.is_active = 1
         ORDER BY m.catalog_priority ASC, b.name_fa ASC, m.name_fa ASC`
      ).all<{
        id: string; brand_id: string; name_fa: string; name_en: string | null;
        engine_cc: number | null; style_family: string | null; body_type: string;
        catalog_priority: number; brand_fa: string; brand_en: string | null;
      }>()
    ]);

    return NextResponse.json(
      { brands: brands.results, models: models.results },
      { headers: { "Cache-Control": "public, max-age=60, s-maxage=300" } }
    );
  } catch {
    return NextResponse.json({ error: "خطا در دریافت کاتالوگ موتورها." }, { status: 500 });
  }
}
