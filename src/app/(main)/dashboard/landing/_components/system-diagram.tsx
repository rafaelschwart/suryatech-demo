"use client";

/*
 * Technical drawings in the growmodo language: isometric line work, white faces on paper, mono
 * labels on the objects, one signal color for the flow. Drawn by hand in SVG (30-degree
 * isometric), no renders. Dashed flows animate unless the visitor prefers reduced motion.
 */

const INK = "#0e1a33";
const RULE = "rgba(14,26,51,0.55)";
const FACE = "#ffffff";
const FACE_2 = "#eef0f4";
const FACE_3 = "#dfe3ea";
const SIGNAL = "#F2A900";
const MONO = "var(--font-jetbrains-mono), 'JetBrains Mono', ui-monospace, monospace";

const COS = Math.cos(Math.PI / 6);
const SIN = 0.5;
export function iso(x: number, y: number, z: number, ox = 0, oy = 0): [number, number] {
  return [ox + (x - y) * COS, oy + (x + y) * SIN - z];
}
function pts(list: [number, number, number][], ox: number, oy: number) {
  return list
    .map(([x, y, z]) =>
      iso(x, y, z, ox, oy)
        .map((v) => v.toFixed(1))
        .join(","),
    )
    .join(" ");
}

/** A box with its three visible faces. Labels sit on the left face, drawn in the face's plane. */
export function IsoBox({
  ox,
  oy,
  w,
  d,
  h,
  label,
  sub,
  stroke = RULE,
  dashed = false,
  accent = false,
  labelSize = 9,
}: {
  ox: number;
  oy: number;
  w: number;
  d: number;
  h: number;
  label?: string;
  sub?: string;
  stroke?: string;
  dashed?: boolean;
  accent?: boolean;
  labelSize?: number;
}) {
  const top = pts(
    [
      [0, 0, h],
      [w, 0, h],
      [w, d, h],
      [0, d, h],
    ],
    ox,
    oy,
  );
  const left = pts(
    [
      [0, d, 0],
      [w, d, 0],
      [w, d, h],
      [0, d, h],
    ],
    ox,
    oy,
  );
  const right = pts(
    [
      [w, 0, 0],
      [w, d, 0],
      [w, d, h],
      [w, 0, h],
    ],
    ox,
    oy,
  );
  const a = iso(w / 2, d, h / 2, ox, oy);
  const common = {
    stroke,
    strokeWidth: 1.1,
    strokeDasharray: dashed ? "3 3" : undefined,
    strokeLinejoin: "round" as const,
  };
  const halo = { stroke: FACE_2, strokeWidth: 3.5, paintOrder: "stroke" as const, strokeLinejoin: "round" as const };
  return (
    <g>
      <polygon points={top} fill={accent ? SIGNAL : FACE} {...common} />
      <polygon points={left} fill={FACE_2} {...common} />
      <polygon points={right} fill={FACE_3} {...common} />
      {label ? (
        <g>
          <text
            x={a[0]}
            y={a[1] - (sub ? 2 : -3)}
            fill={INK}
            fontFamily={MONO}
            fontSize={labelSize}
            letterSpacing="0.06em"
            fontWeight="500"
            textAnchor="middle"
            {...halo}
          >
            {label}
          </text>
          {sub ? (
            <text
              x={a[0]}
              y={a[1] + labelSize}
              fill="rgba(14,26,51,0.6)"
              fontFamily={MONO}
              fontSize={labelSize * 0.82}
              letterSpacing="0.04em"
              textAnchor="middle"
              {...halo}
            >
              {sub}
            </text>
          ) : null}
        </g>
      ) : null}
    </g>
  );
}

function Leader({ from, to, text }: { from: [number, number]; to: [number, number]; text: string }) {
  const right = to[0] > from[0];
  return (
    <g>
      <line x1={from[0]} y1={from[1]} x2={to[0]} y2={to[1]} stroke={SIGNAL} strokeWidth="1" />
      <circle cx={from[0]} cy={from[1]} r="2.2" fill={SIGNAL} />
      <text
        x={to[0] + (right ? 6 : -6)}
        y={to[1] + 3.5}
        fill={INK}
        fontFamily={MONO}
        fontSize="10"
        letterSpacing="0.06em"
        fontWeight="500"
        textAnchor={right ? "start" : "end"}
      >
        {text}
      </text>
    </g>
  );
}

function Sheet({
  w,
  h,
  fig,
  sheet,
  children,
}: {
  w: number;
  h: number;
  fig: string;
  sheet: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <defs>
        <pattern id="sd-dots" width="18" height="18" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.9" fill="rgba(14,26,51,0.16)" />
        </pattern>
        <style>{`
          .sd-flow { stroke-dasharray: 5 6; animation: sd-dash 1.4s linear infinite; }
          @keyframes sd-dash { to { stroke-dashoffset: -22; } }
          @media (prefers-reduced-motion: reduce) { .sd-flow { animation: none; } }
        `}</style>
      </defs>
      <rect width={w} height={h} fill="url(#sd-dots)" />
      {[
        [18, 18],
        [w - 18, 18],
        [18, h - 18],
        [w - 18, h - 18],
      ].map(([x, y]) => (
        <g key={`${x}-${y}`} stroke="rgba(14,26,51,0.5)" strokeWidth="1">
          <line x1={x - 6} y1={y} x2={x + 6} y2={y} />
          <line x1={x} y1={y - 6} x2={x} y2={y + 6} />
        </g>
      ))}
      <text x="34" y="22" fill="rgba(14,26,51,0.55)" fontFamily={MONO} fontSize="9.5" letterSpacing="0.08em">
        {fig}
      </text>
      <text
        x={w - 34}
        y={h - 14}
        fill="rgba(14,26,51,0.55)"
        fontFamily={MONO}
        fontSize="9.5"
        letterSpacing="0.08em"
        textAnchor="end"
      >
        {sheet}
      </text>
      {children}
    </>
  );
}

/** FIG. 01: the unit and the flow of a session. */
export function SystemDiagram({ className }: { className?: string }) {
  const ox = 330;
  const oy = 268;
  const post1 = pts(
    [
      [14, 12, 150],
      [16, 12, 150],
      [16, 12, 176],
      [14, 12, 176],
    ],
    ox,
    oy,
  );
  const post2 = pts(
    [
      [14, 32, 150],
      [16, 32, 150],
      [16, 32, 176],
      [14, 32, 176],
    ],
    ox,
    oy,
  );
  const canopy = pts(
    [
      [-30, -8, 168],
      [90, -8, 196],
      [90, 52, 196],
      [-30, 52, 168],
    ],
    ox,
    oy,
  );
  const canopyEdge = pts(
    [
      [-30, 52, 168],
      [90, 52, 196],
      [90, 52, 192],
      [-30, 52, 164],
    ],
    ox,
    oy,
  );
  const cells: string[] = [];
  for (let i = 1; i < 6; i++) {
    const x = -30 + i * 20;
    const z = 168 + (x + 30) * (28 / 120);
    cells.push(
      pts(
        [
          [x, -8, z],
          [x, 52, z],
        ],
        ox,
        oy,
      ),
    );
  }
  for (let j = 1; j < 3; j++) {
    const y = -8 + j * 20;
    cells.push(
      pts(
        [
          [-30, y, 168],
          [90, y, 196],
        ],
        ox,
        oy,
      ),
    );
  }
  const carOx = ox + 250;
  const carOy = oy + 60;
  const cable = `M ${iso(60, 44, 96, ox, oy).join(" ")} C ${iso(120, 44, 40, ox, oy).join(" ")} ${iso(-10, 20, 30, carOx, carOy).join(" ")} ${iso(0, 28, 26, carOx, carOy).join(" ")}`;
  const sun = iso(-70, -40, 240, ox, oy);
  const sunToCanopy = `M ${sun[0] + 18} ${sun[1] + 10} L ${iso(20, 20, 186, ox, oy).join(" ")}`;

  return (
    <svg
      viewBox="0 0 760 470"
      role="img"
      aria-label="Isometric drawing of the SuryaTech unit: solar canopy on two posts, cabinet with the DC charger, battery bay below, cable to a vehicle"
      className={className}
    >
      <title>The unit, as a drawing</title>
      <Sheet w={760} h={470} fig="FIG. 01 · THE UNIT AND ONE SESSION" sheet="SHEET 01 OF 02">
        <circle cx={sun[0]} cy={sun[1]} r="14" fill="none" stroke={SIGNAL} strokeWidth="1.4" />
        {Array.from({ length: 8 }).map((_, i) => {
          const a = (i / 8) * Math.PI * 2;
          return (
            <line
              key={a}
              x1={sun[0] + Math.cos(a) * 19}
              y1={sun[1] + Math.sin(a) * 19}
              x2={sun[0] + Math.cos(a) * 25}
              y2={sun[1] + Math.sin(a) * 25}
              stroke={SIGNAL}
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          );
        })}
        <path d={sunToCanopy} fill="none" stroke={SIGNAL} strokeWidth="1.4" className="sd-flow" />

        <polygon
          points={pts(
            [
              [-14, -12, 0],
              [78, -12, 0],
              [78, 60, 0],
              [-14, 60, 0],
            ],
            ox,
            oy,
          )}
          fill={FACE_2}
          stroke={RULE}
          strokeWidth="1"
        />

        <IsoBox ox={ox} oy={oy} w={60} d={44} h={58} label="BATTERY" sub="storage bay" />
        <IsoBox ox={ox} oy={oy - 58} w={60} d={44} h={92} label="DC CHARGER" sub="cabinet" />
        <polygon
          points={pts(
            [
              [60, 10, 84],
              [60, 22, 84],
              [60, 22, 108],
              [60, 10, 108],
            ],
            ox,
            oy,
          )}
          fill={FACE}
          stroke={RULE}
          strokeWidth="1"
        />
        <polygon
          points={pts(
            [
              [16, 44, 118],
              [44, 44, 118],
              [44, 44, 136],
              [16, 44, 136],
            ],
            ox,
            oy,
          )}
          fill={INK}
          opacity="0.85"
        />

        <polygon points={post1} fill={FACE_3} stroke={RULE} strokeWidth="1" />
        <polygon points={post2} fill={FACE_3} stroke={RULE} strokeWidth="1" />
        <polygon points={canopyEdge} fill={FACE_3} stroke={RULE} strokeWidth="1" />
        <polygon points={canopy} fill={FACE} stroke={RULE} strokeWidth="1.1" strokeLinejoin="round" />
        {cells.map((c) => (
          <polyline key={c} points={c} fill="none" stroke="rgba(14,26,51,0.25)" strokeWidth="0.8" />
        ))}

        <IsoBox ox={carOx + 10} oy={carOy - 4} w={100} d={40} h={30} label="VEHICLE" sub="CCS inlet" dashed />
        <path d={cable} fill="none" stroke={SIGNAL} strokeWidth="1.6" className="sd-flow" />

        <Leader from={iso(30, 22, 196, ox, oy)} to={[ox - 150, oy - 175]} text="CANOPY · PV" />
        <Leader from={iso(60, 16, 96, ox, oy)} to={[ox + 190, oy - 120]} text="CONNECTOR · DC" />
        <Leader from={iso(30, 44, 30, ox, oy)} to={[ox - 150, oy + 60]} text="BATTERY · RESERVE" />
        <Leader from={iso(30, -12, 0, ox, oy)} to={[ox - 90, oy + 150]} text="PAD · NO TRENCH" />
        <Leader from={iso(60, 20, 30, carOx + 10, carOy - 4)} to={[carOx + 30, carOy - 92]} text="GRID · BACKUP ONLY" />
      </Sheet>
    </svg>
  );
}

/** FIG. 02: what a grid-tied fast charger needs before the first session. */
export function OldModelDiagram({ className }: { className?: string }) {
  const oy = 112;
  const boxes: [number, string, string][] = [
    [56, "FEEDER", "utility upgrade"],
    [174, "XFORMER", "pad + permit"],
    [292, "TRENCH", "conduit"],
    [410, "CHARGER", "grid-tied"],
  ];
  return (
    <svg
      viewBox="0 0 540 200"
      role="img"
      aria-label="Four dashed boxes in a chain: feeder, transformer, trench, charger"
      className={className}
    >
      <title>The grid-tied chain</title>
      <Sheet w={540} h={200} fig="FIG. 02 · THE GRID-TIED CHAIN" sheet="SHEET 02 OF 02">
        {boxes.map(([x, label, sub], i) => (
          <g key={label}>
            <IsoBox ox={x} oy={oy} w={72} d={44} h={40} label={label} sub={sub} dashed={i < 3} labelSize={11} />
            {i < 3 ? (
              <path
                d={`M ${x + 88} ${oy - 22} L ${x + 118} ${oy - 22}`}
                fill="none"
                stroke={SIGNAL}
                strokeWidth="1.4"
                className="sd-flow"
                markerEnd="url(#sd-arrow)"
              />
            ) : null}
          </g>
        ))}
        <defs>
          <marker id="sd-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M0,0 L8,4 L0,8 z" fill={SIGNAL} />
          </marker>
        </defs>
      </Sheet>
    </svg>
  );
}
