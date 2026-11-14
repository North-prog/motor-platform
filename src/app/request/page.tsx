"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";

const bikes = [
  { id: "honda-click", brand: "Honda", model: "Click 125 / 150", type: "اسکوتر شهری", image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=900&q=85" },
  { id: "honda-cg", brand: "Honda", model: "CG 125", type: "شهری و کاری", image: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=900&q=85" },
  { id: "yamaha", brand: "Yamaha", model: "NMAX / Aerox", type: "اسکوتر", image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=900&q=85" },
  { id: "other", brand: "سایر برندها", model: "مدل دیگر", type: "مدل موتورت را وارد کن", image: "" }
];
const steps = ["موتورسیکلت", "موقعیت", "نوع درخواست", "زمان و توضیحات", "تأیید نهایی"];

export default function RequestPage() {
  const [step, setStep] = useState(0);
  const [type, setType] = useState("service");
  const [bikeId, setBikeId] = useState("");
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

  const selectedBike = useMemo(() => bikes.find((bike) => bike.id === bikeId), [bikeId]);

  function chooseBike(id: string) {
    setBikeId(id);
    const bike = bikes.find((item) => item.id === id);
    if (bike && id !== "other") setMotorcycle(bike.brand + " " + bike.model);
    else setMotorcycle("");
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
        <div className="bike-grid">{bikes.map((bike) => <button type="button" key={bike.id} onClick={() => chooseBike(bike.id)} className={"bike-choice " + (bikeId === bike.id ? "selected" : "")}>
          <div className={"bike-photo " + (!bike.image ? "bike-placeholder" : "")}>{bike.image ? <img src={bike.image} alt={bike.model} /> : <span>+</span>}<i>{bikeId === bike.id ? "✓" : "↗"}</i></div>
          <div className="bike-info"><small>{bike.brand}</small><b>{bike.model}</b><span>{bike.type}</span></div>
        </button>)}</div>
        <div className="wizard-fields two">
          <label>مدل دقیق / تیپ<input value={motorcycle} onChange={(e) => setMotorcycle(e.target.value)} placeholder="مثلاً Honda Click 150" /></label>
          <label>سال ساخت<select value={year} onChange={(e) => setYear(e.target.value)}><option value="">انتخاب سال (اختیاری)</option>{Array.from({ length: 25 }, (_, i) => String(new Date().getFullYear() - i)).map((y) => <option key={y}>{y}</option>)}</select></label>
        </div>
        <div className="wizard-hint">کاتالوگ مدل‌ها در حال تکمیل است؛ اگر موتورت در فهرست نیست، نامش را دستی وارد کن.</div>
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
