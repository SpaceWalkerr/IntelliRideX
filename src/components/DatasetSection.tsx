import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Database, Camera, Radio, Cpu, MapPin, Calendar, ChevronDown } from "lucide-react";

/* ─── Data ─────────────────────────────────────────────────────────────── */

const datasets = [
  {
    name: "KITTI",
    year: "2012",
    origin: "Karlsruhe, Germany",
    color: "--primary",
    badge: "Pioneer",
    description:
      "The benchmark that launched a generation of AV research. Captured in real urban and highway environments with a calibrated stereo + LiDAR rig.",
    stats: [
      { label: "Frames", value: "15K+", sub: "annotated" },
      { label: "Classes", value: "8", sub: "object types" },
      { label: "Distance", value: "39 km", sub: "driven" },
    ],
    sensors: [
      { name: "Stereo Camera", icon: Camera, supported: true },
      { name: "LiDAR (64-beam)", icon: Radio, supported: true },
      { name: "GPS / IMU", icon: Cpu, supported: true },
      { name: "Radar", icon: Radio, supported: false },
    ],
    metrics: [
      { task: "3D Object Detection", score: 72, max: 100, unit: "% AP" },
      { task: "Depth Estimation", score: 85, max: 100, unit: "% acc" },
      { task: "Optical Flow", score: 78, max: 100, unit: "% acc" },
      { task: "Semantic Seg.", score: 65, max: 100, unit: "% mIoU" },
    ],
  },
  {
    name: "Waymo Open",
    year: "2019",
    origin: "Multiple US cities",
    color: "--secondary",
    badge: "Large-Scale",
    description:
      "One of the largest and most diverse AV datasets, collected across different cities, weather conditions, and times of day by Waymo's fleet.",
    stats: [
      { label: "Segments", value: "1,950", sub: "20s clips" },
      { label: "3D Labels", value: "12M+", sub: "bounding boxes" },
      { label: "Cameras", value: "5", sub: "surround view" },
    ],
    sensors: [
      { name: "Camera (×5)", icon: Camera, supported: true },
      { name: "LiDAR (×5)", icon: Radio, supported: true },
      { name: "GPS / IMU", icon: Cpu, supported: true },
      { name: "Radar (×3)", icon: Radio, supported: true },
    ],
    metrics: [
      { task: "3D Object Detection", score: 91, max: 100, unit: "% AP" },
      { task: "Motion Prediction", score: 88, max: 100, unit: "% acc" },
      { task: "Semantic Seg.", score: 82, max: 100, unit: "% mIoU" },
      { task: "Tracking (MOTA)", score: 79, max: 100, unit: "% MOTA" },
    ],
  },
  {
    name: "nuScenes",
    year: "2019",
    origin: "Boston & Singapore",
    color: "--accent",
    badge: "Multi-Modal",
    description:
      "Full-surround sensor suite enabling 360° perception tasks. Two-city diversity and rich map annotations make it ideal for multi-modal fusion research.",
    stats: [
      { label: "Scenes", value: "1,000", sub: "20s each" },
      { label: "Annotations", value: "1.4M", sub: "3D boxes" },
      { label: "Categories", value: "23", sub: "fine-grained" },
    ],
    sensors: [
      { name: "Camera (×6)", icon: Camera, supported: true },
      { name: "LiDAR (32-beam)", icon: Radio, supported: true },
      { name: "GPS / IMU", icon: Cpu, supported: true },
      { name: "Radar (×5)", icon: Radio, supported: true },
    ],
    metrics: [
      { task: "3D Object Detection", score: 88, max: 100, unit: "% NDS" },
      { task: "Semantic Seg.", score: 80, max: 100, unit: "% mIoU" },
      { task: "Panoptic Seg.", score: 75, max: 100, unit: "% PQ" },
      { task: "Tracking (AMOTA)", score: 83, max: 100, unit: "% AMOTA" },
    ],
  },
];

/* ─── MetricBar ─────────────────────────────────────────────────────────── */

const MetricBar = ({
  task,
  score,
  unit,
  color,
  delay,
}: {
  task: string;
  score: number;
  unit: string;
  color: string;
  delay: number;
}) => (
  <div className="space-y-1.5">
    <div className="flex justify-between items-center text-xs">
      <span className="text-muted-foreground">{task}</span>
      <span className="font-semibold tabular-nums" style={{ color: `hsl(var(${color}))` }}>
        {score}
        <span className="text-muted-foreground font-normal ml-0.5 text-[10px]">{unit}</span>
      </span>
    </div>
    <div className="h-1.5 w-full rounded-full bg-foreground/[0.06] overflow-hidden">
      <motion.div
        className="h-full rounded-full"
        style={{ background: `hsl(var(${color}) / 0.8)` }}
        initial={{ width: 0 }}
        whileInView={{ width: `${score}%` }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay, ease: "easeOut" }}
      />
    </div>
  </div>
);

/* ─── SensorTag ─────────────────────────────────────────────────────────── */

const SensorTag = ({
  name,
  icon: Icon,
  supported,
  color,
}: {
  name: string;
  icon: React.ElementType;
  supported: boolean;
  color: string;
}) => (
  <div
    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
      supported
        ? "border-foreground/[0.08] text-foreground/80"
        : "border-dashed border-foreground/[0.05] text-muted-foreground/40 line-through"
    }`}
    style={
      supported
        ? { background: `hsl(var(${color}) / 0.07)` }
        : { background: "transparent" }
    }
  >
    <Icon
      className="w-3 h-3 shrink-0"
      style={supported ? { color: `hsl(var(${color}))` } : undefined}
    />
    {name}
  </div>
);

/* ─── DatasetCard ───────────────────────────────────────────────────────── */

const DatasetCard = ({
  dataset,
  index,
}: {
  dataset: (typeof datasets)[0];
  index: number;
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay: index * 0.14 }}
      className="relative group"
    >
      {/* Glow behind card on hover */}
      <div
        className="absolute -inset-px rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 50% 0%, hsl(var(${dataset.color}) / 0.18), transparent 70%)`,
        }}
      />

      <motion.div
        className="relative glass flex flex-col overflow-hidden cursor-pointer"
        whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
        onClick={() => setExpanded((v) => !v)}
      >
        {/* Top accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{ background: `linear-gradient(90deg, transparent, hsl(var(${dataset.color})), transparent)` }}
        />

        {/* Header ─────────────────────────── */}
        <div className="p-6 pb-4 flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: `hsl(var(${dataset.color}) / 0.12)` }}
              >
                <Database
                  className="w-4 h-4"
                  style={{ color: `hsl(var(${dataset.color}))` }}
                />
              </div>
              <h3 className="text-xl font-bold tracking-tight">{dataset.name}</h3>
              <span
                className="text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full border"
                style={{
                  color: `hsl(var(${dataset.color}))`,
                  borderColor: `hsl(var(${dataset.color}) / 0.3)`,
                  background: `hsl(var(${dataset.color}) / 0.08)`,
                }}
              >
                {dataset.badge}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {dataset.year}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {dataset.origin}
              </span>
            </div>
          </div>

          {/* Expand chevron */}
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.25 }}
            className="mt-1 shrink-0 text-muted-foreground/50"
          >
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </div>

        {/* Description */}
        <p className="px-6 text-sm text-muted-foreground leading-relaxed">{dataset.description}</p>

        {/* Quick stats row ─────────────────── */}
        <div className="px-6 py-4 mt-2 flex justify-between gap-3 border-t border-foreground/[0.05]">
          {dataset.stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div
                className="text-lg font-extrabold leading-none"
                style={{ color: `hsl(var(${dataset.color}))` }}
              >
                {stat.value}
              </div>
              <div className="text-[10px] text-muted-foreground mt-0.5">{stat.label}</div>
              <div className="text-[10px] text-muted-foreground/50">{stat.sub}</div>
            </div>
          ))}
        </div>

        {/* Sensors ────────────────────────── */}
        <div className="px-6 pb-5 flex flex-wrap gap-2">
          {dataset.sensors.map((s) => (
            <SensorTag
              key={s.name}
              name={s.name}
              icon={s.icon}
              supported={s.supported}
              color={dataset.color}
            />
          ))}
        </div>

        {/* Expandable metrics ─────────────── */}
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              key="metrics"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div
                className="mx-4 mb-5 rounded-lg p-4 space-y-3"
                style={{ background: `hsl(var(${dataset.color}) / 0.05)` }}
              >
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-4">
                  Benchmark Performance
                </p>
                {dataset.metrics.map((m, mi) => (
                  <MetricBar
                    key={m.task}
                    task={m.task}
                    score={m.score}
                    unit={m.unit}
                    color={dataset.color}
                    delay={mi * 0.08}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

/* ─── Comparison Table ──────────────────────────────────────────────────── */

const tableRows = [
  { feature: "Sensor Suite", kitti: "Camera + LiDAR", waymo: "Cam + LiDAR + Radar", nuscenes: "Cam + LiDAR + Radar" },
  { feature: "LiDAR Beams", kitti: "64", waymo: "64 (×5)", nuscenes: "32" },
  { feature: "Annotation Type", kitti: "3D boxes", waymo: "3D boxes + tracks", nuscenes: "3D boxes + attrs" },
  { feature: "Map Data", kitti: "—", waymo: "HD Map", nuscenes: "HD Map" },
  { feature: "Public Access", kitti: "Free", waymo: "Free", nuscenes: "Free" },
  { feature: "Night / Rain Scenes", kitti: "Limited", waymo: "Yes", nuscenes: "Yes" },
];

const ComparisonTable = () => (
  <motion.div
    className="mt-16 glass overflow-hidden"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
  >
    <div className="px-6 py-4 border-b border-foreground/[0.06]">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        Side-by-Side Comparison
      </p>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-foreground/[0.06]">
            <th className="text-left px-6 py-3 text-muted-foreground font-medium w-44">Feature</th>
            {[
              { name: "KITTI", color: "--primary" },
              { name: "Waymo Open", color: "--secondary" },
              { name: "nuScenes", color: "--accent" },
            ].map((d) => (
              <th
                key={d.name}
                className="px-6 py-3 font-bold text-center"
                style={{ color: `hsl(var(${d.color}))` }}
              >
                {d.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableRows.map((row, i) => (
            <motion.tr
              key={row.feature}
              className="border-b border-foreground/[0.04] last:border-0 hover:bg-foreground/[0.02] transition-colors"
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.06 }}
            >
              <td className="px-6 py-3.5 text-muted-foreground font-medium">{row.feature}</td>
              <td className="px-6 py-3.5 text-center text-foreground/80">{row.kitti}</td>
              <td className="px-6 py-3.5 text-center text-foreground/80">{row.waymo}</td>
              <td className="px-6 py-3.5 text-center text-foreground/80">{row.nuscenes}</td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  </motion.div>
);

/* ─── Section ───────────────────────────────────────────────────────────── */

const DatasetSection = () => (
  <section className="relative py-24 overflow-hidden">
    {/* Subtle background glow */}
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-secondary/5 blur-[120px]" />
    </div>

    <div className="container mx-auto px-6 relative z-10">
      {/* Heading */}
      <motion.div
        className="text-center mb-16 space-y-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <span className="glass inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary">
          <Database className="w-4 h-4" />
          Benchmark Datasets
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Training the{" "}
          <span className="text-gradient-primary">World Model</span>
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          The quality of autonomous driving research hinges on the datasets that
          underpin it. Click any card to reveal benchmark performance metrics.
        </p>
      </motion.div>

      {/* Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {datasets.map((dataset, i) => (
          <DatasetCard key={dataset.name} dataset={dataset} index={i} />
        ))}
      </div>

      {/* Table */}
      <ComparisonTable />
    </div>
  </section>
);

export default DatasetSection;
