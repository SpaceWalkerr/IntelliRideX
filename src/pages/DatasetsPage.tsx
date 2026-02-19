import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  MapPin, Cpu, Database, Target, Camera, Radio, Scan,
  ChevronDown, BarChart3, CircleDot, FlaskConical,
  Sliders, Activity, Crosshair, TrendingUp, Plus, RefreshCw,
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, LineElement, PointElement,
  RadialLinearScale, Tooltip, Legend, Title, Filler,
} from "chart.js";
import { Bar, Line, Radar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale, LinearScale, BarElement, LineElement, PointElement,
  RadialLinearScale, Tooltip, Legend, Title, Filler,
);

/* ══════════════════════════════════════════════════════
   DATA DEFINITIONS
══════════════════════════════════════════════════════ */

const DATASETS = {
  KITTI: {
    id: "KITTI",
    full: "KITTI Vision Benchmark",
    location: "Karlsruhe, Germany",
    year: 2012,
    color: "--primary",
    sensors: ["Stereo Camera", "LiDAR (64-beam)", "GPS/IMU"],
    sensorIcons: [Camera, Scan, CircleDot],
    frames: 15000,
    classes: 8,
    size: "22 GB",
    useCase: "3D Object Detection, Stereo Vision, Optical Flow",
    base: { acc: 76, fps: 28, prec: 74, rec: 72 },
    description:
      "Pioneering autonomous driving benchmark recorded in real traffic around Karlsruhe. First to pair camera with LiDAR for joint 3D detection, making it the reference dataset for a decade of research.",
    stats: [
      { label: "Frames",  value: "15K"  },
      { label: "Classes", value: "8"    },
      { label: "Scenes",  value: "61"   },
      { label: "Year",    value: "2012" },
    ],
  },
  Waymo: {
    id: "Waymo",
    full: "Waymo Open Dataset",
    location: "Multiple U.S. Cities",
    year: 2019,
    color: "--secondary",
    sensors: ["5× Camera", "5× LiDAR", "Radar"],
    sensorIcons: [Camera, Scan, Radio],
    frames: 200000,
    classes: 4,
    size: "1 TB+",
    useCase: "3D Detection, Tracking, Domain Transfer",
    base: { acc: 84, fps: 18, prec: 82, rec: 80 },
    description:
      "Waymo's large-scale, high-diversity dataset collected from 6 cities with sensor-redundant rigs. Known for extremely high annotation quality and the toughest public leaderboard for 3D detection.",
    stats: [
      { label: "Frames",  value: "200K" },
      { label: "Classes", value: "4"    },
      { label: "Scenes",  value: "1K+"  },
      { label: "Year",    value: "2019" },
    ],
  },
  nuScenes: {
    id: "nuScenes",
    full: "nuScenes by Motional",
    location: "Boston & Singapore",
    year: 2019,
    color: "--accent",
    sensors: ["6× Camera (360°)", "1× LiDAR (32-beam)", "5× Radar"],
    sensorIcons: [Camera, Scan, Radio],
    frames: 40000,
    classes: 23,
    size: "300 GB",
    useCase: "3D Detection, Sensor Fusion, Prediction",
    base: { acc: 80, fps: 22, prec: 78, rec: 76 },
    description:
      "Full-surround 6-camera + LiDAR + 5-radar dataset collected in dense urban environments. Best for sensor fusion research and long-tail class coverage (23 object categories).",
    stats: [
      { label: "Frames",  value: "40K"  },
      { label: "Classes", value: "23"   },
      { label: "Scenes",  value: "1K"   },
      { label: "Year",    value: "2019" },
    ],
  },
};

const MODEL_LIST = ["CNN", "PointNet", "Transformer"] as const;
const COMPUTE_LIST = ["Low", "Medium", "High"] as const;
const DATASET_LIST = ["KITTI", "Waymo", "nuScenes"] as const;
const SENSOR_OPTIONS  = ["All", "Camera Only", "LiDAR Only", "Camera + LiDAR", "Camera + LiDAR + Radar"] as const;
const QUALITY_OPTIONS = ["Standard", "High", "Expert", "Crowd-sourced"] as const;
const WEATHER_OPTIONS = ["Clear Only", "Day + Night", "Rain + Fog", "All Conditions"] as const;

type DatasetKey  = typeof DATASET_LIST[number];
type ModelType   = typeof MODEL_LIST[number];
type ComputeType = typeof COMPUTE_LIST[number];
type SensorType  = typeof SENSOR_OPTIONS[number];
type QualityType = typeof QUALITY_OPTIONS[number];
type WeatherType = typeof WEATHER_OPTIONS[number];

/* ══════════════════════════════════════════════════════
   SIMULATION ENGINE
══════════════════════════════════════════════════════ */

interface ExperimentState {
  dataset: DatasetKey;
  model: ModelType;
  accuracy: number;
  noise: number;
  compute: ComputeType;
}

interface SimResults {
  acc: number;
  prec: number;
  rec: number;
  fps: number;
  map: number;
  grade: "Excellent" | "Good" | "Fair" | "Poor";
}

const MODEL_MULTS: Record<ModelType, { acc: number; fps: number }> = {
  CNN:         { acc: 1.00, fps: 1.00 },
  PointNet:    { acc: 1.05, fps: 0.80 },
  Transformer: { acc: 1.12, fps: 0.58 },
};

const COMPUTE_MULTS: Record<ComputeType, { acc: number; fps: number }> = {
  Low:    { acc: 0.90, fps: 0.44 },
  Medium: { acc: 1.00, fps: 1.00 },
  High:   { acc: 1.06, fps: 1.80 },
};

const simulate = (s: ExperimentState): SimResults => {
  const base = DATASETS[s.dataset].base;
  const mm = MODEL_MULTS[s.model];
  const cm = COMPUTE_MULTS[s.compute];
  const noisePenalty = 1 - (s.noise / 100) * 0.30;   // –30% max at noise=100
  const sliderBoost  = 0.80 + (s.accuracy / 100) * 0.20; // 0.80–1.00

  const clamp = (v: number) => Math.min(99, Math.max(10, v));

  const acc  = clamp(base.acc  * mm.acc * cm.acc * noisePenalty * sliderBoost);
  const prec = clamp(base.prec * mm.acc * cm.acc * noisePenalty * sliderBoost * 0.98);
  const rec  = clamp(base.rec  * mm.acc * cm.acc * noisePenalty * sliderBoost * 0.96);
  const map  = clamp(base.prec * mm.acc * cm.acc * noisePenalty * sliderBoost * 0.92);
  const fps  = Math.max(1, Math.round(base.fps * mm.fps * cm.fps));

  const grade = acc >= 82 ? "Excellent" : acc >= 74 ? "Good" : acc >= 60 ? "Fair" : "Poor";
  return { acc, prec, rec, fps, map, grade };
};

const GRADE_COLORS: Record<SimResults["grade"], string> = {
  Excellent: "hsl(142, 76%, 54%)",
  Good:      "hsl(210, 100%, 56%)",
  Fair:      "hsl(45, 100%, 56%)",
  Poor:      "hsl(0, 80%, 60%)",
};

/* ══════════════════════════════════════════════════════
   COMPARISON TABLE STATE
══════════════════════════════════════════════════════ */

interface ColState {
  accuracy: number;
  fps: number;
  frames: number;
  sensor: SensorType;
  quality: QualityType;
  weather: WeatherType;
}

/* ══════════════════════════════════════════════════════
   UTILITY COMPONENTS
══════════════════════════════════════════════════════ */

const Pill = ({ children, color }: { children: React.ReactNode; color: string }) => (
  <span
    className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-full border"
    style={{ color: `hsl(var(${color}))`, borderColor: `hsl(var(${color}) / 0.3)`, background: `hsl(var(${color}) / 0.08)` }}
  >
    {children}
  </span>
);

const GlassCard = ({ children, className = "", style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) => (
  <div className={`glass relative overflow-hidden ${className}`} style={style}>{children}</div>
);

/* ── Animated counter ── */
const AnimatedNumber = ({ value, decimals = 1 }: { value: number; decimals?: number }) => {
  const [display, setDisplay] = useState(value);
  useEffect(() => {
    const start = display;
    const end = value;
    const dur = 500;
    const t0 = performance.now();
    const raf = (t: number) => {
      const p = Math.min((t - t0) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setDisplay(start + (end - start) * ease);
      if (p < 1) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  return <>{display.toFixed(decimals)}</>;
};

/* ── Custom slider ── */
const Slider = ({
  label, value, min, max, step = 1, unit = "",
  color = "--primary", onChange,
}: {
  label: string; value: number; min: number; max: number; step?: number;
  unit?: string; color?: string; onChange: (v: number) => void;
}) => (
  <div className="space-y-1.5">
    <div className="flex justify-between text-xs">
      <span className="font-medium text-muted-foreground">{label}</span>
      <span className="font-bold tabular-nums" style={{ color: `hsl(var(${color}))` }}>
        {value}{unit}
      </span>
    </div>
    <input
      type="range" min={min} max={max} step={step} value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
      style={{
        background: `linear-gradient(to right, hsl(var(${color})) ${((value - min) / (max - min)) * 100}%, hsl(var(--muted-foreground) / 0.2) 0%)`,
        accentColor: `hsl(var(${color}))`,
      }}
    />
    <div className="flex justify-between text-[9px] text-muted-foreground/50">
      <span>{min}{unit}</span><span>{max}{unit}</span>
    </div>
  </div>
);

/* ── Dropdown ── */
const Select = ({
  label, value, options, onChange, color = "--primary",
}: {
  label: string; value: string; options: readonly string[];
  onChange: (v: string) => void; color?: string;
}) => (
  <div className="space-y-1.5">
    <p className="text-xs font-medium text-muted-foreground">{label}</p>
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full glass appearance-none px-3 py-2 pr-8 text-sm font-semibold rounded-xl border border-foreground/10 bg-transparent cursor-pointer focus:outline-none"
        style={{ color: `hsl(var(${color}))` }}
      >
        {options.map((o) => (
          <option key={o} value={o} className="bg-background text-foreground">{o}</option>
        ))}
      </select>
      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
    </div>
  </div>
);

/* ══════════════════════════════════════════════════════
   1. HERO
══════════════════════════════════════════════════════ */

const DatasetsHero = () => (
  <div className="relative overflow-hidden py-20 sm:py-28">
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-0 left-1/3 w-[700px] h-[280px] bg-secondary/8 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[260px] bg-accent/6 blur-[100px] rounded-full" />
    </div>
    <div
      className="absolute inset-0 opacity-[0.025]"
      style={{
        backgroundImage: `linear-gradient(hsl(var(--secondary)/0.4) 1px,transparent 1px),linear-gradient(90deg,hsl(var(--secondary)/0.4) 1px,transparent 1px)`,
        backgroundSize: "60px 60px",
      }}
    />
    <div className="container mx-auto px-6 relative z-10 text-center">
      <motion.div
        className="space-y-6 max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <span className="glass inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-secondary">
          <Database className="w-4 h-4" />
          Benchmark Datasets
        </span>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight">
          AV{" "}
          <span className="text-gradient-primary">Dataset Explorer</span>
          <br />& Simulator
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Compare KITTI, Waymo, and nuScenes — then simulate model performance in real time by tuning dataset, model architecture, noise, and compute power.
        </p>
        <div className="flex flex-wrap justify-center gap-6 pt-2">
          {[
            { icon: Camera, label: "Multi-Sensor Rigs" },
            { icon: BarChart3, label: "Interactive Charts" },
            { icon: FlaskConical, label: "Experiment Simulator" },
          ].map(({ icon: Icon, label }) => (
            <span key={label} className="flex items-center gap-2 text-sm text-muted-foreground">
              <Icon className="w-4 h-4 text-primary" />{label}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  </div>
);

/* ══════════════════════════════════════════════════════
   2. DATASET CARDS
══════════════════════════════════════════════════════ */

const DatasetCardInner = ({ ds, side }: { ds: typeof DATASETS[DatasetKey]; side: "front" | "back" }) => {
  const Icon = side === "front"
    ? ({ className }: { className: string }) => <Database className={className} />
    : ({ className }: { className: string }) => <BarChart3 className={className} />;

  return (
    <div className="absolute inset-0 flex flex-col p-6 gap-4">
      {/* Top line */}
      <div className="absolute top-0 left-0 right-0 h-[2px]"
        style={{ background: `linear-gradient(90deg,transparent,hsl(var(${ds.color})),transparent)` }} />

      {side === "front" ? (
        <>
          <div className="flex items-start justify-between">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center"
              style={{ background: `hsl(var(${ds.color}) / 0.12)` }}
            >
              <div style={{ color: `hsl(var(${ds.color}))` }}><Icon className="w-5 h-5" /></div>
            </div>
            <Pill color={ds.color}><MapPin className="w-3 h-3" />{ds.location}</Pill>
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{ds.year}</p>
            <h3 className="text-xl font-extrabold leading-tight" style={{ color: `hsl(var(${ds.color}))` }}>
              {ds.id}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">{ds.full}</p>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed flex-1">{ds.description}</p>

          <div className="space-y-1.5">
            <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Sensors</p>
            <div className="flex flex-wrap gap-1.5">
              {ds.sensors.map((s) => (
                <span key={s} className="text-[10px] px-2 py-1 rounded-lg border border-foreground/10 text-muted-foreground bg-muted/20">
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs mt-auto pt-3 border-t border-foreground/[0.06]">
            <span className="text-muted-foreground">Hover to see stats</span>
            <span className="font-bold" style={{ color: `hsl(var(${ds.color}))` }}>{ds.size}</span>
          </div>
        </>
      ) : (
        <>
          <h3 className="text-lg font-extrabold" style={{ color: `hsl(var(${ds.color}))` }}>
            {ds.id} — Key Metrics
          </h3>
          <div className="grid grid-cols-2 gap-3 flex-1">
            {ds.stats.map((stat) => (
              <div key={stat.label}
                className="rounded-xl p-3 flex flex-col items-center justify-center gap-1"
                style={{ background: `hsl(var(${ds.color}) / 0.08)` }}>
                <span className="text-2xl font-black tabular-nums" style={{ color: `hsl(var(${ds.color}))` }}>
                  {stat.value}
                </span>
                <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">{stat.label}</span>
              </div>
            ))}
          </div>
          <div>
            <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">Use Case</p>
            <p className="text-xs text-muted-foreground leading-relaxed">{ds.useCase}</p>
          </div>
          <div className="flex items-center justify-between text-xs pt-3 border-t border-foreground/[0.06]">
            <span className="text-muted-foreground">Base Accuracy</span>
            <span className="font-black text-base tabular-nums" style={{ color: `hsl(var(${ds.color}))` }}>
              {ds.base.acc}%
            </span>
          </div>
        </>
      )}
    </div>
  );
};

const DatasetCard = ({ ds, delay }: { ds: typeof DATASETS[DatasetKey]; delay: number }) => {
  const [flipped, setFlipped] = useState(false);
  return (
    <motion.div
      className="relative h-80 cursor-pointer"
      style={{ perspective: 1200 }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      onHoverStart={() => setFlipped(true)}
      onHoverEnd={() => setFlipped(false)}
    >
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 140, damping: 17 }}
      >
        {/* Plain divs — no backdrop-blur so preserve-3d works correctly */}
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            background: "hsl(var(--muted)/0.45)",
            border: "1px solid hsl(var(--foreground)/0.08)",
          }}
        >
          <DatasetCardInner ds={ds} side="front" />
        </div>
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            background: "hsl(var(--muted)/0.45)",
            border: "1px solid hsl(var(--foreground)/0.08)",
          }}
        >
          <DatasetCardInner ds={ds} side="back" />
        </div>
      </motion.div>
    </motion.div>
  );
};

const DatasetCardsSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <section ref={ref} className="container mx-auto px-6 pb-20">
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
      >
        <p className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-2">Dataset Overview</p>
        <h2 className="text-3xl font-extrabold tracking-tight">Three Benchmarks, One Comparison</h2>
        <p className="text-muted-foreground text-sm mt-2">Hover a card to reveal key statistics</p>
      </motion.div>
      <div className="grid md:grid-cols-3 gap-6">
        {Object.values(DATASETS).map((ds, i) => (
          <DatasetCard key={ds.id} ds={ds} delay={i * 0.1} />
        ))}
      </div>
    </section>
  );
};

/* ══════════════════════════════════════════════════════
   3. INTERACTIVE COMPARISON TABLE
══════════════════════════════════════════════════════ */

const ComparisonTable = () => {
  const defaultCol = (ds: DatasetKey): ColState => ({
    accuracy: DATASETS[ds].base.acc,
    fps:      DATASETS[ds].base.fps,
    frames:   DATASETS[ds].frames,
    sensor:   "All",
    quality:  "High",
    weather:  "All Conditions",
  });

  const [cols, setCols] = useState<Record<DatasetKey, ColState>>({
    KITTI:    defaultCol("KITTI"),
    Waymo:    defaultCol("Waymo"),
    nuScenes: defaultCol("nuScenes"),
  });

  const update = (ds: DatasetKey, field: keyof ColState, val: unknown) =>
    setCols((prev) => ({ ...prev, [ds]: { ...prev[ds], [field]: val } }));

  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="container mx-auto px-6 pb-24">
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
      >
        <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2">Interactive Comparison</p>
        <h2 className="text-3xl font-extrabold tracking-tight">Adjust & Compare</h2>
        <p className="text-muted-foreground text-sm mt-2">6 parameters — all editable per dataset, all updating live</p>
      </motion.div>

      <motion.div
        className="glass overflow-x-auto rounded-2xl"
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="border-b border-foreground/[0.06]">
              <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground w-36">
                Parameter
              </th>
              {DATASET_LIST.map((ds) => (
                <th key={ds} className="px-6 py-4 text-center">
                  <span
                    className="text-sm font-extrabold"
                    style={{ color: `hsl(var(${DATASETS[ds].color}))` }}
                  >
                    {ds}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {([
              { field: "accuracy" as const, label: "Accuracy",    icon: Target,    kind: "slider" as const, min: 50, max: 99,     unit: "%"  },
              { field: "fps"      as const, label: "FPS",         icon: Activity,  kind: "slider" as const, min: 1,  max: 60,     unit: ""   },
              { field: "frames"   as const, label: "Frames",      icon: BarChart3, kind: "number" as const, min: 1000, max: 500000, step: 1000 },
              { field: "sensor"   as const, label: "Sensor Config",icon: Cpu,       kind: "select" as const, opts: SENSOR_OPTIONS  },
              { field: "quality"  as const, label: "Annotation",  icon: Camera,    kind: "select" as const, opts: QUALITY_OPTIONS },
              { field: "weather"  as const, label: "Weather Cover",icon: Radio,     kind: "select" as const, opts: WEATHER_OPTIONS },
            ] as Array<
              | { field: "accuracy" | "fps"; label: string; icon: React.ElementType; kind: "slider"; min: number; max: number; unit: string }
              | { field: "frames";            label: string; icon: React.ElementType; kind: "number"; min: number; max: number; step: number }
              | { field: "sensor" | "quality" | "weather"; label: string; icon: React.ElementType; kind: "select"; opts: readonly string[] }
            >).map((row, ri, all) => (
              <tr key={row.field} className={`hover:bg-foreground/[0.02] transition-colors ${ri < all.length - 1 ? "border-b border-foreground/[0.04]" : ""}`}>
                <td className="px-6 py-4 text-xs font-semibold text-muted-foreground">
                  <div className="flex items-center gap-2"><row.icon className="w-3.5 h-3.5" />{row.label}</div>
                </td>
                {DATASET_LIST.map((ds) => {
                  const accentColor = `hsl(var(${DATASETS[ds].color}))`;
                  const c = cols[ds];
                  return (
                    <td key={ds} className="px-6 py-4">
                      <div className="flex flex-col items-center gap-2">
                        {row.kind === "slider" && (() => {
                          const val = c[row.field] as number;
                          const pct = ((val - row.min) / (row.max - row.min)) * 100;
                          return (
                            <>
                              <span className="text-lg font-black tabular-nums" style={{ color: accentColor }}>{val}{row.unit}</span>
                              <input type="range" min={row.min} max={row.max} value={val}
                                onChange={(e) => update(ds, row.field, Number(e.target.value))}
                                className="w-28 h-1.5 rounded-full appearance-none cursor-pointer"
                                style={{ background: `linear-gradient(to right, ${accentColor} ${pct}%, hsl(var(--muted-foreground)/0.2) 0%)`, accentColor }}
                              />
                            </>
                          );
                        })()}
                        {row.kind === "number" && (
                          <input type="number" min={row.min} max={row.max} step={row.step}
                            value={c.frames}
                            onChange={(e) => update(ds, "frames", Math.max(row.min, Number(e.target.value)))}
                            className="w-28 glass text-center px-3 py-2 text-sm font-bold rounded-xl border border-foreground/10 bg-transparent focus:outline-none tabular-nums"
                            style={{ color: accentColor }}
                          />
                        )}
                        {row.kind === "select" && (
                          <div className="relative">
                            <select value={c[row.field] as string}
                              onChange={(e) => update(ds, row.field, e.target.value)}
                              className="glass appearance-none px-3 py-2 pr-7 text-xs font-semibold rounded-xl border border-foreground/10 bg-transparent cursor-pointer focus:outline-none"
                              style={{ color: accentColor }}
                            >
                              {row.opts.map((o) => (
                                <option key={o} value={o} className="bg-background text-foreground text-xs">{o}</option>
                              ))}
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" />
                          </div>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Live composite score bars */}
        <div className="px-6 py-4 border-t border-foreground/[0.06] grid grid-cols-3 gap-4">
          {DATASET_LIST.map((ds) => (
            <div key={ds} className="text-center space-y-1.5">
              <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">{ds} — Composite</p>
              <div className="h-2 rounded-full bg-muted/30 overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: `hsl(var(${DATASETS[ds].color}))` }}
                  animate={{ width: `${cols[ds].accuracy}%` }}
                  transition={{ type: "spring", stiffness: 120, damping: 20 }}
                />
              </div>
              <div className="flex justify-between text-[9px] text-muted-foreground/60">
                <span>Acc {cols[ds].accuracy}%</span>
                <span>FPS {cols[ds].fps}</span>
                <span>{cols[ds].weather}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

/* ══════════════════════════════════════════════════════
   DETECTION PREVIEW — REALISTIC SVG SCENE
══════════════════════════════════════════════════════ */

const SvgCar = ({ x, y, scale, bodyCol, glassCol, lightCol }: {
  x: number; y: number; scale: number;
  bodyCol: string; glassCol: string; lightCol: string;
}) => (
  <g transform={`translate(${x},${y}) scale(${scale})`}>
    <ellipse cx="30" cy="32" rx="28" ry="4" fill="black" opacity="0.3" />
    <rect x="0" y="10" width="60" height="22" rx="4" fill={bodyCol} />
    <rect x="10" y="0" width="36" height="14" rx="5" fill={bodyCol} opacity="0.9" />
    <rect x="11" y="1" width="15" height="11" rx="2" fill={glassCol} opacity="0.55" />
    <rect x="32" y="1" width="13" height="11" rx="2" fill={glassCol} opacity="0.45" />
    <circle cx="46" cy="32" r="8" fill="hsl(0,0%,9%)" />
    <circle cx="46" cy="32" r="4" fill="hsl(0,0%,22%)" />
    <circle cx="14" cy="32" r="8" fill="hsl(0,0%,9%)" />
    <circle cx="14" cy="32" r="4" fill="hsl(0,0%,22%)" />
    <rect x="54" y="14" width="6" height="7" rx="1.5" fill={lightCol} opacity="0.9" />
    <rect x="0" y="14" width="5" height="7" rx="1.5" fill="hsl(0,90%,55%)" opacity="0.85" />
  </g>
);

const SvgTruck = ({ x, y, scale, col }: { x: number; y: number; scale: number; col: string }) => (
  <g transform={`translate(${x},${y}) scale(${scale})`}>
    <ellipse cx="42" cy="44" rx="38" ry="4" fill="black" opacity="0.25" />
    <rect x="52" y="8" width="28" height="36" rx="3" fill={col} />
    <rect x="54" y="10" width="22" height="16" rx="2" fill="hsl(200,50%,65%)" opacity="0.45" />
    <rect x="0" y="14" width="55" height="30" rx="2" fill={col} opacity="0.9" />
    <line x1="18" y1="14" x2="18" y2="44" stroke="black" strokeWidth="0.5" opacity="0.2" />
    <line x1="36" y1="14" x2="36" y2="44" stroke="black" strokeWidth="0.5" opacity="0.2" />
    {([10, 30, 58, 72] as number[]).map((cx) => (
      <g key={cx}>
        <circle cx={cx} cy="44" r="8" fill="hsl(0,0%,9%)" />
        <circle cx={cx} cy="44" r="4" fill="hsl(0,0%,22%)" />
      </g>
    ))}
    <rect x="78" y="18" width="5" height="8" rx="1" fill="hsl(50,100%,75%)" opacity="0.9" />
  </g>
);

const SvgPedestrian = ({ x, y, scale, col }: { x: number; y: number; scale: number; col: string }) => (
  <g transform={`translate(${x},${y}) scale(${scale})`}>
    <ellipse cx="9" cy="54" rx="7" ry="2.5" fill="black" opacity="0.25" />
    <circle cx="9" cy="6" r="6" fill="hsl(30,55%,68%)" />
    <rect x="4" y="13" width="10" height="20" rx="3" fill={col} />
    <line x1="7" y1="33" x2="4" y2="52" stroke={col} strokeWidth="4.5" strokeLinecap="round" />
    <line x1="11" y1="33" x2="14" y2="52" stroke={col} strokeWidth="4.5" strokeLinecap="round" />
    <line x1="4" y1="16" x2="0" y2="28" stroke={col} strokeWidth="3.5" strokeLinecap="round" />
    <line x1="14" y1="16" x2="18" y2="28" stroke={col} strokeWidth="3.5" strokeLinecap="round" />
  </g>
);

const SvgCyclist = ({ x, y, scale, col }: { x: number; y: number; scale: number; col: string }) => (
  <g transform={`translate(${x},${y}) scale(${scale})`}>
    <ellipse cx="22" cy="48" rx="22" ry="3" fill="black" opacity="0.2" />
    <circle cx="6"  cy="36" r="10" fill="none" stroke="hsl(0,0%,40%)" strokeWidth="2.5" />
    <circle cx="38" cy="36" r="10" fill="none" stroke="hsl(0,0%,40%)" strokeWidth="2.5" />
    <line x1="6" y1="36" x2="22" y2="20" stroke="hsl(0,0%,55%)" strokeWidth="2" />
    <line x1="38" y1="36" x2="22" y2="20" stroke="hsl(0,0%,55%)" strokeWidth="2" />
    <line x1="6" y1="36" x2="38" y2="36" stroke="hsl(0,0%,55%)" strokeWidth="2" />
    <circle cx="28" cy="8" r="6" fill="hsl(30,55%,68%)" />
    <line x1="22" y1="20" x2="28" y2="8" stroke={col} strokeWidth="4" strokeLinecap="round" />
    <line x1="22" y1="20" x2="15" y2="30" stroke={col} strokeWidth="4" strokeLinecap="round" />
  </g>
);

interface SceneObj {
  type: "car" | "truck" | "pedestrian" | "cyclist";
  x: number; y: number; scale: number;
  label: string; conf: number;
  bx: number; by: number; bw: number; bh: number;
  bodyColor: string; glassColor: string; lightColor: string;
}

const SCENE_OBJECTS: SceneObj[] = [
  { type: "car",        x: 55,  y: 110, scale: 0.85, label: "Car",        conf: 0.94,
    bx: 48,  by: 102, bw: 85,  bh: 52, bodyColor: "hsl(210,50%,30%)", glassColor: "hsl(200,60%,70%)", lightColor: "hsl(50,100%,70%)" },
  { type: "car",        x: 270, y: 118, scale: 0.70, label: "Car",        conf: 0.89,
    bx: 264, by: 112, bw: 73,  bh: 45, bodyColor: "hsl(0,40%,28%)",   glassColor: "hsl(0,10%,70%)",   lightColor: "hsl(50,100%,70%)" },
  { type: "truck",      x: 390, y: 108, scale: 0.58, label: "Truck",      conf: 0.83,
    bx: 383, by: 100, bw: 95,  bh: 54, bodyColor: "hsl(30,40%,30%)",  glassColor: "hsl(200,50%,65%)", lightColor: "hsl(50,100%,70%)" },
  { type: "pedestrian", x: 152, y: 148, scale: 0.75, label: "Pedestrian", conf: 0.77,
    bx: 148, by: 144, bw: 28,  bh: 62, bodyColor: "hsl(120,35%,30%)", glassColor: "hsl(0,0%,70%)",    lightColor: "hsl(50,100%,70%)" },
  { type: "cyclist",    x: 490, y: 148, scale: 0.60, label: "Cyclist",    conf: 0.71,
    bx: 484, by: 140, bw: 55,  bh: 60, bodyColor: "hsl(270,40%,38%)", glassColor: "hsl(0,0%,70%)",    lightColor: "hsl(50,100%,70%)" },
  { type: "pedestrian", x: 350, y: 158, scale: 0.62, label: "Pedestrian", conf: 0.64,
    bx: 346, by: 154, bw: 23,  bh: 50, bodyColor: "hsl(200,40%,32%)", glassColor: "hsl(0,0%,70%)",    lightColor: "hsl(50,100%,70%)" },
];

const COLOR_MAP: Record<DatasetKey, string> = {
  KITTI:    "hsl(210,100%,56%)",
  Waymo:    "hsl(250,80%,62%)",
  nuScenes: "hsl(180,100%,50%)",
};

const DetectionPreview = ({ state, results }: { state: ExperimentState; results: SimResults }) => {
  const numVisible = Math.max(1, Math.floor((results.acc / 100) * SCENE_OBJECTS.length));
  const visible = SCENE_OBJECTS.slice(0, numVisible);
  const noiseFactor = 1 - state.noise / 250;
  const col = COLOR_MAP[state.dataset];
  const isNight = state.noise > 60;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Live Detection Preview</p>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full animate-pulse inline-block"
            style={{ background: col, boxShadow: `0 0 6px ${col}` }} />
          <span className="text-[9px] text-muted-foreground">SIMULATED · {numVisible}/{SCENE_OBJECTS.length} objects</span>
        </div>
      </div>

      <div className="rounded-xl overflow-hidden border border-foreground/[0.06]" style={{ background: "hsl(222,47%,4%)" }}>
        <svg viewBox="0 0 600 290" className="w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="dp-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={isNight ? "hsl(220,50%,4%)" : "hsl(210,55%,18%)"} />
              <stop offset="100%" stopColor={isNight ? "hsl(222,47%,6%)" : "hsl(214,40%,12%)"} />
            </linearGradient>
            <linearGradient id="dp-road" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(220,18%,14%)" />
              <stop offset="100%" stopColor="hsl(220,15%,10%)" />
            </linearGradient>
            <filter id="dp-blur" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation={state.noise > 30 ? state.noise / 30 : 0} />
            </filter>
            <filter id="dp-grain">
              <feTurbulence type="fractalNoise" baseFrequency={state.noise / 3500} numOctaves="3" stitchTiles="stitch" result="noise" />
              <feColorMatrix type="saturate" values="0" in="noise" result="grayNoise" />
              <feBlend in="SourceGraphic" in2="grayNoise" mode="overlay" />
            </filter>
          </defs>

          {/* Sky */}
          <rect width="600" height="290" fill="url(#dp-sky)" />

          {/* Stars at night */}
          {isNight && ([30,80,140,200,260,340,420,480,540,590,50,120,300,450,510] as number[]).map((sx, si) => (
            <circle key={si} cx={sx} cy={([10,22,8,18,28,5,14,20,9,24,35,30,26,12,18] as number[])[si]} r="1" fill="white" opacity="0.5" />
          ))}

          {/* Left buildings */}
          {([{x:0,w:40,h:70},{x:38,w:25,h:55},{x:61,w:35,h:80},{x:94,w:20,h:45}] as {x:number;w:number;h:number}[]).map((b, i) => (
            <rect key={i} x={b.x} y={130 - b.h} width={b.w} height={b.h} fill="hsl(220,20%,10%)" />
          ))}
          {([[8,70],[16,70],[8,82],[16,82],[8,94],[16,94],[43,65],[43,77],[66,70],[66,82],[66,94],[97,55]] as number[][]).map(([wx,wy],i) => (
            <rect key={i} x={wx} y={wy} width="5" height="5" rx="0.5" fill="hsl(45,80%,65%)" opacity={isNight ? 0.9 : 0.3} />
          ))}

          {/* Right buildings */}
          {([{x:500,w:30,h:65},{x:528,w:40,h:90},{x:566,w:34,h:50}] as {x:number;w:number;h:number}[]).map((b, i) => (
            <rect key={i} x={b.x} y={130 - b.h} width={b.w} height={b.h} fill="hsl(220,20%,10%)" />
          ))}
          {([[505,68],[514,68],[505,80],[514,80],[535,72],[545,72],[535,84],[545,84],[535,96],[545,96],[570,58],[570,70]] as number[][]).map(([wx,wy],i) => (
            <rect key={i} x={wx} y={wy} width="5" height="5" rx="0.5" fill="hsl(45,80%,65%)" opacity={isNight ? 0.9 : 0.3} />
          ))}

          {/* Road */}
          <polygon points="0,290 90,130 510,130 600,290" fill="url(#dp-road)" />
          <line x1="90" y1="130" x2="0" y2="290" stroke="hsl(40,40%,55%)" strokeWidth="2.5" opacity="0.5" />
          <line x1="510" y1="130" x2="600" y2="290" stroke="hsl(40,40%,55%)" strokeWidth="2.5" opacity="0.5" />

          {/* Centre dashes */}
          {([0,1,2,3,4] as number[]).map((i) => {
            const t = 0.12 + i * 0.18;
            const y = 130 + t * 160;
            const w = 3 + t * 4; const h = 14 + t * 6;
            return <rect key={i} x={300 - w / 2} y={y} width={w} height={h} rx="1" fill="hsl(50,80%,60%)" opacity={0.55} />;
          })}

          {/* Street lamps */}
          {([[105,130],[480,130]] as number[][]).map(([lx,ly],i) => (
            <g key={i}>
              <line x1={lx} y1={ly} x2={lx} y2={ly-55} stroke="hsl(0,0%,40%)" strokeWidth="2" />
              <line x1={lx} y1={ly-55} x2={lx+(i===0?12:-12)} y2={ly-52} stroke="hsl(0,0%,40%)" strokeWidth="2" />
              <circle cx={lx+(i===0?12:-12)} cy={ly-52} r="3" fill="hsl(50,100%,80%)" opacity={isNight ? 1 : 0.35} />
              {isNight && <circle cx={lx+(i===0?12:-12)} cy={ly-52} r="10" fill="hsl(50,100%,75%)" opacity="0.08" />}
            </g>
          ))}

          {/* Vehicle / pedestrian shapes */}
          {visible.map((obj, i) => (
            <g key={`shape-${i}`}
              opacity={0.5 + obj.conf * noiseFactor * 0.5}
              filter={state.noise > 40 ? "url(#dp-blur)" : undefined}
            >
              {obj.type === "car" && <SvgCar x={obj.x} y={obj.y} scale={obj.scale} bodyCol={obj.bodyColor} glassCol={obj.glassColor} lightCol={obj.lightColor} />}
              {obj.type === "truck" && <SvgTruck x={obj.x} y={obj.y} scale={obj.scale} col={obj.bodyColor} />}
              {obj.type === "pedestrian" && <SvgPedestrian x={obj.x} y={obj.y} scale={obj.scale} col={obj.bodyColor} />}
              {obj.type === "cyclist" && <SvgCyclist x={obj.x} y={obj.y} scale={obj.scale} col={obj.bodyColor} />}
            </g>
          ))}

          {/* Grain overlay */}
          {state.noise > 10 && <rect width="600" height="290" fill="white" opacity={state.noise / 1000} filter="url(#dp-grain)" />}

          {/* Bounding boxes on top */}
          {visible.map((obj, i) => {
            const conf = obj.conf * noiseFactor;
            const opacity = 0.45 + conf * 0.55;
            const lw = obj.label.length * 5.5 + 28;
            return (
              <g key={`box-${i}`} opacity={opacity}>
                <rect x={obj.bx} y={obj.by} width={obj.bw} height={obj.bh}
                  fill="transparent" stroke={col} strokeWidth="1.5" rx="2" />
                <path d={`M${obj.bx},${obj.by+8} L${obj.bx},${obj.by} L${obj.bx+8},${obj.by}`} stroke={col} strokeWidth="2.5" fill="none" />
                <path d={`M${obj.bx+obj.bw-8},${obj.by} L${obj.bx+obj.bw},${obj.by} L${obj.bx+obj.bw},${obj.by+8}`} stroke={col} strokeWidth="2.5" fill="none" />
                <path d={`M${obj.bx},${obj.by+obj.bh-8} L${obj.bx},${obj.by+obj.bh} L${obj.bx+8},${obj.by+obj.bh}`} stroke={col} strokeWidth="2.5" fill="none" />
                <path d={`M${obj.bx+obj.bw-8},${obj.by+obj.bh} L${obj.bx+obj.bw},${obj.by+obj.bh} L${obj.bx+obj.bw},${obj.by+obj.bh-8}`} stroke={col} strokeWidth="2.5" fill="none" />
                <rect x={obj.bx} y={obj.by-16} width={lw} height={14} fill={col} rx="2" opacity="0.88" />
                <text x={obj.bx+4} y={obj.by-5} fontSize="8" fill="white" fontWeight="bold" fontFamily="monospace">
                  {obj.label} {(conf * 100).toFixed(0)}%
                </text>
              </g>
            );
          })}

          {/* HUD */}
          <rect x="0" y="0" width="600" height="20" fill="black" opacity="0.6" />
          <text x="6"   y="13" fontSize="8.5" fill={col}                  fontFamily="monospace" fontWeight="bold">{state.dataset}</text>
          <text x="68"  y="13" fontSize="8.5" fill="white"               fontFamily="monospace" opacity="0.55">MDL:{state.model}</text>
          <text x="160" y="13" fontSize="8.5" fill="hsl(142,76%,54%)"   fontFamily="monospace">ACC:{results.acc.toFixed(1)}%</text>
          <text x="240" y="13" fontSize="8.5" fill="hsl(45,100%,56%)"   fontFamily="monospace">FPS:{results.fps}</text>
          <text x="282" y="13" fontSize="8.5" fill="hsl(180,100%,50%)" fontFamily="monospace">mAP:{results.map.toFixed(1)}%</text>
          <text x="348" y="13" fontSize="8.5" fill="hsl(250,80%,72%)"   fontFamily="monospace">NOISE:{state.noise}%</text>
          {isNight && <text x="430" y="13" fontSize="8.5" fill="hsl(45,100%,60%)" fontFamily="monospace">⚠ LOW-LIGHT</text>}
          <text x="594" y="13" fontSize="8.5" fill="white"               fontFamily="monospace" opacity="0.35" textAnchor="end">SIM</text>
        </svg>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════
   4. EXPERIMENT SIMULATOR
══════════════════════════════════════════════════════ */

const MetricGauge = ({
  label, value, max = 100, color, suffix = "%",
}: {
  label: string; value: number; max?: number; color: string; suffix?: string;
}) => {
  const pct = (value / max) * 100;
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-black tabular-nums" style={{ color }}>
          <AnimatedNumber value={value} decimals={suffix === "%" ? 1 : 0} />{suffix}
        </span>
      </div>
      <div className="h-2 rounded-full bg-muted/30 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          animate={{ width: `${pct}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
        />
      </div>
    </div>
  );
};

const ExperimentSimulator = () => {
  const [state, setState] = useState<ExperimentState>({
    dataset: "Waymo",
    model: "Transformer",
    accuracy: 80,
    noise: 10,
    compute: "High",
  });

  const results = useMemo(() => simulate(state), [state]);

  const set = <K extends keyof ExperimentState>(key: K, val: ExperimentState[K]) =>
    setState((prev) => ({ ...prev, [key]: val }));

  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="container mx-auto px-6 pb-24">
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
      >
        <p className="text-[10px] font-bold uppercase tracking-widest text-accent mb-2">
          🔥 Experiment Mode
        </p>
        <h2 className="text-3xl font-extrabold tracking-tight">Live Experiment Simulator</h2>
        <p className="text-muted-foreground text-sm mt-2">
          Adjust every parameter — results update in real time. No backend required.
        </p>
      </motion.div>

      <motion.div
        className="grid lg:grid-cols-[340px_1fr] gap-6"
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.55, delay: 0.1 }}
      >
        {/* ── LEFT: Controls ── */}
        <GlassCard className="rounded-2xl p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-accent/10">
              <Sliders className="w-4 h-4 text-accent" />
            </div>
            <div>
              <p className="text-sm font-bold">Controls Panel</p>
              <p className="text-[9px] text-muted-foreground uppercase tracking-wider">Tune parameters</p>
            </div>
          </div>

          {/* Top line */}
          <div className="absolute top-0 left-0 right-0 h-[2px]"
            style={{ background: "linear-gradient(90deg,transparent,hsl(var(--accent)),transparent)" }} />

          <Select label="Dataset" value={state.dataset} options={DATASET_LIST}
            onChange={(v) => set("dataset", v as DatasetKey)} color="--secondary" />

          <Select label="Model Architecture" value={state.model} options={MODEL_LIST}
            onChange={(v) => set("model", v as ModelType)} color="--primary" />

          <Select label="Compute Power" value={state.compute} options={COMPUTE_LIST}
            onChange={(v) => set("compute", v as ComputeType)} color="--accent" />

          <Slider
            label="Accuracy Setting" value={state.accuracy} min={50} max={100} unit="%"
            color="--primary" onChange={(v) => set("accuracy", v)}
          />

          <Slider
            label="Noise Level" value={state.noise} min={0} max={100} unit="%"
            color="--secondary" onChange={(v) => set("noise", v)}
          />

          {/* Active config summary */}
          <div
            className="rounded-xl p-3 space-y-1 text-xs"
            style={{ background: `hsl(var(--accent) / 0.06)`, border: `1px solid hsl(var(--accent) / 0.15)` }}
          >
            <p className="font-bold text-accent text-[9px] uppercase tracking-widest mb-2">Active Config</p>
            {[
              ["Dataset", state.dataset],
              ["Model", state.model],
              ["Compute", state.compute],
              ["Accuracy", `${state.accuracy}%`],
              ["Noise",    `${state.noise}%`],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between">
                <span className="text-muted-foreground">{k}</span>
                <span className="font-semibold text-foreground/80">{v}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* ── RIGHT: Output ── */}
        <div className="space-y-5">
          {/* Grade banner */}
          <motion.div
            className="glass rounded-2xl p-5 flex items-center justify-between overflow-hidden relative"
            key={results.grade}
            initial={{ opacity: 0.6, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: `linear-gradient(135deg, ${GRADE_COLORS[results.grade]}10, transparent)` }} />
            <div>
              <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Simulated Result</p>
              <p className="text-4xl font-black tabular-nums mt-1" style={{ color: GRADE_COLORS[results.grade] }}>
                <AnimatedNumber value={results.acc} />%
              </p>
              <p className="text-muted-foreground text-xs mt-0.5">Overall Accuracy</p>
            </div>
            <div className="text-right">
              <span
                className="text-lg font-extrabold px-3 py-1 rounded-xl"
                style={{ color: GRADE_COLORS[results.grade], background: `${GRADE_COLORS[results.grade]}15` }}
              >
                {results.grade}
              </span>
              <p className="text-[9px] text-muted-foreground mt-2 uppercase tracking-wider">
                {state.dataset} + {state.model}
              </p>
            </div>
          </motion.div>

          {/* Metric bars */}
          <GlassCard className="rounded-2xl p-5 space-y-4">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Performance Metrics</p>
            <MetricGauge label="Precision"       value={results.prec} color="hsl(210,100%,56%)"  />
            <MetricGauge label="Recall"           value={results.rec}  color="hsl(250,80%,62%)"  />
            <MetricGauge label="Overall Accuracy" value={results.acc}  color="hsl(180,100%,50%)" />
            <MetricGauge label="FPS" value={results.fps} max={60} color="hsl(142,76%,54%)" suffix=" fps" />
          </GlassCard>

          {/* Detection preview */}
          <GlassCard className="rounded-2xl p-5">
            <DetectionPreview state={state} results={results} />
          </GlassCard>
        </div>
      </motion.div>
    </section>
  );
};

/* ══════════════════════════════════════════════════════
   5. GRAPH DASHBOARD
══════════════════════════════════════════════════════ */

const CHART_OPTS = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { labels: { color: "hsl(215,20%,65%)", font: { size: 11 }, boxWidth: 12, padding: 16 } },
    tooltip: {
      backgroundColor: "hsl(222,47%,8%)",
      titleColor: "hsl(215,20%,85%)",
      bodyColor: "hsl(215,20%,65%)",
      borderColor: "hsl(215,20%,20%)",
      borderWidth: 1,
      padding: 10,
      cornerRadius: 8,
    },
  },
  scales: {
    x: {
      ticks: { color: "hsl(215,20%,55%)", font: { size: 11 } },
      grid:  { color: "hsl(215,20%,15%)" },
    },
    y: {
      ticks: { color: "hsl(215,20%,55%)", font: { size: 11 } },
      grid:  { color: "hsl(215,20%,15%)" },
      min: 0,
    },
  },
} as const;

const GraphDashboard = () => {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  /* Accuracy vs Dataset (grouped by model) */
  const accData = {
    labels: ["KITTI", "Waymo", "nuScenes"],
    datasets: [
      {
        label: "CNN",
        data: [76, 84, 80].map((v) => +(v * MODEL_MULTS.CNN.acc * COMPUTE_MULTS.High.acc).toFixed(1)),
        backgroundColor: "hsl(210,100%,56%,0.75)",
        borderColor: "hsl(210,100%,56%)",
        borderWidth: 1.5,
        borderRadius: 6,
      },
      {
        label: "PointNet",
        data: [76, 84, 80].map((v) => +(v * MODEL_MULTS.PointNet.acc * COMPUTE_MULTS.High.acc).toFixed(1)),
        backgroundColor: "hsl(250,80%,62%,0.75)",
        borderColor: "hsl(250,80%,62%)",
        borderWidth: 1.5,
        borderRadius: 6,
      },
      {
        label: "Transformer",
        data: [76, 84, 80].map((v) => +(v * MODEL_MULTS.Transformer.acc * COMPUTE_MULTS.High.acc).toFixed(1)),
        backgroundColor: "hsl(180,100%,50%,0.65)",
        borderColor: "hsl(180,100%,50%)",
        borderWidth: 1.5,
        borderRadius: 6,
      },
    ],
  };

  /* FPS vs Model (per compute level) */
  const fpsData = {
    labels: ["CNN", "PointNet", "Transformer"],
    datasets: (["Low", "Medium", "High"] as ComputeType[]).map((c, ci) => ({
      label: c,
      data: MODEL_LIST.map((m) =>
        Math.round(DATASETS.Waymo.base.fps * MODEL_MULTS[m].fps * COMPUTE_MULTS[c].fps)
      ),
      backgroundColor: [
        "hsl(210,100%,56%,0.7)",
        "hsl(250,80%,62%,0.7)",
        "hsl(180,100%,50%,0.6)",
      ][ci],
      borderColor: [
        "hsl(210,100%,56%)",
        "hsl(250,80%,62%)",
        "hsl(180,100%,50%)",
      ][ci],
      borderWidth: 1.5,
      borderRadius: 6,
    })),
  };

  /* Training convergence (line chart) */
  const epochs = Array.from({ length: 10 }, (_, i) => `Ep ${i + 1}`);
  const convergenceData = {
    labels: epochs,
    datasets: MODEL_LIST.map((m, i) => {
      const target = { CNN: 76, PointNet: 80, Transformer: 90 }[m];
      return {
        label: m,
        data: epochs.map((_, e) => +(target * (1 - Math.exp(-(e + 1) / 3.5))).toFixed(1)),
        borderColor: ["hsl(210,100%,56%)", "hsl(250,80%,62%)", "hsl(180,100%,50%)"][i],
        backgroundColor: ["hsl(210,100%,56%,0.08)", "hsl(250,80%,62%,0.08)", "hsl(180,100%,50%,0.08)"][i],
        borderWidth: 2,
        pointRadius: 3,
        tension: 0.45,
        fill: true,
      };
    }),
  };

  return (
    <section ref={ref} className="container mx-auto px-6 pb-24">
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
      >
        <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2">Live Charts</p>
        <h2 className="text-3xl font-extrabold tracking-tight">Performance Graph Dashboard</h2>
        <p className="text-muted-foreground text-sm mt-2">Accuracy, speed, and convergence across models and datasets</p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Accuracy vs Dataset */}
        <motion.div
          className="glass rounded-2xl p-6"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.0 }}
        >
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">
            Accuracy vs Dataset
          </p>
          <p className="text-sm font-bold mb-4">Model Accuracy by Dataset (High Compute)</p>
          <div className="h-56">
            <Bar
              data={accData}
              options={{
                ...CHART_OPTS,
                scales: {
                  ...CHART_OPTS.scales,
                  y: { ...CHART_OPTS.scales.y, min: 60, max: 100 },
                },
              }}
            />
          </div>
        </motion.div>

        {/* FPS vs Model */}
        <motion.div
          className="glass rounded-2xl p-6"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">
            Speed vs Compute
          </p>
          <p className="text-sm font-bold mb-4">Inference FPS by Compute Level (Waymo)</p>
          <div className="h-56">
            <Bar data={fpsData} options={CHART_OPTS} />
          </div>
        </motion.div>

        {/* Convergence */}
        <motion.div
          className="glass rounded-2xl p-6 lg:col-span-2"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">
            Training Convergence
          </p>
          <p className="text-sm font-bold mb-4">Validation Accuracy Over Training Epochs</p>
          <div className="h-56">
            <Line
              data={convergenceData}
              options={{
                ...CHART_OPTS,
                scales: {
                  ...CHART_OPTS.scales,
                  y: { ...CHART_OPTS.scales.y, min: 0, max: 100 },
                },
              }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/* ══════════════════════════════════════════════════════
   6. TRY YOUR OWN METHOD  (10 fields + radar chart)
══════════════════════════════════════════════════════ */

const ARCH_OPTIONS = ["CNN", "Transformer", "Hybrid CNN-Transformer", "PointNet", "Custom"] as const;
type ArchType = typeof ARCH_OPTIONS[number];

interface CustomMethod {
  name: string; description: string;
  architecture: ArchType; dataset: DatasetKey;
  acc: number; prec: number; rec: number; fps: number;
  modelSize: number; epochs: number;
}

const RADAR_LABELS = ["Accuracy", "Precision", "Recall", "FPS (norm)", "Size Score", "Epoch Eff."];

const buildRadar = (acc: number, prec: number, rec: number, fps: number, modelSize: number, epochs: number) => [
  acc,
  prec,
  rec,
  Math.min(99, (fps / 60) * 99),
  Math.max(0, 99 - (modelSize / 5000) * 99),
  Math.max(10, 99 - (epochs / 100) * 70),
];

const RADAR_BASE: Record<DatasetKey, number[]> = {
  KITTI:    buildRadar(DATASETS.KITTI.base.acc,    DATASETS.KITTI.base.prec,    DATASETS.KITTI.base.rec,    DATASETS.KITTI.base.fps,    200, 50),
  Waymo:    buildRadar(DATASETS.Waymo.base.acc,    DATASETS.Waymo.base.prec,    DATASETS.Waymo.base.rec,    DATASETS.Waymo.base.fps,    300, 60),
  nuScenes: buildRadar(DATASETS.nuScenes.base.acc, DATASETS.nuScenes.base.prec, DATASETS.nuScenes.base.rec, DATASETS.nuScenes.base.fps, 250, 55),
};

const RADAR_CHART_OPTS = {
  responsive: true, maintainAspectRatio: false,
  plugins: {
    legend: { labels: { color: "hsl(215,20%,65%)", font: { size: 10 }, boxWidth: 10 } },
    tooltip: { backgroundColor: "hsl(222,47%,8%)", titleColor: "hsl(215,20%,85%)", bodyColor: "hsl(215,20%,65%)", borderColor: "hsl(215,20%,20%)", borderWidth: 1, padding: 8, cornerRadius: 8 },
  },
  scales: {
    r: {
      min: 0, max: 100,
      ticks: { color: "hsl(215,20%,40%)", font: { size: 8 }, stepSize: 25, backdropColor: "transparent" },
      grid: { color: "hsl(215,20%,14%)" },
      angleLines: { color: "hsl(215,20%,14%)" },
      pointLabels: { color: "hsl(215,20%,60%)", font: { size: 10, weight: 600 as const } },
    },
  },
};

const CustomMethodSection = () => {
  const [form, setForm] = useState<CustomMethod>({
    name: "", description: "", architecture: "CNN",
    dataset: "Waymo", acc: 85, prec: 82, rec: 80, fps: 25, modelSize: 200, epochs: 30,
  });
  const [submitted, setSubmitted] = useState<CustomMethod | null>(null);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { setError("Please enter a model name."); return; }
    setError("");
    setSubmitted({ ...form, name: form.name.trim() });
  };

  const baseline = submitted ? DATASETS[submitted.dataset].base : null;

  const radarData = submitted ? {
    labels: RADAR_LABELS,
    datasets: [
      {
        label: submitted.name,
        data: buildRadar(submitted.acc, submitted.prec, submitted.rec, submitted.fps, submitted.modelSize, submitted.epochs),
        borderColor: "hsl(250,80%,62%)", backgroundColor: "hsl(250,80%,62%,0.15)",
        borderWidth: 2, pointRadius: 3, pointBackgroundColor: "hsl(250,80%,62%)",
      },
      {
        label: `${submitted.dataset} Baseline`,
        data: RADAR_BASE[submitted.dataset],
        borderColor: "hsl(210,100%,56%)", backgroundColor: "hsl(210,100%,56%,0.10)",
        borderWidth: 2, pointRadius: 3, pointBackgroundColor: "hsl(210,100%,56%)",
      },
    ],
  } : null;

  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="container mx-auto px-6 pb-28">
      <motion.div className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }}>
        <p className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-2">✨ Advanced Feature</p>
        <h2 className="text-3xl font-extrabold tracking-tight">Try Your Own Method</h2>
        <p className="text-muted-foreground text-sm mt-2">10 custom parameters — get a full radar chart vs the dataset baseline</p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* ── FORM ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1 }}
        >
          <GlassCard className="rounded-2xl p-6">
            <div className="absolute top-0 left-0 right-0 h-[2px]"
              style={{ background: "linear-gradient(90deg,transparent,hsl(var(--secondary)),transparent)" }} />

            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "hsl(var(--secondary)/0.12)" }}>
                <Plus className="w-4 h-4 text-secondary" />
              </div>
              <div>
                <p className="text-sm font-bold">Custom Model Parameters</p>
                <p className="text-[9px] text-muted-foreground uppercase tracking-wider">10 fields — radar chart comparison</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Model Name <span className="text-red-400">*</span></label>
                <input type="text" placeholder='e.g. “FusionNet-v3”'
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  className="w-full glass px-4 py-2.5 text-sm font-semibold rounded-xl border border-foreground/10 bg-transparent focus:outline-none focus:border-secondary/40 placeholder:text-muted-foreground/30 transition-colors"
                />
                {error && <p className="text-xs text-red-400">{error}</p>}
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Short Description</label>
                <textarea rows={2} placeholder="What makes your model unique?"
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  className="w-full glass px-4 py-2.5 text-sm rounded-xl border border-foreground/10 bg-transparent focus:outline-none focus:border-secondary/40 placeholder:text-muted-foreground/30 transition-colors resize-none"
                />
              </div>

              {/* Architecture + Dataset */}
              <div className="grid grid-cols-2 gap-3">
                <Select label="Architecture" value={form.architecture} options={ARCH_OPTIONS}
                  onChange={(v) => setForm((p) => ({ ...p, architecture: v as ArchType }))} color="--primary" />
                <Select label="vs Dataset" value={form.dataset} options={DATASET_LIST}
                  onChange={(v) => setForm((p) => ({ ...p, dataset: v as DatasetKey }))} color="--secondary" />
              </div>

              {/* Performance sliders */}
              <div className="grid grid-cols-2 gap-4">
                <Slider label="Accuracy"  value={form.acc}  min={30} max={99} unit="%" color="--secondary" onChange={(v) => setForm((p) => ({ ...p, acc:  v }))} />
                <Slider label="Precision" value={form.prec} min={20} max={99} unit="%" color="--primary"   onChange={(v) => setForm((p) => ({ ...p, prec: v }))} />
                <Slider label="Recall"    value={form.rec}  min={20} max={99} unit="%" color="--accent"    onChange={(v) => setForm((p) => ({ ...p, rec:  v }))} />
                <Slider label="FPS"       value={form.fps}  min={1}  max={120}         color="--primary"   onChange={(v) => setForm((p) => ({ ...p, fps:  v }))} />
              </div>

              {/* Model efficiency */}
              <div className="grid grid-cols-2 gap-4">
                <Slider label="Model Size (MB)"  value={form.modelSize} min={1}  max={5000} step={10} color="--secondary" onChange={(v) => setForm((p) => ({ ...p, modelSize: v }))} />
                <Slider label="Training Epochs" value={form.epochs}    min={1}  max={100}          color="--accent"    onChange={(v) => setForm((p) => ({ ...p, epochs:   v }))} />
              </div>

              <button type="submit"
                className="w-full py-2.5 rounded-xl text-sm font-bold transition-all mt-1"
                style={{ background: "hsl(var(--secondary)/0.12)", border: "1px solid hsl(var(--secondary)/0.3)", color: "hsl(var(--secondary))" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "hsl(var(--secondary)/0.22)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "hsl(var(--secondary)/0.12)")}>
                Compare Against Baseline →
              </button>
            </form>
          </GlassCard>
        </motion.div>

        {/* ── RESULTS ── */}
        <motion.div className="flex flex-col gap-4"
          initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2 }}>
          <GlassCard className="rounded-2xl p-6 flex-1 flex flex-col">
            <div className="absolute top-0 left-0 right-0 h-[2px]"
              style={{ background: "linear-gradient(90deg,transparent,hsl(var(--primary)),transparent)" }} />

            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-primary/10">
                  <TrendingUp className="w-4 h-4 text-primary" />
                </div>
                <p className="text-sm font-bold">Comparison Result</p>
              </div>
              {submitted && (
                <button className="text-xs text-muted-foreground flex items-center gap-1 hover:text-foreground transition-colors"
                  onClick={() => setSubmitted(null)}>
                  <RefreshCw className="w-3 h-3" />Reset
                </button>
              )}
            </div>

            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.div key="empty" className="flex-1 flex flex-col items-center justify-center gap-3 text-center py-12"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="w-14 h-14 rounded-full bg-muted/25 flex items-center justify-center">
                    <Crosshair className="w-6 h-6 text-muted-foreground/30" />
                  </div>
                  <p className="text-sm text-muted-foreground max-w-xs">
                    Fill in your model parameters and click <strong>Compare</strong> to get a radar chart + metric deltas.
                  </p>
                </motion.div>
              ) : (
                <motion.div key="result" className="flex-1 space-y-4"
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}>

                  {/* Name badge */}
                  <div className="rounded-xl p-3 flex items-center gap-3" style={{ background: "hsl(var(--secondary)/0.08)", border: "1px solid hsl(var(--secondary)/0.18)" }}>
                    <div>
                      <p className="font-bold text-sm text-secondary">{submitted.name}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{submitted.architecture} · vs {submitted.dataset}</p>
                      {submitted.description && <p className="text-[10px] text-muted-foreground/70 mt-0.5 italic">“{submitted.description}”</p>}
                    </div>
                  </div>

                  {/* Radar chart */}
                  {radarData && (
                    <div className="rounded-xl overflow-hidden" style={{ background: "hsl(var(--muted)/0.2)", border: "1px solid hsl(var(--foreground)/0.06)" }}>
                      <div className="h-52 p-3">
                        <Radar data={radarData} options={RADAR_CHART_OPTS as Parameters<typeof Radar>[0]["options"]} />
                      </div>
                    </div>
                  )}

                  {/* Delta table */}
                  <div className="space-y-1.5">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Your Model vs {submitted.dataset} Baseline</p>
                    {([
                      { label: "Accuracy",  yours: submitted.acc,  base: baseline!.acc,  suffix: "%" },
                      { label: "Precision", yours: submitted.prec, base: baseline!.prec, suffix: "%" },
                      { label: "Recall",    yours: submitted.rec,  base: baseline!.rec,  suffix: "%" },
                      { label: "FPS",       yours: submitted.fps,  base: baseline!.fps,  suffix: ""  },
                    ] as { label: string; yours: number; base: number; suffix: string }[]).map(({ label, yours, base, suffix }) => {
                      const delta = yours - base;
                      const good = delta >= 0;
                      return (
                        <div key={label} className="flex items-center gap-2 text-xs">
                          <span className="w-16 text-muted-foreground shrink-0">{label}</span>
                          <div className="flex-1 h-1.5 rounded-full bg-muted/30 overflow-hidden relative">
                            <div className="absolute top-0 bottom-0 w-px bg-white/20" style={{ left: `${Math.min(99, base)}%` }} />
                            <div className="h-full rounded-full transition-all duration-500"
                              style={{ width: `${Math.min(99, yours)}%`, background: good ? "hsl(142,76%,54%)" : "hsl(0,80%,60%)" }} />
                          </div>
                          <span className="w-12 text-right font-bold tabular-nums" style={{ color: good ? "hsl(142,76%,54%)" : "hsl(0,80%,60%)" }}>
                            {good ? "+" : ""}{delta.toFixed(1)}{suffix}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Model efficiency summary */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    {([
                      { icon: Activity,  label: "Model Size", val: `${submitted.modelSize} MB`, color: "hsl(210,100%,56%)" },
                      { icon: Sliders,   label: "Epochs",     val: `${submitted.epochs}`,        color: "hsl(250,80%,62%)"  },
                    ] as { icon: React.ElementType; label: string; val: string; color: string }[]).map(({ icon: Icon, label, val, color }) => (
                      <div key={label} className="rounded-xl p-3 flex items-center gap-2.5" style={{ background: "hsl(var(--muted)/0.25)", border: "1px solid hsl(var(--foreground)/0.06)" }}>
                        <Icon className="w-4 h-4 shrink-0" style={{ color }} />
                        <div>
                          <p className="text-[9px] text-muted-foreground uppercase tracking-wider">{label}</p>
                          <p className="text-sm font-bold" style={{ color }}>{val}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
};

/* ══════════════════════════════════════════════════════
   PAGE ROOT
══════════════════════════════════════════════════════ */

const DatasetsPage = () => (
  <div className="min-h-screen">
    <DatasetsHero />
    <DatasetCardsSection />
    <ComparisonTable />
    <ExperimentSimulator />
    <GraphDashboard />
    <CustomMethodSection />
  </div>
);

export default DatasetsPage;
