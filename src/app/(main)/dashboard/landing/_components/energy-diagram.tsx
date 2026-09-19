"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createTimeline, svg, type Timeline } from "animejs";
import { ArrowUpRight, Pause, Play } from "lucide-react";

import styles from "./site-landing.module.css";

const steps = [
  {
    title: "Capture sunlight",
    short: "Solar generation",
    text: "The solar canopy turns the light available at your site into electrical energy.",
  },
  {
    title: "Store the energy",
    short: "Battery storage",
    text: "On-site batteries hold energy for use when vehicles need to charge.",
  },
  {
    title: "Charge your vehicles",
    short: "EV charging",
    text: "Charging equipment delivers that energy to the vehicles using your site.",
  },
];
const point = (x: number, y: number, z = 0) => `${((x - y) * 0.866).toFixed(2)},${((x + y) * 0.5 - z).toFixed(2)}`;
const points = (vertices: number[][]) => vertices.map(([x, y, z]) => point(x, y, z)).join(" ");

function Cabinet({ width, depth, height }: { width: number; depth: number; height: number }) {
  return (
    <>
      <polygon
        className={styles.diagramFace}
        points={points([
          [0, 0, height],
          [width, 0, height],
          [width, depth, height],
          [0, depth, height],
        ])}
      />
      <polygon
        className={styles.diagramFace}
        points={points([
          [0, depth, height],
          [width, depth, height],
          [width, depth, 0],
          [0, depth, 0],
        ])}
      />
      <polygon
        className={styles.diagramSide}
        points={points([
          [width, 0, height],
          [width, depth, height],
          [width, depth, 0],
          [width, 0, 0],
        ])}
      />
    </>
  );
}

function SolarArtwork() {
  const z = (y: number) => 150 - y * 0.3;
  return (
    <g className={styles.diagramInk}>
      <path className={styles.diagramGround} d="M-104 80 63 177 195 100" />
      {[28, 146].map((x) => (
        <g key={x}>
          <polyline
            points={points([
              [x, 58, z(58)],
              [x, 58, 0],
              [x + 8, 58, 0],
              [x + 8, 58, z(58)],
            ])}
          />
          <polygon
            points={points([
              [x - 10, 46, 0],
              [x + 20, 46, 0],
              [x + 20, 72, 0],
              [x - 10, 72, 0],
            ])}
          />
        </g>
      ))}
      <polygon
        className={styles.diagramSide}
        points={points([
          [0, 0, z(0)],
          [186, 0, z(0)],
          [186, 112, z(112)],
          [0, 112, z(112)],
        ])}
      />
      <polyline
        points={points([
          [0, 112, z(112)],
          [0, 112, z(112) - 6],
          [186, 112, z(112) - 6],
          [186, 0, z(0) - 6],
          [186, 0, z(0)],
        ])}
      />
      {[1, 2, 3, 4, 5].map((i) => (
        <line
          key={i}
          x1={Number(point(i * 31, 0, z(0)).split(",")[0])}
          y1={Number(point(i * 31, 0, z(0)).split(",")[1])}
          x2={Number(point(i * 31, 112, z(112)).split(",")[0])}
          y2={Number(point(i * 31, 112, z(112)).split(",")[1])}
        />
      ))}
      {[28, 56, 84].map((y) => (
        <polyline
          key={y}
          points={points([
            [0, y, z(y)],
            [186, y, z(y)],
          ])}
        />
      ))}
      <g className={styles.diagramSun} transform="translate(-138 -130)">
        <circle r="19" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
          <path key={angle} d="M0 -29V-38" transform={`rotate(${angle})`} />
        ))}
      </g>
      <path className={styles.diagramRay} d="M-106 -99 -91 -78 M-81 -111 -65 -90 M-57 -123 -41 -102" />
    </g>
  );
}

function StorageArtwork() {
  return (
    <g className={styles.diagramInk}>
      <path className={styles.diagramGround} d="M-69 42 21 94 93 52" />
      <Cabinet width={70} depth={48} height={145} />
      <g transform="matrix(.866 .5 0 -1 -41.568 24)">
        <rect x="7" y="9" width="55" height="126" rx="1" />
        {[24, 58, 92].map((y) => (
          <g key={y}>
            <rect x="13" y={y} width="43" height="24" rx="1" />
            <path d={`M19 ${y + 8}h17 M19 ${y + 13}h17 M19 ${y + 18}h17`} />
            <path className={styles.diagramCharge} d={`M45 ${y + 8}h5v9h-5z`} />
          </g>
        ))}
      </g>
      <polygon
        points={points([
          [70, 20, 81],
          [70, 31, 81],
          [70, 31, 66],
          [70, 20, 66],
        ])}
      />
      {[108, 116, 124].map((z) => (
        <polyline
          key={z}
          points={points([
            [70, 12, z],
            [70, 36, z],
          ])}
        />
      ))}
    </g>
  );
}

function ChargingArtwork() {
  return (
    <g className={styles.diagramInk}>
      <path className={styles.diagramGround} d="M-47 42 115 136 294 32" />
      <Cabinet width={36} depth={27} height={115} />
      <g transform="matrix(.866 .5 0 -1 -23.382 13.5)">
        <rect x="7" y="71" width="22" height="30" />
        <path className={styles.diagramCharge} d="M20 61 13 46h7l-4 -14 12 18h-8Z" />
        <path d="M8 13h20 M8 19h20 M8 25h20" />
      </g>
      <path d="M32 -47C66 -44 27 62 59 68S87 28 93 0" strokeWidth="2.2" />
      <g transform="translate(159 -39)">
        {/* Five top surfaces follow the hood, windshield, roof, rear glass and trunk. */}
        {[
          [0, 31, 29, 38],
          [29, 38, 51, 62],
          [51, 62, 99, 62],
          [99, 62, 122, 37],
          [122, 37, 148, 29],
        ].map(([x1, z1, x2, z2]) => (
          <polygon
            key={x1}
            className={styles.diagramFace}
            points={points([
              [x1, 0, z1],
              [x2, 0, z2],
              [x2, 62, z2],
              [x1, 62, z1],
            ])}
          />
        ))}
        <polygon
          className={styles.diagramSide}
          points={points([
            [0, 62, 31],
            [29, 62, 38],
            [51, 62, 62],
            [99, 62, 62],
            [122, 62, 37],
            [148, 62, 29],
            [148, 62, 10],
            [0, 62, 10],
          ])}
        />
        <polygon
          className={styles.diagramFace}
          points={points([
            [148, 0, 29],
            [148, 62, 29],
            [148, 62, 10],
            [148, 0, 10],
          ])}
        />
        <polygon
          points={points([
            [38, 62, 39],
            [54, 62, 57],
            [95, 62, 57],
            [113, 62, 39],
          ])}
        />
        <polyline
          points={points([
            [76, 62, 57],
            [76, 62, 14],
          ])}
        />
        <polyline
          points={points([
            [39, 62, 35],
            [43, 62, 14],
          ])}
        />
        <polyline
          points={points([
            [85, 62, 32],
            [96, 62, 32],
          ])}
        />
        <polyline
          points={points([
            [105, 4, 55],
            [119, 4, 40],
            [119, 58, 40],
            [105, 58, 55],
          ])}
        />
        {[29, 121].map((x) => (
          <g key={x} transform={"translate(" + point(x, 64, 12) + ") rotate(-26)"}>
            <ellipse className={styles.diagramFace} rx="11" ry="16" strokeWidth="2" />
            <ellipse rx="5" ry="9" />
          </g>
        ))}
        <polyline
          points={points([
            [148, 9, 25],
            [148, 20, 25],
            [148, 20, 19],
            [148, 9, 19],
            [148, 9, 25],
          ])}
        />
        <polyline
          points={points([
            [148, 42, 25],
            [148, 53, 25],
            [148, 53, 19],
            [148, 42, 19],
            [148, 42, 25],
          ])}
        />
      </g>
    </g>
  );
}

function EnergyArtwork({ compact, selected, id }: { compact: boolean; selected: number; id: string }) {
  const paths = compact
    ? [
        "M264 309 309 335Q322 342 309 350L273 371Q264 376 264 387V456Q264 463 270 466",
        "M230 632 297 671Q310 679 297 687L154 815",
        "M181 873Q215 875 219 900T255 916",
      ]
    : [
        "M306 332 384 377Q396 384 409 377L513 317",
        "M581 301 663 348Q676 356 689 348L766 304",
        "M821 248Q850 250 852 275T894 283",
      ];
  const origins = compact
    ? ["translate(205 225)", "translate(210 575)", "translate(151 900)"]
    : ["translate(225 230)", "translate(548 260)", "translate(790 295)"];
  return (
    <svg
      className={compact ? styles.flowSvgCompact : styles.flowSvgWide}
      viewBox={compact ? "0 0 455 1080" : "0 0 1120 445"}
      role="img"
      aria-labelledby={`${id}-title-${compact}`}
    >
      <title id={`${id}-title-${compact}`}>
        Solar energy is captured, stored in a battery and delivered through a charger to an electric vehicle.
      </title>
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        {paths.map((d, i) => (
          <g key={d}>
            <path className={styles.flowTrack} d={d} />
            <path className={styles.flowEnergy} data-energy-path={i} d={d} />
            <circle className={styles.flowPacket} data-energy-packet={i} r="5" />
          </g>
        ))}
        <g transform={origins[0]} data-illustration="0" data-selected={selected === 0}>
          <SolarArtwork />
        </g>
        <g transform={origins[1]} data-illustration="1" data-selected={selected === 1}>
          <StorageArtwork />
        </g>
        <g transform={origins[2]} data-illustration="2" data-selected={selected === 2}>
          <ChargingArtwork />
        </g>
      </g>
      {(compact
        ? [
            [60, 54],
            [60, 420],
            [60, 758],
          ]
        : [
            [99, 40],
            [500, 55],
            [848, 60],
          ]
      ).map(([x, y], i) => (
        <g key={steps[i].short} transform={`translate(${x} ${y})`} className={styles.diagramLabel}>
          <text className={styles.diagramNumber} y="0">
            0{i + 1}
          </text>
          <text x="31" y="0">
            {steps[i].short}
          </text>
        </g>
      ))}
    </svg>
  );
}

export function EnergyDiagram() {
  const root = useRef<HTMLDivElement>(null);
  const timeline = useRef<Timeline | null>(null);
  const [selected, setSelected] = useState(0);
  const [running, setRunning] = useState(false);
  const [enhanced, setEnhanced] = useState(false);
  const [reduced, setReduced] = useState(false);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const id = useId();

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let observer: IntersectionObserver | null = null;
    let drawingMode = "";
    let hasStarted = false;
    let userPaused = false;
    let visible = false;
    function clearDrawing() {
      timeline.current?.revert();
      timeline.current = null;
      // Drawable proxies add SVG attributes outside Anime.js style restoration.
      element!.querySelectorAll<SVGPathElement>("[data-energy-path]").forEach((path) => {
        for (const attribute of ["pathLength", "draw", "stroke-dasharray", "stroke-dashoffset"])
          path.removeAttribute(attribute);
        path.style.removeProperty("stroke-linecap");
      });
    }
    function setup() {
      observer?.disconnect();
      clearDrawing();
      setReduced(motion.matches);
      setRunning(false);
      if (motion.matches) return;
      const drawings = Array.from(element!.querySelectorAll<SVGSVGElement>("svg[role='img']"));
      const drawing = drawings.find((node) => getComputedStyle(node).display !== "none");
      if (!drawing) return;
      drawingMode = drawing.getAttribute("viewBox") ?? "";
      const paths = drawing.querySelectorAll<SVGPathElement>("[data-energy-path]");
      const packets = drawing.querySelectorAll<SVGCircleElement>("[data-energy-packet]");
      const sequence = createTimeline({ autoplay: false, onComplete: () => setRunning(false) });
      timeline.current = sequence;
      paths.forEach((path, index) => {
        const start = index * 2350;
        sequence.call(() => setSelected(index), start);
        sequence.add(svg.createDrawable(path), { draw: ["0 0", "0 1"], duration: 1750, ease: "inOut(2)" }, start);
        const { translateX, translateY } = svg.createMotionPath(path);
        sequence.add(packets[index], { translateX, translateY, duration: 1750, ease: "linear" }, start);
        sequence.add(packets[index], { opacity: [0, 1], duration: 100 }, start);
        sequence.add(packets[index], { opacity: 0, duration: 250 }, start + 1750);
      });
      observer = new IntersectionObserver(
        ([entry]) => {
          visible = entry.isIntersecting;
          if (!visible) {
            sequence.pause();
            setRunning(false);
          } else if (!userPaused && !sequence.completed && !document.hidden) {
            hasStarted = true;
            sequence.play();
            setRunning(true);
          }
        },
        { threshold: 0.18 },
      );
      observer.observe(element!);
    }
    function visibility() {
      const sequence = timeline.current;
      if (!sequence) return;
      if (document.hidden) {
        sequence.pause();
        setRunning(false);
      } else if (visible && hasStarted && !userPaused && !sequence.completed) {
        sequence.play();
        setRunning(true);
      }
    }
    const manualPause = () => {
      userPaused = true;
    };
    const manualPlay = () => {
      userPaused = false;
      hasStarted = true;
    };
    element.addEventListener("energy-pause", manualPause);
    element.addEventListener("energy-play", manualPlay);
    document.addEventListener("visibilitychange", visibility);
    motion.addEventListener("change", setup);
    const resize = new ResizeObserver(() => {
      if (motion.matches) return;
      const drawing = Array.from(element.querySelectorAll<SVGSVGElement>("svg[role='img']")).find(
        (node) => getComputedStyle(node).display !== "none",
      );
      if (drawing && drawing.getAttribute("viewBox") !== drawingMode) setup();
    });
    resize.observe(element);
    setEnhanced(true);
    setup();
    return () => {
      observer?.disconnect();
      resize.disconnect();
      clearDrawing();
      element.removeEventListener("energy-pause", manualPause);
      element.removeEventListener("energy-play", manualPlay);
      document.removeEventListener("visibilitychange", visibility);
      motion.removeEventListener("change", setup);
    };
  }, []);

  function choose(index: number, focus = false) {
    root.current?.dispatchEvent(new Event("energy-pause"));
    timeline.current?.pause();
    timeline.current?.seek(index * 2350 + 1750);
    setRunning(false);
    setSelected(index);
    if (focus) tabRefs.current[index]?.focus();
  }
  return (
    <div ref={root} className={styles.energyDiagram} data-running={running}>
      <div className={styles.diagramToolbar}>
        <span>One connected energy system</span>
        {enhanced && !reduced && (
          <button
            type="button"
            onClick={() => {
              if (running) {
                root.current?.dispatchEvent(new Event("energy-pause"));
                timeline.current?.pause();
                setRunning(false);
              } else {
                root.current?.dispatchEvent(new Event("energy-play"));
                timeline.current?.restart();
                setRunning(true);
              }
            }}
            aria-label={running ? "Pause energy flow" : "Replay energy flow"}
          >
            {running ? <Pause size={15} /> : <Play size={15} />}
            {running ? "Pause flow" : "Replay flow"}
          </button>
        )}
      </div>
      <div className={styles.diagramCanvas}>
        <EnergyArtwork compact={false} selected={selected} id={id} />
        <EnergyArtwork compact selected={selected} id={id} />
      </div>
      <div
        className={styles.diagramSteps}
        role="tablist"
        aria-label="System components"
        onKeyDown={(event) => {
          if (["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp", "Home", "End"].includes(event.key)) {
            event.preventDefault();
            const index =
              event.key === "Home"
                ? 0
                : event.key === "End"
                  ? 2
                  : (selected + (["ArrowLeft", "ArrowUp"].includes(event.key) ? 2 : 1)) % 3;
            choose(index, true);
          }
        }}
      >
        {steps.map((step, index) => (
          <button
            key={step.title}
            ref={(node) => {
              tabRefs.current[index] = node;
            }}
            type="button"
            role="tab"
            id={`${id}-tab-${index}`}
            aria-label={step.short}
            aria-selected={selected === index}
            aria-controls={`${id}-panel-${index}`}
            tabIndex={selected === index ? 0 : -1}
            onClick={() => choose(index)}
          >
            <span>0{index + 1}</span>
            <strong>{step.title}</strong>
            <ArrowUpRight size={18} />
          </button>
        ))}
      </div>
      <div className={styles.diagramDetails}>
        {steps.map((step, index) => (
          <p
            key={step.title}
            role="tabpanel"
            id={`${id}-panel-${index}`}
            aria-labelledby={`${id}-tab-${index}`}
            hidden={selected !== index}
            tabIndex={0}
          >
            {step.text}
          </p>
        ))}
        <span>Conceptual energy flow. Configuration is defined for each site.</span>
      </div>
    </div>
  );
}
