"use client";

import { useState } from "react";

const copy = {
  fa: {
    eyebrow: "خدمات موتورسیکلت، ساده و شفاف",
    title: "موتورت آماده‌ست؟",
    accent: "ما کنارتیم.",
    intro: "از سرویس دوره‌ای تا تعمیر در محل و تهیه قطعه؛ درخواستت رو ثبت کن، قیمت قطعات رو استعلام می‌گیریم و قبل از هر اقدامی با تو هماهنگ می‌کنیم.",
    service: "درخواست خدمات",
    parts: "استعلام قطعه",
    how: "چطور کار می‌کنیم؟",
    steps: ["درخواستت رو ثبت کن", "قیمت و موجودی رو بررسی می‌کنیم", "پیش‌فاکتور رو تأیید کن", "خدمت یا قطعه رو تحویل بگیر"],
    servicesTitle: "خدمات ما",
    services: [
      ["سرویس دوره‌ای", "روغن موتور و گیربکس، فیلتر، تسمه و بازبینی"],
      ["تعمیرات", "عیب‌یابی و تعمیرات فنی موتورسیکلت"],
      ["لاستیک و پنچرگیری", "پنچرگیری، تعویض و بررسی لاستیک"],
      ["باتری", "بررسی، تعویض و خدمات باتری"]
    ],
    partsTitle: "قطعه مناسب موتورت رو پیدا کن",
    partsText: "مدل موتورت رو انتخاب کن و قطعه موردنظرت رو درخواست بده. قیمت روی سایت نمایش داده نمی‌شه؛ قیمت و موجودی روز از تأمین‌کننده‌های ساری استعلام می‌شه.",
    partsCta: "ثبت درخواست قطعه",
    location: "شروع فعالیت از ساری",
    note: "بدون پرداخت آنلاین · بدون قیمت‌گذاری حدسی · تأیید هزینه قبل از اجرا",
    footer: "موتورپلاس — خدمات و قطعات موتورسیکلت"
  },
  en: {
    eyebrow: "Motorcycle care, made straightforward",
    title: "Is your bike ready?",
    accent: "We've got your back.",
    intro: "From routine maintenance to on-site repairs and spare parts. Send a request, receive a verified quote, and approve it before we proceed.",
    service: "Request a service",
    parts: "Ask for a part",
    how: "How it works",
    steps: ["Submit your request", "We check price and availability", "Review and approve the quote", "Get your service or part"],
    servicesTitle: "Our services",
    services: [
      ["Routine maintenance", "Engine and gearbox oil, filters, belts and inspection"],
      ["Repairs", "Motorcycle diagnostics and mechanical repairs"],
      ["Tyres & punctures", "Puncture repair, replacement and inspection"],
      ["Battery", "Battery testing, replacement and support"]
    ],
    partsTitle: "Find the right part for your bike",
    partsText: "Choose your motorcycle and request the part you need. Prices are not listed online; current price and availability are checked with local suppliers in Sari.",
    partsCta: "Request a spare part",
    location: "Launching in Sari, Iran",
    note: "No online payment · No guessed prices · Costs approved before work",
    footer: "MotorPlus — Motorcycle services & parts"
  }
};

export default function Home() {
  const [lang, setLang] = useState<"fa" | "en">("fa");
  const t = copy[lang];
  const rtl = lang === "fa";
  return (
    <main dir={rtl ? "rtl" : "ltr"} className={rtl ? "site fa" : "site en"}>
      <nav className="nav wrap">
        <a className="brand" href="#"><span className="brand-mark">M</span><span>MOTOR<span className="muted">PLUS</span></span></a>
        <div className="nav-right">
          <span className="city"><i />{t.location}</span>
          <button className="lang" onClick={() => setLang(rtl ? "en" : "fa")}>{rtl ? "EN" : "فا"}</button>
        </div>
      </nav>

      <section className="hero wrap">
        <div className="hero-copy">
          <div className="eyebrow"><span />{t.eyebrow}</div>
          <h1>{t.title}<br /><em>{t.accent}</em></h1>
          <p>{t.intro}</p>
          <div className="actions">
            <a className="btn primary" href="/request?type=service">{t.service}<span>↗</span></a>
            <a className="btn secondary" href="/request?type=part">{t.parts}<span>↗</span></a>
          </div>
          <div className="trust">{t.note}</div>
        </div>
        <div className="hero-art" aria-label="Motorcycle illustration">
          <div className="art-glow" />
          <div className="art-label">RIDE<br/>WITHOUT<br/><b>WORRY.</b></div>
          <div className="wheel wheel-one" /><div className="wheel wheel-two" />
          <svg className="bike" viewBox="0 0 650 330" role="img" aria-label="Stylized motorcycle">
            <path d="M112 235 L205 235 L270 140 L382 140 L455 235 L535 235" />
            <path d="M205 235 L260 160 L330 160 L382 140 L430 235" />
            <path d="M260 160 L225 110 L305 110 L340 145" />
            <path d="M382 140 L420 105 L480 105" />
            <path d="M290 110 L355 110 L390 135" />
            <path d="M225 110 L195 100 L160 100" />
            <path d="M270 140 L250 235 M382 140 L405 235" />
            <path d="M300 155 L350 155 L370 180 L310 180 Z" className="seat" />
            <path d="M350 180 L425 185 L455 235" />
            <circle cx="310" cy="205" r="25" className="engine"/>
            <path d="M290 185 L330 225 M330 185 L290 225" />
          </svg>
          <div className="art-caption"><b>01 / CARE</b><span>BUILT AROUND YOUR RIDE</span></div>
        </div>
      </section>

      <section className="services wrap">
        <div className="section-head"><div><div className="eyebrow"><span />WHAT WE DO</div><h2>{t.servicesTitle}</h2></div><div className="section-index">01 — 04</div></div>
        <div className="service-grid">
          {t.services.map((s, i) => <a href="/request?type=service" className="service-card" key={s[0]}>
            <div className="service-top"><span>0{i + 1}</span><span className="arrow">↗</span></div>
            <div className="service-icon">{["◉", "⌁", "◌", "ϟ"][i]}</div>
            <h3>{s[0]}</h3><p>{s[1]}</p>
          </a>)}
        </div>
      </section>

      <section className="parts wrap">
        <div className="parts-copy"><div className="eyebrow"><span />PARTS, SOURCED RIGHT</div><h2>{t.partsTitle}</h2><p>{t.partsText}</p><a className="btn primary" href="/request?type=part">{t.partsCta}<span>↗</span></a></div>
        <div className="parts-visual"><div className="parts-ring" /><div className="parts-number">02<span>/02</span></div><div className="parts-word">SOURCE<br/><b>SMART.</b></div></div>
      </section>

      <section className="process wrap">
        <div className="section-head"><div><div className="eyebrow"><span />CLEAR FROM START TO FINISH</div><h2>{t.how}</h2></div></div>
        <div className="steps">{t.steps.map((step, i) => <div className="step" key={step}><span>0{i + 1}</span><p>{step}</p></div>)}</div>
      </section>
      <footer className="footer wrap"><a className="brand" href="#"><span className="brand-mark">M</span><span>MOTOR<span className="muted">PLUS</span></span></a><span>{t.footer}</span><span>© 2026</span></footer>
    </main>
  );
}