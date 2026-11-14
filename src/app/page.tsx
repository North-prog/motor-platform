"use client";

import { useEffect, useState } from "react";
import BikeStage from "../components/BikeStage";
import IntroGate, { type Lang } from "../components/IntroGate";
import Reveal from "../components/Reveal";

const copy = {
  fa: {
    menu: "منو", close: "بستن", cta: "ثبت درخواست", langBtn: "EN",
    nav: [["خدمات", "#services"], ["قطعات", "#parts"], ["روش کار", "#process"], ["ثبت درخواست", "/request"]],
    h1: ["تنها گاراژی که", "موتورت لازم دارد"],
    sub: "موتورت را انتخاب کن؛ سرویس را رزرو می‌کنیم و قطعه را پس از تأیید تأمین‌کننده قیمت می‌دهیم.",
    service: "درخواست خدمات", part: "استعلام قطعه", ride: "موتور تو: ",
    svcTitle: ["همه‌چیز،", "برای یک موتور"],
    svcSub: "یک‌بار موتورت را انتخاب کن. هر چیزی که بعدش می‌بینی دربارهٔ همان موتور است.",
    services: [
      ["سرویس دوره‌ای", "بازبینی کامل طبق زمان‌بندی سازنده."],
      ["روغن موتور", "تعویض روغن و فیلتر، همان‌جا که هستی."],
      ["روغن گیربکس", "مخصوص اسکوترها و گیربکس‌های اتومات."],
      ["تسمه", "بازبینی و تعویض تسمه قبل از خرابی."],
      ["تعمیرات مکانیکی", "عیب‌یابی و تعمیر، با هزینهٔ تأییدشده."],
      ["لاستیک و پنچری", "پنچرگیری، تعویض و بررسی باد و آج."],
      ["باتری", "تست، شارژ و تعویض باتری."],
      ["در محل و رزرو", "تعمیرکار به آدرس تو می‌آید یا زمان رزرو می‌کنی."]
    ],
    partsTitle: ["قطعه‌ای که", "به موتور تو می‌خورد"],
    partsSub: "قیمت روی سایت نمایش داده نمی‌شود. موجودی و قیمت روز از تأمین‌کننده‌ها استعلام می‌شود.",
    partsSteps: [
      ["برند", "از میان برندهای موجود در کاتالوگ."],
      ["مدل", "مدل دقیق موتورت را انتخاب کن."],
      ["تیپ و سال", "تیپ و سال ساخت را وارد کن."],
      ["درخواست قطعه", "نام قطعه را بنویس و ثبت کن."]
    ],
    partsEnd: "بعد از تأیید تأمین‌کننده، پیش‌فاکتور برایت ارسال می‌شود. بدون تأیید تو هیچ سفارشی انجام نمی‌شود.",
    processTitle: ["روشن،", "از اول تا آخر"],
    steps: ["درخواستت را ثبت کن", "قیمت و موجودی را بررسی می‌کنیم", "پیش‌فاکتور را تأیید کن", "خدمت یا قطعه را تحویل بگیر"],
    closing: ["موتورت", "آماده است؟"], closingNote: "بدون پرداخت آنلاین. هزینه قبل از اجرا تأیید می‌شود.",
    footer: "موتورپلاس — خدمات و قطعات موتورسیکلت · شروع از ساری"
  },
  en: {
    menu: "Menu", close: "Close", cta: "Request", langBtn: "فا",
    nav: [["Services", "#services"], ["Spare parts", "#parts"], ["How it works", "#process"], ["Request", "/request"]],
    h1: ["The only garage", "your bike will ever need"],
    sub: "Pick your bike. We book the service, and quote parts once a supplier has verified them.",
    service: "Request a service", part: "Ask for a part", ride: "Your ride: ",
    svcTitle: ["Everything,", "for one bike"],
    svcSub: "Choose your bike once. Everything after it is about that bike.",
    services: [
      ["Periodic maintenance", "A full check on the maker's schedule."],
      ["Engine oil", "Oil and filter changed where you are."],
      ["Gearbox oil", "For scooters and automatic gearboxes."],
      ["Belts", "Checked and replaced before they fail."],
      ["Mechanical repairs", "Diagnosis and repair with an approved cost."],
      ["Tyres & punctures", "Puncture repair, replacement, pressure and tread checks."],
      ["Battery", "Testing, charging and replacement."],
      ["On-site & scheduled", "A mechanic comes to you, or you book a slot."]
    ],
    partsTitle: ["Parts that fit", "your exact bike"],
    partsSub: "Prices are not listed online. Current price and availability are checked with suppliers.",
    partsSteps: [
      ["Brand", "From the brands in the catalogue."],
      ["Model", "Choose your exact model."],
      ["Variant & year", "Enter the variant and model year."],
      ["Part request", "Name the part and submit."]
    ],
    partsEnd: "Once a supplier has verified it, we send you a quotation. Nothing is ordered without your approval.",
    processTitle: ["Clear,", "start to finish"],
    steps: ["Submit your request", "We check price and availability", "Approve the quotation", "Receive your service or part"],
    closing: ["Is your bike", "ready?"], closingNote: "No online payment. Costs are approved before any work.",
    footer: "MotorPlus — motorcycle services & spare parts · starting in Sari"
  }
};

export default function Home() {
  const [lang, setLang] = useState<Lang>("fa");
  const [introDone, setIntroDone] = useState(false);
  const [bike, setBike] = useState("");
  const [menu, setMenu] = useState(false);
  const [solid, setSolid] = useState(false);
  const [progress, setProgress] = useState(0);
  const t = copy[lang];
  const rtl = lang === "fa";

  useEffect(() => {
    try {
      if (sessionStorage.getItem("mp_intro")) {
        setIntroDone(true);
        setBike(sessionStorage.getItem("mp_bike") || "");
      }
    } catch { /* storage unavailable */ }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = rtl ? "rtl" : "ltr";
  }, [lang, rtl]);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        setSolid(window.scrollY > 40);
        setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(frame); };
  }, []);

  useEffect(() => {
    document.body.classList.toggle("locked", menu);
    return () => { if (menu) document.body.classList.remove("locked"); };
  }, [menu]);

  function introFinished(label: string) {
    try { sessionStorage.setItem("mp_intro", "1"); sessionStorage.setItem("mp_bike", label); } catch { /* ignore */ }
    setBike(label);
    setIntroDone(true);
  }

  return (
    <main dir={rtl ? "rtl" : "ltr"} className={"site " + (rtl ? "fa" : "en")}>
      {!introDone && <IntroGate lang={lang} onDone={introFinished} />}
      <header className={"hdr" + (solid ? " solid" : "")}>
        <button type="button" className="hdr-menu" onClick={() => setMenu(true)} aria-label={t.menu}><i /><span>{t.menu}</span></button>
        <a className="hdr-logo" href="#">MOTORPLUS<b>.</b></a>
        <a className="pill" href="/request">{t.cta}</a>
        <span className="hdr-progress" style={{ transform: "scaleX(" + progress + ")" }} />
      </header>
      <nav className={"menu" + (menu ? " open" : "")} aria-hidden={!menu}>
        <button type="button" className="menu-close" onClick={() => setMenu(false)}>{t.close}</button>
        {t.nav.map(([label, href]) => <a key={href} href={href} onClick={() => setMenu(false)} tabIndex={menu ? 0 : -1}>{label}</a>)}
        <button type="button" className="lang" onClick={() => setLang(rtl ? "en" : "fa")} tabIndex={menu ? 0 : -1}>{t.langBtn}</button>
      </nav>
      <section className={"hero" + (introDone ? " in" : "")}>
        <BikeStage />
        <div className="hero-shade" />
        {bike && <div className="ride-chip">{t.ride}{bike}</div>}
        <div className="hero-body">
          <h1><b>{t.h1[0]}</b> {t.h1[1]}</h1>
          <div className="hero-row">
            <p>{t.sub}</p>
            <div className="hero-cta">
              <a className="pill fill" href="/request?type=service">{t.service}</a>
              <a className="link" href="/request?type=part">{t.part}</a>
            </div>
          </div>
        </div>
      </section>
      <section className="sec" id="services">
        <Reveal><div className="sec-head"><h2><b>{t.svcTitle[0]}</b> {t.svcTitle[1]}</h2><p>{t.svcSub}</p></div></Reveal>
        <Reveal><div className="rows">
          {t.services.map(([title, text]) => <a className="row" key={title} href="/request?type=service" style={{ textDecoration: "none" }}><h3>{title}</h3><p>{text}</p></a>)}
        </div></Reveal>
      </section>
      <section className="sec parts" id="parts">
        <Reveal><div className="sec-head"><h2><b>{t.partsTitle[0]}</b> {t.partsTitle[1]}</h2><p>{t.partsSub}</p></div></Reveal>
        <Reveal>
          <div className="parts-flow">{t.partsSteps.map(([title, text]) => <div className="pstep" key={title}><h3>{title}</h3><p>{text}</p></div>)}</div>
          <div className="parts-end"><p>{t.partsEnd}</p><a className="pill dark" href="/request?type=part">{t.part}</a></div>
        </Reveal>
      </section>
      <section className="sec" id="process">
        <Reveal><div className="sec-head"><h2><b>{t.processTitle[0]}</b> {t.processTitle[1]}</h2><span /></div></Reveal>
        <Reveal><div className="steps">{t.steps.map((step, i) => <div className="step" key={step}><b>0{i + 1}</b><p>{step}</p></div>)}</div></Reveal>
      </section>
      <section className="sec closing"><Reveal><h2><b>{t.closing[0]}</b> {t.closing[1]}</h2><a className="pill fill" href="/request">{t.cta}</a><small>{t.closingNote}</small></Reveal></section>
      <footer className="foot"><span className="hdr-logo">MOTORPLUS<b>.</b></span><span>{t.footer}</span><span>© 2026</span></footer>
    </main>
  );
}