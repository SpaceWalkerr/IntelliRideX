import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  Box,
  Layers,
  GitBranch,
  Brain,
  Merge,
  Zap,
  ChevronRight,
  AlertTriangle,
  CheckCircle,
  Quote,
  CircleDot,
} from "lucide-react";

/* ─── Technique data ─────────────────────────────────────────────────────── */

const techniques = [
  {
    id: "3d-detection",
    number: "01",
    title: "3D Object Detection",
    subtitle: "LiDAR-Based Perception",
    icon: Box,
    color: "--primary",
    category: "Perception",
    tagline: "\"Unlike 2D detection, 3D perception allows spatial awareness, which is essential for real-world navigation.\"",
    problem: {
      heading: "What problem does it solve?",
      body: "Traditional 2D camera-based detectors output only bounding boxes on a flat image plane — they cannot tell you how far away an obstacle is or its true physical size. In autonomous driving, a vehicle must know the precise distance, width, and orientation of every object around it in three-dimensional space to plan a safe path. 3D Object Detection solves this by processing LiDAR point clouds to produce full 3D bounding boxes with depth, dimensions, and heading angle.",
      bullets: [
        "Detects objects in 3D space using LiDAR point clouds",
        "Outputs bounding boxes with depth, size, and orientation",
        "Resolves distance ambiguity impossible from a single camera",
      ],
    },
    how: {
      heading: "How does it work?",
      body: "Raw LiDAR returns are an unordered set of (x, y, z, intensity) points — traditional CNNs that expect regular grid inputs cannot process them directly. Modern 3D detectors transform this sparse point cloud into a learnable representation before applying deep networks.",
      steps: [
        { label: "Point Cloud Ingestion",  detail: "LiDAR scans produce 100K–200K 3D points per frame, each with position and laser intensity." },
        { label: "Voxelisation / Pillars",  detail: "Space is divided into a 3D voxel grid (VoxelNet) or vertical pillars (PointPillars). Points inside each cell are aggregated into a fixed-size feature vector." },
        { label: "Sparse 3D Convolution",   detail: "Only occupied voxels are processed — exploiting natural sparsity for 10× efficiency gains over dense convolutions." },
        { label: "BEV Feature Map",          detail: "Features are projected top-down, producing a Bird's-Eye View canvas where standard 2D detection heads predict 3D boxes." },
        { label: "Non-Max Suppression",      detail: "Overlapping predictions are merged into final detections with class, position, orientation, and confidence score." },
      ],
      models: ["PointNet", "PointNet++", "VoxelNet", "PointPillars", "CenterPoint", "BEVFusion"],
    },
    why: {
      heading: "Why is it important?",
      body: "3D Object Detection underpins every safety-critical function in an autonomous stack.",
      points: [
        { icon: CheckCircle, text: "Enables accurate distance estimation to every surrounding object" },
        { icon: CheckCircle, text: "Critical for collision avoidance — knowing exact gap between vehicles" },
        { icon: CheckCircle, text: "Provides heading angle for predicting object trajectories" },
        { icon: CheckCircle, text: "Works in low light and fog where cameras alone fail" },
      ],
    },
  },

  {
    id: "segmentation",
    number: "02",
    title: "Semantic Segmentation",
    subtitle: "Scene Understanding",
    icon: Layers,
    color: "--secondary",
    category: "Understanding",
    tagline: "\"Semantic segmentation transforms raw images into structured environmental understanding.\"",
    problem: {
      heading: "What problem does it solve?",
      body: "Object detection draws boxes — but a box around 'road' doesn't tell you which exact pixels are drivable. Semantic segmentation assigns a class label to every single pixel in an image, giving the vehicle a complete, pixel-accurate map of its environment: where the road is, where pedestrians are, what can be driven over, and what must be avoided.",
      bullets: [
        "Classifies every pixel in the image into a semantic category",
        "Labels: road, vehicle, pedestrian, sidewalk, sky, vegetation",
        "Produces dense, spatially-precise scene understanding",
      ],
    },
    how: {
      heading: "How does it work?",
      body: "Semantic segmentation networks use an encoder-decoder architecture. The encoder progressively compresses the image into a semantic feature representation; the decoder restores spatial resolution to produce a per-pixel classification map.",
      steps: [
        { label: "Encoder (Backbone)",     detail: "A CNN (ResNet, EfficientNet) or ViT extracts hierarchical spatial features, reducing spatial resolution while increasing semantic depth." },
        { label: "Bottleneck / ASPP",       detail: "Atrous Spatial Pyramid Pooling (DeepLab) captures multi-scale context using dilated convolutions at multiple receptive field sizes." },
        { label: "Decoder / Skip Connections", detail: "U-Net-style skip connections pass high-resolution encoder features to the decoder, preserving fine details like lane edges." },
        { label: "Pixel-wise Classification", detail: "A 1×1 convolution maps each spatial position to a class probability vector; argmax yields the final label per pixel." },
        { label: "Post-processing",          detail: "Dense CRF or learned refinement modules sharpen boundaries at class transitions." },
      ],
      models: ["U-Net", "DeepLabV3+", "SegFormer", "Mask2Former", "HRNet", "SegNeXT"],
    },
    why: {
      heading: "Why is it important?",
      body: "Pixel-level understanding is the foundation of safe path planning.",
      points: [
        { icon: CheckCircle, text: "Identifies the exact drivable area — not just an approximate region" },
        { icon: CheckCircle, text: "Detects road boundaries, kerbs, and lane lines with centimeter-precision" },
        { icon: CheckCircle, text: "Enables pedestrian crossing detection without relying on bounding-box detectors" },
        { icon: CheckCircle, text: "Improves decision-making in unstructured, non-highway environments" },
      ],
    },
  },

  {
    id: "lane-detection",
    number: "03",
    title: "Lane Detection",
    subtitle: "Navigation Backbone",
    icon: GitBranch,
    color: "--accent",
    category: "Navigation",
    tagline: "\"Lane detection acts as the guiding rails for autonomous navigation.\"",
    problem: {
      heading: "What problem does it solve?",
      body: "A vehicle needs to stay within its designated lane — whether for highway cruising, urban driving, or merging manoeuvres. Lane detection identifies lane boundary markings in camera images and maps them to real-world 3D positions the planner can track, even under challenging conditions like worn markings, poor lighting, or occluding vehicles.",
      bullets: [
        "Detects lane boundaries, centre lines, and road markings",
        "Handles faded, occluded, or partially visible lanes",
        "Provides lateral offset and heading angle relative to the lane",
      ],
    },
    how: {
      heading: "How does it work?",
      body: "Lane detection combines classical image processing intuitions with deep learning, exploiting the fact that lane markings are long, thin, nearly-parallel structures that can be modelled geometrically.",
      steps: [
        { label: "Feature Extraction",   detail: "A CNN backbone extracts edge and texture features, trained to respond strongly to lane-marking colours and patterns." },
        { label: "Row-Anchor Prediction", detail: "Ultra-Fast Lane Detection divides the image into horizontal row anchors; for each row the network classifies which column contains the lane." },
        { label: "Polynomial Fitting",    detail: "Detected points are fit to cubic polynomial curves, providing a smooth, differentiable representation of each lane boundary." },
        { label: "IPM Projection",        detail: "Inverse Perspective Mapping transforms the front-view lane to a top-down BEV, giving metric lateral offset for the controller." },
        { label: "Temporal Smoothing",    detail: "Kalman filtering or LSTM propagation smooths detections across frames, preventing jitter from single-frame noise." },
      ],
      models: ["SCNN", "Ultra-Fast Lane Detection", "LaneATT", "CLRNet", "BezierLaneNet", "Anchor3DLane"],
    },
    why: {
      heading: "Why is it important?",
      body: "Lane detection is the most direct interface between perception and lateral vehicle control.",
      points: [
        { icon: CheckCircle, text: "Ensures the vehicle remains centred within its lane at all times" },
        { icon: CheckCircle, text: "Essential for highway lane-change and merge decision making" },
        { icon: CheckCircle, text: "Provides ground truth for ADAS lane-keeping assist (LKA) systems" },
        { icon: CheckCircle, text: "Works in conjunction with HD maps for precise localisation" },
      ],
    },
  },

  {
    id: "end-to-end",
    number: "04",
    title: "End-to-End Learning",
    subtitle: "Direct Control Systems",
    icon: Brain,
    color: "--glow-accent",
    category: "Control",
    tagline: "\"End-to-end models eliminate modular complexity but introduce challenges in transparency and safety validation.\"",
    limitation: "Lack of interpretability makes debugging and safety certification difficult — the network is a black box.",
    problem: {
      heading: "What problem does it solve?",
      body: "Classical autonomous driving pipelines are modular: separate models for perception, prediction, and planning hand off results via structured interfaces. Each handoff introduces error propagation and requires hand-designed representations. End-to-end learning removes all intermediate modules, training a single neural network directly from raw sensor input to steering angle, throttle, and brake commands.",
      bullets: [
        "Directly maps raw sensor input → steering, throttle, braking",
        "Eliminates hand-engineered intermediate representations",
        "Learns implicit features that modular pipelines might miss",
      ],
    },
    how: {
      heading: "How does it work?",
      body: "A deep neural network — typically a CNN encoder with MLP/RNN output head — is trained by imitation learning on recorded expert driving demonstrations, or by reinforcement learning in simulation.",
      steps: [
        { label: "Sensor Encoding",         detail: "Camera (and optionally LiDAR/radar) frames are encoded by a CNN or Transformer backbone into a compact latent representation." },
        { label: "Temporal Aggregation",     detail: "An LSTM or Transformer processes multiple historical frames, giving the policy access to motion history needed for safe decisions." },
        { label: "Waypoint / Command Head",  detail: "The network outputs future waypoints or direct control signals; a PID controller tracks the waypoints for smooth actuation." },
        { label: "Imitation / RL Training",  detail: "Behaviour cloning trains on human driver demonstrations. RL fine-tunes in simulation using reward signals like comfort, safety, and speed." },
        { label: "Closed-Loop Evaluation",   detail: "Performance is measured end-to-end in simulation (CARLA benchmark) and on real closed-course test tracks before deployment." },
      ],
      models: ["NVIDIA PilotNet", "TransFuser", "InterFuser", "TCP", "UniAD", "DriveLM"],
    },
    why: {
      heading: "Why is it important?",
      body: "End-to-end learning represents the long-term vision of a unified, learnable driving policy.",
      points: [
        { icon: CheckCircle, text: "Simplifies the entire AV pipeline into a single trainable system" },
        { icon: CheckCircle, text: "Learns complex multi-step driving behaviours from data" },
        { icon: CheckCircle, text: "Avoids error accumulation across modular pipeline stages" },
        { icon: AlertTriangle, text: "⚠ Limited interpretability makes debugging and safety certification hard" },
      ],
    },
  },

  {
    id: "sensor-fusion",
    number: "05",
    title: "Sensor Fusion",
    subtitle: "Multi-Modal Robustness",
    icon: Merge,
    color: "--primary",
    category: "Robustness",
    tagline: "\"Sensor fusion enhances robustness by compensating for individual sensor limitations.\"",
    problem: {
      heading: "What problem does it solve?",
      body: "No single sensor is sufficient for all driving conditions. Cameras lose depth information and fail in darkness or glare. LiDAR is sparse at long range and struggles with glass or rain. Radar is all-weather but lacks resolution. Sensor fusion combines the complementary strengths of all three modalities, building a more complete and dependable world model than any sensor could provide alone.",
      bullets: [
        "Combines Camera + LiDAR + Radar for 360° all-condition perception",
        "Compensates when any single sensor degrades or fails",
        "Produces richer feature representations for downstream tasks",
      ],
    },
    how: {
      heading: "How does it work?",
      body: "Fusion can happen at three levels — early (raw data), middle (feature), or late (decision) — with middle-level BEV fusion dominating modern state-of-the-art systems.",
      steps: [
        { label: "Early Fusion",    detail: "Raw sensor streams are aligned in a shared spatial representation. Camera pixels are depth-coloured using LiDAR before CNN processing." },
        { label: "Feature Fusion",  detail: "Separate encoders process each modality; cross-modal attention or concatenation merges their feature maps in a shared BEV space." },
        { label: "BEV Unification", detail: "BEVFusion projects camera features via depth estimation and LiDAR features via voxel pooling to a common ground-plane grid." },
        { label: "Late Fusion",     detail: "Independent per-modality detectors produce object hypotheses; a Kalman-filter tracker fuses object-level outputs." },
        { label: "Confidence Gating", detail: "Sensor reliability scores gate contributions — if LiDAR returns are degraded, camera weight increases dynamically." },
      ],
      models: ["BEVFusion (MIT)", "BEVFusion (NuScenes)", "DeepFusion", "CenterFusion", "TransFusion", "MSMDFusion"],
    },
    why: {
      heading: "Why is it important?",
      body: "Sensor fusion is what separates a perception system that works in demos from one that works in production.",
      points: [
        { icon: CheckCircle, text: "All-weather, all-condition robustness through modality redundancy" },
        { icon: CheckCircle, text: "Camera fills in colour/texture; LiDAR provides precise geometry" },
        { icon: CheckCircle, text: "Radar tracks object velocity even through heavy precipitation" },
        { icon: CheckCircle, text: "Industry standard for L3+ production systems (Waymo, Cruise, Mobileye)" },
      ],
    },
  },

  {
    id: "realtime",
    number: "06",
    title: "Real-Time Processing",
    subtitle: "Low-Latency Inference",
    icon: Zap,
    color: "--secondary",
    category: "Efficiency",
    tagline: "\"Speed is not a performance metric — in autonomous driving, it is a safety requirement.\"",
    problem: {
      heading: "What problem does it solve?",
      body: "A state-of-the-art transformer ensemble might achieve 91% detection accuracy but take 200 ms per frame. At 60 km/h a vehicle travels 3.3 metres in that time — far too late to react to a pedestrian stepping off the kerb. Real-time processing ensures that perception, prediction, and planning complete within the 100 ms safety budget required for a human-equivalent reaction time.",
      bullets: [
        "Ensures inference latency stays within 100 ms reaction budget",
        "Enables 10–30 fps minimum; 60+ fps target on production hardware",
        "GPU/NPU optimisation critical for edge deployment without cloud dependency",
      ],
    },
    how: {
      heading: "How does it work?",
      body: "Real-time performance is achieved through a combination of algorithmic efficiency and hardware-aware optimisation applied at multiple levels of the stack.",
      steps: [
        { label: "Architecture Design",  detail: "Lightweight backbones (MobileNet, EfficientNet) and one-stage detectors (YOLO, CenterPoint) skip expensive region-proposal stages." },
        { label: "Quantisation",          detail: "Converting weights from FP32 → INT8 or FP16 reduces memory bandwidth 4× and accelerates matrix multiplications on tensor cores." },
        { label: "Structured Pruning",    detail: "Entire filters or attention heads with low magnitude are removed, shrinking model size without loss of structural regularity." },
        { label: "Knowledge Distillation", detail: "A small 'student' model is trained to mimic the soft outputs of a large 'teacher', achieving teacher-level accuracy at fraction of the compute." },
        { label: "NPU Pipeline",           detail: "NVIDIA Orin, Qualcomm Ride, and Mobileye EyeQ optimise dedicated hardware pipelines running full AV stacks at 60 fps within a 30 W power envelope." },
      ],
      models: ["YOLOv8-n", "EfficientDet-Lite", "MobileNet-V3", "TensorRT", "TFLite", "ONNX Runtime"],
    },
    why: {
      heading: "Why is it important?",
      body: "No accuracy/latency trade-off is acceptable when human safety is on the line.",
      points: [
        { icon: CheckCircle, text: "Sub-20 ms latency achievable with INT8 quantisation + TensorRT" },
        { icon: CheckCircle, text: "Enables deployment on power-constrained embedded SoCs" },
        { icon: CheckCircle, text: "Prevents cloud-dependency — the car must act even with no network" },
        { icon: CheckCircle, text: "Meets ISO 26262 ASIL-D timing requirements for safety-critical paths" },
      ],
    },
  },
];

/* ─── Hero section ───────────────────────────────────────────────────────── */

const TechniquesHero = () => (
  <div className="relative overflow-hidden py-20 sm:py-28">
    {/* Background blobs */}
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-primary/8 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[300px] bg-accent/6 blur-[100px] rounded-full" />
    </div>
    {/* Grid overlay */}
    <div
      className="absolute inset-0 opacity-[0.025]"
      style={{
        backgroundImage: `linear-gradient(hsl(var(--primary) / 0.4) 1px, transparent 1px),
                          linear-gradient(90deg, hsl(var(--primary) / 0.4) 1px, transparent 1px)`,
        backgroundSize: "60px 60px",
      }}
    />

    <div className="container mx-auto px-6 relative z-10 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-6 max-w-3xl mx-auto"
      >
        <span className="glass inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary">
          <CircleDot className="w-4 h-4" />
          Deep Learning Techniques
        </span>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight">
          Core{" "}
          <span className="text-gradient-primary">Vision Techniques</span>
          <br />in Autonomous Driving
        </h1>

        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Six foundational deep learning methods — each answering the same three questions: what problem it solves, how it works, and why it's critical for safe autonomous navigation.
        </p>

        {/* Category legend */}
        <div className="flex flex-wrap justify-center gap-2 pt-2">
          {techniques.map((t) => {
            const Icon = t.icon;
            return (
              <a
                key={t.id}
                href={`#technique-${t.id}`}
                className="flex items-center gap-1.5 glass px-3 py-1.5 rounded-full text-xs font-semibold hover:-translate-y-0.5 transition-transform"
                style={{ color: `hsl(var(${t.color}))`, borderColor: `hsl(var(${t.color}) / 0.2)` }}
              >
                <Icon className="w-3 h-3" />
                {t.title}
              </a>
            );
          })}
        </div>
      </motion.div>
    </div>
  </div>
);

/* ─── Sticky sidebar nav ─────────────────────────────────────────────────── */

const SideNav = ({ active }: { active: string }) => (
  <div className="hidden xl:block sticky top-24 w-52 shrink-0">
    <div className="glass p-3 rounded-xl space-y-0.5">
      <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground px-3 pb-2 pt-1">
        Jump to
      </p>
      {techniques.map((t) => {
        const Icon = t.icon;
        const isActive = active === t.id;
        return (
          <a
            key={t.id}
            href={`#technique-${t.id}`}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              isActive
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground/80 hover:bg-foreground/[0.03]"
            }`}
            style={isActive ? {
              background: `hsl(var(${t.color}) / 0.10)`,
              color: `hsl(var(${t.color}))`,
              borderLeft: `2px solid hsl(var(${t.color}) / 0.6)`,
            } : {}}
          >
            <Icon className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{t.title}</span>
          </a>
        );
      })}
    </div>
  </div>
);

/* ─── Pipeline flow diagram (how it works) ───────────────────────────────── */

const PipelineFlow = ({ steps, color }: { steps: { label: string; detail: string }[]; color: string }) => {
  const [hovered, setHovered] = useState<number | null>(null);
  return (
    <div className="space-y-2">
      {steps.map((step, i) => (
        <motion.div
          key={i}
          className="relative"
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: i * 0.08 }}
        >
          <div
            className="flex gap-3 p-3 rounded-xl border cursor-pointer transition-all duration-200"
            style={{
              borderColor: hovered === i ? `hsl(var(${color}) / 0.35)` : `hsl(var(--foreground) / 0.06)`,
              background: hovered === i ? `hsl(var(${color}) / 0.06)` : "transparent",
            }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            {/* Step number */}
            <div
              className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-extrabold shrink-0 mt-0.5"
              style={{
                background: `hsl(var(${color}) / 0.12)`,
                color: `hsl(var(${color}))`,
              }}
            >
              {i + 1}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground/90">{step.label}</p>
              <AnimatePresence>
                {hovered === i && (
                  <motion.p
                    className="text-xs text-muted-foreground mt-1 leading-relaxed"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22 }}
                  >
                    {step.detail}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
            <ChevronRight
              className="w-4 h-4 shrink-0 mt-0.5 transition-transform duration-200"
              style={{
                color: hovered === i ? `hsl(var(${color}))` : "hsl(var(--muted-foreground) / 0.4)",
                transform: hovered === i ? "translateX(2px)" : "none",
              }}
            />
          </div>
          {/* Connector */}
          {i < steps.length - 1 && (
            <div className="ml-6 w-px h-2" style={{ background: `hsl(var(${color}) / 0.2)` }} />
          )}
        </motion.div>
      ))}
    </div>
  );
};

/* ─── Model chip ─────────────────────────────────────────────────────────── */

const ModelChip = ({ name, color, delay }: { name: string; color: string; delay: number }) => (
  <motion.span
    className="px-3 py-1.5 text-xs font-semibold rounded-full border"
    style={{
      color: `hsl(var(${color}))`,
      borderColor: `hsl(var(${color}) / 0.3)`,
      background: `hsl(var(${color}) / 0.07)`,
    }}
    initial={{ opacity: 0, scale: 0.85 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.25, delay }}
    whileHover={{ scale: 1.05, y: -1 }}
  >
    {name}
  </motion.span>
);

/* ─── Full technique section ─────────────────────────────────────────────── */

const TechniqueSection = ({
  tech,
  index,
  onVisible,
}: {
  tech: (typeof techniques)[0];
  index: number;
  onVisible: (id: string) => void;
}) => {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { margin: "-40% 0px -40% 0px" });
  const Icon = tech.icon;

  if (inView) onVisible(tech.id);

  const isEven = index % 2 === 0;

  return (
    <motion.section
      ref={ref}
      id={`technique-${tech.id}`}
      className="relative py-20 scroll-mt-24"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
    >
      {/* Subtle section divider */}
      {index > 0 && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px"
          style={{ background: `linear-gradient(90deg, transparent, hsl(var(${tech.color}) / 0.3), transparent)` }} />
      )}

      <div className="container mx-auto px-6">
        {/* Section header */}
        <motion.div
          className="flex flex-col sm:flex-row sm:items-center gap-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
            style={{
              background: `hsl(var(${tech.color}) / 0.12)`,
              boxShadow: `0 0 30px hsl(var(${tech.color}) / 0.15)`,
            }}
          >
            <Icon className="w-7 h-7" style={{ color: `hsl(var(${tech.color}))` }} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-5xl font-black text-foreground/[0.04] select-none leading-none tabular-nums">
                {tech.number}
              </span>
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
                  {tech.title}
                </h2>
                <p className="text-sm text-muted-foreground font-medium">{tech.subtitle}</p>
              </div>
              <span
                className="ml-auto text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border hidden sm:inline"
                style={{
                  color: `hsl(var(${tech.color}))`,
                  borderColor: `hsl(var(${tech.color}) / 0.3)`,
                  background: `hsl(var(${tech.color}) / 0.08)`,
                }}
              >
                {tech.category}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Impact quote */}
        <motion.div
          className="relative glass p-5 mb-12 flex gap-4 items-start overflow-hidden"
          initial={{ opacity: 0, x: isEven ? -20 : 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: `linear-gradient(135deg, hsl(var(${tech.color}) / 0.06), transparent)` }} />
          <Quote className="w-6 h-6 shrink-0 mt-0.5" style={{ color: `hsl(var(${tech.color}) / 0.6)` }} />
          <p className="text-base sm:text-lg font-semibold italic leading-relaxed relative z-10"
            style={{ color: `hsl(var(${tech.color}))` }}>
            {tech.tagline}
          </p>
        </motion.div>

        {/* Limitation banner (end-to-end only) */}
        {"limitation" in tech && tech.limitation && (
          <motion.div
            className="flex items-start gap-3 glass p-4 mb-8 border-l-2"
            style={{ borderColor: "hsl(35, 100%, 60%)" }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
          >
            <AlertTriangle className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-orange-400 mb-0.5">
                Key Limitation
              </p>
              <p className="text-sm text-muted-foreground">{tech.limitation}</p>
            </div>
          </motion.div>
        )}

        {/* Three-column Q&A grid */}
        <div className="grid lg:grid-cols-3 gap-6">

          {/* ── Q1: Problem ── */}
          <motion.div
            className="glass relative overflow-hidden p-6 flex flex-col gap-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.0 }}
          >
            <div className="absolute top-0 left-0 right-0 h-[2px]"
              style={{ background: `linear-gradient(90deg, transparent, hsl(var(${tech.color})), transparent)` }} />
            <div>
              <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: `hsl(var(${tech.color}))` }}>
                Problem
              </span>
              <h3 className="text-base font-bold mt-1">{tech.problem.heading}</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{tech.problem.body}</p>
            <ul className="space-y-2 mt-auto">
              {tech.problem.bullets.map((b) => (
                <li key={b} className="flex items-start gap-2 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                    style={{ background: `hsl(var(${tech.color}))`, boxShadow: `0 0 4px hsl(var(${tech.color}) / 0.5)` }} />
                  <span className="text-foreground/80">{b}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* ── Q2: How ── */}
          <motion.div
            className="glass relative overflow-hidden p-6 flex flex-col gap-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.1 }}
          >
            <div className="absolute top-0 left-0 right-0 h-[2px]"
              style={{ background: `linear-gradient(90deg, transparent, hsl(var(${tech.color})), transparent)` }} />
            <div>
              <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: `hsl(var(${tech.color}))` }}>
                How It Works
              </span>
              <h3 className="text-base font-bold mt-1">{tech.how.heading}</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{tech.how.body}</p>
            <div className="flex-1">
              <PipelineFlow steps={tech.how.steps} color={tech.color} />
            </div>
          </motion.div>

          {/* ── Q3: Why + Models ── */}
          <motion.div
            className="glass relative overflow-hidden p-6 flex flex-col gap-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.2 }}
          >
            <div className="absolute top-0 left-0 right-0 h-[2px]"
              style={{ background: `linear-gradient(90deg, transparent, hsl(var(${tech.color})), transparent)` }} />
            <div>
              <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: `hsl(var(${tech.color}))` }}>
                Why It Matters
              </span>
              <h3 className="text-base font-bold mt-1">{tech.why.heading}</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{tech.why.body}</p>
            <ul className="space-y-2.5">
              {tech.why.points.map((p, pi) => {
                const PIcon = p.icon;
                return (
                  <motion.li
                    key={pi}
                    className="flex items-start gap-2.5 text-sm"
                    initial={{ opacity: 0, x: 12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: pi * 0.07 }}
                  >
                    <PIcon
                      className="w-4 h-4 shrink-0 mt-0.5"
                      style={{
                        color: p.icon === AlertTriangle ? "hsl(35, 100%, 60%)" : `hsl(var(${tech.color}))`,
                      }}
                    />
                    <span className="text-foreground/80 leading-snug">{p.text}</span>
                  </motion.li>
                );
              })}
            </ul>

            {/* Model chips */}
            <div className="mt-auto pt-4 border-t border-foreground/[0.06]">
              <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-2.5">
                Key Models
              </p>
              <div className="flex flex-wrap gap-1.5">
                {tech.how.models.map((m, mi) => (
                  <ModelChip key={m} name={m} color={tech.color} delay={mi * 0.06} />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

/* ─── Page ───────────────────────────────────────────────────────────────── */

const TechniquesPage = () => {
  const [activeTech, setActiveTech] = useState(techniques[0].id);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <TechniquesHero />

      {/* Body: side nav + content */}
      <div className="container mx-auto px-6 flex gap-10 items-start">
        <SideNav active={activeTech} />

        {/* Techniques */}
        <div className="flex-1 min-w-0">
          {techniques.map((tech, i) => (
            <TechniqueSection
              key={tech.id}
              tech={tech}
              index={i}
              onVisible={(id) => setActiveTech(id)}
            />
          ))}

          {/* Bottom CTA */}
          <motion.div
            className="py-20 text-center space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-muted-foreground text-sm max-w-xl mx-auto">
              These six techniques form the perception backbone of every production autonomous vehicle on the road today — and the foundation of all future survey chapters.
            </p>
            <a
              href="/"
              className="inline-flex items-center gap-2 glass px-5 py-2.5 rounded-xl text-sm font-semibold text-primary border border-primary/20 hover:border-primary/40 hover:bg-primary/5 transition-all"
            >
              ← Return to Overview
            </a>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default TechniquesPage;
