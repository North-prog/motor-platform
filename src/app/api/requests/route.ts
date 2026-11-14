import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export const runtime = "nodejs";

type RequestPayload = {
  type?: string; customerName?: string; phone?: string; motorcycle?: string;
  requestDetails?: string; address?: string; note?: string;
};

function clean(value: unknown, max = 500) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: NextRequest) {
  let body: RequestPayload;
  try { body = await request.json() as RequestPayload; }
  catch { return NextResponse.json({ error: "اطلاعات ارسالی معتبر نیست." }, { status: 400 }); }

  const type = body.type === "part" ? "part" : body.type === "service" ? "service" : "";
  const customerName = clean(body.customerName, 120);
  const phone = clean(body.phone, 24);
  const motorcycle = clean(body.motorcycle, 120);
  const details = clean(body.requestDetails, 500);
  const address = clean(body.address, 1000);
  const note = clean(body.note, 1500);

  if (!type || customerName.length < 2 || !/^[0-9۰-۹+\-\s]{8,18}$/.test(phone) || !motorcycle || !details || !address) {
    return NextResponse.json({ error: "لطفاً فیلدهای ضروری را درست تکمیل کن." }, { status: 400 });
  }

  try {
    const { env } = getCloudflareContext();
    const db = (env as typeof env & { DB?: D1Database }).DB;
    if (!db) return NextResponse.json({ error: "سامانه هنوز به پایگاه داده متصل نشده است. لطفاً بعداً دوباره تلاش کن." }, { status: 503 });

    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    if (type === "service") {
      await db.prepare(`INSERT INTO service_jobs (id, customer_name, customer_phone, address_text, issue_description, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, 'requested', ?, ?)`)
        .bind(id, customerName, phone, address, motorcycle + " — " + details + (note ? " — " + note : ""), now, now).run();
    } else {
      await db.prepare(`INSERT INTO customer_orders (id, order_number, customer_name, customer_phone, delivery_address_text, customer_note, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, 'submitted', ?, ?)`)
        .bind(id, "MP-" + Date.now().toString().slice(-8), customerName, phone, address, "موتورسیکلت: " + motorcycle + " | قطعه: " + details + (note ? " | " + note : ""), now, now).run();
    }

    const token = (env as typeof env & { TELEGRAM_BOT_TOKEN?: string }).TELEGRAM_BOT_TOKEN;
    const chatId = (env as typeof env & { TELEGRAM_ADMIN_CHAT_ID?: string }).TELEGRAM_ADMIN_CHAT_ID;
    if (token && chatId) {
      const message = [
        type === "part" ? "🧩 درخواست استعلام قطعه" : "🔧 درخواست خدمات",
        "نام: " + customerName, "تلفن: " + phone, "موتور: " + motorcycle,
        "درخواست: " + details, "آدرس: " + address, note ? "توضیحات: " + note : "",
        "شناسه: " + id
      ].filter(Boolean).join("\n");
      try {
        await fetch("https://api.telegram.org/bot" + token + "/sendMessage", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: chatId, text: message })
        });
      } catch { /* Request is saved; notification can be retried after deployment. */ }
    }
    return NextResponse.json({ ok: true, id });
  } catch {
    return NextResponse.json({ error: "خطا در ثبت درخواست. لطفاً دوباره تلاش کن." }, { status: 500 });
  }
}