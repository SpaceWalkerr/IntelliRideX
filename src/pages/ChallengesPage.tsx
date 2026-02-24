import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
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
  AlertTriangle,
  Quote,
  TrendingUp,
  Target,
  ArrowRight,
  Lightbulb,
  FileWarning,
  BadgeCheck,
  Wrench,
  Layers,
  Brain,
} from "lucide-react";

/* ══════════════════════════════════════════════════════
   DATA
══════════════════════════════════════════════════════ */

const challenges = [
  {
    id: "noise",
    number: "01",
    color: "--primary",
    problemIcon: WifiOff,
    solutionIcon: ScanEye,
    tag: "Data Quality",
    category: "Perception",
    title: "Sensor Noise & Corruption",
    subtitle: "Multi-Modal Degradation",
    tagline:
      '"When sensors fail silently in adverse conditions, the perception stack must still deliver — lives depend on graceful degradation, not perfect inputs."',

    problem: {
      heading: "What is the challenge?",
      body: "LiDAR and camera sensors are not invincible. Rain droplets scatter laser returns, creating thousands of false 3D points. Fog attenuates both light and laser pulses, reducing effective range by 40–60%. Direct sunlight saturates camera CCDs, producing bloom and washout. Over time, vibration causes subtle calibration drift between sensors — meaning the camera and LiDAR see slightly different worlds. These failures are not rare edge cases; they occur daily in real-world driving and generate ghost detections (phantom objects) or silent misses (real objects that vanish from perception).",
      bullets: [
        "Rain generates ~3,000 false LiDAR points per frame from droplet reflections",
        "Fog reduces effective LiDAR range from 200m to under 80m",
        "Camera saturation in direct sunlight causes complete loss in 15–25% of the image",
        "Calibration drift of just 0.5° between camera and LiDAR misaligns 30% of projected points",
        "Ghost detections trigger unnecessary emergency braking; silent misses risk collisions",
      ],
    },

    approach: {
      heading: "How was it handled?",
      body: "The solution is a multi-pronged strategy combining sensor fusion, adversarial training augmentation, and online sensor health monitoring. Rather than trusting any single sensor, the system cross-validates information across modalities and learns to operate even when individual sensors degrade.",
      steps: [
        {
          label: "Cross-Modal Attention Fusion",
          detail:
            "A transformer-based attention mechanism fuses LiDAR depth with camera appearance features. When LiDAR is degraded (rain/fog), the model up-weights camera features; when the camera is saturated (glare), LiDAR compensates. This attention gating is learned end-to-end from training on both clean and degraded pairs.",
        },
        {
          label: "Adversarial Corruption Augmentation",
          detail:
            "At training time, physics-based rain, fog, and glare simulations are injected into clean data. Point dropout mimics LiDAR occlusion; Gaussian noise simulates sensor noise floors. Models trained with this augmentation show 25–40% fewer false positives compared to models trained only on clean data.",
        },
        {
          label: "Sensor Health Scoring",
          detail:
            "A lightweight diagnostics module computes per-frame confidence scores for each sensor based on point density, image contrast, and noise level. When a sensor's health drops below threshold, the downstream fusion module dynamically discounts its contribution.",
        },
        {
          label: "Temporal Consistency Filtering",
          detail:
            "Objects that appear in only a single frame are suppressed using track-based consistency checks. A genuine object persists across 3–5 consecutive frames; ghost detections from rain scatter rarely survive more than one frame.",
        },
        {
          label: "Calibration Self-Check",
          detail:
            "Projection residuals between camera detections and LiDAR point clusters are monitored online. If misalignment exceeds a threshold, the system triggers auto-recalibration using lane markings and poles as reference geometry.",
        },
      ],
    },

    results: {
      heading: "What were the results?",
      body: "After implementing robust multi-modal fusion with adversarial training, the reduction in failure modes was dramatic across all weather conditions and sensor degradation scenarios.",
      metrics: [
        { label: "Misdetections Reduced", value: "40%", description: "fewer ghost detections compared to single-modal LiDAR-only or camera-only baselines" },
        { label: "Rain Performance", value: "92%", description: "detection accuracy maintained in moderate rain (vs. 71% for LiDAR-only)" },
        { label: "Fog Robustness", value: "85%", description: "accuracy at 60m range in heavy fog (previously 52%)" },
        { label: "Glare Recovery", value: "88%", description: "detection retained under direct sunlight saturation events" },
      ],
      insight:
        "The key learning: sensor fusion is not about averaging — it's about learned trust. The attention mechanism dynamically reallocates confidence based on per-frame sensor quality, making the system robust without manual fallback rules.",
    },

    papers: ["PointPainting (CVPR 2020)", "BEVFusion (ICRA 2023)", "RobustFusion (NeurIPS 2022)"],
  },

  {
    id: "cost",
    number: "02",
    color: "--secondary",
    problemIcon: DollarSign,
    solutionIcon: FlaskConical,
    tag: "Scalability",
    category: "Data Engineering",
    title: "Annotation Cost & Data Scarcity",
    subtitle: "Label-Efficient Learning",
    tagline:
      '"The bottleneck of autonomous driving is not compute — it is the thousands of hours of expert annotation required to train every new model."',

    problem: {
      heading: "What is the challenge?",
      body: "Dense 3D annotation of a single driving scene — labelling every car, pedestrian, cyclist, lane marking, and traffic sign with precise 3D bounding boxes — costs $6–$12 per frame at professional annotation shops. A typical training dataset needs 50,000–200,000 annotated frames. At scale, this amounts to $300K–$2.4M per dataset iteration. Moreover, rare events (child running into road, cargo spill, emergency vehicle) are drastically underrepresented in collected data, creating dangerous blind spots in model coverage.",
      bullets: [
        "Dense 3D annotation costs $6–12 per frame, multiplied across 100K+ frames",
        "Total annotation budgets for one model version: $300K–$2.4M",
        "Rare safety-critical events occur in < 0.01% of collected driving data",
        "Inter-annotator disagreement on ambiguous cases degrades label quality",
        "Each new deployment region (country, city) requires re-annotation for local conditions",
      ],
    },

    approach: {
      heading: "How was it handled?",
      body: "Three complementary strategies drastically reduce the need for expensive human annotation: self-supervised pre-training on unlabelled drives, synthetic data generation from photorealistic simulators, and active learning to intelligently select which frames actually need human labels.",
      steps: [
        {
          label: "Contrastive Self-Supervised Pre-Training",
          detail:
            "The backbone is pre-trained on millions of unlabelled driving frames using contrastive objectives (SimCLR, BYOL, DINO). The model learns transferable visual representations — edges, textures, depth cues — without a single human label. Fine-tuning on just 10% of labelled data then achieves 94% of fully-supervised accuracy.",
        },
        {
          label: "Photorealistic Synthetic Data (CARLA / nuPlan)",
          detail:
            "Simulators generate unlimited perfectly-labelled training scenes at near-zero marginal cost. Domain randomisation (texture, lighting, weather, traffic density variations) prevents overfitting to simulator aesthetics. Neural style transfer bridges the remaining sim-to-real gap, achieving 87% real-world accuracy using only synthetic training.",
        },
        {
          label: "Active Learning Loop",
          detail:
            "Instead of uniformly annotating collected drives, an uncertainty-based selector identifies the 5–10% of frames where the current model is most confused. Only these frames are sent for human annotation, cutting label budgets by 8–15× while maintaining equivalent model quality.",
        },
        {
          label: "Pseudo-Label Propagation",
          detail:
            "A teacher model trained on existing labels generates pseudo-labels on unlabelled data. High-confidence predictions are accepted as-is; uncertain predictions are flagged for human review. This semi-supervised pipeline expands effective dataset size by 5–10× at minimal annotation cost.",
        },
        {
          label: "Rare-Event Synthesis",
          detail:
            "Generative models (diffusion-based scene generation, object insertion via NeRFs) create photorealistic rare scenarios: children behind parked cars, debris on highways, wrong-way drivers. These synthetic long-tail events fill critical gaps no amount of regular driving could cover cost-effectively.",
        },
      ],
    },

    results: {
      heading: "What were the results?",
      body: "The combined self-supervised + synthetic + active learning pipeline transformed the economics of AV model training.",
      metrics: [
        { label: "Training Cost", value: "10×", description: "cheaper overall pipeline compared to fully-supervised human annotation" },
        { label: "Label Efficiency", value: "94%", description: "of full accuracy achieved with only 10% of labels via self-supervised pre-training" },
        { label: "Sim-to-Real Transfer", value: "87%", description: "real-world accuracy using only synthetic training + domain adaptation" },
        { label: "Rare Event Coverage", value: "50×", description: "more rare-event training samples via generative synthesis" },
      ],
      insight:
        "The paradigm shift is clear: human annotation is no longer the default — it's the exception. Self-supervised features provide the foundation, synthetic data provides scale, and active learning ensures human effort is spent only where it matters most.",
    },

    papers: ["DINO (ICCV 2021)", "nuPlan (ICRA 2023)", "BDD100K Active (ECCV 2022)"],
  },

  {
    id: "realtime",
    number: "03",
    color: "--accent",
    problemIcon: Timer,
    solutionIcon: Zap,
    tag: "Latency",
    category: "Efficiency",
    title: "Real-Time Inference Constraints",
    subtitle: "Edge Deployment Under 100ms",
    tagline:
      '"At 100 km/h a vehicle travels 2.8 metres every 100 milliseconds. If the model doesn\'t finish thinking in time, the car has already passed the point of safe reaction."',

    problem: {
      heading: "What is the challenge?",
      body: "State-of-the-art perception models — large vision transformers with multi-scale attention, multi-frame fusion, and dense prediction heads — deliver exceptional accuracy but at prohibitive computational cost. A single forward pass of a BEVFormer-class model takes 150–300ms on a desktop GPU, far exceeding the 100ms total budget for the entire perception-to-planning cycle. On embedded hardware (which must operate within 30–60W power envelopes), these models simply cannot run. The challenge is to retain accuracy while achieving real-time performance on production automotive hardware.",
      bullets: [
        "Transformer ensembles: 150–300ms per frame on A100 GPUs",
        "Safety-critical cycle budget: ≤ 100ms for perception + prediction + planning combined",
        "At 60 km/h, 100ms delay = 1.67m of uncontrolled travel",
        "Automotive SoCs (NVIDIA Orin, Qualcomm Ride) have 30–60W power limits",
        "Cloud offloading is not viable — cellular latency adds 50–200ms and coverage is unreliable",
      ],
    },

    approach: {
      heading: "How was it handled?",
      body: "A multi-level optimisation strategy compresses models at the algorithmic, numerical, and hardware levels — each stage independently recovers speed while the combined pipeline delivers order-of-magnitude latency reduction.",
      steps: [
        {
          label: "INT8 / FP16 Quantisation",
          detail:
            "Model weights and activations are converted from 32-bit floating point to 8-bit integers or 16-bit floats. This halves or quarters memory bandwidth requirements and enables hardware tensor-core acceleration. Post-training quantisation (PTQ) achieves < 1% accuracy drop; quantisation-aware training (QAT) recovers even that small gap.",
        },
        {
          label: "Structured Pruning",
          detail:
            "Entire convolutional filters, attention heads, or MLP blocks with low activation magnitude are permanently removed. Unlike unstructured pruning (which requires sparse-compute hardware), structured pruning immediately accelerates inference on standard GPUs and NPUs. Typical compression: 2–4× model shrink with < 1.5% accuracy loss.",
        },
        {
          label: "Knowledge Distillation",
          detail:
            "A large, accurate 'teacher' model's soft probability outputs guide the training of a small, fast 'student' model. The student learns to mimic the teacher's dark knowledge — the relative probabilities between classes — which transfers richer information than hard labels alone. Student models achieve 97–99% of teacher accuracy at 3–5× lower compute.",
        },
        {
          label: "TensorRT / ONNX Runtime Compilation",
          detail:
            "Models are compiled with graph-level optimisations: operator fusion (merging Conv+BN+ReLU into single kernels), memory planning, and hardware-specific kernel tuning. TensorRT on NVIDIA Orin delivers 2–3× speedup over native PyTorch inference.",
        },
        {
          label: "NPU Pipeline on Automotive SoCs",
          detail:
            "Dedicated neural processing units (NVIDIA Orin: 275 TOPS INT8, Qualcomm Ride: 360 TOPS) run optimised perception pipelines at 60+ FPS within 30W power envelopes. Multi-stream scheduling overlaps camera preprocessing with LiDAR backbone computation, hiding data-transfer latency entirely.",
        },
      ],
    },

    results: {
      heading: "What were the results?",
      body: "The combined compression pipeline achieved production-viable latency while retaining near-full accuracy.",
      metrics: [
        { label: "End-to-End Latency", value: "< 20ms", description: "per frame on NVIDIA Orin with INT8 quantisation + TensorRT" },
        { label: "Model Size Reduction", value: "4–8×", description: "smaller than baseline with quantisation + pruning combined" },
        { label: "Accuracy Retention", value: "98.2%", description: "of original teacher model accuracy after distillation + QAT" },
        { label: "Power Envelope", value: "30W", description: "total SoC power for full perception stack at 60 FPS" },
      ],
      insight:
        "Speed is not a performance metric in autonomous driving — it is a safety requirement. The insight is that compression techniques are multiplicative: quantisation × pruning × distillation × compiler optimisation yields 10–20× total speedup, far more than any single technique alone.",
    },

    papers: ["TensorRT Best Practices (NVIDIA 2023)", "PointPillars-INT8 (2022)", "BEVDistill (CVPR 2023)"],
  },

  {
    id: "weather",
    number: "04",
    color: "--glow-accent",
    problemIcon: CloudRain,
    solutionIcon: Network,
    tag: "Edge Cases",
    category: "Robustness",
    title: "Adverse Weather & Rare Events",
    subtitle: "Taming the Long Tail",
    tagline:
      '"The 99th percentile doesn\'t kill — the 99.99th percentile does. Autonomous driving safety is defined by the rarest events in the harshest conditions."',

    problem: {
      heading: "What is the challenge?",
      body: "Production autonomous vehicles are predominantly trained on clear-day, good-road, well-lit data — because that's what 85% of collected miles look like. But the remaining 15% contains the scenarios where the system is most dangerous: heavy rain that obscures lane markings, snow that changes road surface appearance entirely, fog that compresses perceived depth, and night driving with oncoming headlight glare. Beyond weather, rare events — a ladder falling off a truck, a cyclist riding against traffic, a child chasing a ball between parked cars — occur so infrequently that even billions of miles of driving data contain only a handful of examples. These long-tail scenarios are where current systems fail catastrophically.",
      bullets: [
        "Clear-day data represents ~85% of training sets, but only ~70% of real driving hours",
        "Snow-covered roads change lane appearance entirely — learned features become useless",
        "Heavy rain reduces camera contrast by 40–60% and creates splashing artifacts",
        "Rare events (< 0.01% of miles) include the most safety-critical scenarios",
        "Domain shift between training conditions and deployment weather degrades all metrics by 15–30%",
      ],
    },

    approach: {
      heading: "How was it handled?",
      body: "A combination of domain-adaptive training, physics-informed augmentation, rare-event mining, and test-time adaptation ensures models generalise to conditions far outside their training distribution.",
      steps: [
        {
          label: "Physics-Based Weather Augmentation",
          detail:
            "Rather than naïve image-level noise, physics-based renderers simulate how rain, fog, and snow actually interact with light and sensors. Rain augmentation models raindrop refraction, splash patterns, and wet-road reflectivity. Fog simulation applies Koschmieder's law for visibility attenuation. These produce training data that accurately mimics real degradation.",
        },
        {
          label: "Neural Style Transfer for Domain Bridging",
          detail:
            "CycleGAN-based style transfer transforms clear-weather training images into photorealistic rainy, foggy, or snowy versions while preserving semantic content. This multiplies the effective diversity of the training set by 4–6× without requiring any new data collection.",
        },
        {
          label: "Hard Example Mining",
          detail:
            "After an initial training pass, the model's most confident wrong predictions are identified (high-loss frames). These hard examples are up-sampled in subsequent training rounds, forcing the model to focus its capacity on the scenarios it currently handles worst — often exactly the rare, adverse-weather situations that matter most.",
        },
        {
          label: "Test-Time Batch Norm Adaptation (TTBA)",
          detail:
            "At deployment, when the model encounters conditions unseen during training (e.g., a specific type of freezing rain), the batch normalisation layers' running statistics are updated using the current input stream. This adapts the model's internal normalisation to match deployment-time data distribution — no retraining needed.",
        },
        {
          label: "Scenario-Aware Ensemble Routing",
          detail:
            "A lightweight classifier detects the current weather/lighting condition and routes inference to a condition-specialised model head. Rather than one model being mediocre everywhere, specialised heads excel in specific conditions: rain, night, fog, clear — with a shared backbone for efficiency.",
        },
      ],
    },

    results: {
      heading: "What were the results?",
      body: "Domain-adaptive training transformed a system that failed in bad weather into one that operates reliably across the full spectrum of real-world conditions.",
      metrics: [
        { label: "Adverse-Weather Robustness", value: "3×", description: "improvement in detection mAP across rain, fog, and snow conditions" },
        { label: "Night Driving Accuracy", value: "89%", description: "detection accuracy at night (vs. 72% before domain adaptation)" },
        { label: "Snow Coverage", value: "81%", description: "lane detection accuracy on snow-covered roads (previously 43%)" },
        { label: "Domain Gap Reduction", value: "68%", description: "reduction in accuracy drop when transferring clear→adverse conditions" },
      ],
      insight:
        "The long tail cannot be eliminated — it can only be managed. The most effective strategy is a layered defense: diverse training (augmentation + style transfer), smart sampling (hard example mining), and runtime adaptation (TTBA + routing). No single technique is sufficient; together they cover the distribution.",
    },

    papers: ["FIFO (ICCV 2022)", "RobustNet (CVPR 2021)", "TENT (ICLR 2021)"],
  },

  {
    id: "safety",
    number: "05",
    color: "--primary",
    problemIcon: ShieldAlert,
    solutionIcon: Lock,
    tag: "Safety",
    category: "Security",
    title: "Adversarial Attacks & Safety",
    subtitle: "Certified Robustness Guarantees",
    tagline:
      '"If a modified stop sign can fool a neural network with 99% confidence, then no amount of accuracy on test sets guarantees safety — we need provable robustness."',

    problem: {
      heading: "What is the challenge?",
      body: "Deep neural networks are vulnerable to adversarial attacks: carefully crafted perturbations — often invisible to the human eye — that cause the model to make confident but catastrophically wrong predictions. In autonomous driving, this isn't theoretical: physical adversarial patches printed on stickers and affixed to stop signs have been shown to make detectors classify them as speed limit signs with 95%+ confidence. Projected light patterns can create phantom LiDAR objects. Even without malicious intent, naturally occurring adversarial-like patterns (unusual shadows, reflective surfaces) trigger similar failures. Safety certification (ISO 26262, SOTIF) requires demonstrably bounded worst-case behaviour — something standard deep learning cannot provide.",
      bullets: [
        "Pixel-level perturbations (ε = 4/255) fool classifiers with 95%+ attack success rate",
        "Physical adversarial patches on real stop signs demonstrated in peer-reviewed research",
        "LiDAR spoofing can inject phantom objects at precise 3D locations",
        "No standard deep network provides worst-case output guarantees",
        "ISO 26262 ASIL-D and SOTIF (ISO 21448) require formal safety arguments",
      ],
    },

    approach: {
      heading: "How was it handled?",
      body: "A defense-in-depth strategy combining adversarial training, certified robustness methods, multi-sensor cross-validation, and formal verification creates multiple layers of protection against both malicious and natural adversarial failures.",
      steps: [
        {
          label: "Adversarial Training (PGD-AT)",
          detail:
            "Models are trained not just on clean images but on adversarial examples generated by Projected Gradient Descent (PGD). This trains the network to be invariant to small input perturbations, increasing empirical robustness by 30–50% against L∞ attacks at ε = 8/255. The accuracy-robustness trade-off is managed by combining clean and adversarial losses.",
        },
        {
          label: "Randomised Smoothing Certificates",
          detail:
            "Randomised smoothing provides provable, mathematically certified robustness within an L² perturbation radius. The input is evaluated with hundreds of Gaussian noise samples; the consensus prediction is guaranteed correct for any perturbation within the certified radius — no adversary can change the output, period. Certification radii of r = 0.5–1.0 L² are achievable on production models.",
        },
        {
          label: "Multi-Sensor Disagreement Detection",
          detail:
            "If camera says 'speed limit sign' but LiDAR geometry shows a flat octagonal shape, there's a mismatch. Cross-modal consistency checking detects when one sensor's perception contradicts another. Disagreements trigger fallback mode: reduced speed, increased following distance, and alerts to the human safety driver.",
        },
        {
          label: "Formal Verification of Output Bounds",
          detail:
            "Tools like α,β-CROWN and VeriNet provide formal proofs about neural network output bounds within defined input regions. Before deployment, safety-critical model components (e.g., emergency stop classification) are verified to never produce false negatives for objects above a minimum size and distance threshold.",
        },
        {
          label: "Runtime Safety Monitor (RSS)",
          detail:
            "The Responsibility-Sensitive Safety (RSS) framework wraps the ML perception stack with formally verified kinematic safety rules. Even if perception fails completely, RSS constrains vehicle actions to mathematically provable safe envelopes — the car will always maintain minimum safe following distance and maximum deceleration rate.",
        },
      ],
    },

    results: {
      heading: "What were the results?",
      body: "The layered defense produces a system where no single point of failure can cause an unsafe action — meeting the bar for safety certification.",
      metrics: [
        { label: "Adversarial Robustness", value: "+45%", description: "improvement in attacked accuracy via PGD adversarial training" },
        { label: "Certified Radius", value: "L² ≤ 1.0", description: "provable robustness certificate — no perturbation within this ball can change prediction" },
        { label: "Attack Detection", value: "99.1%", description: "of adversarial patch attacks detected by cross-modal consistency checking" },
        { label: "Safety Compliance", value: "ISO 26262", description: "ASIL-D compliance achieved through certified architectures + RSS" },
      ],
      insight:
        "The insight is that safety is not about making the neural network perfect — it's about making the system safe even when the network fails. Certified robustness ensures bounded failure, cross-modal checking detects anomalies, and RSS guarantees safe physical actions regardless of perception quality.",
    },

    papers: ["Randomised Smoothing (ICML 2019)", "RSS (Mobileye 2017)", "α,β-CROWN (NeurIPS 2021)"],
  },

  {
    id: "fusion",
    number: "06",
    color: "--secondary",
    problemIcon: GitMerge,
    solutionIcon: Cpu,
    tag: "Perception",
    category: "Sensor Fusion",
    title: "Multi-Sensor Temporal Alignment",
    subtitle: "Asynchronous Data Unification",
    tagline:
      '"Cameras see at 30 Hz. LiDAR spins at 10 Hz. Radar fires at 20 Hz. If you naïvely concatenate these signals, your world model is a temporal Frankenstein — stitched from moments that never coexisted."',

    problem: {
      heading: "What is the challenge?",
      body: "Modern autonomous vehicles carry 6–8 cameras (30 Hz each), 1–2 LiDAR sensors (10 Hz), and 4–6 radars (20 Hz). These sensors sample the world at different rates, with different latencies, and with different spatial coverage. Naïve concatenation — treating all sensor data as simultaneous — introduces temporal misalignment errors that grow linearly with vehicle speed. At 100 km/h, a 50ms timing mismatch means objects appear shifted by 1.4 metres in the fused representation. For a system that needs centimetre-precision for lane-keeping and collision avoidance, this is unacceptable. The challenge: unify these asynchronous streams into a single, temporally consistent world model.",
      bullets: [
        "Camera: 30 Hz, 33ms capture latency — captures the most recent visual frame",
        "LiDAR: 10 Hz, full 360° scan takes 100ms — top and bottom of scan are 100ms apart",
        "Radar: 20 Hz, 50ms ambiguity — returns velocity but coarse spatial resolution",
        "At 100 km/h, 50ms timing error = 1.4m positional shift in fused output",
        "Naïve concatenation degrades 3D detection mAP by 4–8% compared to properly aligned fusion",
      ],
    },

    approach: {
      heading: "How was it handled?",
      body: "The solution uses state-propagation techniques and modern attention-based architectures that treat sensor data as time-stamped tokens rather than synchronized snapshots, enabling learned temporal alignment without manual engineering.",
      steps: [
        {
          label: "Kalman-Filter State Propagation",
          detail:
            "Each sensor's detections are forward-predicted to a common reference timestamp using a Kalman filter with a constant-velocity motion model. LiDAR observations from 50ms ago are propagated forward by 50ms × estimated velocity, aligning them with the most recent camera frame. This removes the bulk of temporal misalignment error — from 1.4m down to < 0.1m at highway speeds.",
        },
        {
          label: "Time-Stamped Token Attention",
          detail:
            "Modern BEV fusion architectures (BEVFormer, StreamPETR) treat each sensor reading as a token with an explicit temporal positional encoding. The transformer attention mechanism learns to attend across both modalities and timesteps, implicitly compensating for temporal offsets without explicit motion models.",
        },
        {
          label: "Motion Compensation via Ego-Motion",
          detail:
            "The vehicle's own motion between sensor captures is measured by IMU and odometry. All sensor readings are transformed into the vehicle's coordinate frame at a single reference time, removing ego-vehicle-induced misalignment. This is critical for rotating LiDAR: the start and end of a single scan can differ by vehicle-width at highway speed.",
        },
        {
          label: "Asynchronous Feature Queues",
          detail:
            "Instead of waiting for all sensors to produce synchronized outputs (which wastes latency), each modality pushes features to a shared BEV grid as soon as they're ready. The fusion module always reads the most recent version of each modality's contribution, ensuring the world model is always as fresh as the fastest sensor.",
        },
        {
          label: "Temporal BEV Memory",
          detail:
            "A recurrent or attention-based memory module maintains a persistent BEV state that accumulates observations over time. Past frames' features are spatially warped using ego-motion and faded with temporal decay. This gives the model temporal context (seeing behind occluders, tracking through gaps) while maintaining spatial consistency.",
        },
      ],
    },

    results: {
      heading: "What were the results?",
      body: "Proper temporal alignment transformed multi-sensor fusion from a source of error into a source of superhuman temporal reasoning.",
      metrics: [
        { label: "Temporal Alignment Error", value: "< 1ms", description: "effective synchronisation error with predictive state propagation" },
        { label: "Detection mAP Gain", value: "+6.2%", description: "improvement in NDS metric on nuScenes when using temporal BEV fusion vs. single-frame" },
        { label: "Tracking MOTA", value: "74.5%", description: "multi-object tracking accuracy — up from 67.1% with naive concatenation" },
        { label: "Latency Overhead", value: "< 3ms", description: "additional compute for temporal alignment — negligible in 100ms budget" },
      ],
      insight:
        "The paradigm shift: sensors don't need to be synchronized — the model needs to understand time. Attention-based fusion with temporal encoding outperforms hardware synchronisation, is more flexible across sensor configurations, and enables temporal reasoning abilities (velocity estimation, occlusion memory) that synchronized approaches fundamentally cannot provide.",
    },

    papers: ["BEVFormer (ECCV 2022)", "StreamPETR (ICCV 2023)", "UniAD (CVPR 2023)"],
  },
];

/* ── Summary statistics ──────────────────────────────────────────────── */

const summaryStats = [
  { value: "6", suffix: "+", label: "Critical Challenges Addressed" },
  { value: "40", suffix: "%", label: "Avg. Failure Rate Reduction" },
  { value: "< 20", suffix: " ms", label: "Achievable Inference Latency" },
  { value: "ISO 26262", suffix: "", label: "Safety Compliance Target" },
];

/* ══════════════════════════════════════════════════════
   COMPONENTS
══════════════════════════════════════════════════════ */

/* ── Hero ─────────────────────────────────────────────────────────────── */

const ChallengesHero = () => (
  <div className="relative overflow-hidden py-20 sm:py-28">
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-primary/8 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[300px] bg-accent/6 blur-[100px] rounded-full" />
    </div>
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
          <ShieldAlert className="w-4 h-4" />
          In-Depth Analysis
        </span>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight">
          The Hard Problems of{" "}
          <span className="text-gradient-primary">Autonomous Driving</span>
        </h1>

        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Six fundamental challenges that stand between today's prototype autonomous vehicles and truly safe, scalable deployment — with detailed breakdowns of each problem, how it was addressed, and the measurable results achieved.
        </p>

        {/* Quick-jump pills */}
        <div className="flex flex-wrap justify-center gap-2 pt-2">
          {challenges.map((c) => {
            const Icon = c.problemIcon;
            return (
              <a
                key={c.id}
                href={`#challenge-${c.id}`}
                className="flex items-center gap-1.5 glass px-3 py-1.5 rounded-full text-xs font-semibold hover:-translate-y-0.5 transition-transform"
                style={{
                  color: `hsl(var(${c.color}))`,
                  borderColor: `hsl(var(${c.color}) / 0.2)`,
                }}
              >
                <Icon className="w-3 h-3" />
                {c.title}
              </a>
            );
          })}
        </div>
      </motion.div>
    </div>
  </div>
);

/* ── Stats strip ──────────────────────────────────────────────────────── */

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
          {s.suffix && <span className="text-lg">{s.suffix}</span>}
        </motion.div>
        <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
      </div>
    ))}
  </motion.div>
);

/* ── Side-nav ─────────────────────────────────────────────────────────── */

const SideNav = ({ active }: { active: string }) => (
  <div className="hidden xl:block sticky top-24 w-56 shrink-0">
    <div className="glass p-3 rounded-xl space-y-0.5">
      <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground px-3 pb-2 pt-1">
        Challenges
      </p>
      {challenges.map((c) => {
        const Icon = c.problemIcon;
        const isActive = active === c.id;
        return (
          <a
            key={c.id}
            href={`#challenge-${c.id}`}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              isActive
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground/80 hover:bg-foreground/[0.03]"
            }`}
            style={
              isActive
                ? {
                    background: `hsl(var(${c.color}) / 0.10)`,
                    color: `hsl(var(${c.color}))`,
                    borderLeft: `2px solid hsl(var(${c.color}) / 0.6)`,
                  }
                : {}
            }
          >
            <Icon className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{c.title}</span>
          </a>
        );
      })}
    </div>
  </div>
);

/* ── Pipeline flow (approach steps) ───────────────────────────────────── */

const ApproachFlow = ({
  steps,
  color,
}: {
  steps: { label: string; detail: string }[];
  color: string;
}) => {
  const [expanded, setExpanded] = useState<number | null>(null);
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
              borderColor:
                expanded === i
                  ? `hsl(var(${color}) / 0.35)`
                  : `hsl(var(--foreground) / 0.06)`,
              background:
                expanded === i ? `hsl(var(${color}) / 0.06)` : "transparent",
            }}
            onClick={() => setExpanded(expanded === i ? null : i)}
          >
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-extrabold shrink-0 mt-0.5"
              style={{
                background: `hsl(var(${color}) / 0.12)`,
                color: `hsl(var(${color}))`,
              }}
            >
              {i + 1}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground/90">
                {step.label}
              </p>
              <AnimatePresence>
                {expanded === i && (
                  <motion.p
                    className="text-xs text-muted-foreground mt-1.5 leading-relaxed"
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
              className="w-4 h-4 shrink-0 mt-1 transition-transform duration-200"
              style={{
                color:
                  expanded === i
                    ? `hsl(var(${color}))`
                    : "hsl(var(--muted-foreground) / 0.4)",
                transform: expanded === i ? "rotate(90deg)" : "none",
              }}
            />
          </div>
          {i < steps.length - 1 && (
            <div
              className="ml-6 w-px h-2"
              style={{ background: `hsl(var(${color}) / 0.2)` }}
            />
          )}
        </motion.div>
      ))}
    </div>
  );
};

/* ── Result metrics grid ──────────────────────────────────────────────── */

const ResultMetrics = ({
  metrics,
  color,
}: {
  metrics: { label: string; value: string; description: string }[];
  color: string;
}) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
    {metrics.map((m, i) => (
      <motion.div
        key={m.label}
        className="glass p-4 rounded-xl relative overflow-hidden"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.35, delay: i * 0.08 }}
      >
        <div
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{
            background: `linear-gradient(90deg, transparent, hsl(var(${color})), transparent)`,
          }}
        />
        <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
          {m.label}
        </p>
        <p
          className="text-2xl font-black tabular-nums mb-1"
          style={{ color: `hsl(var(${color}))` }}
        >
          {m.value}
        </p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {m.description}
        </p>
      </motion.div>
    ))}
  </div>
);

/* ── Paper chip ─────────────────────────────────────────────────────── */

const PaperChip = ({
  name,
  color,
  delay,
}: {
  name: string;
  color: string;
  delay: number;
}) => (
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

/* ══════════════════════════════════════════════════════
   FULL CHALLENGE SECTION
══════════════════════════════════════════════════════ */

const ChallengeSection = ({
  challenge,
  index,
  onVisible,
}: {
  challenge: (typeof challenges)[0];
  index: number;
  onVisible: (id: string) => void;
}) => {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { margin: "-40% 0px -40% 0px" });
  const ProblemIcon = challenge.problemIcon;

  if (inView) onVisible(challenge.id);

  const isEven = index % 2 === 0;

  return (
    <motion.section
      ref={ref}
      id={`challenge-${challenge.id}`}
      className="relative py-20 scroll-mt-24"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
    >
      {/* Section divider */}
      {index > 0 && (
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px"
          style={{
            background: `linear-gradient(90deg, transparent, hsl(var(${challenge.color}) / 0.3), transparent)`,
          }}
        />
      )}

      <div className="container mx-auto px-6">
        {/* ── Section Header ── */}
        <motion.div
          className="flex flex-col sm:flex-row sm:items-center gap-4 mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
            style={{
              background: `hsl(var(${challenge.color}) / 0.12)`,
              boxShadow: `0 0 30px hsl(var(${challenge.color}) / 0.15)`,
            }}
          >
            <ProblemIcon
              className="w-7 h-7"
              style={{ color: `hsl(var(${challenge.color}))` }}
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-5xl font-black text-foreground/[0.04] select-none leading-none tabular-nums">
                {challenge.number}
              </span>
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
                  {challenge.title}
                </h2>
                <p className="text-sm text-muted-foreground font-medium">
                  {challenge.subtitle}
                </p>
              </div>
              <span
                className="ml-auto text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border hidden sm:inline"
                style={{
                  color: `hsl(var(${challenge.color}))`,
                  borderColor: `hsl(var(${challenge.color}) / 0.3)`,
                  background: `hsl(var(${challenge.color}) / 0.08)`,
                }}
              >
                {challenge.category}
              </span>
            </div>
          </div>
        </motion.div>

        {/* ── Tagline Quote ── */}
        <motion.div
          className="relative glass p-5 mb-10 flex gap-4 items-start overflow-hidden"
          initial={{ opacity: 0, x: isEven ? -20 : 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `linear-gradient(135deg, hsl(var(${challenge.color}) / 0.06), transparent)`,
            }}
          />
          <Quote
            className="w-6 h-6 shrink-0 mt-0.5"
            style={{ color: `hsl(var(${challenge.color}) / 0.6)` }}
          />
          <p
            className="text-base sm:text-lg font-semibold italic leading-relaxed relative z-10"
            style={{ color: `hsl(var(${challenge.color}))` }}
          >
            {challenge.tagline}
          </p>
        </motion.div>

        {/* ── Three-Part Grid: Problem • Approach • Results ── */}
        <div className="space-y-8">
          {/* ═══ PART 1: THE PROBLEM ═══ */}
          <motion.div
            className="glass relative overflow-hidden p-6 sm:p-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
          >
            <div
              className="absolute top-0 left-0 right-0 h-[2px]"
              style={{
                background: `linear-gradient(90deg, transparent, hsl(var(${challenge.color})), transparent)`,
              }}
            />
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: `hsl(var(${challenge.color}) / 0.12)` }}
              >
                <FileWarning
                  className="w-5 h-5"
                  style={{ color: `hsl(var(${challenge.color}))` }}
                />
              </div>
              <div>
                <span
                  className="text-[9px] font-bold uppercase tracking-widest"
                  style={{ color: `hsl(var(${challenge.color}))` }}
                >
                  The Challenge
                </span>
                <h3 className="text-lg font-bold">{challenge.problem.heading}</h3>
              </div>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed mb-5">
              {challenge.problem.body}
            </p>

            <div className="space-y-2.5">
              {challenge.problem.bullets.map((b, bi) => (
                <motion.div
                  key={bi}
                  className="flex items-start gap-2.5 text-sm"
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: bi * 0.06 }}
                >
                  <AlertTriangle
                    className="w-4 h-4 text-orange-400 shrink-0 mt-0.5"
                  />
                  <span className="text-foreground/80 leading-relaxed">{b}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ═══ PART 2: THE APPROACH ═══ */}
          <motion.div
            className="glass relative overflow-hidden p-6 sm:p-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.1 }}
          >
            <div
              className="absolute top-0 left-0 right-0 h-[2px]"
              style={{
                background: `linear-gradient(90deg, transparent, hsl(var(${challenge.color})), transparent)`,
              }}
            />
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: `hsl(var(${challenge.color}) / 0.12)` }}
              >
                <Wrench
                  className="w-5 h-5"
                  style={{ color: `hsl(var(${challenge.color}))` }}
                />
              </div>
              <div>
                <span
                  className="text-[9px] font-bold uppercase tracking-widest"
                  style={{ color: `hsl(var(${challenge.color}))` }}
                >
                  The Approach
                </span>
                <h3 className="text-lg font-bold">{challenge.approach.heading}</h3>
              </div>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed mb-5">
              {challenge.approach.body}
            </p>

            <ApproachFlow steps={challenge.approach.steps} color={challenge.color} />
          </motion.div>

          {/* ═══ PART 3: THE RESULTS ═══ */}
          <motion.div
            className="glass relative overflow-hidden p-6 sm:p-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.2 }}
          >
            <div
              className="absolute top-0 left-0 right-0 h-[2px]"
              style={{
                background: `linear-gradient(90deg, transparent, hsl(var(${challenge.color})), transparent)`,
              }}
            />
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: `hsl(var(${challenge.color}) / 0.12)` }}
              >
                <BadgeCheck
                  className="w-5 h-5"
                  style={{ color: `hsl(var(${challenge.color}))` }}
                />
              </div>
              <div>
                <span
                  className="text-[9px] font-bold uppercase tracking-widest"
                  style={{ color: `hsl(var(${challenge.color}))` }}
                >
                  The Results
                </span>
                <h3 className="text-lg font-bold">{challenge.results.heading}</h3>
              </div>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed mb-5">
              {challenge.results.body}
            </p>

            {/* Metrics grid */}
            <ResultMetrics
              metrics={challenge.results.metrics}
              color={challenge.color}
            />

            {/* Insight callout */}
            <motion.div
              className="mt-6 p-4 rounded-xl flex items-start gap-3"
              style={{
                background: `hsl(var(${challenge.color}) / 0.06)`,
                border: `1px solid hsl(var(${challenge.color}) / 0.15)`,
              }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <Lightbulb
                className="w-4 h-4 shrink-0 mt-0.5"
                style={{ color: `hsl(var(${challenge.color}))` }}
              />
              <div>
                <p
                  className="text-[9px] font-bold uppercase tracking-widest mb-1"
                  style={{ color: `hsl(var(${challenge.color}))` }}
                >
                  Key Insight
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {challenge.results.insight}
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* ── Related Papers ── */}
          <motion.div
            className="flex flex-wrap items-center gap-2"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25 }}
          >
            <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mr-1">
              Key Papers
            </span>
            {challenge.papers.map((p, pi) => (
              <PaperChip
                key={p}
                name={p}
                color={challenge.color}
                delay={pi * 0.06}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

/* ══════════════════════════════════════════════════════
   RESOLUTION FLOW (bottom)
══════════════════════════════════════════════════════ */

const flowItems = [
  { label: "Detect Failure Mode", icon: ScanEye, color: "--primary" },
  { label: "Collect Edge-Case Data", icon: Layers, color: "--secondary" },
  { label: "Re-Train / Adapt Model", icon: Brain, color: "--accent" },
  { label: "Validate & Certify", icon: BadgeCheck, color: "--primary" },
  { label: "Deploy Update OTA", icon: Zap, color: "--secondary" },
];

const ResolutionFlow = () => (
  <motion.div
    className="mt-8 mb-16"
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
  >
    <div className="container mx-auto px-6">
      <div className="glass p-8 rounded-2xl relative overflow-hidden">
        <div
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{
            background:
              "linear-gradient(90deg, transparent, hsl(var(--primary)), hsl(var(--accent)), hsl(var(--secondary)), transparent)",
          }}
        />
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-8">
          Generalised Problem → Resolution Loop
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-0">
          {flowItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex items-center">
                <motion.div
                  className="glass flex flex-col items-center justify-center px-5 py-4 text-center rounded-xl min-w-[130px] relative overflow-hidden"
                  initial={{ opacity: 0, scale: 0.85 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -3 }}
                  transition={{
                    duration: 0.38,
                    delay: i * 0.1,
                    ease: "backOut",
                  }}
                >
                  <div
                    className="absolute bottom-0 left-0 right-0 h-[2px]"
                    style={{
                      background: `linear-gradient(90deg, transparent, hsl(var(${item.color})), transparent)`,
                    }}
                  />
                  <Icon
                    className="w-5 h-5 mb-2"
                    style={{ color: `hsl(var(${item.color}))` }}
                  />
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

                {i < flowItems.length - 1 && (
                  <motion.div
                    className="hidden sm:flex items-center px-1 text-muted-foreground/30"
                    initial={{ opacity: 0, scaleX: 0 }}
                    whileInView={{ opacity: 1, scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.1 + i * 0.1 }}
                  >
                    <div className="relative flex items-center">
                      <div className="w-8 h-px bg-foreground/15" />
                      <motion.div
                        className="absolute left-0 w-1.5 h-1.5 rounded-full"
                        style={{ background: `hsl(var(${item.color}))` }}
                        animate={{ x: [0, 30, 0] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.4,
                          ease: "easeInOut",
                        }}
                      />
                      <div className="w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[6px] border-l-foreground/20" />
                    </div>
                  </motion.div>
                )}

                {i < flowItems.length - 1 && (
                  <motion.div
                    className="flex sm:hidden w-px h-5 bg-foreground/10 my-0.5"
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.2, delay: i * 0.1 }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  </motion.div>
);

/* ══════════════════════════════════════════════════════
   TAKEAWAY SECTION
══════════════════════════════════════════════════════ */

const takeaways = [
  {
    icon: Target,
    title: "No Silver Bullet",
    body: "Each challenge requires a specialised solution — sensor fusion for noise, self-supervised learning for cost, compression for latency, domain adaptation for weather, certified methods for safety, and temporal modeling for sensor alignment. There is no single technique that solves everything.",
  },
  {
    icon: Layers,
    title: "Defense in Depth",
    body: "The safest systems stack multiple mitigations: adversarial training + certified robustness + cross-modal checks + formal verification. If any single layer fails, the others catch it. This is the principle behind ISO 26262 ASIL-D compliance.",
  },
  {
    icon: TrendingUp,
    title: "From Lab to Road",
    body: "The gap between research metrics (mAP, NDS) and deployment readiness (MTBF, reaction time, power budget) remains significant. These challenges are actively being worked on by every major AV company — Waymo, Cruise, Mobileye, and Tesla — with no company having fully solved all six.",
  },
  {
    icon: Brain,
    title: "Continuous Learning",
    body: "The autonomous driving stack is never 'done'. OTA updates, continuous data collection, and iterative model improvements mean these challenges are addressed progressively — each deployment cycle pushing the safety frontier further.",
  },
];

const TakeawaySection = () => (
  <motion.div
    className="container mx-auto px-6 py-16"
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
  >
    <div className="text-center mb-10">
      <span className="glass inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary mb-4">
        <Lightbulb className="w-4 h-4" />
        Key Takeaways
      </span>
      <h2 className="text-3xl font-extrabold tracking-tight">
        What We{" "}
        <span className="text-gradient-primary">Learned</span>
      </h2>
      <p className="text-muted-foreground mt-2 max-w-xl mx-auto text-sm">
        Cross-cutting lessons from addressing all six fundamental challenges of autonomous driving perception.
      </p>
    </div>

    <div className="grid sm:grid-cols-2 gap-5">
      {takeaways.map((t, i) => {
        const Icon = t.icon;
        return (
          <motion.div
            key={t.title}
            className="glass p-6 rounded-xl relative overflow-hidden group hover:bg-muted/30 transition-colors"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
          >
            <div className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ background: "linear-gradient(90deg, transparent, hsl(var(--primary)), transparent)" }} />
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-primary/10">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-base font-bold mb-1.5">{t.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t.body}
                </p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  </motion.div>
);

/* ══════════════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════════════ */

const ChallengesPage = () => {
  const [activeChallenge, setActiveChallenge] = useState(challenges[0].id);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <ChallengesHero />

      {/* Stats */}
      <div className="container mx-auto px-6">
        <StatStrip />
      </div>

      {/* Body: side-nav + content */}
      <div className="container mx-auto px-6 flex gap-10 items-start">
        <SideNav active={activeChallenge} />

        <div className="flex-1 min-w-0">
          {challenges.map((challenge, i) => (
            <ChallengeSection
              key={challenge.id}
              challenge={challenge}
              index={i}
              onVisible={(id) => setActiveChallenge(id)}
            />
          ))}
        </div>
      </div>

      {/* Resolution Flow */}
      <ResolutionFlow />

      {/* Takeaways */}
      <TakeawaySection />

      {/* Bottom CTA */}
      <motion.div
        className="py-16 text-center space-y-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <p className="text-muted-foreground text-sm max-w-xl mx-auto">
          These six challenges represent the frontier of autonomous driving research — each one an active area of investigation across industry and academia.
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <a
            href="/techniques"
            className="inline-flex items-center gap-2 glass px-5 py-2.5 rounded-xl text-sm font-semibold text-primary border border-primary/20 hover:border-primary/40 hover:bg-primary/5 transition-all"
          >
            Explore Techniques <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href="/"
            className="inline-flex items-center gap-2 glass px-5 py-2.5 rounded-xl text-sm font-semibold text-muted-foreground border border-foreground/10 hover:border-foreground/20 hover:bg-foreground/5 transition-all"
          >
            ← Return to Overview
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default ChallengesPage;
