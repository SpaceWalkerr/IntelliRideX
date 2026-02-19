import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
  type ChartOptions,
} from "chart.js";
import { Bar, Radar, Doughnut, Line } from "react-chartjs-2";
import { BarChart3, Activity, Target, Gauge } from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend,
  Filler
);

/* ─── Theme tokens (hsl → actual values for Chart.js) ───────────────────── */
const C = {
  primary:     "hsl(210, 100%, 56%)",
  primaryFade: "hsla(210, 100%, 56%, 0.15)",
  secondary:   "hsl(250, 80%, 62%)",
  secondaryFade:"hsla(250, 80%, 62%, 0.15)",
  accent:      "hsl(180, 100%, 50%)",
  accentFade:  "hsla(180, 100%, 50%, 0.15)",
  warn:        "hsl(35, 100%, 60%)",
  warnFade:    "hsla(35, 100%, 60%, 0.15)",
  grid:        "hsla(210, 40%, 96%, 0.06)",
  text:        "hsla(210, 40%, 96%, 0.55)",
  textBright:  "hsla(210, 40%, 96%, 0.85)",
};

const baseTooltip = {
  backgroundColor: "hsl(222, 47%, 9%)",
  borderColor:     "hsla(210, 40%, 96%, 0.10)",
  borderWidth:     1,
  titleColor:      C.textBright,
  bodyColor:       C.text,
  padding:         12,
  cornerRadius:    8,
  displayColors:   true,
  boxPadding:      4,
};

const baseScales = (yLabel = "") => ({
  x: {
    ticks:  { color: C.text, font: { size: 11, family: "Inter" } },
    grid:   { color: C.grid, drawBorder: false },
    border: { display: false },
  },
  y: {
    ticks:  { color: C.text, font: { size: 11, family: "Inter" } },
    grid:   { color: C.grid, drawBorder: false },
    border: { display: false },
    title:  { display: !!yLabel, text: yLabel, color: C.text, font: { size: 11 } },
  },
});

/* ─── KPI cards ─────────────────────────────────────────────────────────── */

const kpis = [
  { label: "Best 3D AP",       value: "91.2%", delta: "+4.1%",  color: "primary",   icon: Target },
  { label: "Fastest Inference",value: "11 ms", delta: "−3 ms",  color: "accent",    icon: Gauge },
  { label: "Top mIoU",         value: "82.4%", delta: "+2.8%",  color: "secondary", icon: Activity },
  { label: "Models Surveyed",  value: "18",    delta: "6 tasks", color: "primary",   icon: BarChart3 },
];

const colorMap: Record<string, string> = {
  primary:   "--primary",
  secondary: "--secondary",
  accent:    "--accent",
};

const KPIStrip = () => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
    {kpis.map((k, i) => {
      const Icon = k.icon;
      const c = colorMap[k.color];
      return (
        <motion.div
          key={k.label}
          className="glass relative overflow-hidden p-5 flex flex-col gap-3"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: i * 0.09, ease: "easeOut" }}
          whileHover={{ y: -3 }}
        >
          <div className="absolute top-0 left-0 right-0 h-[2px]"
            style={{ background: `linear-gradient(90deg, transparent, hsl(var(${c})), transparent)` }} />
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-medium">{k.label}</span>
            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: `hsl(var(${c}) / 0.12)` }}>
              <Icon className="w-3.5 h-3.5" style={{ color: `hsl(var(${c}))` }} />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold tracking-tight" style={{ color: `hsl(var(${c}))` }}>
              {k.value}
            </div>
            <div className="text-[11px] text-muted-foreground mt-0.5">{k.delta} vs prev. SOTA</div>
          </div>
        </motion.div>
      );
    })}
  </div>
);

/* ─── Chart 1 — Accuracy vs Model (grouped bar) ─────────────────────────── */

const models = ["YOLOv8", "BEVFormer", "PointPillars", "UniAD", "DETR", "BEVFusion"];

const accuracyData = {
  labels: models,
  datasets: [
    {
      label: "3D Detection AP (%)",
      data: [74.2, 91.2, 72.5, 85.4, 79.8, 89.1],
      backgroundColor: C.primaryFade,
      borderColor:     C.primary,
      borderWidth:     2,
      borderRadius:    5,
      borderSkipped:   false as const,
    },
    {
      label: "Semantic Seg. mIoU (%)",
      data: [68.1, 80.4, 63.2, 78.9, 75.5, 82.4],
      backgroundColor: C.secondaryFade,
      borderColor:     C.secondary,
      borderWidth:     2,
      borderRadius:    5,
      borderSkipped:   false as const,
    },
    {
      label: "Tracking MOTA (%)",
      data: [61.0, 79.3, 58.7, 81.2, 70.1, 76.8],
      backgroundColor: C.accentFade,
      borderColor:     C.accent,
      borderWidth:     2,
      borderRadius:    5,
      borderSkipped:   false as const,
    },
  ],
};

const accuracyOpts: ChartOptions<"bar"> = {
  responsive: true,
  maintainAspectRatio: false,
  animation: { duration: 900, easing: "easeOutQuart" },
  plugins: {
    tooltip: { ...baseTooltip, callbacks: { label: (ctx) => ` ${ctx.dataset.label}: ${ctx.parsed.y}%` } },
    legend: {
      labels: { color: C.text, font: { size: 11, family: "Inter" }, boxWidth: 12, boxHeight: 12, padding: 16 },
    },
  },
  scales: baseScales("Score (%)") as ChartOptions<"bar">["scales"],
  interaction: { mode: "index", intersect: false },
};

/* ─── Chart 2 — Latency comparison (horizontal bar) ─────────────────────── */

const latencyData = {
  labels: models,
  datasets: [
    {
      label: "Inference Latency (ms)",
      data: [18, 95, 25, 140, 42, 68],
      backgroundColor: models.map((_, i) =>
        ["hsla(210,100%,56%,0.25)","hsla(250,80%,62%,0.25)","hsla(180,100%,50%,0.25)",
         "hsla(35,100%,60%,0.25)","hsla(210,100%,56%,0.20)","hsla(180,100%,50%,0.20)"][i]),
      borderColor: [C.primary, C.secondary, C.accent, C.warn, C.primary, C.accent],
      borderWidth: 2,
      borderRadius: 5,
      borderSkipped: false as const,
    },
  ],
};

const latencyOpts: ChartOptions<"bar"> = {
  indexAxis: "y" as const,
  responsive: true,
  maintainAspectRatio: false,
  animation: { duration: 900, easing: "easeOutQuart" },
  plugins: {
    legend: { display: false },
    tooltip: { ...baseTooltip, callbacks: { label: (ctx) => ` Latency: ${ctx.parsed.x} ms` } },
  },
  scales: {
    x: {
      ticks:  { color: C.text, font: { size: 11 }, callback: (v) => `${v} ms` },
      grid:   { color: C.grid },
      border: { display: false },
      title:  { display: true, text: "Inference Time (ms)", color: C.text, font: { size: 11 } },
    },
    y: {
      ticks:  { color: C.textBright, font: { size: 12, family: "Inter", weight: 600 } },
      grid:   { display: false },
      border: { display: false },
    },
  },
};

/* ─── Chart 3 — Radar: 3 models across 5 axes ───────────────────────────── */

const radarAxes = ["Detection", "Segmentation", "Tracking", "Speed", "Robustness"];

const radarData = {
  labels: radarAxes,
  datasets: [
    {
      label: "BEVFormer",
      data: [91, 80, 79, 38, 82],
      borderColor: C.primary,
      backgroundColor: C.primaryFade,
      pointBackgroundColor: C.primary,
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: C.primary,
      borderWidth: 2,
      pointRadius: 4,
    },
    {
      label: "BEVFusion",
      data: [89, 82, 77, 52, 85],
      borderColor: C.accent,
      backgroundColor: C.accentFade,
      pointBackgroundColor: C.accent,
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: C.accent,
      borderWidth: 2,
      pointRadius: 4,
    },
    {
      label: "UniAD",
      data: [85, 79, 81, 28, 78],
      borderColor: C.secondary,
      backgroundColor: C.secondaryFade,
      pointBackgroundColor: C.secondary,
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: C.secondary,
      borderWidth: 2,
      pointRadius: 4,
    },
  ],
};

const radarOpts: ChartOptions<"radar"> = {
  responsive: true,
  maintainAspectRatio: false,
  animation: { duration: 900 },
  plugins: {
    tooltip: { ...baseTooltip },
    legend: {
      labels: { color: C.text, font: { size: 11, family: "Inter" }, boxWidth: 12, boxHeight: 12, padding: 14 },
    },
  },
  scales: {
    r: {
      min: 0,
      max: 100,
      ticks: { display: false, stepSize: 25 },
      grid:  { color: C.grid },
      angleLines: { color: C.grid },
      pointLabels: {
        color: C.textBright,
        font:  { size: 12, family: "Inter", weight: 600 },
      },
    },
  },
};

/* ─── Chart 4 — Dataset annotation volume (Doughnut) ────────────────────── */

const doughnutData = {
  labels: ["Waymo Open (12M)", "nuScenes (1.4M)", "KITTI (380K)", "Argoverse2 (10M)", "Lyft L5 (1.3M)"],
  datasets: [
    {
      data: [12000, 1400, 380, 10000, 1300],
      backgroundColor: [C.primary, C.secondary, C.accent, C.warn,
        "hsla(290,60%,60%,0.80)"],
      borderColor: "hsl(222, 47%, 9%)",
      borderWidth: 3,
      hoverOffset: 8,
    },
  ],
};

const doughnutOpts: ChartOptions<"doughnut"> = {
  responsive: true,
  maintainAspectRatio: false,
  animation: { duration: 900 },
  cutout: "68%",
  plugins: {
    tooltip: {
      ...baseTooltip,
      callbacks: {
        label: (ctx) => {
          const val = ctx.parsed as number;
          return ` ${ctx.label}: ${val >= 1000 ? (val / 1000).toFixed(1) + "M" : val + "K"} boxes`;
        },
      },
    },
    legend: {
      position: "bottom" as const,
      labels: { color: C.text, font: { size: 10, family: "Inter" }, boxWidth: 10, padding: 12 },
    },
  },
};

/* ─── Chart 5 — mAP over training epochs (Line) ─────────────────────────── */

const epochs = Array.from({ length: 10 }, (_, i) => `E${(i + 1) * 5}`);

const lineData = {
  labels: epochs,
  datasets: [
    {
      label: "BEVFormer",
      data: [42, 55, 63, 70, 76, 81, 85, 88, 90, 91.2],
      borderColor: C.primary,
      backgroundColor: C.primaryFade,
      pointBackgroundColor: C.primary,
      pointRadius: 3,
      pointHoverRadius: 6,
      borderWidth: 2.5,
      tension: 0.4,
      fill: true,
    },
    {
      label: "BEVFusion",
      data: [38, 52, 61, 68, 74, 79, 83, 86, 88, 89.1],
      borderColor: C.accent,
      backgroundColor: C.accentFade,
      pointBackgroundColor: C.accent,
      pointRadius: 3,
      pointHoverRadius: 6,
      borderWidth: 2.5,
      tension: 0.4,
      fill: true,
    },
    {
      label: "YOLOv8",
      data: [35, 48, 58, 65, 70, 73, 74, 74.2, 74.2, 74.2],
      borderColor: C.secondary,
      backgroundColor: C.secondaryFade,
      pointBackgroundColor: C.secondary,
      pointRadius: 3,
      pointHoverRadius: 6,
      borderWidth: 2.5,
      tension: 0.4,
      fill: true,
    },
  ],
};

const lineOpts: ChartOptions<"line"> = {
  responsive: true,
  maintainAspectRatio: false,
  animation: { duration: 1000, easing: "easeOutQuart" },
  plugins: {
    tooltip: { ...baseTooltip, mode: "index", intersect: false,
      callbacks: { label: (ctx) => ` ${ctx.dataset.label}: ${ctx.parsed.y}%` } },
    legend: {
      labels: { color: C.text, font: { size: 11, family: "Inter" }, boxWidth: 12, boxHeight: 12, padding: 14 },
    },
  },
  scales: baseScales("mAP (%)") as ChartOptions<"line">["scales"],
  interaction: { mode: "index", intersect: false },
};

/* ─── Chart card wrapper ────────────────────────────────────────────────── */

const ChartCard = ({
  title,
  subtitle,
  color,
  icon: Icon,
  children,
  height = 280,
  delay = 0,
  className = "",
}: {
  title: string;
  subtitle: string;
  color: string;
  icon: React.ElementType;
  children: React.ReactNode;
  height?: number;
  delay?: number;
  className?: string;
}) => (
  <motion.div
    className={`glass relative overflow-hidden flex flex-col ${className}`}
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-40px" }}
    transition={{ duration: 0.5, delay, ease: "easeOut" }}
  >
    {/* Top accent line */}
    <div className="absolute top-0 left-0 right-0 h-[2px]"
      style={{ background: `linear-gradient(90deg, transparent, hsl(var(${color})), transparent)` }} />

    {/* Card header */}
    <div className="flex items-start justify-between gap-3 p-5 pb-3">
      <div>
        <h3 className="text-sm font-bold text-foreground/90">{title}</h3>
        <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
      </div>
      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: `hsl(var(${color}) / 0.12)` }}>
        <Icon className="w-4 h-4" style={{ color: `hsl(var(${color}))` }} />
      </div>
    </div>

    {/* Chart area */}
    <div className="px-4 pb-5 flex-1" style={{ height }}>
      {children}
    </div>
  </motion.div>
);

/* ─── Task selector for accuracy chart ──────────────────────────────────── */

type AccuracyView = "all" | "detection" | "segmentation" | "tracking";

const accuracyViews: { id: AccuracyView; label: string }[] = [
  { id: "all",         label: "All Tasks" },
  { id: "detection",   label: "Detection" },
  { id: "segmentation",label: "Segmentation" },
  { id: "tracking",    label: "Tracking" },
];

const filteredAccuracyData = (view: AccuracyView) => {
  if (view === "all") return accuracyData;
  const idx = view === "detection" ? 0 : view === "segmentation" ? 1 : 2;
  return { ...accuracyData, datasets: [accuracyData.datasets[idx]] };
};

/* ─── Section ───────────────────────────────────────────────────────────── */

const DashboardSection = () => {
  const [activeView, setActiveView] = useState<AccuracyView>("all");
  const headingRef = useRef<HTMLDivElement>(null);
  const inView = useInView(headingRef, { once: true });

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[400px] rounded-full bg-secondary/5 blur-[140px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[400px] rounded-full bg-accent/5 blur-[120px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Heading */}
        <motion.div
          ref={headingRef}
          className="text-center mb-12 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="glass inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary">
            <BarChart3 className="w-4 h-4" />
            Performance Dashboard
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Model{" "}
            <span className="text-gradient-primary">Benchmarks & Metrics</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Interactive charts comparing state-of-the-art autonomous driving models
            across accuracy, latency, and multi-task performance dimensions.
          </p>
        </motion.div>

        {/* KPI strip */}
        <KPIStrip />

        {/* ── Row 1: Accuracy bar + Latency bar ── */}
        <div className="grid lg:grid-cols-5 gap-6 mb-6">

          {/* Accuracy grouped bar — takes 3/5 */}
          <div className="lg:col-span-3 glass relative overflow-hidden flex flex-col">
            <div className="absolute top-0 left-0 right-0 h-[2px]"
              style={{ background: "linear-gradient(90deg, transparent, hsl(var(--primary)), transparent)" }} />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 pb-3">
              <div>
                <h3 className="text-sm font-bold text-foreground/90">Accuracy vs Model</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Detection AP · Segmentation mIoU · Tracking MOTA</p>
              </div>
              {/* Task filter pills */}
              <div className="flex gap-1 flex-wrap">
                {accuracyViews.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setActiveView(v.id)}
                    className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border transition-colors ${
                      activeView === v.id
                        ? "border-primary/40 bg-primary/10 text-primary"
                        : "border-foreground/10 text-muted-foreground hover:border-primary/20 hover:text-foreground/70"
                    }`}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="px-4 pb-5" style={{ height: 280 }}>
              <Bar data={filteredAccuracyData(activeView)} options={accuracyOpts} />
            </div>
          </div>

          {/* Latency horizontal bar — takes 2/5 */}
          <ChartCard
            title="Inference Latency"
            subtitle="End-to-end per-frame time on NVIDIA Orin"
            color="--accent"
            icon={Gauge}
            height={280}
            delay={0.1}
            className="lg:col-span-2"
          >
            <Bar data={latencyData} options={latencyOpts} />
          </ChartCard>
        </div>

        {/* ── Row 2: Radar + Training curve + Doughnut ── */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Radar */}
          <ChartCard
            title="Multi-Task Capability Radar"
            subtitle="Normalised score across 5 performance axes"
            color="--primary"
            icon={Activity}
            height={300}
            delay={0.0}
          >
            <Radar data={radarData} options={radarOpts} />
          </ChartCard>

          {/* Training curve */}
          <ChartCard
            title="Training Convergence"
            subtitle="mAP vs training epoch — top three models"
            color="--secondary"
            icon={Activity}
            height={300}
            delay={0.1}
          >
            <Line data={lineData} options={lineOpts} />
          </ChartCard>

          {/* Dataset doughnut */}
          <ChartCard
            title="Dataset Annotation Volume"
            subtitle="Relative 3D bounding-box count across major datasets"
            color="--accent"
            icon={Target}
            height={300}
            delay={0.2}
          >
            <Doughnut data={doughnutData} options={doughnutOpts} />
          </ChartCard>
        </div>

        {/* Footer note */}
        <motion.p
          className="text-center text-xs text-muted-foreground/50 mt-8"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }} transition={{ delay: 0.5 }}
        >
          Results sourced from published CVPR / ICCV / NeurIPS papers and official leaderboards (2023–2025).
          Latency measured on NVIDIA Orin 64 GB at FP16 precision.
        </motion.p>
      </div>
    </section>
  );
};

export default DashboardSection;
