"use client";

import { useEffect, useMemo, useState } from "react";
import IgnitionKey, { type KeyState } from "./IgnitionKey";

export type Lang = "fa" | "en";
type Brand = { id: string; name_fa: string; name_en: string | null; slug: string };
type Model = { id: string; brand_id: string; name_fa: string; name_en: string | null; brand_fa: string; brand_en: string | null };

const T = {
  fa: {
    title: ["موتورت", "کدام است؟"], brand: "برند", model: "مدل", pickBrand: "انتخاب برند", pickModel: "انتخاب مدل",
    turn: "سوئیچ را بچرخان", skip: "رد شدن", loading: "در حال بارگذاری کاتالوگ…",
    error: "کاتالوگ بارگذاری نشد؛ می‌توانی بدون انتخاب ادامه بدهی.", hint: "یک مدل انتخاب کن، بعد سوئیچ را بچرخان.", foot: "موتورپلاس · ساری"
  },
  en: {
    title: ["Which bike", "is yours?"], brand: "Brand", model: "Model", pickBrand: "Choose brand", pickModel: "Choose model",
    turn: "Turn the key", skip: "Skip", loading: "Loading the catalogue…",
    error: "The catalogue didn't load. You can continue without choosing.", hint: "Choose a model, then turn the key.", foot: "MotorPlus · Sari"
  }
};

export default function IntroGate({ lang, onDone }: { lang: Lang; onDone: (bike: string) => void }) {
  const t = T[lang];
  const [brands, setBrands] = useState<Brand[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [brandId, setBrandId] = useState("");
  const [modelId, setModelId] = useState("");
  const [keyState, setKeyState] = useState<KeyState>(0);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    document.body.classList.add("locked");
    return () => document.body.classList.remove("locked");
  }, []);

  useEffect(() => {
    let active = true;
    fetch("/api/catalog/motorcycles")
      .then((r) => { if (!r.ok) throw new Error("catalog"); return r.json(); })
      .then((d: { brands?: Brand[]; models?: Model[] }) => {
        if (!active) return;
        setBrands(d.brands || []); setModels(d.models || []); setLoading(false);
      })
      .catch(() => { if (!active) return; setFailed(true); setLoading(false); });
    return () => { active = false; };
  }, []);

  const brandName = (b: Brand) => (lang === "fa" ? b.name_fa : b.name_en || b.name_fa);
  const modelsOfBrand = useMemo(() => models.filter((m) => m.brand_id === brandId), [models, brandId]);
  const selected = models.find((m) => m.id === modelId);
  const label = selected ? (lang === "fa" ? selected.brand_fa + " " + selected.name_fa : (selected.brand_en || selected.brand_fa) + " " + (selected.name_en || selected.name_fa)) : "";
  const canTurn = keyState === 0 && (Boolean(modelId) || failed || (!loading && models.length === 0));

  function finish(bike: string) {
    setLeaving(true);
    window.setTimeout(() => onDone(bike), 850);
  }
  function turn() {
    if (!canTurn) return;
    setKeyState(1);
    window.setTimeout(() => setKeyState(2), 600);
    window.setTimeout(() => setKeyState(3), 1200);
    window.setTimeout(() => finish(label), 1800);
  }

  return (
    <div className={"intro" + (leaving ? " leaving" : "")} role="dialog" aria-modal="true" aria-label={t.title.join(" ")}>
      <div className="intro-top">
        <span className="hdr-logo">MOTORPLUS<b>.</b></span>
        <button type="button" className="intro-skip" onClick={() => finish("")}>{t.skip}</button>
      </div>
      <div className="intro-main">
        <h1><b>{t.title[0]}</b> {t.title[1]}</h1>
        <div className="intro-fields">
          <label>{t.brand}
            <select value={brandId} onChange={(e) => { setBrandId(e.target.value); setModelId(""); }} disabled={loading || failed || keyState > 0}>
              <option value="">{t.pickBrand}</option>
              {brands.map((b) => <option key={b.id} value={b.id}>{brandName(b)}</option>)}
            </select>
          </label>
          <label>{t.model}
            <select value={modelId} onChange={(e) => setModelId(e.target.value)} disabled={!brandId || keyState > 0}>
              <option value="">{t.pickModel}</option>
              {modelsOfBrand.map((m) => <option key={m.id} value={m.id}>{lang === "fa" ? m.name_fa : m.name_en || m.name_fa}</option>)}
            </select>
          </label>
        </div>
        <IgnitionKey state={keyState} onTurn={turn} disabled={!canTurn} caption={t.turn} ariaLabel={t.turn} />
        <p className="intro-note" role="status">{loading ? t.loading : failed ? t.error : !modelId ? t.hint : ""}</p>
      </div>
      <div className="intro-foot"><span>{t.foot}</span><span>01</span></div>
    </div>
  );
}