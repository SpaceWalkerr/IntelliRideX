import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  Target, Zap, TrendingDown, CheckCircle2, XCircle,
  Activity, Cpu, Cloud, CloudRain, CloudFog, Moon,
  Eye, Lightbulb, ArrowRight, Gauge, Brain, RefreshCw,
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, LineElement, PointElement,
  RadialLinearScale, Tooltip, Legend, Title, Filler,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale, LinearScale, BarElement, LineElement, PointElement,
  RadialLinearScale, Tooltip, Legend, Title, Filler,
);

/* ══════════════════════════════════════════════════════
   DATA & TYPES
══════════════════════════════════════════════════════ */

const MODELS = ["CNN", "PointNet", "Transformer"] as const;
const DATASETS = ["KITTI", "Waymo", "nuScenes"] as const;
const SCENARIOS = ["Clear", "Rain", "Fog", "Night"] as const;

type ModelType = typeof MODELS[number];
type DatasetType = typeof DATASETS[number];
type ScenarioType = typeof SCENARIOS[number];

interface SimState {
  model: ModelType;
  dataset: DatasetType;
  scenario: ScenarioType;
}

interface Metrics {
  accuracy: number;
  fps: number;
  loss: number;
  precision: number;
  recall: number;
  falsePos: number;
  falseNeg: number;
}

const BASE_METRICS: Record<ModelType, Record<DatasetType, Metrics>> = {
  CNN: {
    KITTI:    { accuracy: 76, fps: 45, loss: 0.24, precision: 74, recall: 72, falsePos: 12, falseNeg: 16 },
    Waymo:    { accuracy: 82, fps: 32, loss: 0.18, precision: 80, recall: 78, falsePos: 9,  falseNeg: 13 },
    nuScenes: { accuracy: 79, fps: 38, loss: 0.21, precision: 77, recall: 75, falsePos: 11, falseNeg: 14 },
  },
  PointNet: {
    KITTI:    { accuracy: 80, fps: 36, loss: 0.20, precision: 78, recall: 76, falsePos: 10, falseNeg: 14 },
    Waymo:    { accuracy: 86, fps: 25, loss: 0.14, precision: 84, recall: 82, falsePos: 7,  falseNeg: 11 },
    nuScenes: { accuracy: 83, fps: 30, loss: 0.17, precision: 81, recall: 79, falsePos: 9,  falseNeg: 12 },
  },
  Transformer: {
    KITTI:    { accuracy: 85, fps: 26, loss: 0.15, precision: 83, recall: 81, falsePos: 8,  falseNeg: 11 },
    Waymo:    { accuracy: 91, fps: 18, loss: 0.09, precision: 89, recall: 87, falsePos: 5,  falseNeg: 8  },
    nuScenes: { accuracy: 88, fps: 22, loss: 0.12, precision: 86, recall: 84, falsePos: 6,  falseNeg: 10 },
  },
};

const SCENARIO_PENALTY: Record<ScenarioType, number> = {
  Clear: 1.00,
  Rain:  0.88,
  Fog:   0.82,
  Night: 0.85,
};

const computeMetrics = (state: SimState): Metrics => {
  const base = BASE_METRICS[state.model][state.dataset];
  const penalty = SCENARIO_PENALTY[state.scenario];
  return {
    accuracy:  Math.round(base.accuracy * penalty),
    fps:       Math.round(base.fps * penalty),
    loss:      +(base.loss / penalty).toFixed(3),
    precision: Math.round(base.precision * penalty),
    recall:    Math.round(base.recall * penalty),
    falsePos:  Math.round(base.falsePos / penalty),
    falseNeg:  Math.round(base.falseNeg / penalty),
  };
};

const INSIGHTS = {
  bestAccuracy: "Transformer on Waymo achieves 91% accuracy — best for complex urban scenarios.",
  bestSpeed: "CNN on KITTI delivers 45 FPS — ideal for real-time embedded systems.",
  weakScenario: "High false positives in dense traffic highlight limitations in object separation.",
  tradeoff: "Higher accuracy often comes at the cost of computational efficiency.",
  datasetCompare: "While Waymo achieves higher accuracy, KITTI provides faster inference due to smaller dataset complexity.",
};

/* ══════════════════════════════════════════════════════
   UTILITY COMPONENTS
══════════════════════════════════════════════════════ */

const GlassCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`glass relative overflow-hidden rounded-2xl ${className}`}>{children}</div>
);

const AnimatedNumber = ({ value, decimals = 0, suffix = "" }: { value: number; decimals?: number; suffix?: string }) => {
  const [display, setDisplay] = useState(value);
  useEffect(() => {
    const start = display;
    const end = value;
    const dur = 800;
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
  return <>{display.toFixed(decimals)}{suffix}</>;
};

/* ══════════════════════════════════════════════════════
   HERO
══════════════════════════════════════════════════════ */

const ResultsHero = () => (
  <div className="relative overflow-hidden py-20 sm:py-24">
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-0 right-1/4 w-[600px] h-[280px] bg-primary/8 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 left-1/3 w-[500px] h-[260px] bg-secondary/6 blur-[100px] rounded-full" />
    </div>
    <div className="container mx-auto px-6 relative z-10 text-center">
      <motion.div className="space-y-6 max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <span className="glass inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary">
          <Brain className="w-4 h-4" />
          AI-Driven Insights
        </span>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight">
          Performance{" "}
          <span className="text-gradient-primary">Results Dashboard</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Real-time model comparison, scenario testing, and intelligent insights — experiment with datasets, architectures, and weather conditions to reveal performance trade-offs.
        </p>
      </motion.div>
    </div>
  </div>
);

/* ══════════════════════════════════════════════════════
   1. KPI CARDS
══════════════════════════════════════════════════════ */

const KPICard = ({ icon: Icon, label, value, suffix, color, decimals = 0 }: {
  icon: React.ElementType; label: string; value: number; suffix: string;
  color: string; decimals?: number;
}) => {
  const goodThreshold = label === "Loss" ? 0.2 : (label === "FPS" ? 30 : 80);
  const isGood = label === "Loss" ? value < goodThreshold : value >= goodThreshold;
  const statusColor = isGood ? "hsl(142,76%,54%)" : "hsl(0,80%,60%)";

  return (
    <GlassCard className="p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}18` }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: statusColor }} />
      </div>
      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">{label}</p>
      <p className="text-3xl font-black tabular-nums" style={{ color }}>
        <AnimatedNumber value={value} decimals={decimals} suffix={suffix} />
      </p>
    </GlassCard>
  );
};

const KPISection = ({ metrics }: { metrics: Metrics }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <section ref={ref} className="container mx-auto px-6 pb-16">
      <motion.div className="grid grid-cols-2 md:grid-cols-5 gap-4"
        initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }}>
        <KPICard icon={Target}        label="Accuracy"  value={metrics.accuracy}  suffix="%" color="hsl(210,100%,56%)" />
        <KPICard icon={Zap}           label="FPS"       value={metrics.fps}       suffix=""  color="hsl(142,76%,54%)" />
        <KPICard icon={TrendingDown}  label="Loss"      value={metrics.loss}      suffix=""  color="hsl(45,100%,56%)" decimals={3} />
        <KPICard icon={CheckCircle2}  label="Precision" value={metrics.precision} suffix="%" color="hsl(250,80%,62%)" />
        <KPICard icon={Activity}      label="Recall"    value={metrics.recall}    suffix="%" color="hsl(180,100%,50%)" />
      </motion.div>
    </section>
  );
};

/* ══════════════════════════════════════════════════════
   3. MODEL PERFORMANCE COMPARISON
══════════════════════════════════════════════════════ */

const CHART_OPTS = {
  responsive: true, maintainAspectRatio: false,
  plugins: {
    legend: { labels: { color: "hsl(215,20%,65%)", font: { size: 11 }, boxWidth: 12, padding: 12 } },
    tooltip: { backgroundColor: "hsl(222,47%,8%)", titleColor: "hsl(215,20%,85%)", bodyColor: "hsl(215,20%,65%)", borderColor: "hsl(215,20%,20%)", borderWidth: 1, padding: 10, cornerRadius: 8 },
  },
  scales: {
    x: { ticks: { color: "hsl(215,20%,55%)", font: { size: 11 } }, grid: { color: "hsl(215,20%,12%)" } },
    y: { ticks: { color: "hsl(215,20%,55%)", font: { size: 11 } }, grid: { color: "hsl(215,20%,12%)" }, min: 0 },
  },
};

const ModelComparisonChart = ({ dataset }: { dataset: DatasetType }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const accData = {
    labels: [...MODELS] as string[],
    datasets: [{
      label: "Accuracy (%)",
      data: MODELS.map((m) => BASE_METRICS[m][dataset].accuracy),
      backgroundColor: "hsl(210,100%,56%,0.75)",
      borderColor: "hsl(210,100%,56%)",
      borderWidth: 2, borderRadius: 8,
    }],
  };

  const fpsData = {
    labels: [...MODELS] as string[],
    datasets: [{
      label: "FPS (Speed)",
      data: MODELS.map((m) => BASE_METRICS[m][dataset].fps),
      backgroundColor: "hsl(142,76%,54%,0.75)",
      borderColor: "hsl(142,76%,54%)",
      borderWidth: 2, borderRadius: 8,
    }],
  };

  return (
    <section ref={ref} className="container mx-auto px-6 pb-16">
      <motion.div className="text-center mb-10"
        initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }}>
        <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2">Model Performance</p>
        <h2 className="text-3xl font-extrabold tracking-tight">Which Model Wins?</h2>
        <p className="text-sm text-muted-foreground mt-2">Accuracy vs Speed on {dataset}</p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1 }}>
          <GlassCard className="p-6">
            <p className="text-sm font-bold mb-4 flex items-center gap-2">
              <Target className="w-4 h-4 text-primary" />Accuracy Comparison
            </p>
            <div className="h-56"><Bar data={accData} options={CHART_OPTS} /></div>
          </GlassCard>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2 }}>
          <GlassCard className="p-6">
            <p className="text-sm font-bold mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4 text-accent" />Speed Comparison
            </p>
            <div className="h-56"><Bar data={fpsData} options={{ ...CHART_OPTS, scales: { ...CHART_OPTS.scales, y: { ...CHART_OPTS.scales.y, max: 50 } } }} /></div>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
};

/* ══════════════════════════════════════════════════════
   4. DATASET vs PERFORMANCE
══════════════════════════════════════════════════════ */

const DatasetComparisonSection = ({ model }: { model: ModelType }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const data = {
    labels: [...DATASETS] as string[],
    datasets: [
      { label: "Accuracy (%)", data: DATASETS.map((d) => BASE_METRICS[model][d].accuracy), borderColor: "hsl(210,100%,56%)", backgroundColor: "hsl(210,100%,56%,0.1)", borderWidth: 2.5, pointRadius: 5, tension: 0.4, fill: true },
      { label: "FPS", data: DATASETS.map((d) => BASE_METRICS[model][d].fps), borderColor: "hsl(142,76%,54%)", backgroundColor: "hsl(142,76%,54%,0.1)", borderWidth: 2.5, pointRadius: 5, tension: 0.4, fill: true },
    ],
  };

  return (
    <section ref={ref} className="container mx-auto px-6 pb-16">
      <motion.div className="text-center mb-10"
        initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }}>
        <p className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-2">Dataset Analysis</p>
        <h2 className="text-3xl font-extrabold tracking-tight">Dataset Performance</h2>
        <p className="text-sm text-muted-foreground mt-2">{model} across KITTI, Waymo, nuScenes</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1 }}>
        <GlassCard className="p-6">
          <div className="h-64"><Line data={data} options={{ ...CHART_OPTS, scales: { ...CHART_OPTS.scales, y: { ...CHART_OPTS.scales.y, max: 100 } } }} /></div>
          <div className="mt-6 p-4 rounded-xl" style={{ background: "hsl(var(--accent)/0.08)", border: "1px solid hsl(var(--accent)/0.15)" }}>
            <p className="text-xs text-muted-foreground leading-relaxed flex items-start gap-2">
              <Lightbulb className="w-3.5 h-3.5 text-accent mt-0.5 shrink-0" />
              <span>{INSIGHTS.datasetCompare}</span>
            </p>
          </div>
        </GlassCard>
      </motion.div>
    </section>
  );
};

/* ══════════════════════════════════════════════════════
   5. REAL-TIME SIMULATION
══════════════════════════════════════════════════════ */

const SimulationPanel = ({ state, setState }: { state: SimState; setState: (s: SimState) => void }) => {
  const [analyzing, setAnalyzing] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const handleChange = <K extends keyof SimState>(key: K, val: SimState[K]) => {
    setAnalyzing(true);
    setTimeout(() => {
      setState({ ...state, [key]: val });
      setAnalyzing(false);
    }, 600);
  };

  const metrics = useMemo(() => computeMetrics(state), [state]);

  return (
    <section ref={ref} className="container mx-auto px-6 pb-16">
      <motion.div className="text-center mb-10"
        initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }}>
        <p className="text-[10px] font-bold uppercase tracking-widest text-accent mb-2">🔥 Live Simulation</p>
        <h2 className="text-3xl font-extrabold tracking-tight">Experiment in Real-Time</h2>
        <p className="text-sm text-muted-foreground mt-2">Change model, dataset, or scenario — metrics update instantly</p>
      </motion.div>

      <motion.div className="grid lg:grid-cols-[320px_1fr] gap-6"
        initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1 }}>
        {/* Controls */}
        <GlassCard className="p-6 space-y-5">
          <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: "linear-gradient(90deg,transparent,hsl(var(--accent)),transparent)" }} />
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
              <Cpu className="w-4 h-4 text-accent" />
            </div>
            <div>
              <p className="text-sm font-bold">Controls</p>
              <p className="text-[9px] text-muted-foreground uppercase tracking-wider">Adjust parameters</p>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Model Architecture</label>
            <div className="grid grid-cols-3 gap-2">
              {MODELS.map((m) => (
                <button key={m} onClick={() => handleChange("model", m)}
                  className={`py-2 px-3 text-xs font-bold rounded-xl transition-all ${state.model === m ? "bg-primary/20 text-primary border border-primary/40" : "glass text-muted-foreground border border-transparent hover:border-foreground/10"}`}>
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Dataset</label>
            <div className="grid grid-cols-3 gap-2">
              {DATASETS.map((d) => (
                <button key={d} onClick={() => handleChange("dataset", d)}
                  className={`py-2 px-2 text-xs font-bold rounded-xl transition-all ${state.dataset === d ? "bg-secondary/20 text-secondary border border-secondary/40" : "glass text-muted-foreground border border-transparent hover:border-foreground/10"}`}>
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Scenario Testing</label>
            <div className="grid grid-cols-2 gap-2">
              {SCENARIOS.map((sc) => {
                const Icon = sc === "Clear" ? Cloud : sc === "Rain" ? CloudRain : sc === "Fog" ? CloudFog : Moon;
                return (
                  <button key={sc} onClick={() => handleChange("scenario", sc)}
                    className={`py-2.5 px-3 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${state.scenario === sc ? "bg-accent/20 text-accent border border-accent/40" : "glass text-muted-foreground border border-transparent hover:border-foreground/10"}`}>
                    <Icon className="w-3.5 h-3.5" />{sc}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-xl p-3 space-y-1 text-xs" style={{ background: "hsl(var(--primary)/0.06)", border: "1px solid hsl(var(--primary)/0.15)" }}>
            <p className="font-bold text-primary text-[9px] uppercase tracking-widest mb-1.5">Active Config</p>
            {[["Model", state.model], ["Dataset", state.dataset], ["Scenario", state.scenario]].map(([k, v]) => (
              <div key={k} className="flex justify-between">
                <span className="text-muted-foreground">{k}</span>
                <span className="font-semibold text-foreground/80">{v}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Output */}
        <div className="space-y-4">
          <AnimatePresence mode="wait">
            {analyzing ? (
              <motion.div key="analyzing" className="glass rounded-2xl p-8 flex flex-col items-center justify-center gap-4 min-h-[280px]"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="relative">
                  <RefreshCw className="w-10 h-10 text-primary animate-spin" />
                  <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl" />
                </div>
                <p className="text-sm font-bold text-primary">Analyzing performance...</p>
                <p className="text-xs text-muted-foreground">Computing metrics</p>
              </motion.div>
            ) : (
              <motion.div key="result" className="space-y-4"
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
                <GlassCard className="p-6">
                  <p className="text-sm font-bold mb-4 flex items-center gap-2">
                    <Gauge className="w-4 h-4 text-primary" />Updated Metrics
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "Accuracy", val: metrics.accuracy, suffix: "%", color: "hsl(210,100%,56%)" },
                      { label: "FPS", val: metrics.fps, suffix: "", color: "hsl(142,76%,54%)" },
                      { label: "Loss", val: metrics.loss, suffix: "", color: "hsl(45,100%,56%)", dec: 3 },
                      { label: "Precision", val: metrics.precision, suffix: "%", color: "hsl(250,80%,62%)" },
                      { label: "Recall", val: metrics.recall, suffix: "%", color: "hsl(180,100%,50%)" },
                      { label: "F1-Score", val: Math.round(2 * metrics.precision * metrics.recall / (metrics.precision + metrics.recall)), suffix: "%", color: "hsl(210,100%,56%)" },
                    ].map((m) => (
                      <div key={m.label} className="rounded-xl p-3 text-center" style={{ background: "hsl(var(--muted)/0.3)" }}>
                        <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground mb-1">{m.label}</p>
                        <p className="text-xl font-black tabular-nums" style={{ color: m.color }}>
                          <AnimatedNumber value={m.val} decimals={m.dec || 0} suffix={m.suffix} />
                        </p>
                      </div>
                    ))}
                  </div>
                </GlassCard>

                <GlassCard className="p-6">
                  <p className="text-sm font-bold mb-4 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-accent" />Performance Graph
                  </p>
                  <div className="h-48">
                    <Bar
                      data={{
                        labels: ["Accuracy", "Precision", "Recall"],
                        datasets: [{
                          label: `${state.model} on ${state.dataset}`,
                          data: [metrics.accuracy, metrics.precision, metrics.recall],
                          backgroundColor: ["hsl(210,100%,56%,0.75)", "hsl(250,80%,62%,0.75)", "hsl(180,100%,50%,0.75)"],
                          borderColor: ["hsl(210,100%,56%)", "hsl(250,80%,62%)", "hsl(180,100%,50%)"],
                          borderWidth: 2, borderRadius: 8,
                        }],
                      }}
                      options={{ ...CHART_OPTS, scales: { ...CHART_OPTS.scales, y: { ...CHART_OPTS.scales.y, max: 100 } } }}
                    />
                  </div>
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  );
};

/* ══════════════════════════════════════════════════════
   6. ERROR ANALYSIS
══════════════════════════════════════════════════════ */

const ErrorAnalysisSection = ({ metrics }: { metrics: Metrics }) => {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} className="container mx-auto px-6 pb-16">
      <motion.div className="text-center mb-10"
        initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }}>
        <p className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-2">Error Breakdown</p>
        <h2 className="text-3xl font-extrabold tracking-tight">Where Does It Fail?</h2>
      </motion.div>

      <motion.div className="grid lg:grid-cols-2 gap-6"
        initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1 }}>
        <GlassCard className="p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <p className="text-sm font-bold">False Positives</p>
              <p className="text-xs text-muted-foreground">Detected incorrectly</p>
            </div>
          </div>
          <p className="text-4xl font-black text-red-400 mb-4"><AnimatedNumber value={metrics.falsePos} suffix="%" /></p>
          <div className="space-y-2">
            {["Dense traffic scenarios", "Occluded objects", "Reflective surfaces"].map((ex, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400/50" />
                {ex}
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
              <XCircle className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <p className="text-sm font-bold">False Negatives</p>
              <p className="text-xs text-muted-foreground">Missed detections</p>
            </div>
          </div>
          <p className="text-4xl font-black text-orange-400 mb-4"><AnimatedNumber value={metrics.falseNeg} suffix="%" /></p>
          <div className="space-y-2">
            {["Small distant objects", "Poor lighting conditions", "Fast-moving vehicles"].map((ex, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="w-1.5 h-1.5 rounded-full bg-orange-400/50" />
                {ex}
              </div>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      <motion.div className="mt-6"
        initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2 }}>
        <div className="p-4 rounded-xl" style={{ background: "hsl(var(--secondary)/0.08)", border: "1px solid hsl(var(--secondary)/0.15)" }}>
          <p className="text-xs text-muted-foreground leading-relaxed flex items-start gap-2">
            <Lightbulb className="w-3.5 h-3.5 text-secondary mt-0.5 shrink-0" />
            <span>{INSIGHTS.weakScenario}</span>
          </p>
        </div>
      </motion.div>
    </section>
  );
};

/* ══════════════════════════════════════════════════════
   7. TRADE-OFF VISUALIZATION
══════════════════════════════════════════════════════ */

const TradeoffSection = () => {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const points = MODELS.flatMap((m) => DATASETS.map((d) => ({
    model: m, dataset: d, acc: BASE_METRICS[m][d].accuracy, fps: BASE_METRICS[m][d].fps,
  })));

  return (
    <section ref={ref} className="container mx-auto px-6 pb-16">
      <motion.div className="text-center mb-10"
        initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }}>
        <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2">Trade-off Analysis</p>
        <h2 className="text-3xl font-extrabold tracking-tight">Accuracy vs Speed</h2>
        <p className="text-sm text-muted-foreground mt-2">The real-world compromise</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1 }}>
        <GlassCard className="p-6">
          <div className="grid lg:grid-cols-[1fr_300px] gap-6">
            <div>
              <div className="relative h-80 rounded-xl overflow-hidden" style={{ background: "hsl(var(--muted)/0.2)" }}>
                <svg viewBox="0 0 100 100" className="w-full h-full p-4" preserveAspectRatio="xMidYMid meet">
                  {/* Grid */}
                  {[0, 25, 50, 75, 100].map((v) => (
                    <g key={v}>
                      <line x1="0" y1={100 - v} x2="100" y2={100 - v} stroke="hsl(var(--foreground)/0.06)" strokeWidth="0.3" />
                      <line x1={v} y1="0" x2={v} y2="100" stroke="hsl(var(--foreground)/0.06)" strokeWidth="0.3" />
                    </g>
                  ))}
                  {/* Points */}
                  {points.map((p, i) => {
                    const x = (p.fps / 50) * 100;
                    const y = 100 - p.acc;
                    const col = p.model === "CNN" ? "hsl(210,100%,56%)" : p.model === "PointNet" ? "hsl(250,80%,62%)" : "hsl(180,100%,50%)";
                    return (
                      <g key={i}>
                        <circle cx={x} cy={y} r="2.5" fill={col} opacity="0.8" />
                        <text x={x + 3} y={y - 2} fontSize="3" fill={col} fontWeight="bold">{p.model[0]}</text>
                      </g>
                    );
                  })}
                  {/* Axes */}
                  <line x1="0" y1="100" x2="100" y2="100" stroke="hsl(var(--foreground)/0.2)" strokeWidth="0.5" />
                  <line x1="0" y1="0" x2="0" y2="100" stroke="hsl(var(--foreground)/0.2)" strokeWidth="0.5" />
                  <text x="50" y="98" fontSize="3.5" fill="hsl(var(--muted-foreground))" textAnchor="middle">FPS →</text>
                  <text x="2" y="50" fontSize="3.5" fill="hsl(var(--muted-foreground))" transform="rotate(-90 2 50)">Accuracy (%) →</text>
                </svg>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Legend</p>
              {[
                { model: "CNN", color: "hsl(210,100%,56%)", desc: "Fast, moderate accuracy" },
                { model: "PointNet", color: "hsl(250,80%,62%)", desc: "Balanced trade-off" },
                { model: "Transformer", color: "hsl(180,100%,50%)", desc: "High accuracy, slower" },
              ].map((l) => (
                <div key={l.model} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ background: l.color }} />
                  <div>
                    <p className="text-xs font-bold" style={{ color: l.color }}>{l.model}</p>
                    <p className="text-[10px] text-muted-foreground">{l.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-6 p-4 rounded-xl" style={{ background: "hsl(var(--accent)/0.08)", border: "1px solid hsl(var(--accent)/0.15)" }}>
            <p className="text-xs text-muted-foreground leading-relaxed flex items-start gap-2">
              <Lightbulb className="w-3.5 h-3.5 text-accent mt-0.5 shrink-0" />
              <span>{INSIGHTS.tradeoff}</span>
            </p>
          </div>
        </GlassCard>
      </motion.div>
    </section>
  );
};

/* ══════════════════════════════════════════════════════
   2. VISUAL OUTPUT (Before/After) — PREMIUM 🔥
══════════════════════════════════════════════════════ */

type DetectionType = "object" | "segmentation" | "lane";

const VisualOutputSection = ({ state, metrics }: { state: SimState; metrics: Metrics }) => {
  const [sliderPos, setSliderPos] = useState(50);
  const [detectionType, setDetectionType] = useState<DetectionType>("object");
  const [isDragging, setIsDragging] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const handleMouseDown = () => setIsDragging(true);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(percent);
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false);
    window.addEventListener("mouseup", handleGlobalMouseUp);
    return () => window.removeEventListener("mouseup", handleGlobalMouseUp);
  }, []);

  // Render scene functions
  const renderBefore = () => (
    <svg viewBox="0 0 800 450" className="w-full h-full">
      <defs>
        <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="hsl(210,60%,60%)" />
          <stop offset="100%" stopColor="hsl(210,50%,80%)" />
        </linearGradient>
      </defs>
      {/* Sky */}
      <rect width="800" height="300" fill="url(#skyGrad)" />
      {/* Road */}
      <path d="M 0 300 L 0 450 L 800 450 L 800 300 L 600 320 L 200 320 Z" fill="hsl(0,0%,25%)" />
      {/* Lane lines */}
      {[150, 250, 350, 450, 550, 650].map(x => (
        <rect key={x} x={x - 12} y="360" width="24" height="8" fill="hsl(45,100%,80%)" opacity="0.7" rx="2" />
      ))}
      {/* Buildings */}
      <rect x="50" y="180" width="120" height="120" fill="hsl(210,15%,35%)" />
      <rect x="200" y="200" width="100" height="100" fill="hsl(210,15%,30%)" />
      <rect x="600" y="190" width="140" height="110" fill="hsl(210,15%,33%)" />
      {/* Windows */}
      {[...Array(12)].map((_, i) => (
        <rect key={i} x={60 + (i % 4) * 25} y={195 + Math.floor(i / 4) * 30} width="15" height="20" fill="hsl(45,80%,70%)" opacity="0.6" />
      ))}
      {/* Car silhouettes */}
      <rect x="320" y="340" width="80" height="45" rx="8" fill="hsl(210,30%,40%)" />
      <rect x="330" y="325" width="60" height="20" rx="6" fill="hsl(210,30%,35%)" />
      <circle cx="340" cy="385" r="12" fill="hsl(0,0%,15%)" />
      <circle cx="380" cy="385" r="12" fill="hsl(0,0%,15%)" />
      {/* Truck */}
      <rect x="520" y="330" width="100" height="50" rx="6" fill="hsl(15,40%,45%)" />
      <rect x="530" y="315" width="40" height="20" rx="4" fill="hsl(15,40%,40%)" />
      <circle cx="540" cy="380" r="12" fill="hsl(0,0%,15%)" />
      <circle cx="600" cy="380" r="12" fill="hsl(0,0%,15%)" />
      {/* Pedestrian */}
      <circle cx="180" cy="340" r="8" fill="hsl(30,50%,50%)" />
      <rect x="174" y="348" width="12" height="20" rx="3" fill="hsl(210,60%,40%)" />
    </svg>
  );

  const renderObjectDetection = () => (
    <svg viewBox="0 0 800 450" className="w-full h-full">
      <defs>
        <linearGradient id="skyGrad2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="hsl(210,60%,60%)" />
          <stop offset="100%" stopColor="hsl(210,50%,80%)" />
        </linearGradient>
      </defs>
      {/* Same scene */}
      <rect width="800" height="300" fill="url(#skyGrad2)" />
      <path d="M 0 300 L 0 450 L 800 450 L 800 300 L 600 320 L 200 320 Z" fill="hsl(0,0%,25%)" />
      {[150, 250, 350, 450, 550, 650].map(x => (
        <rect key={x} x={x - 12} y="360" width="24" height="8" fill="hsl(45,100%,80%)" opacity="0.7" rx="2" />
      ))}
      <rect x="50" y="180" width="120" height="120" fill="hsl(210,15%,35%)" />
      <rect x="200" y="200" width="100" height="100" fill="hsl(210,15%,30%)" />
      <rect x="600" y="190" width="140" height="110" fill="hsl(210,15%,33%)" />
      {[...Array(12)].map((_, i) => (
        <rect key={i} x={60 + (i % 4) * 25} y={195 + Math.floor(i / 4) * 30} width="15" height="20" fill="hsl(45,80%,70%)" opacity="0.6" />
      ))}
      <rect x="320" y="340" width="80" height="45" rx="8" fill="hsl(210,30%,40%)" />
      <rect x="330" y="325" width="60" height="20" rx="6" fill="hsl(210,30%,35%)" />
      <circle cx="340" cy="385" r="12" fill="hsl(0,0%,15%)" />
      <circle cx="380" cy="385" r="12" fill="hsl(0,0%,15%)" />
      <rect x="520" y="330" width="100" height="50" rx="6" fill="hsl(15,40%,45%)" />
      <rect x="530" y="315" width="40" height="20" rx="4" fill="hsl(15,40%,40%)" />
      <circle cx="540" cy="380" r="12" fill="hsl(0,0%,15%)" />
      <circle cx="600" cy="380" r="12" fill="hsl(0,0%,15%)" />
      <circle cx="180" cy="340" r="8" fill="hsl(30,50%,50%)" />
      <rect x="174" y="348" width="12" height="20" rx="3" fill="hsl(210,60%,40%)" />

      {/* Bounding boxes */}
      <rect x="315" y="320" width="90" height="70" fill="none" stroke="hsl(210,100%,56%)" strokeWidth="3" rx="4" />
      <rect x="315" y="305" width="70" height="18" fill="hsl(210,100%,56%)" rx="2" />
      <text x="320" y="318" fontSize="12" fill="white" fontWeight="bold">Car {metrics.accuracy}%</text>

      <rect x="515" y="310" width="110" height="75" fill="none" stroke="hsl(45,100%,56%)" strokeWidth="3" rx="4" />
      <rect x="515" y="295" width="75" height="18" fill="hsl(45,100%,56%)" rx="2" />
      <text x="520" y="308" fontSize="12" fill="white" fontWeight="bold">Truck {metrics.precision}%</text>

      <rect x="168" y="330" width="28" height="42" fill="none" stroke="hsl(142,76%,54%)" strokeWidth="2.5" rx="3" />
      <rect x="168" y="318" width="50" height="14" fill="hsl(142,76%,54%)" rx="2" />
      <text x="172" y="328" fontSize="9" fill="white" fontWeight="bold">Person</text>

      <rect x="45" y="175" width="130" height="130" fill="none" stroke="hsl(250,60%,60%)" strokeWidth="2" strokeDasharray="8 4" rx="4" opacity="0.5" />
      <text x="50" y="195" fontSize="10" fill="hsl(250,60%,60%)" fontWeight="bold">Building</text>
    </svg>
  );

  const renderSegmentation = () => (
    <svg viewBox="0 0 800 450" className="w-full h-full">
      {/* Segmented regions with color coding */}
      {/* Sky - Blue */}
      <rect width="800" height="300" fill="hsl(210,80%,50%)" opacity="0.6" />
      {/* Road - Purple */}
      <path d="M 0 300 L 0 450 L 800 450 L 800 300 L 600 320 L 200 320 Z" fill="hsl(280,70%,50%)" opacity="0.7" />
      {/* Buildings - Orange */}
      <rect x="50" y="180" width="120" height="120" fill="hsl(25,90%,55%)" opacity="0.7" />
      <rect x="200" y="200" width="100" height="100" fill="hsl(25,90%,55%)" opacity="0.7" />
      <rect x="600" y="190" width="140" height="110" fill="hsl(25,90%,55%)" opacity="0.7" />
      {/* Vehicles - Red */}
      <rect x="320" y="340" width="80" height="45" rx="8" fill="hsl(0,85%,55%)" opacity="0.75" />
      <rect x="330" y="325" width="60" height="20" rx="6" fill="hsl(0,85%,55%)" opacity="0.75" />
      <rect x="520" y="330" width="100" height="50" rx="6" fill="hsl(0,85%,55%)" opacity="0.75" />
      <rect x="530" y="315" width="40" height="20" rx="4" fill="hsl(0,85%,55%)" opacity="0.75" />
      {/* Pedestrian - Green */}
      <circle cx="180" cy="340" r="8" fill="hsl(142,80%,50%)" opacity="0.8" />
      <rect x="174" y="348" width="12" height="20" rx="3" fill="hsl(142,80%,50%)" opacity="0.8" />
      {/* Legend */}
      <g transform="translate(620, 20)">
        <rect width="160" height="140" fill="hsl(0,0%,0%)" opacity="0.7" rx="8" />
        <text x="10" y="20" fontSize="11" fill="white" fontWeight="bold">Segmentation</text>
        {[
          { y: 40, color: "hsl(210,80%,50%)", label: "Sky" },
          { y: 60, color: "hsl(280,70%,50%)", label: "Road" },
          { y: 80, color: "hsl(25,90%,55%)", label: "Building" },
          { y: 100, color: "hsl(0,85%,55%)", label: "Vehicle" },
          { y: 120, color: "hsl(142,80%,50%)", label: "Pedestrian" },
        ].map(item => (
          <g key={item.y}>
            <rect x="10" y={item.y} width="16" height="12" fill={item.color} rx="2" />
            <text x="32" y={item.y + 10} fontSize="10" fill="white">{item.label}</text>
          </g>
        ))}
      </g>
    </svg>
  );

  const renderLaneDetection = () => (
    <svg viewBox="0 0 800 450" className="w-full h-full">
      <defs>
        <linearGradient id="skyGrad3" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="hsl(210,60%,60%)" />
          <stop offset="100%" stopColor="hsl(210,50%,80%)" />
        </linearGradient>
      </defs>
      {/* Sky */}
      <rect width="800" height="300" fill="url(#skyGrad3)" />
      {/* Road */}
      <path d="M 0 300 L 0 450 L 800 450 L 800 300 L 600 320 L 200 320 Z" fill="hsl(0,0%,25%)" />
      <rect x="50" y="180" width="120" height="120" fill="hsl(210,15%,35%)" />
      <rect x="600" y="190" width="140" height="110" fill="hsl(210,15%,33%)" />
      {/* Enhanced lane detection */}
      <path d="M 100 450 Q 150 380, 200 320" fill="none" stroke="hsl(45,100%,60%)" strokeWidth="5" />
      <path d="M 250 450 Q 300 380, 350 320" fill="none" stroke="hsl(45,100%,60%)" strokeWidth="5" />
      <path d="M 450 450 Q 500 380, 550 320" fill="none" stroke="hsl(45,100%,60%)" strokeWidth="5" />
      <path d="M 600 450 Q 650 380, 700 320" fill="none" stroke="hsl(45,100%,60%)" strokeWidth="5" />
      {/* Lane markers with glow */}
      {[150, 250, 350, 450, 550, 650].map((x, i) => (
        <g key={i}>
          <rect x={x - 12} y="360" width="24" height="8" fill="hsl(142,90%,60%)" rx="2" />
          <rect x={x - 14} y="358" width="28" height="12" fill="hsl(142,90%,60%)" opacity="0.3" rx="3" />
        </g>
      ))}
      {/* Drivable area highlight */}
      <path d="M 150 450 L 200 340 L 600 340 L 650 450 Z" fill="hsl(142,70%,50%)" opacity="0.15" />
      <text x="400" y="400" fontSize="16" fill="hsl(142,90%,60%)" fontWeight="bold" textAnchor="middle">DRIVABLE AREA</text>
      {/* Lane boundaries */}
      <path d="M 120 450 Q 160 380, 190 320" fill="none" stroke="hsl(0,90%,60%)" strokeWidth="3" strokeDasharray="10 5" />
      <path d="M 680 450 Q 660 380, 610 320" fill="none" stroke="hsl(0,90%,60%)" strokeWidth="3" strokeDasharray="10 5" />
    </svg>
  );

  const captions = {
    object: `${state.model} successfully detects multiple vehicles and pedestrians with ${metrics.accuracy}% confidence on ${state.dataset}, demonstrating robustness in urban environments.`,
    segmentation: `Semantic segmentation assigns pixel-level labels (sky, road, building, vehicle, pedestrian), enabling scene understanding for path planning.`,
    lane: `Lane detection identifies drivable areas and boundaries with high precision, essential for autonomous navigation and lane-keeping systems.`,
  };

  return (
    <section ref={ref} className="container mx-auto px-6 pb-16">
      <motion.div className="text-center mb-10"
        initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }}>
        <span className="glass inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-accent mb-4">
          <Eye className="w-4 h-4" />
          Model Output Visualization
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
          See <span className="text-gradient-primary">AI in Action</span>
        </h2>
        <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
          Drag the slider to compare raw input vs AI-processed detections — witness the transformation in real-time
        </p>
      </motion.div>

      <motion.div className="max-w-5xl mx-auto"
        initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1 }}>
        <GlassCard className="p-6">
          {/* Detection type selector */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex gap-2">
              {([
                { type: "object" as const, label: "🚗 Object Detection" },
                { type: "segmentation" as const, label: "🛣️ Segmentation" },
                { type: "lane" as const, label: "🚦 Lane Detection" },
              ]).map(({ type, label }) => (
                <button key={type} onClick={() => setDetectionType(type)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    detectionType === type
                      ? "bg-primary/20 text-primary border-2 border-primary/50"
                      : "glass text-muted-foreground border border-transparent hover:border-foreground/10"
                  }`}>
                  {label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-muted-foreground">Model: <span className="font-bold text-foreground">{state.model}</span></span>
              </div>
              <div className="w-px h-4 bg-foreground/10" />
              <span className="text-muted-foreground">Dataset: <span className="font-bold text-foreground">{state.dataset}</span></span>
            </div>
          </div>

          {/* Slider comparison */}
          <div
            ref={containerRef}
            className="relative rounded-2xl overflow-hidden aspect-video cursor-ew-resize select-none"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            style={{ touchAction: "none" }}
          >
            {/* After (AI output) - full width */}
            <div className="absolute inset-0 pointer-events-none">
              {detectionType === "object" && renderObjectDetection()}
              {detectionType === "segmentation" && renderSegmentation()}
              {detectionType === "lane" && renderLaneDetection()}
            </div>

            {/* Before (raw) - clipped by slider */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
            >
              {renderBefore()}
            </div>

            {/* Slider handle */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-white pointer-events-none transition-opacity"
              style={{ left: `${sliderPos}%`, opacity: isDragging ? 1 : 0.7 }}
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-2xl flex items-center justify-center pointer-events-auto cursor-ew-resize">
                <ArrowRight className="w-4 h-4 text-primary -rotate-180" style={{ marginRight: 2 }} />
                <ArrowRight className="w-4 h-4 text-primary" style={{ marginLeft: 2 }} />
              </div>
            </div>

            {/* Labels */}
            <div className="absolute top-4 left-4 px-3 py-1.5 rounded-lg text-xs font-bold bg-black/70 text-white pointer-events-none">
              BEFORE
            </div>
            <div className="absolute top-4 right-4 px-3 py-1.5 rounded-lg text-xs font-bold bg-primary/90 text-white pointer-events-none">
              AFTER
            </div>
          </div>

          {/* Metadata bar */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            <div className="text-center p-3 rounded-xl" style={{ background: "hsl(var(--muted)/0.3)" }}>
              <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Confidence</p>
              <p className="text-xl font-black text-primary"><AnimatedNumber value={metrics.accuracy} suffix="%" /></p>
            </div>
            <div className="text-center p-3 rounded-xl" style={{ background: "hsl(var(--muted)/0.3)" }}>
              <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Inference Speed</p>
              <p className="text-xl font-black text-accent"><AnimatedNumber value={metrics.fps} suffix=" FPS" /></p>
            </div>
            <div className="text-center p-3 rounded-xl" style={{ background: "hsl(var(--muted)/0.3)" }}>
              <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground mb-1">mAP Score</p>
              <p className="text-xl font-black text-secondary">
                <AnimatedNumber value={Math.round((metrics.precision + metrics.recall) / 2)} suffix="%" />
              </p>
            </div>
          </div>

          {/* Caption */}
          <div className="mt-6 p-4 rounded-xl" style={{ background: "hsl(var(--primary)/0.08)", border: "1px solid hsl(var(--primary)/0.15)" }}>
            <p className="text-xs text-muted-foreground leading-relaxed flex items-start gap-2">
              <Lightbulb className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
              <span>{captions[detectionType]}</span>
            </p>
          </div>
        </GlassCard>
      </motion.div>
    </section>
  );
};

/* ══════════════════════════════════════════════════════
   8. INSIGHT GENERATOR
══════════════════════════════════════════════════════ */

const InsightGenerator = () => {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} className="container mx-auto px-6 pb-28">
      <motion.div className="text-center mb-10"
        initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }}>
        <p className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-2">🏆 AI Insights</p>
        <h2 className="text-3xl font-extrabold tracking-tight">Key Takeaways</h2>
      </motion.div>

      <motion.div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1 }}>
        {[
          { label: "Best Accuracy", text: INSIGHTS.bestAccuracy, color: "hsl(210,100%,56%)" },
          { label: "Best Speed", text: INSIGHTS.bestSpeed, color: "hsl(142,76%,54%)" },
        ].map((ins, i) => (
          <GlassCard key={i} className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${ins.color}18` }}>
                <Lightbulb className="w-5 h-5" style={{ color: ins.color }} />
              </div>
              <p className="text-sm font-bold" style={{ color: ins.color }}>{ins.label}</p>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{ins.text}</p>
          </GlassCard>
        ))}
      </motion.div>
    </section>
  );
};

/* ══════════════════════════════════════════════════════
   PAGE ROOT
══════════════════════════════════════════════════════ */

const ResultsPage = () => {
  const [state, setState] = useState<SimState>({ model: "Transformer", dataset: "Waymo", scenario: "Clear" });
  const metrics = useMemo(() => computeMetrics(state), [state]);

  return (
    <div className="min-h-screen">
      <ResultsHero />
      <KPISection metrics={metrics} />
      <VisualOutputSection state={state} metrics={metrics} />
      <ModelComparisonChart dataset={state.dataset} />
      <DatasetComparisonSection model={state.model} />
      <SimulationPanel state={state} setState={setState} />
      <ErrorAnalysisSection metrics={metrics} />
      <TradeoffSection />
      <InsightGenerator />
    </div>
  );
};

export default ResultsPage;
