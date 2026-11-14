"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type CatalogBrand = { id: string; name_fa: string; name_en: string | null; slug: string };
type CatalogModel = { id: string; brand_id: string; name_fa: string; name_en: string | null; engine_cc: number | null; style_family: string | null; body_type: string; catalog_priority: number; brand_fa: string; brand_en: string | null };
const styleLabels: Record<string, string> = {
  "click-style": "طرح کلیک",
  "classic-scooter": "اسکوتر کلاسیک",
  "sport-scooter": "اسکوتر اسپرت",
  "maxi-scooter": "مکسی اسکوتر",
  "adventure-scooter": "اسکوتر ادونچر",
  "city-scooter": "اسکوتر شهری"
};
const steps = ["موتورسیکلت", "موقعیت", "نوع درخواست", "زمان و توضیحات", "تأیید نهایی"];

export default function RequestPage() {
  const [step, setStep] = useState(0);
  const [type, setType] = useState("service");
  const [bikeId, setBikeId] = useState("");
  const [catalogBrands, setCatalogBrands] = useState<CatalogBrand[]>([]);
  const [catalogModels, setCatalogModels] = useState<CatalogModel[]>([]);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [catalogError, setCatalogError] = useState("");
  const [brandFilter, setBrandFilter] = useState("all");
  const [styleFilter, setStyleFilter] = useState("all");
  const [motorcycle, setMotorcycle] = useState("");
  const [year, setYear] = useState("");
  const [address, setAddress] = useState("");
  const [coordinates, setCoordinates] = useState("");
  const [service, setService] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [details, setDetails] = useState("");
  const [when, setWhen] = useState("اولین زمان ممکن");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/api/catalog/motorcycles")
      .then((response) => {
        if (!response.ok) throw new Error("دریافت فهرست موتورها ممکن نشد.");
        return response.json();
      })
      .then((data: { brands: CatalogBrand[]; models: CatalogModel[] }) => {
        if (!active) return;
        setCatalogBrands(data.brands || []);
        setCatalogModels(data.models || []);
        setCatalogLoading(false);
      })
      .catch(() => {
        if (!active) return;
        setCatalogError("فهرست موتورها بارگذاری نشد؛ می‌توانی مدل را دستی وارد کنی.");
        setCatalogLoading(false);
      });
    return () => { active = false; };
  }, []);

  const selectedBike = useMemo(() => catalogModels.find((bike) => bike.id === bikeId), [catalogModels, bikeId]);
  const visibleModels = useMemo(() => catalogModels.filter((bike) =>
    (brandFilter === "all" || bike.brand_id === brandFilter) &&
    (styleFilter === "all" || bike.style_family === styleFilter)
  ), [catalogModels, brandFilter, styleFilter]);

  function chooseBike(id: string) {
    setBikeId(id);
    const bike = catalogModels.find((item) => item.id === id);
    if (bike) setMotorcycle(bike.brand_fa + " " + bike.name_fa);
  }

  function locateMe() {
    if (!navigator.geolocation) { setStatus("مکان‌یابی در این مرورگر پشتیبانی نمی‌شود."); return; }
    setStatus("در حال دریافت موقعیت...");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const point = position.coords.latitude.toFixed(6) + ", " + position.coords.longitude.toFixed(6);
        setCoordinates(point);
        setStatus("موقعیت دریافت شد. آدرس دقیق یا نشانی نزدیک را هم وارد کن.");
      },
      () => setStatus("دسترسی به موقعیت ممکن نشد؛ آدرس را دستی وارد کن."),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  async function submit() {
    setBusy(true); setStatus("");
    const fullNote = [
      "سال ساخت: " + (year || "نامشخص"),
      "نوع خدمت: " + (type === "part" ? "استعلام قطعه" : service),
      "زمان پیشنهادی: " + when,
      coordinates ? "مختصات GPS: " + coordinates : "",
      details
    ].filter(Boolean).join(" | ");
    try {
      const response = await fetch("/api/requests", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, customerName, phone, motorcycle, requestDetails: type === "part" ? details : service, address, note: fullNote })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "ثبت درخواست انجام نشد.");
      setStatus("درخواستت با موفقیت ثبت شد. برای هماهنگی با تو تماس می‌گیریم.");
      setStep(5);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "خطا در ثبت درخواست");
    } finally { setBusy(false); }
  }

  function next() {
    setStatus("");
    if (step === 0 && (!motorcycle.trim() || !bikeId)) return setStatus("اول موتورسیکلتت را انتخاب کن.");
    if (step === 1 && !address.trim()) return setStatus("آدرس یا محدوده را وارد کن.");
    if (step === 2 && type === "service" && !service) return setStatus("نوع خدمت را انتخاب کن.");
    if (step === 3 && (!customerName.trim() || !/^[0-9۰-۹+\-\s]{8,18}$/.test(phone))) return setStatus("نام و شماره تماس معتبر را وارد کن.");
    if (step < 4) setStep(step + 1);
  }

  return <main className="wizard-page" dir="rtl">
    <header className="wizard-nav">
      <Link className="wizard-brand" href="/"><span className="wizard-logo">M</span><span>MOTOR<span>PLUS</span></span></Link>
      <Link href="/" className="wizard-exit">بازگشت به سایت <span>↗</span></Link>
    </header>
    <div className="wizard-shell">
      <div className="wizard-heading">
        <div className="wizard-kicker"><i /> MOTORPLUS SERVICE EXPERIENCE</div>
        <h1>از موتورت شروع کنیم<span>.</span></h1>
        <p>چند قدم کوتاه تا ثبت درخواست؛ هزینه‌ها قبل از انجام کار با تو هماهنگ می‌شوند.</p>
      </div>
      {step < 5 && <div className="wizard-progress">
        <div className="progress-meta"><span>مرحله {step + 1} از ۵</span><span>{Math.round(((step + 1) / 5) * 100)}٪</span></div>
        <div className="progress-track"><span style={{ width: ((step + 1) / 5) * 100 + "%" }} /></div>
        <div className="progress-steps">{steps.map((label, index) => <div key={label} className={index <= step ? "current" : ""}><b>{index + 1}</b><span>{label}</span></div>)}</div>
      </div>}

      {step === 0 && <section className="wizard-panel">
        <div className="panel-title"><div><small>01 / YOUR RIDE</small><h2>موتورسیکلتت کدومه؟</h2><p>مدل موتورت رو انتخاب کن تا خدمات مناسبش رو پیدا کنیم.</p></div><span className="panel-symbol">01</span></div>
        <div className="catalog-filters">
          <label>پیدا کردن بر اساس سبک<select value={styleFilter} onChange={(e) => setStyleFilter(e.target.value)}><option value="all">همه سبک‌ها</option>{Object.entries(styleLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></label>
          <label>برند<select value={brandFilter} onChange={(e) => setBrandFilter(e.target.value)}><option value="all">همه برندها</option>{catalogBrands.map((brand) => <option key={brand.id} value={brand.id}>{brand.name_fa}</option>)}</select></label>
        </div>
        {catalogLoading ? <div className="wizard-hint">در حال بارگذاری کاتالوگ موتورها...</div> : <>
          {catalogError && <div className="wizard-hint">{catalogError}</div>}
          <div className="bike-grid">{visibleModels.map((bike) => <button type="button" key={bike.id} onClick={() => chooseBike(bike.id)} className={"bike-choice " + (bikeId === bike.id ? "selected" : "")}>
            <div className="bike-photo bike-placeholder"><span>🛵</span><i>{bikeId === bike.id ? "✓" : "↗"}</i></div>
            <div className="bike-info"><small>{bike.brand_fa} · {styleLabels[bike.style_family || ""] || "اسکوتر"}</small><b>{bike.name_fa}</b><span>{bike.engine_cc ? bike.engine_cc + " سی‌سی" : "حجم موتور ثبت نشده"}</span></div>
          </button>)}</div>
          {visibleModels.length === 0 && <div className="wizard-hint">مدلی با این فیلتر پیدا نشد.</div>}
        </>}
        <div className="wizard-fields two">
          <label>مدل دقیق / تیپ<input value={motorcycle} onChange={(e) => setMotorcycle(e.target.value)} placeholder="مثلاً Honda Click 150" /></label>
          <label>سال ساخت<select value={year} onChange={(e) => setYear(e.target.value)}><option value="">انتخاب سال (اختیاری)</option>{Array.from({ length: 25 }, (_, i) => String(new Date().getFullYear() - i)).map((y) => <option key={y}>{y}</option>)}</select></label>
        </div>
        <div className="wizard-hint">مدل‌های کاتالوگ از دیتابیس بارگذاری می‌شوند. اگر موتورت در فهرست نیست، نام دقیقش را دستی وارد کن.</div>
      </section>}

      {step === 1 && <section className="wizard-panel">
        <div className="panel-title"><div><small>02 / YOUR LOCATION</small><h2>کجا بهت خدمات بدیم؟</h2><p>محدوده را روی نقشه ببین و آدرس یا موقعیت دقیق را ثبت کن.</p></div><span className="panel-symbol">02</span></div>
        <div className="map-frame"><iframe title="نقشه ساری" src="https://www.openstreetmap.org/export/embed.html?bbox=53.00%2C36.53%2C53.13%2C36.61&layer=mapnik&marker=36.565%2C53.06" loading="lazy" /><a href="https://www.openstreetmap.org/#map=14/36.565/53.06" target="_blank" rel="noreferrer">باز کردن نقشه بزرگ‌تر ↗</a></div>
        <button type="button" className="gps-button" onClick={locateMe}>◎ استفاده از موقعیت فعلی من</button>
        {coordinates && <div className="coordinate-note">موقعیت GPS: {coordinates}</div>}
        <div className="wizard-fields"><label>آدرس کامل یا محدوده در ساری<input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="مثلاً خیابان فرهنگ، فرهنگ ۵، پلاک ..." /></label></div>
        <div className="wizard-hint">برای دقت بیشتر، موقعیت فعلی را ارسال کن و نشانی نزدیک را هم بنویس. فعلاً پوشش خدمات در ساری است.</div>
      </section>}

      {step === 2 && <section className="wizard-panel">
        <div className="panel-title"><div><small>03 / WHAT YOU NEED</small><h2>چه کاری برات انجام بدیم؟</h2><p>نوع درخواست را انتخاب کن؛ جزئیات را در مرحله بعد می‌گیریم.</p></div><span className="panel-symbol">03</span></div>
        <div className="request-type-grid">
          <button type="button" className={type === "service" ? "type-card chosen" : "type-card"} onClick={() => setType("service")}><span>🔧</span><b>خدمات و تعمیر</b><small>سرویس، تعمیر، پنچرگیری، باتری</small></button>
          <button type="button" className={type === "part" ? "type-card chosen" : "type-card"} onClick={() => setType("part")}><span>⚙</span><b>استعلام قطعه</b><small>تهیه قطعه متناسب با موتورت</small></button>
        </div>
        {type === "service" && <div className="service-options">{["سرویس دوره‌ای و تعویض روغن", "تعمیرات و عیب‌یابی", "پنچرگیری و لاستیک", "باتری و برق", "درخواست تعمیرکار در محل"].map((item) => <button type="button" key={item} onClick={() => setService(item)} className={service === item ? "active" : ""}><span>{service === item ? "✓" : "+"}</span>{item}</button>)}</div>}
        {type === "part" && <div className="wizard-fields"><label>نام قطعه و تعداد<input value={details} onChange={(e) => setDetails(e.target.value)} placeholder="مثلاً لنت جلو، یک جفت" /></label></div>}
        <div className="wizard-hint">قیمت قطعات آنلاین نمایش داده نمی‌شود؛ ابتدا موجودی و قیمت روز استعلام می‌شود.</div>
      </section>}

      {step === 3 && <section className="wizard-panel">
        <div className="panel-title"><div><small>04 / DETAILS</small><h2>جزئیات و زمان مراجعه</h2><p>راه ارتباطی و زمان مناسب را مشخص کن.</p></div><span className="panel-symbol">04</span></div>
        <div className="wizard-fields two">
          <label>نام و نام خانوادگی<input value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="نام شما" /></label>
          <label>شماره تماس<input value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" placeholder="09xxxxxxxxx" /></label>
          <label>زمان مناسب<select value={when} onChange={(e) => setWhen(e.target.value)}><option>اولین زمان ممکن</option><option>امروز</option><option>فردا</option><option>هماهنگی تلفنی</option></select></label>
          <label>نوع هماهنگی<select defaultValue="onsite"><option value="onsite">خدمات در محل</option><option value="workshop">مراجعه به تعمیرگاه</option><option value="delivery">فقط ارسال قطعه</option></select></label>
          <label className="span-two">توضیحات بیشتر<textarea value={details} onChange={(e) => setDetails(e.target.value)} rows={4} placeholder="مشکل موتور، قطعه موردنظر یا توضیحی که به ما کمک می‌کند..." /></label>
        </div>
      </section>}

      {step === 4 && <section className="wizard-panel">
        <div className="panel-title"><div><small>05 / REVIEW</small><h2>درخواستت رو بررسی کن</h2><p>اگر همه‌چیز درسته، درخواست را ارسال کن.</p></div><span className="panel-symbol">05</span></div>
        <div className="review-list">
          <div><small>موتورسیکلت</small><b>{motorcycle} {year && "· " + year}</b></div>
          <div><small>آدرس</small><b>{address}</b>{coordinates && <span>{coordinates}</span>}</div>
          <div><small>نوع درخواست</small><b>{type === "part" ? "استعلام قطعه" : service}</b></div>
          <div><small>زمان پیشنهادی</small><b>{when}</b></div>
          <div><small>مشتری</small><b>{customerName} · {phone}</b></div>
          {details && <div><small>توضیحات</small><b>{details}</b></div>}
        </div>
        <div className="approval-note">ثبت درخواست رایگان است. هیچ هزینه‌ای بدون اعلام و تأیید تو دریافت یا اجرا نمی‌شود.</div>
      </section>}

      {step === 5 && <section className="wizard-panel success-panel"><div className="success-icon">✓</div><small>REQUEST RECEIVED</small><h2>درخواستت ثبت شد.</h2><p>{status || "به‌زودی برای هماهنگی با تو تماس می‌گیریم."}</p><Link className="wizard-primary" href="/">بازگشت به صفحه اصلی ↗</Link></section>}

      {status && step !== 5 && <div className="wizard-status" role="status">{status}</div>}
      {step < 5 && <div className="wizard-actions">
        {step > 0 && <button type="button" className="wizard-back" onClick={() => { setStatus(""); setStep(step - 1); }}>مرحله قبل</button>}
        {step < 4 ? <button type="button" className="wizard-primary" onClick={next}>ادامه <span>←</span></button> : <button type="button" className="wizard-primary" disabled={busy} onClick={submit}>{busy ? "در حال ارسال..." : "ثبت نهایی درخواست"} <span>↗</span></button>}
      </div>}
      <footer className="wizard-footer"><span>MOTORPLUS / SARI</span><span>خدمات شفاف، بدون هزینه پنهان</span></footer>
    </div>
  </main>;
}
