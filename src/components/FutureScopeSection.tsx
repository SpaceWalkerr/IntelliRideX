import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import {
  Brain,
  Radio,
  Car,
  Globe,
  Cpu,
  Sparkles,
  Satellite,
  Network,
  ShieldCheck,
  Zap,
  Building2,
  Infinity,
} from "lucide-react";

/* ─── Data ───────────────────────────────────────────────────────────────── */

type TrackId = "ai" | "sensor" | "adoption";

const tracks: {
  id: TrackId;
  label: string;
  icon: React.ElementType;
  color: string;
  description: string;
}[] = [
  {
    id: "ai",
    label: "AI & Algorithms",
    icon: Brain,
    color: "--primary",
    description: "Foundation models, world models, and generalised driving agents.",
  },
  {
    id: "sensor",
    label: "Sensor Technology",
    icon: Radio,
    color: "--secondary",
    description: "Next-gen LiDAR, 4D radar, event cameras, and V2X connectivity.",
  },
  {
    id: "adoption",
    label: "AV Adoption",
    icon: Car,
    color: "--accent",
    description: "Fleet deployment, regulatory frameworks, and public infrastructure.",
  },
];

const milestones: {
  year: string;
  track: TrackId;
  title: string;
  detail: string;
  icon: React.ElementType;
  status: "achieved" | "near" | "future" | "horizon";
}[] = [
  // ── AI ──
  {
    year: "2024",
    track: "ai",
    title: "Foundation Model Perception",
    detail: "Large vision-language models (GPT-4V, Gemini) deployed for open-vocabulary 3-D scene understanding without dataset-specific fine-tuning.",
    icon: Sparkles,
    status: "achieved",
  },
  {
    year: "2026",
    track: "ai",
    title: "World Model Planning",
    detail: "Neural world models simulate thousands of future trajectories in milliseconds, enabling risk-aware decision-making beyond fixed rule sets.",
    icon: Brain,
    status: "near",
  },
  {
    year: "2028",
    track: "ai",
    title: "Generalised Driving Agents",
    detail: "A single model handles city, highway, off-road, and adverse weather without scene-specific retraining — the ImageNet moment for AV.",
    icon: Cpu,
    status: "future",
  },
  {
    year: "2032",
    track: "ai",
    title: "Continual On-Road Learning",
    detail: "Vehicles learn from every trip, sharing safety-critical edge cases across fleets via federated learning without compromising privacy.",
    icon: Infinity,
    status: "horizon",
  },

  // ── Sensor ──
  {
    year: "2024",
    track: "sensor",
    title: "Solid-State LiDAR at Scale",
    detail: "MEMS micro-mirror LiDARs drop below $200 at volume, enabling full-surround 360° point clouds on mass-market vehicles.",
    icon: Radio,
    status: "achieved",
  },
  {
    year: "2026",
    track: "sensor",
    title: "4D Radar Point Clouds",
    detail: "Continental and Arbe 4D imaging radars resolve velocity-per-point at LiDAR-class resolution — adding all-weather depth perception cheaply.",
    icon: Satellite,
    status: "near",
  },
  {
    year: "2029",
    track: "sensor",
    title: "Event Camera Fusion",
    detail: "Neuromorphic event cameras capturing 1 Mevents/s replace frame cameras in high-speed, high-contrast scenarios with μs latency.",
    icon: Zap,
    status: "future",
  },
  {
    year: "2033",
    track: "sensor",
    title: "V2X + Collective Perception",
    detail: "Road infrastructure — signs, intersections, bridges — broadcasts LiDAR point clouds to passing vehicles, creating a shared city-scale sensor mesh.",
    icon: Network,
    status: "horizon",
  },

  // ── Adoption ──
  {
    year: "2025",
    track: "adoption",
    title: "Commercial Robotaxi Expansion",
    detail: "Waymo, Zoox and Baidu Apollo scale to 20+ cities globally; driverless rides surpass 1 M trip milestone without safety driver.",
    icon: Car,
    status: "achieved",
  },
  {
    year: "2027",
    track: "adoption",
    title: "L3 Highway Autopilot OEM",
    detail: "SAE Level 3 conditional automation reaches 40% of new-vehicle sales in the EU and US following UNECE WP.29 homologation approvals.",
    icon: ShieldCheck,
    status: "near",
  },
  {
    year: "2030",
    track: "adoption",
    title: "Urban L4 Mainstream Fleets",
    detail: "Level 4 robotaxis operating without safety drivers in geofenced metro areas across 50+ cities, reshaping urban mobility economics.",
    icon: Building2,
    status: "future",
  },
  {
    year: "2035",
    track: "adoption",
    title: "L5 Full Autonomy Anywhere",
    detail: "Fully driverless operation in unstructured environments — rural roads, extreme weather, unmapped regions — achieves regulatory acceptance globally.",
    icon: Globe,
    status: "horizon",
  },
];

/* ─── Status config ─────────────────────────────────────────────────────── */

const statusConfig: Record<
  string,
  { label: string; ringColor: string; fillOpacity: string }
> = {
  achieved: { label: "Achieved",      ringColor: "--accent",    fillOpacity: "0.25" },
  near:     { label: "Near-term",     ringColor: "--primary",   fillOpacity: "0.20" },
  future:   { label: "Mid-term",      ringColor: "--secondary", fillOpacity: "0.15" },
  horizon:  { label: "Horizon",       ringColor: "--glow-accent", fillOpacity: "0.10" },
};

/* ─── Milestone node ────────────────────────────────────────────────────── */

const MilestoneNode = ({
  milestone,
  trackColor,
  position,   // "above" | "below"  — alternates to avoid overlap
  index,
}: {
  milestone: (typeof milestones)[0];
  trackColor: string;
  position: "above" | "below";
  index: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const Icon = milestone.icon;
  const sc = statusConfig[milestone.status];

  const cardVariants = {
    hidden: { opacity: 0, y: position === "above" ? -24 : 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: index * 0.08, ease: "easeOut" } },
  };

  return (
    <div
      ref={ref}
      className="relative flex flex-col items-center"
      style={{ minWidth: 160, maxWidth: 200 }}
    >
      {/* Card above the track line */}
      {position === "above" && (
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="mb-3 w-full"
        >
          <MilestoneCard milestone={milestone} trackColor={trackColor} sc={sc} Icon={Icon} />
        </motion.div>
      )}

      {/* Stem → dot */}
      <div className="relative flex flex-col items-center">
        {/* vertical stem */}
        <motion.div
          className="w-px"
          style={{
            height: 32,
            background: `hsl(var(${trackColor}) / 0.35)`,
            order: position === "above" ? 1 : 0,
          }}
          initial={{ scaleY: 0 }}
          animate={inView ? { scaleY: 1 } : { scaleY: 0 }}
          transition={{ duration: 0.3, delay: index * 0.08 + 0.2 }}
        />

        {/* Year label beside dot (shown above for "below" nodes) */}
        {position === "below" && (
          <motion.span
            className="text-[10px] font-bold mb-1"
            style={{ color: `hsl(var(${trackColor}))` }}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: index * 0.08 + 0.3 }}
          >
            {milestone.year}
          </motion.span>
        )}

        {/* Dot */}
        <motion.div
          className="relative z-10 flex items-center justify-center rounded-full"
          style={{
            width: 36,
            height: 36,
            background: `hsl(var(${trackColor}) / ${sc.fillOpacity})`,
            border: `2px solid hsl(var(${sc.ringColor}) / 0.6)`,
            boxShadow: `0 0 12px hsl(var(${sc.ringColor}) / 0.25)`,
          }}
          initial={{ scale: 0 }}
          animate={inView ? { scale: 1 } : { scale: 0 }}
          transition={{ type: "spring", stiffness: 280, damping: 20, delay: index * 0.08 + 0.15 }}
        >
          <Icon className="w-4 h-4" style={{ color: `hsl(var(${sc.ringColor}))` }} />
        </motion.div>

        {/* Year label (shown for "above" nodes) */}
        {position === "above" && (
          <motion.span
            className="text-[10px] font-bold mt-1"
            style={{ color: `hsl(var(${trackColor}))` }}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: index * 0.08 + 0.3 }}
          >
            {milestone.year}
          </motion.span>
        )}
      </div>

      {/* Card below the track line */}
      {position === "below" && (
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="mt-3 w-full"
        >
          <MilestoneCard milestone={milestone} trackColor={trackColor} sc={sc} Icon={Icon} />
        </motion.div>
      )}
    </div>
  );
};

/* ─── Milestone card pop-up ─────────────────────────────────────────────── */

const MilestoneCard = ({
  milestone,
  trackColor,
  sc,
  Icon: _Icon,
}: {
  milestone: (typeof milestones)[0];
  trackColor: string;
  sc: (typeof statusConfig)[string];
  Icon: React.ElementType;
}) => (
  <div
    className="glass p-3 rounded-xl text-left relative overflow-hidden group/card hover:-translate-y-1 transition-transform duration-300"
    style={{ border: `1px solid hsl(var(${trackColor}) / 0.15)` }}
  >
    {/* top accent */}
    <div
      className="absolute top-0 left-0 right-0 h-[1.5px]"
      style={{
        background: `linear-gradient(90deg, transparent, hsl(var(${trackColor})), transparent)`,
      }}
    />
    {/* hover glow */}
    <div
      className="absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-400 pointer-events-none rounded-xl"
      style={{
        background: `radial-gradient(ellipse at 50% 0%, hsl(var(${trackColor}) / 0.10), transparent 70%)`,
      }}
    />

    {/* Status badge */}
    <span
      className="inline-block text-[9px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full border mb-2"
      style={{
        color: `hsl(var(${sc.ringColor}))`,
        borderColor: `hsl(var(${sc.ringColor}) / 0.3)`,
        background: `hsl(var(${sc.ringColor}) / 0.08)`,
      }}
    >
      {sc.label}
    </span>

    <h4 className="text-xs font-bold leading-snug mb-1.5">{milestone.title}</h4>
    <p className="text-[10px] text-muted-foreground leading-relaxed">{milestone.detail}</p>
  </div>
);

/* ─── Single track row ─────────────────────────────────────────────────── */

const TrackRow = ({
  track,
  trackMilestones,
}: {
  track: (typeof tracks)[0];
  trackMilestones: (typeof milestones);
}) => {
  const Icon = track.icon;
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55 }}
    >
      {/* Track label */}
      <div className="flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: `hsl(var(${track.color}) / 0.12)` }}
        >
          <Icon className="w-4 h-4" style={{ color: `hsl(var(${track.color}))` }} />
        </div>
        <div>
          <p className="text-sm font-bold">{track.label}</p>
          <p className="text-[10px] text-muted-foreground">{track.description}</p>
        </div>
      </div>

      {/* Scrollable timeline row */}
      <div ref={scrollRef} className="relative overflow-x-auto pb-4 scrollbar-hide">
        <div className="relative" style={{ minWidth: trackMilestones.length * 176 }}>
          {/* Horizontal rail */}
          <div className="absolute left-0 right-0" style={{ top: "calc(50%)", height: 2 }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: `hsl(var(${track.color}) / 0.20)` }}
              initial={{ scaleX: 0, originX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
            {/* Animated progress pulse */}
            <motion.div
              className="absolute top-0 left-0 h-full rounded-full"
              style={{
                background: `linear-gradient(90deg, transparent, hsl(var(${track.color}) / 0.5), transparent)`,
                width: "30%",
              }}
              animate={{ x: ["0%", "240%", "0%"] }}
              transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            />
          </div>

          {/* Milestone nodes */}
          <div className="relative flex items-center justify-between px-8">
            {trackMilestones.map((m, i) => (
              <MilestoneNode
                key={m.title}
                milestone={m}
                trackColor={track.color}
                position={i % 2 === 0 ? "above" : "below"}
                index={i}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* ─── Legend ─────────────────────────────────────────────────────────────── */

const Legend = () => (
  <motion.div
    className="flex flex-wrap justify-center gap-4 mb-14"
    initial={{ opacity: 0, y: 12 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
  >
    {Object.entries(statusConfig).map(([key, val]) => (
      <div key={key} className="flex items-center gap-2 glass px-3 py-1.5 rounded-full">
        <div
          className="w-2.5 h-2.5 rounded-full"
          style={{
            background: `hsl(var(${val.ringColor}))`,
            boxShadow: `0 0 6px hsl(var(${val.ringColor}) / 0.5)`,
          }}
        />
        <span className="text-xs text-muted-foreground font-medium">{val.label}</span>
      </div>
    ))}
  </motion.div>
);

/* ─── Closing vision card ─────────────────────────────────────────────────── */

const VisionCard = () => (
  <motion.div
    className="mt-16 relative glass overflow-hidden rounded-2xl p-8 text-center"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
  >
    {/* Gradient overlay */}
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-0 left-1/4 w-72 h-32 bg-primary/10 blur-[60px] rounded-full" />
      <div className="absolute bottom-0 right-1/4 w-72 h-32 bg-accent/10 blur-[60px] rounded-full" />
    </div>
    {/* top accent */}
    <div className="absolute top-0 left-0 right-0 h-[2px]"
      style={{ background: "linear-gradient(90deg, transparent, hsl(var(--primary)), hsl(var(--secondary)), hsl(var(--accent)), transparent)" }} />

    <div className="relative z-10 max-w-2xl mx-auto space-y-4">
      <Globe className="w-10 h-10 mx-auto text-primary" />
      <h3 className="text-2xl font-extrabold tracking-tight">
        Towards a{" "}
        <span className="text-gradient-primary">Zero-Accident Future</span>
      </h3>
      <p className="text-muted-foreground leading-relaxed text-sm">
        The convergence of foundation-model AI, solid-state sensing, and city-scale V2X
        infrastructure puts fully autonomous, universally safe mobility within reach
        by the mid-2030s — reshaping urban planning, logistics, and human independence.
      </p>
      <div className="flex flex-wrap justify-center gap-3 pt-2">
        {["Zero Fatalities", "Shared Mobility", "Accessible Transport", "Reduced Emissions"].map((tag) => (
          <span
            key={tag}
            className="glass text-xs font-semibold px-3 py-1.5 rounded-full text-primary border border-primary/20"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  </motion.div>
);

/* ─── Scroll-driven progress bar ─────────────────────────────────────────── */

const ScrollProgress = () => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return { ref, scaleX };
};

/* ─── Section ───────────────────────────────────────────────────────────── */

const FutureScopeSection = () => {
  const { ref, scaleX } = ScrollProgress();

  return (
    <section ref={ref} className="relative py-24 overflow-hidden">
      {/* Scroll-driven top bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] z-50 origin-left"
        style={{
          scaleX,
          background: "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--secondary)), hsl(var(--accent)))",
        }}
      />

      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[300px] bg-primary/5 blur-[140px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[400px] bg-accent/5 blur-[120px] rounded-full" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Heading */}
        <motion.div
          className="text-center mb-14 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="glass inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary">
            <Sparkles className="w-4 h-4" />
            Future Scope
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            The Road{" "}
            <span className="text-gradient-primary">Ahead</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A decade-scale view of how AI, sensing, and deployment are forecast to
            evolve — from today's near-term breakthroughs to the horizon of full autonomy.
          </p>
        </motion.div>

        {/* Legend */}
        <Legend />

        {/* Three track timelines */}
        <div className="space-y-16">
          {tracks.map((track) => (
            <TrackRow
              key={track.id}
              track={track}
              trackMilestones={milestones.filter((m) => m.track === track.id)}
            />
          ))}
        </div>

        {/* Vision card */}
        <VisionCard />
      </div>
    </section>
  );
};

export default FutureScopeSection;
