"use client";

import { useEffect, useState } from "react";
const SPOKES = Array.from({ length: 18 }, (_, i) => (i * 360) / 18);

function Wheel({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  return <g>
    <circle cx={cx} cy={cy} r={r * 0.9} fill="none" stroke="#0d0c0b" strokeWidth={r * 0.22} />
    <circle cx={cx} cy={cy} r={r * 0.76} fill="none" stroke="#a39d94" strokeWidth="5" />
    {SPOKES.map((a) => {
      const rad = (a * Math.PI) / 180;
      return <line key={a} x1={cx + Math.cos(rad) * r * 0.13} y1={cy + Math.sin(rad) * r * 0.13} x2={cx + Math.cos(rad) * r * 0.74} y2={cy + Math.sin(rad) * r * 0.74} stroke="#8f8a82" strokeWidth="1.6" />;
    })}
    <circle cx={cx} cy={cy} r={r * 0.44} fill="none" stroke="#cfc8bd" strokeWidth="3" opacity=".7" />
    <circle cx={cx} cy={cy} r={r * 0.13} fill="#2a2622" stroke="#a39d94" strokeWidth="3" />
  </g>;
}
function Bike() {
  return <g>
    <Wheel cx={330} cy={430} r={110} /><Wheel cx={865} cy={440} r={100} />
    <line x1={770} y1={405} x2={865} y2={440} stroke="#9b958c" strokeWidth="14" strokeLinecap="round" />
    <line x1={905} y1={245} x2={825} y2={398} stroke="#e8742a" strokeWidth="9" strokeLinecap="round" />
    <path d="M690 425 Q850 478 985 405" fill="none" stroke="#8d8780" strokeWidth="16" strokeLinecap="round" />
    <rect x={960} y={375} width={130} height={30} rx={15} transform="rotate(-18 1025 390)" fill="#6f6a63" />
    <path d="M585 292 L745 292 L765 402 L610 414 Z" fill="#2a2622" stroke="#5b544b" strokeWidth="3" />
    <rect x={635} y={262} width={92} height={40} rx={6} fill="#332e29" stroke="#5b544b" strokeWidth="3" />
    {[0, 1, 2, 3].map((i) => <line key={i} x1={640} y1={270 + i * 8} x2={722} y2={270 + i * 8} stroke="#5b544b" strokeWidth="2" />)}
    <circle cx={680} cy={350} r={26} fill="#1b1815" stroke="#6b6055" strokeWidth="3" />
    <path d="M598 410 L765 420 L742 452 L622 446 Z" fill="#4a443d" />
    <line x1={330} y1={430} x2={425} y2={212} stroke="#b9b2a8" strokeWidth="13" strokeLinecap="round" />
    <line x1={344} y1={430} x2={439} y2={218} stroke="#7c766d" strokeWidth="8" strokeLinecap="round" />
    <path d="M232 352 Q318 292 412 328 L398 352 Q318 322 246 372 Z" fill="#d8d0c4" />
    <path d="M402 238 L438 152 L528 122 L566 154 L548 240 Z" fill="#cfc7ba" />
    <path d="M470 136 L522 48 L586 60 L552 152 Z" fill="#9db8c855" stroke="#cfc7ba" strokeWidth="3" />
    <ellipse cx={421} cy={214} rx={12} ry={26} fill="#fff4d6" />
    <path d="M432 190 L545 168" stroke="#e8742a" strokeWidth="6" strokeLinecap="round" />
    <path d="M548 240 Q625 188 728 214 L742 280 Q640 306 562 292 Z" fill="#c9c1b4" />
    <path d="M600 252 Q650 232 716 244" fill="none" stroke="#e8742a" strokeWidth="6" strokeLinecap="round" />
    <path d="M722 212 L902 234 Q934 240 944 264 L934 284 L744 278 Z" fill="#1a1816" />
    <path d="M902 232 L1015 202 L1036 232 L942 272 Z" fill="#cfc7ba" />
    <line x1={895} y1={214} x2={1046} y2={194} stroke="#2a2623" strokeWidth="9" strokeLinecap="round" />
    <path d="M432 206 L476 190 L486 166" fill="none" stroke="#1a1816" strokeWidth="10" strokeLinecap="round" />
    <path d="M470 176 L504 160" stroke="#2a2623" strokeWidth="12" strokeLinecap="round" />
  </g>;
}
export default function BikeStage({ photo = "/hero/adv.webp" }: { photo?: string }) {
  const [hasPhoto, setHasPhoto] = useState(false);
  useEffect(() => {
    const img = new Image();
    img.onload = () => setHasPhoto(true);
    img.src = photo;
  }, [photo]);
  return <div className="stage">
    <div className="stage-wall" /><div className="stage-beam" /><div className="stage-floor" />
    {hasPhoto ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img className="stage-photo" src={photo} alt="Adventure motorcycle" />
    ) : <svg viewBox="0 0 1200 600" role="img" aria-label="Adventure motorcycle illustration">
      <defs>
        <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff" stopOpacity=".28" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></linearGradient>
        <mask id="reflect"><rect x="0" y="540" width="1200" height="60" fill="url(#fade)" /></mask>
      </defs>
      <ellipse cx={600} cy={546} rx={560} ry={14} fill="#000" opacity=".5" />
      <g mask="url(#reflect)" transform="translate(0 1080) scale(1 -1)"><Bike /></g><Bike />
    </svg>}
  </div>;
}