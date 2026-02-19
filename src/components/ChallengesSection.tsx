import { useState } from "react";
import { motion } from "framer-motion";
import {
  WifiOff,
  DollarSign,
  Timer,
  CloudRain,
  ShieldAlert,
  GitMerge,
  Cpu,
  Zap,
  ScanEye,
  Network,
  FlaskConical,
  Lock,
  ChevronRight,
} from "lucide-react";

/* ─── Data ───────────────────────────────────────────────────────────────── */

const challenges = [
  {
    id: "noise",
    color: "--primary",
    problemIcon: WifiOff,
    solutionIcon: ScanEye,
    tag: "Data Quality",
    problem: "Sensor Noise & Corruption",
    problemDetail:
      "LiDAR and camera returns degrade under rain, fog, direct sunlight, and sensor calibration drift — causing ghost detections or silent misses at the worst moments.",
    solution: "Robust Multi-Modal Fusion",
    solutionDetail:
      "Cross-modal attention fuses complementary cues: LiDAR depth fills camera ambiguity; cameras fill LiDAR sparsity. Adversarial augmentation at training time simulates corruptions, hardening models against real-world degradation.",
    stat: { value: "40 %", label: "fewer misdetections with sensor fusion vs. single-modal" },
  },
  {
    id: "cost",
    color: "--secondary",
    problemIcon: DollarSign,
    solutionIcon: FlaskConical,
    tag: "Scalability",
    problem: "Annotation Cost & Data Scarcity",
    problemDetail:
      "A single hour of dense 3-D annotation can cost thousands of dollars and weeks of labeller time — making large-scale supervised learning prohibitively expensive.",
    solution: "Self-Supervised & Synthetic Data",
    solutionDetail:
      "Contrastive pre-training on unlabelled drives learns transferable representations without labels. Photorealistic simulators (CARLA, nuPlan) generate unlimited labelled scenes at near-zero cost, closing the simulation-to-real gap via domain randomisation.",
    stat: { value: "10×", label: "cheaper training using self-supervised + synthetic pipelines" },
  },
  {
    id: "realtime",
    color: "--accent",
    problemIcon: Timer,
    solutionIcon: Zap,
    tag: "Latency",
    problem: "Real-Time Inference Constraints",
    problemDetail:
      "State-of-the-art transformer ensembles can take 200 ms per frame — far too slow for 100 ms safety-critical planning cycles at highway speeds.",
    solution: "Model Compression & Edge Deployment",
    solutionDetail:
      "Quantisation (INT8/FP16), structured pruning, and knowledge distillation shrink models 4–8× with < 2 % accuracy drop. Dedicated NPU pipelines on NVIDIA Orin and Qualcomm Ride run full stacks at 60 fps within 30 W envelopes.",
    stat: { value: "< 20 ms", label: "end-to-end latency achievable on optimised edge hardware" },
  },
  {
    id: "weather",
    color: "--glow-accent",
    problemIcon: CloudRain,
    solutionIcon: Network,
    tag: "Edge Cases",
    problem: "Adverse Weather & Rare Events",
    problemDetail:
      "Snow-covered lane markings, heavy rain occlusion, and glare confound vision stacks that trained predominantly on clear-day data — the long tail still kills.",
    solution: "Domain-Adaptive Training",
    solutionDetail:
      "Neural style transfer and physics-based augmentation diversify training distributions. Rare-event mining selects hard examples, and test-time adaptation modules update batch-norm statistics on-the-fly to match deployment conditions.",
    stat: { value: "3× more", label: "robustness in adverse conditions after domain adaptation" },
  },
  {
    id: "safety",
    color: "--primary",
    problemIcon: ShieldAlert,
    solutionIcon: Lock,
    tag: "Safety",
    problem: "Adversarial Attacks & Safety",
    problemDetail:
      "Imperceptible pixel perturbations or physical adversarial patches on stop signs can fool deep networks with high confidence — posing genuine safety threats.",
    solution: "Certified Robustness & Redundancy",
    solutionDetail:
      "Randomised smoothing provides provable robustness certificates within an L² perturbation ball. Redundant sensor disagreement triggers fallback modes, while formal verification tools bound worst-case model outputs before deployment.",
    stat: { value: "ISO 26262", label: "compliance achievable through certified safety architectures" },
  },
  {
    id: "fusion",
    color: "--secondary",
    problemIcon: GitMerge,
    solutionIcon: Cpu,
    tag: "Perception",
    problem: "Multi-Sensor Temporal Alignment",
    problemDetail:
      "Cameras at 30 Hz, LiDAR at 10 Hz, and radar at 20 Hz arrive asynchronously. Naïve concatenation introduces temporal misalignment errors that compound at high speed.",
    solution: "Asynchronous Sensor Fusion",
    solutionDetail:
      "Kalman-filter state propagation predicts each sensor's state to a common timestamp before fusion. Transformer-based architectures treat sensor readings as time-stamped tokens, attending across modalities and timesteps in a unified BEV latent space.",
    stat: { value: "< 1 ms", label: "temporal alignment error with predictive sensor synchronisation" },
  },
];

/* ─── Challenge Card ─────────────────────────────────────────────────────── */

const ChallengeCard = ({
  challenge,
  index,
}: {
  challenge: (typeof challenges)[0];
  index: number;
}) => {
  const [flipped, setFlipped] = useState(false);
  const ProblemIcon = challenge.problemIcon;
  const SolutionIcon = challenge.solutionIcon;

  return (
    <motion.div
      className="relative group"
      initial={{ opacity: 0, y: 44 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.52, delay: index * 0.1 }}
    >
      {/* Ambient glow on hover */}
      <div
        className="absolute -inset-px rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-md pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 50% 0%, hsl(var(${challenge.color}) / 0.2), transparent 70%)`,
        }}
      />

      {/* Card shell — fixed height so flip works */}
      <div
        className="relative h-[310px] cursor-pointer"
        style={{ perspective: "1200px" }}
        onMouseEnter={() => setFlipped(true)}
        onMouseLeave={() => setFlipped(false)}
      >
        <motion.div
          className="relative w-full h-full"
          style={{ transformStyle: "preserve-3d" }}
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 220, damping: 26 }}
        >
          {/* ── FRONT: Problem ── */}
          <div
            className="absolute inset-0 glass flex flex-col p-6 gap-4 overflow-hidden"
            style={{ backfaceVisibility: "hidden" }}
          >
            {/* top accent line */}
            <div
              className="absolute top-0 left-0 right-0 h-[2px] rounded-t-xl"
              style={{
                background: `linear-gradient(90deg, transparent, hsl(var(${challenge.color})), transparent)`,
              }}
            />

            {/* Tag + flip hint */}
            <div className="flex items-center justify-between">
              <span
                className="text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full border"
                style={{
                  color: `hsl(var(${challenge.color}))`,
                  borderColor: `hsl(var(${challenge.color}) / 0.3)`,
                  background: `hsl(var(${challenge.color}) / 0.08)`,
                }}
              >
                {challenge.tag}
              </span>
              <span className="flex items-center gap-1 text-[10px] text-muted-foreground/50">
                Hover for solution
                <ChevronRight className="w-3 h-3" />
              </span>
            </div>

            {/* Icon */}
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
              style={{ background: `hsl(var(${challenge.color}) / 0.12)` }}
            >
              <ProblemIcon
                className="w-6 h-6"
                style={{ color: `hsl(var(${challenge.color}))` }}
              />
            </div>

            {/* Title */}
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">
                Challenge
              </p>
              <h3 className="text-lg font-bold leading-tight">{challenge.problem}</h3>
            </div>

            {/* Detail */}
            <p className="text-sm text-muted-foreground leading-relaxed flex-1 overflow-hidden">
              {challenge.problemDetail}
            </p>
          </div>

          {/* ── BACK: Solution ── */}
          <div
            className="absolute inset-0 glass flex flex-col p-6 gap-4 overflow-hidden"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              background: `hsl(var(${challenge.color}) / 0.06)`,
            }}
          >
            {/* top accent line */}
            <div
              className="absolute top-0 left-0 right-0 h-[2px] rounded-t-xl"
              style={{
                background: `linear-gradient(90deg, transparent, hsl(var(${challenge.color})), transparent)`,
              }}
            />

            {/* Icon */}
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
              style={{ background: `hsl(var(${challenge.color}) / 0.15)` }}
            >
              <SolutionIcon
                className="w-6 h-6"
                style={{ color: `hsl(var(${challenge.color}))` }}
              />
            </div>

            {/* Title */}
            <div>
              <p
                className="text-[10px] font-semibold uppercase tracking-widest mb-1"
                style={{ color: `hsl(var(${challenge.color}))` }}
              >
                Solution
              </p>
              <h3 className="text-lg font-bold leading-tight">{challenge.solution}</h3>
            </div>

            {/* Detail */}
            <p className="text-sm text-muted-foreground leading-relaxed flex-1 overflow-hidden">
              {challenge.solutionDetail}
            </p>

            {/* Key stat pill */}
            <div
              className="flex items-center gap-2 rounded-lg px-3 py-2 border shrink-0"
              style={{
                borderColor: `hsl(var(${challenge.color}) / 0.25)`,
                background: `hsl(var(${challenge.color}) / 0.08)`,
              }}
            >
              <span
                className="text-base font-extrabold tabular-nums"
                style={{ color: `hsl(var(${challenge.color}))` }}
              >
                {challenge.stat.value}
              </span>
              <span className="text-xs text-muted-foreground leading-tight">
                {challenge.stat.label}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

/* ─── Animated counter strip ─────────────────────────────────────────────── */

const summaryStats = [
  { value: "6", suffix: "+", label: "Critical Challenges" },
  { value: "60", suffix: " fps", label: "Target Inference Rate" },
  { value: "99.99", suffix: "%", label: "Required Uptime" },
  { value: "< 100", suffix: " ms", label: "Reaction Budget" },
];

const StatStrip = () => (
  <motion.div
    className="grid grid-cols-2 sm:grid-cols-4 gap-px glass overflow-hidden rounded-2xl mb-16"
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
  >
    {summaryStats.map((s, i) => (
      <div
        key={s.label}
        className="flex flex-col items-center justify-center py-6 px-4 text-center bg-muted/20 hover:bg-muted/40 transition-colors"
      >
        <motion.div
          className="text-2xl sm:text-3xl font-extrabold text-gradient-primary tabular-nums"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.1 + i * 0.1, ease: "backOut" }}
        >
          {s.value}
          <span className="text-lg">{s.suffix}</span>
        </motion.div>
        <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
      </div>
    ))}
  </motion.div>
);

/* ─── Problem → Solution flow bar ───────────────────────────────────────── */

const flowItems = [
  { label: "Detect Failure Mode", color: "--primary" },
  { label: "Collect Edge-Case Data", color: "--secondary" },
  { label: "Re-Train / Adapt", color: "--accent" },
  { label: "Validate & Certify", color: "--primary" },
  { label: "Deploy Update", color: "--secondary" },
];

const ResolutionFlow = () => (
  <motion.div
    className="mt-14"
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
  >
    <p className="text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-6">
      Generalised Problem-Resolution Loop
    </p>
    <div className="flex flex-col sm:flex-row items-center justify-center gap-0">
      {flowItems.map((item, i) => (
        <div key={item.label} className="flex items-center">
          {/* Node */}
          <motion.div
            className="glass flex flex-col items-center justify-center px-4 py-3 text-center rounded-xl min-w-[110px] relative overflow-hidden"
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ y: -3 }}
            transition={{ duration: 0.38, delay: i * 0.1, ease: "backOut" }}
          >
            {/* bottom glow line */}
            <div
              className="absolute bottom-0 left-0 right-0 h-[2px]"
              style={{
                background: `linear-gradient(90deg, transparent, hsl(var(${item.color})), transparent)`,
              }}
            />
            {/* Step number */}
            <span
              className="text-[10px] font-bold mb-0.5"
              style={{ color: `hsl(var(${item.color}))` }}
            >
              0{i + 1}
            </span>
            <span className="text-xs font-semibold leading-tight text-foreground/85">
              {item.label}
            </span>
          </motion.div>

          {/* Connector arrow */}
          {i < flowItems.length - 1 && (
            <motion.div
              className="hidden sm:flex items-center px-1 text-muted-foreground/30"
              initial={{ opacity: 0, scaleX: 0 }}
              whileInView={{ opacity: 1, scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.1 + i * 0.1 }}
            >
              {/* Animated pulse dot on arrow */}
              <div className="relative flex items-center">
                <div className="w-6 h-px bg-foreground/15" />
                <motion.div
                  className="absolute left-0 w-1.5 h-1.5 rounded-full"
                  style={{ background: `hsl(var(${item.color}))` }}
                  animate={{ x: [0, 22, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.4, ease: "easeInOut" }}
                />
                <div className="w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[6px] border-l-foreground/20" />
              </div>
            </motion.div>
          )}

          {/* Mobile connector (vertical) */}
          {i < flowItems.length - 1 && (
            <motion.div
              className="flex sm:hidden w-px h-5 bg-foreground/10 my-0.5"
              initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.2, delay: i * 0.1 }}
            />
          )}
        </div>
      ))}
    </div>
  </motion.div>
);

/* ─── Section ────────────────────────────────────────────────────────────── */

const ChallengesSection = () => (
  <section className="relative py-24 overflow-hidden">
    {/* Background glow */}
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-1/3 left-0 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[130px]" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-secondary/5 blur-[110px]" />
    </div>

    <div className="container mx-auto px-6 relative z-10">
      {/* Heading */}
      <motion.div
        className="text-center mb-12 space-y-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <span className="glass inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary">
          <ShieldAlert className="w-4 h-4" />
          Open Challenges
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          The Hard Problems of{" "}
          <span className="text-gradient-primary">Autonomous Driving</span>
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Despite rapid progress, several fundamental challenges remain unsolved.
          Hover each card to reveal how the research community is tackling them.
        </p>
      </motion.div>

      {/* Stats strip */}
      <StatStrip />

      {/* Challenge cards — 3-column grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {challenges.map((challenge, i) => (
          <ChallengeCard key={challenge.id} challenge={challenge} index={i} />
        ))}
      </div>

      {/* Resolution flow */}
      <ResolutionFlow />
    </div>
  </section>
);

export default ChallengesSection;
