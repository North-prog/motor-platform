"use client";

export type KeyState = 0 | 1 | 2 | 3;
const MARKS = [{ label: "LOCK", angle: -62 }, { label: "ACC", angle: -21 }, { label: "ON", angle: 21 }, { label: "START", angle: 62 }];
const C = 140;
const pt = (deg: number, r: number) => ({ x: C + r * Math.sin((deg * Math.PI) / 180), y: C - r * Math.cos((deg * Math.PI) / 180) });

export default function IgnitionKey({ state, onTurn, disabled, caption, ariaLabel }: {
  state: KeyState; onTurn: () => void; disabled: boolean; caption: string; ariaLabel: string;
}) {
  const angle = MARKS[state].angle;
  return (
    <button type="button" className={"ign" + (disabled && state === 0 ? " wait" : "")} onClick={onTurn} disabled={disabled || state > 0} aria-label={ariaLabel}>
      <svg viewBox="0 0 280 280" width="240" height="240" aria-hidden="true">
        <circle cx={C} cy={C} r="104" fill="none" stroke="#3a342d" />
        <circle cx={C} cy={C} r="66" fill="#1f1c18" stroke="#4a4238" strokeWidth="2" />
        <circle cx={C} cy={C} r="12" fill="#0f0e0c" stroke="#4a4238" />
        {MARKS.map((m, i) => {
          const a = pt(m.angle, 98), b = pt(m.angle, 112), t = pt(m.angle, 128);
          const active = i <= state;
          return <g key={m.label}>
            <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={active ? "#e8742a" : "#6b6055"} strokeWidth="2" />
            <text x={t.x} y={t.y + 4} textAnchor="middle" fontSize="11" fontFamily="Manrope, sans-serif" letterSpacing="1.5" fill={active ? "#f3e9dc" : "#9c8b78"}>{m.label}</text>
          </g>;
        })}
        <g style={{ transform: "rotate(" + angle + "deg)", transformOrigin: C + "px " + C + "px", transition: "transform .6s cubic-bezier(.2,.7,.1,1)" }}>
          <rect x={C - 6} y={C - 62} width="12" height="62" rx="3" fill="#d9ccbb" />
          <rect x={C - 20} y={C - 112} width="40" height="54" rx="16" fill="#f3e9dc" />
          <circle cx={C} cy={C - 92} r="7" fill="#171512" />
          <rect x={C - 20} y={C - 76} width="40" height="5" rx="2" fill="#e8742a" />
        </g>
      </svg>
      <span className="ign-cap">{caption}</span>
    </button>
  );
}