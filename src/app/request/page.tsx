"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

export default function RequestPage() {
  const [type, setType] = useState("service");
  useEffect(() => { if (new URLSearchParams(window.location.search).get("type") === "part") setType("part"); }, []);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setStatus("");
    const formElement = e.currentTarget;
    const form = new FormData(formElement);
    const payload = Object.fromEntries(form.entries());
    try {
      const response = await fetch("/api/requests", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...payload, type }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "ثبت درخواست انجام نشد.");
      setStatus("درخواستت ثبت شد. برای هماهنگی با تو تماس می‌گیریم.");
      formElement.reset();
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "خطا در ثبت درخواست");
    } finally { setBusy(false); }
  }

  return <main className="request-page" dir="rtl">
    <nav className="nav wrap"><Link className="brand" href="/"><span className="brand-mark">M</span><span>MOTOR<span className="muted">PLUS</span></span></Link><Link className="back-link" href="/">بازگشت به صفحه اصلی ←</Link></nav>
    <section className="request-wrap">
      <div className="eyebrow"><span />SARl / SERVICE DESK</div>
      <h1>درخواستت رو ثبت کن<span>.</span></h1>
      <p className="request-intro">اطلاعاتت رو وارد کن. قیمت قطعات بعد از استعلام اعلام می‌شه و هیچ هزینه‌ای بدون تأیید تو انجام نمی‌دیم.</p>
      <div className="type-switch"><button className={type === "service" ? "active" : ""} onClick={() => setType("service")}>خدمات و تعمیر</button><button className={type === "part" ? "active" : ""} onClick={() => setType("part")}>استعلام قطعه</button></div>
      <form className="request-form" onSubmit={submit}>
        <label>نام و نام خانوادگی<input name="customerName" required minLength={2} placeholder="نام شما" /></label>
        <label>شماره تماس<input name="phone" required inputMode="tel" pattern="^[0-9۰-۹+\\-\\s]{8,18}$" placeholder="09xxxxxxxxx" /></label>
        <label>مدل موتورسیکلت<input name="motorcycle" required placeholder="مثلاً هوندا کلیک ۱۵۰" /></label>
        {type === "part" ? <label>نام قطعه و تعداد<input name="requestDetails" required placeholder="مثلاً لنت جلو، ۱ عدد" /></label> : <label>نوع خدمت<select name="requestDetails" required defaultValue=""><option value="" disabled>انتخاب کن</option><option>سرویس دوره‌ای</option><option>تعمیرات</option><option>پنچرگیری و لاستیک</option><option>باتری</option><option>سایر موارد</option></select></label>}
        <label className="full">آدرس یا محدوده در ساری<textarea name="address" rows={3} required placeholder="خیابان، محله یا نشانی تقریبی" /></label>
        <label className="full">توضیحات بیشتر<textarea name="note" rows={3} placeholder="شرح مشکل، زمان مناسب و ..." /></label>
        <button className="btn primary submit-btn" disabled={busy}>{busy ? "در حال ثبت..." : "ثبت درخواست"} <span>↗</span></button>
        {status && <p className="form-status" role="status">{status}</p>}
      </form>
      <p className="form-foot">ثبت درخواست رایگان است. پرداخت آنلاین نداریم؛ هزینه نهایی قبل از انجام کار با شما هماهنگ می‌شود.</p>
    </section>
  </main>;
}