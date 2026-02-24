import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  Brain,
  Radio,
  Globe,
  Sparkles,
  Network,
  ShieldCheck,
  Building2,
  Infinity as InfinityIcon,
  Quote,
  Lightbulb,
  ArrowRight,
  TrendingUp,
  Target,
  CheckCircle,
  Clock,
  Rocket,
  BarChart3,
} from "lucide-react";

/* ══════════════════════════════════════════════════════
   DATA
══════════════════════════════════════════════════════ */

const futureDirections = [
  {
    id: "foundation-models",
    number: "01",
    color: "--primary",
    icon: Brain,
    tag: "AI & Algorithms",
    category: "Next-Gen AI",
    title: "Foundation Models for Driving",
    subtitle: "Large-Scale Vision-Language-Action Models",
    tagline:
      '"The next paradigm shift in autonomous driving isn\'t a better detector — it\'s a model that understands the world the way we do: through language, vision, and reasoning combined."',

    currentState: {
      heading: "Where are we today?",
      body: "Foundation models like GPT-4V, Gemini, and LLaVA have demonstrated remarkable capabilities in open-vocabulary image understanding, spatial reasoning, and even rudimentary driving scene narration. Research labs at Waymo (EMMA), NVIDIA (DriveLM), and Tsinghua (DriveVLM) have published driving-specific vision-language models that can describe scenes, identify hazards, and propose driving actions in natural language. However, these models are far too slow (2–5 seconds per query) and too unreliable (hallucinations, factual errors) for real-time safety-critical control. Today, they serve as powerful offline annotation assistants and scenario analysers — not as real-time driving agents.",
      keyPoints: [
        "GPT-4V can narrate driving scenes with 78% accuracy on nuScenes QA benchmarks",
        "DriveLM achieves state-of-the-art on open-vocabulary hazard identification",
        "Inference latency of 2–5 seconds makes real-time deployment impossible currently",
        "Hallucination rates of 12–18% on spatial reasoning tasks remain a safety concern",
      ],
    },

    futureVision: {
      heading: "What's coming?",
      body: "The convergence of three trends will make foundation models viable for real-time driving within 3–5 years: (1) efficient architectures that compress trillion-parameter reasoning into edge-viable models, (2) multimodal tokenisation that natively ingests LiDAR, camera, radar, and HD maps as unified tokens, and (3) action-grounding mechanisms that convert language-level reasoning into precise control commands.",
      milestones: [
        {
          year: "2025–2026",
          title: "Efficient Driving VLMs",
          detail: "Distilled driving-specific VLMs running at 10–20 FPS on NVIDIA Orin via INT4 quantisation and speculative decoding. Used for scene understanding and anomaly explanation alongside traditional perception stacks.",
          status: "near",
        },
        {
          year: "2027–2028",
          title: "Multimodal World Models",
          detail: "Foundation models that natively consume camera, LiDAR, radar, and HD map tokens in a unified sequence. These models predict future scene evolution (world modelling), enabling risk-aware planning by simulating thousands of trajectories in parallel.",
          status: "mid",
        },
        {
          year: "2029–2030",
          title: "Generalised Driving Agents",
          detail: "A single foundation model handles perception, prediction, planning, and natural-language explanation — the 'GPT moment' for autonomous driving. One model works across cities, countries, weather conditions, and vehicle platforms without retraining.",
          status: "far",
        },
        {
          year: "2032+",
          title: "Continual Fleet Learning",
          detail: "Foundation models learn from every trip across the fleet. Federated learning shares safety-critical edge cases without raw-data transfer. Models self-improve after deployment, closing the long-tail distribution gap continuously.",
          status: "horizon",
        },
      ],
    },

    impact: {
      heading: "Why does it matter?",
      body: "Foundation models will fundamentally change how autonomous driving systems are built, trained, and maintained.",
      points: [
        "Eliminates the need for task-specific model engineering — one model replaces dozens",
        "Natural language reasoning enables explainable AI decisions for regulators and passengers",
        "Transfer learning across geographies reduces per-city deployment cost by 10–50×",
        "World modelling enables anticipatory driving — predicting events before they happen",
        "Continual learning closes the long-tail safety gap that static models can never fill",
      ],
    },

    challenges: [
      "Latency: compressing trillion-parameter reasoning to < 50ms on edge hardware",
      "Hallucinations: eliminating factual errors in safety-critical spatial reasoning",
      "Verification: certifying a model that can generate arbitrary language outputs",
      "Data governance: training on diverse global driving data while respecting privacy laws",
    ],

    keyResearch: ["EMMA (Waymo 2024)", "DriveLM (NVIDIA 2024)", "DriveVLM (Tsinghua 2024)", "UniAD (CVPR 2023)"],
  },

  {
    id: "sensor-evolution",
    number: "02",
    color: "--secondary",
    icon: Radio,
    tag: "Sensor Technology",
    category: "Hardware",
    title: "Next-Generation Sensor Suites",
    subtitle: "Solid-State LiDAR, 4D Radar & Event Cameras",
    tagline:
      '"The autonomous vehicle of 2030 won\'t just have better sensors — it will have entirely new sensing modalities that don\'t exist in production today."',

    currentState: {
      heading: "Where are we today?",
      body: "Current L4 prototypes use mechanical spinning LiDARs ($4,000–$10,000), consumer-grade cameras, and traditional 3D radar. Solid-state MEMS LiDARs (Luminar Iris, Hesai AT-series) have entered mass production at $500–$1,000, dropping rapidly. 4D imaging radar (Continental ARS540, Arbe Phoenix) resolves individual objects with velocity-per-point at LiDAR-class angular resolution — a breakthrough for all-weather sensing at $100–$200 per unit. Event cameras (Prophesee, Samsung DVS) capture per-pixel brightness changes at microsecond latency with 120dB dynamic range, but driver software and fusion pipelines are still immature.",
      keyPoints: [
        "Solid-state LiDAR production cost: $500–$1,000 today, projected $200 by 2027",
        "4D imaging radar: 0.5° angular resolution, native velocity per point, works in all weather",
        "Event cameras: 1 Mevent/s, 120dB dynamic range, < 1μs latency — but limited software ecosystem",
        "Current sensor suites total $15K–$30K — must reach $2K–$5K for mass-market L3/L4",
      ],
    },

    futureVision: {
      heading: "What's coming?",
      body: "Three disruptive sensor technologies will reshape the perception stack, each addressing a fundamental limitation of today's sensors. The key insight: future AVs won't rely on one dominant sensor — they'll fuse 5–7 heterogeneous modalities that complement each other across every possible failure mode.",
      milestones: [
        {
          year: "2025–2026",
          title: "Sub-$200 Solid-State LiDAR",
          detail: "MEMS micro-mirror and flash LiDARs reach automotive mass-production price points ($150–$200). Every new L3+ vehicle ships with at least one LiDAR as standard equipment, not a premium option.",
          status: "near",
        },
        {
          year: "2027–2028",
          title: "4D Radar as Primary Sensor",
          detail: "4D imaging radar achieves 0.1° resolution with native velocity estimation. Combined with cameras, this radar-vision stack delivers L3+ capability at $300–$500 total — enabling affordable ADAS for economy vehicles worldwide.",
          status: "mid",
        },
        {
          year: "2029–2030",
          title: "Event Camera Fusion",
          detail: "Neuromorphic event cameras replace frame cameras in high-speed and high-dynamic-range scenarios. Motion estimation at μs latency enables reaction to obstacles at speeds impossible for 30fps frame cameras. Dedicated event-driven neural accelerators process event streams natively.",
          status: "far",
        },
        {
          year: "2032+",
          title: "V2X Collective Perception",
          detail: "Road infrastructure (traffic lights, signs, bridge sensors) broadcasts local LiDAR point clouds and hazard alerts to all vehicles via C-V2X. Individual vehicles gain city-scale perception — seeing around corners, through buildings, and beyond their own sensor range.",
          status: "horizon",
        },
      ],
    },

    impact: {
      heading: "Why does it matter?",
      body: "Sensor evolution directly determines the cost, capability, and reliability ceiling of autonomous driving.",
      points: [
        "Cost reduction from $30K to < $3K per sensor suite unlocks mass-market L3/L4 vehicles",
        "4D radar provides all-weather depth sensing that LiDAR and cameras cannot match",
        "Event cameras enable μs-latency perception — 1,000× faster than frame cameras",
        "V2X collective perception extends sensor range from 200m to city-scale coverage",
        "Heterogeneous sensor fusion eliminates single-modality failure modes entirely",
      ],
    },

    challenges: [
      "Manufacturing yield: MEMS LiDAR at automotive-grade reliability (0 DPPM over 15 years)",
      "Software ecosystem: event cameras lack mature deep learning frameworks and training data",
      "Standardisation: V2X protocols (DSRC vs C-V2X) remain fragmented across regions",
      "Calibration: maintaining alignment across 10+ sensors over vehicle lifetime",
    ],

    keyResearch: ["Luminar Iris (2024)", "Arbe Phoenix (2024)", "Prophesee EVK4-HD (2024)", "3GPP C-V2X Release 18"],
  },

  {
    id: "world-models",
    number: "03",
    color: "--accent",
    icon: Globe,
    tag: "AI & Algorithms",
    category: "Prediction",
    title: "Neural World Models",
    subtitle: "Predictive Scene Simulation for Planning",
    tagline:
      '"The safest driver is the one who predicts what will happen next. World models give autonomous vehicles imagination — the ability to simulate futures before choosing actions."',

    currentState: {
      heading: "Where are we today?",
      body: "Current prediction modules in autonomous driving are limited to trajectory forecasting: given past positions of surrounding agents, predict their future positions for 3–8 seconds. These models (HiVT, QCNet, MTR) are accurate for agents that behave predictably but fail on novel scenarios — a child suddenly running into the road, a truck shedding debris, a construction zone appearing mid-route. They predict where objects will be, but not what will happen to the entire scene. Neural world models aim to solve this by learning a full generative model of scene evolution — predicting the entire future state of the world (geometry, semantics, agent behaviour, lighting) from current observations.",
      keyPoints: [
        "State-of-art trajectory prediction: 1.2m ADE at 3s horizon on Argoverse 2",
        "GAIA-1 (Wayve) generates photorealistic future driving videos from current scene + action",
        "DriveDreamer and OccWorld predict occupancy grid evolution — full 3D scene futures",
        "Current world models are too slow (500ms–2s per simulation) for real-time planning",
      ],
    },

    futureVision: {
      heading: "What's coming?",
      body: "World models will evolve from offline research tools to real-time planning engines that simulate hundreds of possible futures in parallel, score them by safety and comfort, and select the optimal action — all within 50ms.",
      milestones: [
        {
          year: "2025–2026",
          title: "Offline Scenario Generation",
          detail: "World models generate millions of diverse, photorealistic training scenarios — including rare events (accidents, debris, animals) — replacing expensive real-world data collection. This 10× reduces the cost of long-tail coverage.",
          status: "near",
        },
        {
          year: "2027–2028",
          title: "Real-Time Occupancy Prediction",
          detail: "Lightweight occupancy world models predict 3D voxel-grid evolution at 50+ FPS on automotive SoCs. Planners use these predictions to evaluate collision probability for candidate trajectories in real-time.",
          status: "mid",
        },
        {
          year: "2029–2030",
          title: "Multi-Agent Interactive Simulation",
          detail: "World models simulate interactive multi-agent scenarios: 'If I brake, will the car behind swerve or stop? If I merge, will the truck slow down?' This enables game-theoretic planning with human-like social intelligence.",
          status: "far",
        },
        {
          year: "2032+",
          title: "Learned Physics Engines",
          detail: "World models learn accurate physics: tire friction, vehicle dynamics, rain hydroplaning, ice braking distances. They replace hand-tuned vehicle dynamics models with learned simulators that are more accurate across more conditions.",
          status: "horizon",
        },
      ],
    },

    impact: {
      heading: "Why does it matter?",
      body: "World models transform autonomous driving from reactive to anticipatory — the single most important shift for safety.",
      points: [
        "Enables 'imagination' — testing thousands of actions before executing any",
        "Covers long-tail scenarios that no amount of real-world driving can provide",
        "Replaces hand-coded rules with learned scene dynamics that generalise",
        "Game-theoretic multi-agent planning enables human-like negotiation (merging, yielding)",
        "Learned physics replace brittle engineering models with data-driven accuracy",
      ],
    },

    challenges: [
      "Temporal compounding: errors in frame N propagate and amplify in frame N+K",
      "Compute budget: generating 100+ futures in < 50ms requires 100 TOPS+ NPUs",
      "Evaluation: no agreed-upon metric for 'world model quality' in driving contexts",
      "Causality: current models learn correlations, not causal mechanisms — risky for edge cases",
    ],

    keyResearch: ["GAIA-1 (Wayve 2023)", "OccWorld (2024)", "DriveDreamer (2024)", "UniSim (Google 2023)"],
  },

  {
    id: "v2x-infrastructure",
    number: "04",
    color: "--glow-accent",
    icon: Network,
    tag: "Infrastructure",
    category: "Connectivity",
    title: "V2X & Smart Infrastructure",
    subtitle: "Vehicle-to-Everything Communication",
    tagline:
      '"An autonomous vehicle that only sees with its own sensors is like a driver who never looks at road signs, never listens to traffic radio, and never checks their mirrors. V2X gives vehicles the information they cannot sense alone."',

    currentState: {
      heading: "Where are we today?",
      body: "Vehicle-to-Everything (V2X) communication exists in pilot deployments across China (C-V2X on 5G), Europe (ITS-G5/ETSI), and the US (C-V2X DSRC debate). China leads adoption: 7,000+ V2X-equipped intersections in 20+ cities broadcast signal phase and timing (SPaT), hazard warnings, and traffic flow data. However, global standardisation is fragmented (DSRC vs C-V2X), penetration rates are < 2% of vehicles, and latency/reliability for safety-critical messages (collision warnings) haven't met automotive-grade requirements. V2X is deployed for convenience (traffic info), not yet for safety-critical cooperative perception.",
      keyPoints: [
        "China: 7,000+ V2X-equipped intersections; 20+ pilot cities with C-V2X",
        "EU: ITS-G5 (ETSI) deployed on 2,000+ km of highway; Day 1 services active",
        "US: C-V2X selected over DSRC in 2023; deployment accelerating in 2025+",
        "Global V2X-equipped vehicle penetration: < 2% — critical mass needed at 30%+",
        "Latency: current V2X messages take 20–100ms — too slow for cooperative collision avoidance",
      ],
    },

    futureVision: {
      heading: "What's coming?",
      body: "V2X will evolve through four stages: from basic broadcast messages, through cooperative perception sharing, to fully cooperative driving where vehicles and infrastructure jointly plan movements across entire traffic networks.",
      milestones: [
        {
          year: "2025–2026",
          title: "Day 1+ V2X Services at Scale",
          detail: "Signal phase and timing (SPaT), hazard warnings, and construction zone alerts reach 50+ cities globally. New vehicles ship with C-V2X hardware as standard. Basic cooperative awareness reduces intersection collisions by 30–40%.",
          status: "near",
        },
        {
          year: "2027–2028",
          title: "Cooperative Perception Sharing",
          detail: "Vehicles share compressed BEV perception features with nearby vehicles and infrastructure via 5G sidelink. A vehicle approaching a blind intersection 'sees' through the building using the perception of vehicles on the cross street.",
          status: "mid",
        },
        {
          year: "2029–2031",
          title: "Cooperative Manoeuvre Planning",
          detail: "Vehicles negotiate complex multi-agent manoeuvres (highway merges, unprotected left turns, emergency vehicle yielding) via V2X intent sharing. Intersection managers coordinate traffic flow without signals, increasing throughput 2–3×.",
          status: "far",
        },
        {
          year: "2033+",
          title: "City-Scale Traffic Orchestration",
          detail: "Citywide V2X mesh networks enable global traffic optimisation. Every vehicle's planned route is known to the network; congestion, accidents, and emissions are minimised through cooperative routing. Human-driven and autonomous vehicles coexist seamlessly via V2X mediation.",
          status: "horizon",
        },
      ],
    },

    impact: {
      heading: "Why does it matter?",
      body: "V2X extends perception beyond the physical limits of onboard sensors and enables cooperative intelligence that no single vehicle can achieve alone.",
      points: [
        "See-through-buildings: perception sharing eliminates blind spots at intersections",
        "2–3× intersection throughput via cooperative coordination — no traffic lights needed",
        "Emergency vehicle preemption: all vehicles yield automatically via V2X broadcast",
        "30–40% reduction in intersection collisions from SPaT and hazard warnings alone",
        "Enables global traffic optimisation: routing, speed harmonisation, emissions reduction",
      ],
    },

    challenges: [
      "Standardisation: DSRC vs C-V2X fragmentation delays global interoperability",
      "Cybersecurity: V2X messages must be authenticated in < 5ms to prevent spoofing attacks",
      "Infrastructure cost: equipping every intersection costs $20K–$50K per node",
      "Chicken-and-egg: benefits scale with penetration rate, but penetration requires benefits",
    ],

    keyResearch: ["3GPP Release 18 (C-V2X)", "ETSI ITS-G5 (2024)", "V2X-ViT (ECCV 2022)", "CoopDet3D (2023)"],
  },

  {
    id: "safety-certification",
    number: "05",
    color: "--primary",
    icon: ShieldCheck,
    tag: "Regulation",
    category: "Safety & Trust",
    title: "Safety Certification & AI Regulation",
    subtitle: "From Research Metrics to Deployment Guarantees",
    tagline:
      '"We can build a car that drives itself. The harder question: how do we prove to society that it\'s safe enough to trust with human lives — and who decides?"',

    currentState: {
      heading: "Where are we today?",
      body: "The autonomous driving industry operates under a patchwork of safety frameworks: ISO 26262 (functional safety) defines hardware and software development processes, ISO 21448 (SOTIF — Safety of the Intended Functionality) addresses AI-specific hazards like misclassifications and ODD limitations, and UNECE WP.29 provides the first legally binding international regulations for automated lane-keeping (ALKS). However, none of these frameworks provide a complete, AI-native certification methodology. How do you certify a neural network that can produce novel outputs for every input? The gap between ML research metrics (mAP, NDS) and safety proof obligations (ASIL-D, SOTIF) remains the single largest barrier to L4+ deployment.",
      keyPoints: [
        "ISO 26262 ASIL-D: requires < 10⁻⁸ dangerous failures per hour — unfalsifiable for neural networks",
        "ISO 21448 SOTIF: defines known/unknown unsafe scenarios — but doesn't certify ML components directly",
        "UNECE WP.29 ALKS: first binding L3 regulation — limited to ≤ 60 km/h, motorway-only",
        "Waymo Safety Report 2024: 7.1M autonomous miles, 0 fatalities — but N is too small for statistical proof",
        "No country has an approved process for certifying L4/L5 neural network perception systems",
      ],
    },

    futureVision: {
      heading: "What's coming?",
      body: "Safety certification will evolve from process-based compliance to evidence-based, continuous assurance — combining formal methods, simulation-at-scale, and real-world performance monitoring into a living safety case.",
      milestones: [
        {
          year: "2025–2026",
          title: "Scenario-Based Validation at Scale",
          detail: "Regulatory bodies accept simulation-based validation as complementary evidence to real-world testing. Companies demonstrate coverage of 10,000+ critical scenarios in simulation, reducing the miles required for statistical proof from billions to millions.",
          status: "near",
        },
        {
          year: "2027–2028",
          title: "AI-Specific Safety Standards",
          detail: "ISO/PAS 8800 (AI Safety in Road Vehicles) reaches full publication, providing the first comprehensive framework for certifying ML perception, prediction, and planning components. Shadow-mode deployment data is accepted as safety evidence.",
          status: "mid",
        },
        {
          year: "2029–2031",
          title: "Continuous Safety Monitoring",
          detail: "Safety cases become living documents updated in real-time with fleet telemetry. OTA model updates are validated against safety regression tests automatically. Regulatory dashboards provide continuous safety performance visibility to authorities.",
          status: "far",
        },
        {
          year: "2033+",
          title: "Global Mutual Recognition",
          detail: "International mutual recognition agreements allow L4+ vehicles certified in one region to operate globally — similar to aviation's bilateral safety agreements. A unified global safety taxonomy enables cross-border autonomous operation.",
          status: "horizon",
        },
      ],
    },

    impact: {
      heading: "Why does it matter?",
      body: "Without safety certification, L4+ AVs remain confined to pilot programs. Certification unlocks mass-market deployment.",
      points: [
        "Enables legal L4 deployment: manufacturers assume liability based on certified safety cases",
        "Public trust: transparent safety evidence builds societal acceptance of autonomous vehicles",
        "Insurance frameworks: actuarial models based on certified safety data enable AV insurance markets",
        "Global scalability: mutual recognition eliminates per-country recertification barriers",
        "Innovation speed: simulation-based validation accelerates development cycles from years to months",
      ],
    },

    challenges: [
      "Statistical proof: demonstrating 10× safer than human requires billions of equivalent miles",
      "Adversarial gap: safety cases must account for intentional attacks, not just random failures",
      "Liability frameworks: who is responsible — manufacturer, software provider, or operator?",
      "International fragmentation: EU, US, China, Japan each developing independent frameworks",
    ],

    keyResearch: ["ISO/PAS 8800 (Draft 2024)", "SOTIF ISO 21448 (2022)", "UNECE WP.29 ALKS R157 (2021)", "UL 4600 (2023)"],
  },

  {
    id: "societal-transformation",
    number: "06",
    color: "--secondary",
    icon: Building2,
    tag: "Society",
    category: "Impact",
    title: "Societal & Urban Transformation",
    subtitle: "Mobility, Equity & Sustainability",
    tagline:
      '"Autonomous driving is not just a technology story — it\'s a story about how cities are built, who can access mobility, and whether transportation makes our planet better or worse."',

    currentState: {
      heading: "Where are we today?",
      body: "Commercial robotaxi services are live in 5+ US cities (Waymo in SF, Phoenix, Austin, LA; Zoox in SF, Las Vegas) and 10+ Chinese cities (Baidu Apollo, Pony.ai). These services have completed millions of driverless trips with strong safety records. However, they're confined to geofenced urban cores, serve a small fraction of the population, and their economic model (expensive sensor suites, safety operators in remote control centres, limited ODD) isn't yet viable without venture subsidies. The transformative potential — reducing urban parking by 80%, enabling mobility for elderly/disabled populations, cutting transport emissions — remains unrealised at current scale.",
      keyPoints: [
        "Waymo: 100K+ paid rides/week across 4 US cities (2025), zero at-fault fatalities",
        "Baidu Apollo: 5M+ cumulative autonomous rides across 11 Chinese cities",
        "Economics: robotaxi cost $1.50–$3.00/mile vs $0.60/mile for traditional rideshare",
        "30% of urban land is devoted to parking — AVs could return this to productive use",
        "1.35M global traffic deaths annually — 94% caused by human error",
      ],
    },

    futureVision: {
      heading: "What's coming?",
      body: "The societal impact of autonomous driving will unfold in waves: first as a transportation option, then as an urban planning assumption, and eventually as the default mode of mobility that reshapes cities, economies, and environmental impact.",
      milestones: [
        {
          year: "2025–2027",
          title: "Robotaxi Scale-Up (50+ Cities)",
          detail: "Waymo, Zoox, Baidu, and Pony.ai expand to 50+ cities globally. Per-ride costs reach parity with human rideshare ($0.80–$1.20/mile). Autonomous delivery (Nuro, Gatik) becomes standard for last-mile grocery and pharmacy.",
          status: "near",
        },
        {
          year: "2028–2030",
          title: "Mobility-as-a-Service (MaaS) Integration",
          detail: "Autonomous vehicles integrate with public transit, micro-mobility (scooters, bikes), and ride-pooling into unified MaaS platforms. The average urban household drops from 2 cars to 0.5 cars. On-demand autonomous shuttles replace low-ridership bus routes.",
          status: "mid",
        },
        {
          year: "2031–2033",
          title: "Urban Redesign",
          detail: "Cities begin converting parking structures to housing, parks, and commercial space. Road lanes narrow as AVs drive with centimetre precision. New developments are built 'AV-native' with automated loading zones replacing garages. Urban density increases without congestion.",
          status: "far",
        },
        {
          year: "2035+",
          title: "Universal Autonomous Mobility",
          detail: "Autonomous transportation becomes a utility — like electricity or water. Mobility is no longer age, disability, or location-dependent. Rural communities gain access to on-demand transport. Global traffic fatalities drop below 100K/year (from 1.35M today).",
          status: "horizon",
        },
      ],
    },

    impact: {
      heading: "Why does it matter?",
      body: "The societal impact dwarfs the technology itself — autonomous driving will reshape how 8 billion people live, work, and move.",
      points: [
        "Safety: potential to prevent 1.2M+ traffic deaths per year (94% caused by human error)",
        "Accessibility: independent mobility for 1B+ elderly and disabled people worldwide",
        "Environment: EV-autonomous fleets could reduce transport emissions 60–80%",
        "Urban space: reclaiming 30% of city land currently used for parking",
        "Economic productivity: converting 600B+ annual hours of commuting into productive time",
      ],
    },

    challenges: [
      "Job displacement: 3.5M US truck/taxi/delivery drivers face career transition",
      "Digital divide: ensuring AV benefits aren't limited to affluent urban areas",
      "Cybersecurity: fleet-wide vulnerabilities in connected autonomous systems",
      "Regulation: legal frameworks for mixed human-AV traffic during transition period",
    ],

    keyResearch: ["ITF Transport Outlook 2025", "McKinsey Mobility 2040 Report", "Waymo Safety Report 2024", "NACTO Blueprint for AV"],
  },
];

/* ── Timeline constants */

const statusConfig: Record<string, { label: string; color: string; bgOpacity: string }> = {
  near:    { label: "Near-Term (1–2yr)",  color: "--accent",      bgOpacity: "0.20" },
  mid:     { label: "Mid-Term (3–5yr)",   color: "--primary",     bgOpacity: "0.15" },
  far:     { label: "Long-Term (5–8yr)",  color: "--secondary",   bgOpacity: "0.12" },
  horizon: { label: "Horizon (10yr+)",    color: "--glow-accent", bgOpacity: "0.08" },
};

/* ── Summary stats */

const summaryStats = [
  { value: "6",    suffix: "",  label: "Future Directions" },
  { value: "2035", suffix: "",  label: "L5 Target Year" },
  { value: "1.2M", suffix: "+", label: "Lives Saved Annually" },
  { value: "80",   suffix: "%", label: "Parking Land Reclaimed" },
];

/* ══════════════════════════════════════════════════════
   COMPONENTS
══════════════════════════════════════════════════════ */

/* ── Hero ─────────────────────────────────────────────────────────────── */

const FutureHero = () => (
  <div className="relative overflow-hidden py-20 sm:py-28">
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-primary/8 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[300px] bg-accent/6 blur-[100px] rounded-full" />
      <div className="absolute top-1/2 left-0 w-[400px] h-[200px] bg-secondary/5 blur-[100px] rounded-full" />
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
          <Sparkles className="w-4 h-4" />
          Looking Ahead
        </span>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight">
          The Road{" "}
          <span className="text-gradient-primary">Ahead</span>
        </h1>

        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Six transformative directions shaping the future of autonomous driving — from foundation model AI and next-gen sensors to V2X infrastructure, safety certification, and the societal transformation that follows.
        </p>

        {/* Quick-jump pills */}
        <div className="flex flex-wrap justify-center gap-2 pt-2">
          {futureDirections.map((d) => {
            const Icon = d.icon;
            return (
              <a
                key={d.id}
                href={`#future-${d.id}`}
                className="flex items-center gap-1.5 glass px-3 py-1.5 rounded-full text-xs font-semibold hover:-translate-y-0.5 transition-transform"
                style={{
                  color: `hsl(var(${d.color}))`,
                  borderColor: `hsl(var(${d.color}) / 0.2)`,
                }}
              >
                <Icon className="w-3 h-3" />
                {d.title}
              </a>
            );
          })}
        </div>

        {/* Status legend */}
        <div className="flex flex-wrap justify-center gap-3 pt-3">
          {Object.entries(statusConfig).map(([key, val]) => (
            <div key={key} className="flex items-center gap-2 glass px-3 py-1.5 rounded-full">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{
                  background: `hsl(var(${val.color}))`,
                  boxShadow: `0 0 6px hsl(var(${val.color}) / 0.5)`,
                }}
              />
              <span className="text-[10px] text-muted-foreground font-medium">{val.label}</span>
            </div>
          ))}
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
        Future Directions
      </p>
      {futureDirections.map((d) => {
        const Icon = d.icon;
        const isActive = active === d.id;
        return (
          <a
            key={d.id}
            href={`#future-${d.id}`}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              isActive
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground/80 hover:bg-foreground/[0.03]"
            }`}
            style={
              isActive
                ? {
                    background: `hsl(var(${d.color}) / 0.10)`,
                    color: `hsl(var(${d.color}))`,
                    borderLeft: `2px solid hsl(var(${d.color}) / 0.6)`,
                  }
                : {}
            }
          >
            <Icon className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{d.title}</span>
          </a>
        );
      })}
    </div>
  </div>
);

/* ── Milestone timeline card ──────────────────────────────────────────── */

const MilestoneTimeline = ({
  milestones,
  color,
}: {
  milestones: { year: string; title: string; detail: string; status: string }[];
  color: string;
}) => {
  const [expanded, setExpanded] = useState<number | null>(null);
  return (
    <div className="relative">
      {/* Vertical line */}
      <div
        className="absolute left-[15px] top-0 bottom-0 w-px"
        style={{ background: `hsl(var(${color}) / 0.2)` }}
      />
      <div className="space-y-3">
        {milestones.map((m, i) => {
          const sc = statusConfig[m.status];
          return (
            <motion.div
              key={i}
              className="relative pl-10"
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              {/* Dot on the line */}
              <div
                className="absolute left-[9px] top-3 w-[14px] h-[14px] rounded-full border-2 z-10"
                style={{
                  borderColor: `hsl(var(${sc.color}))`,
                  background: `hsl(var(${sc.color}) / ${sc.bgOpacity})`,
                  boxShadow: `0 0 8px hsl(var(${sc.color}) / 0.3)`,
                }}
              />

              <div
                className="p-4 rounded-xl border cursor-pointer transition-all duration-200"
                style={{
                  borderColor: expanded === i ? `hsl(var(${color}) / 0.35)` : `hsl(var(--foreground) / 0.06)`,
                  background: expanded === i ? `hsl(var(${color}) / 0.04)` : "transparent",
                }}
                onClick={() => setExpanded(expanded === i ? null : i)}
              >
                <div className="flex items-center gap-3 mb-1">
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full border"
                    style={{
                      color: `hsl(var(${sc.color}))`,
                      borderColor: `hsl(var(${sc.color}) / 0.3)`,
                      background: `hsl(var(${sc.color}) / 0.08)`,
                    }}
                  >
                    {m.year}
                  </span>
                  <span
                    className="text-[9px] font-medium uppercase tracking-widest"
                    style={{ color: `hsl(var(${sc.color}) / 0.7)` }}
                  >
                    {sc.label}
                  </span>
                </div>
                <p className="text-sm font-semibold text-foreground/90 mb-0.5">{m.title}</p>
                <AnimatePresence>
                  {expanded === i && (
                    <motion.p
                      className="text-xs text-muted-foreground leading-relaxed mt-1.5"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22 }}
                    >
                      {m.detail}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

/* ── Research chip ────────────────────────────────────────────────────── */

const ResearchChip = ({ name, color, delay }: { name: string; color: string; delay: number }) => (
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
   FULL DIRECTION SECTION
══════════════════════════════════════════════════════ */

const DirectionSection = ({
  direction,
  index,
  onVisible,
}: {
  direction: (typeof futureDirections)[0];
  index: number;
  onVisible: (id: string) => void;
}) => {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { margin: "-40% 0px -40% 0px" });
  const Icon = direction.icon;

  if (inView) onVisible(direction.id);
  const isEven = index % 2 === 0;

  return (
    <motion.section
      ref={ref}
      id={`future-${direction.id}`}
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
            background: `linear-gradient(90deg, transparent, hsl(var(${direction.color}) / 0.3), transparent)`,
          }}
        />
      )}

      <div className="container mx-auto px-6">
        {/* ── Header ── */}
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
              background: `hsl(var(${direction.color}) / 0.12)`,
              boxShadow: `0 0 30px hsl(var(${direction.color}) / 0.15)`,
            }}
          >
            <Icon className="w-7 h-7" style={{ color: `hsl(var(${direction.color}))` }} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-5xl font-black text-foreground/[0.04] select-none leading-none tabular-nums">
                {direction.number}
              </span>
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
                  {direction.title}
                </h2>
                <p className="text-sm text-muted-foreground font-medium">{direction.subtitle}</p>
              </div>
              <span
                className="ml-auto text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border hidden sm:inline"
                style={{
                  color: `hsl(var(${direction.color}))`,
                  borderColor: `hsl(var(${direction.color}) / 0.3)`,
                  background: `hsl(var(${direction.color}) / 0.08)`,
                }}
              >
                {direction.category}
              </span>
            </div>
          </div>
        </motion.div>

        {/* ── Tagline ── */}
        <motion.div
          className="relative glass p-5 mb-10 flex gap-4 items-start overflow-hidden"
          initial={{ opacity: 0, x: isEven ? -20 : 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: `linear-gradient(135deg, hsl(var(${direction.color}) / 0.06), transparent)` }}
          />
          <Quote className="w-6 h-6 shrink-0 mt-0.5" style={{ color: `hsl(var(${direction.color}) / 0.6)` }} />
          <p
            className="text-base sm:text-lg font-semibold italic leading-relaxed relative z-10"
            style={{ color: `hsl(var(${direction.color}))` }}
          >
            {direction.tagline}
          </p>
        </motion.div>

        {/* ── Content Grid ── */}
        <div className="space-y-8">

          {/* ═══ PART 1: WHERE ARE WE TODAY? ═══ */}
          <motion.div
            className="glass relative overflow-hidden p-6 sm:p-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
          >
            <div
              className="absolute top-0 left-0 right-0 h-[2px]"
              style={{ background: `linear-gradient(90deg, transparent, hsl(var(${direction.color})), transparent)` }}
            />
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: `hsl(var(${direction.color}) / 0.12)` }}
              >
                <Clock className="w-5 h-5" style={{ color: `hsl(var(${direction.color}))` }} />
              </div>
              <div>
                <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: `hsl(var(${direction.color}))` }}>
                  Current State
                </span>
                <h3 className="text-lg font-bold">{direction.currentState.heading}</h3>
              </div>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed mb-5">
              {direction.currentState.body}
            </p>

            <div className="space-y-2.5">
              {direction.currentState.keyPoints.map((point, pi) => (
                <motion.div
                  key={pi}
                  className="flex items-start gap-2.5 text-sm"
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: pi * 0.06 }}
                >
                  <BarChart3
                    className="w-4 h-4 shrink-0 mt-0.5"
                    style={{ color: `hsl(var(${direction.color}))` }}
                  />
                  <span className="text-foreground/80 leading-relaxed">{point}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ═══ PART 2: WHAT'S COMING? (Timeline) ═══ */}
          <motion.div
            className="glass relative overflow-hidden p-6 sm:p-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.1 }}
          >
            <div
              className="absolute top-0 left-0 right-0 h-[2px]"
              style={{ background: `linear-gradient(90deg, transparent, hsl(var(${direction.color})), transparent)` }}
            />
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: `hsl(var(${direction.color}) / 0.12)` }}
              >
                <Rocket className="w-5 h-5" style={{ color: `hsl(var(${direction.color}))` }} />
              </div>
              <div>
                <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: `hsl(var(${direction.color}))` }}>
                  Future Roadmap
                </span>
                <h3 className="text-lg font-bold">{direction.futureVision.heading}</h3>
              </div>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              {direction.futureVision.body}
            </p>

            <MilestoneTimeline
              milestones={direction.futureVision.milestones}
              color={direction.color}
            />
          </motion.div>

          {/* ═══ PART 3: WHY IT MATTERS + CHALLENGES ═══ */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Impact */}
            <motion.div
              className="glass relative overflow-hidden p-6 sm:p-8 flex flex-col"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.15 }}
            >
              <div
                className="absolute top-0 left-0 right-0 h-[2px]"
                style={{ background: `linear-gradient(90deg, transparent, hsl(var(${direction.color})), transparent)` }}
              />
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: `hsl(var(${direction.color}) / 0.12)` }}
                >
                  <TrendingUp className="w-5 h-5" style={{ color: `hsl(var(${direction.color}))` }} />
                </div>
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: `hsl(var(${direction.color}))` }}>
                    Impact
                  </span>
                  <h3 className="text-lg font-bold">{direction.impact.heading}</h3>
                </div>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                {direction.impact.body}
              </p>

              <ul className="space-y-2.5 flex-1">
                {direction.impact.points.map((point, pi) => (
                  <motion.li
                    key={pi}
                    className="flex items-start gap-2.5 text-sm"
                    initial={{ opacity: 0, x: 12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: pi * 0.06 }}
                  >
                    <CheckCircle
                      className="w-4 h-4 shrink-0 mt-0.5"
                      style={{ color: `hsl(var(${direction.color}))` }}
                    />
                    <span className="text-foreground/80 leading-relaxed">{point}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Remaining Challenges */}
            <motion.div
              className="glass relative overflow-hidden p-6 sm:p-8 flex flex-col"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.2 }}
            >
              <div
                className="absolute top-0 left-0 right-0 h-[2px]"
                style={{ background: "linear-gradient(90deg, transparent, hsl(35, 100%, 55%), transparent)" }}
              />
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-orange-500/10">
                  <Target className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-orange-400">
                    Open Questions
                  </span>
                  <h3 className="text-lg font-bold">Remaining Challenges</h3>
                </div>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                Key obstacles that must be overcome to realise this future direction.
              </p>

              <ul className="space-y-3 flex-1">
                {direction.challenges.map((ch, ci) => (
                  <motion.li
                    key={ci}
                    className="flex items-start gap-2.5 text-sm p-3 rounded-xl border border-orange-500/10 bg-orange-500/[0.03]"
                    initial={{ opacity: 0, x: 12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: ci * 0.06 }}
                  >
                    <Lightbulb className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                    <span className="text-foreground/80 leading-relaxed">{ch}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* ── Key Research ── */}
          <motion.div
            className="flex flex-wrap items-center gap-2"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25 }}
          >
            <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mr-1">
              Key Research & Standards
            </span>
            {direction.keyResearch.map((r, ri) => (
              <ResearchChip key={r} name={r} color={direction.color} delay={ri * 0.06} />
            ))}
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

/* ══════════════════════════════════════════════════════
   CONVERGENCE VISION (bottom)
══════════════════════════════════════════════════════ */

const convergencePoints = [
  { icon: Brain, label: "Foundation AI", color: "--primary" },
  { icon: Radio, label: "Next-Gen Sensors", color: "--secondary" },
  { icon: Globe, label: "World Models", color: "--accent" },
  { icon: Network, label: "V2X Mesh", color: "--glow-accent" },
  { icon: ShieldCheck, label: "Safety Cert.", color: "--primary" },
  { icon: Building2, label: "Urban Transform", color: "--secondary" },
];

const ConvergenceSection = () => (
  <motion.div
    className="my-16"
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
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-48 h-24 bg-primary/5 blur-[60px] rounded-full" />
          <div className="absolute bottom-0 right-1/4 w-48 h-24 bg-accent/5 blur-[60px] rounded-full" />
        </div>

        <div className="relative z-10 text-center mb-8">
          <span className="glass inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-primary mb-3">
            <InfinityIcon className="w-3.5 h-3.5" />
            Convergence
          </span>
          <h2 className="text-2xl font-extrabold tracking-tight mb-2">
            Where All Six{" "}
            <span className="text-gradient-primary">Converge</span>
          </h2>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto">
            The future of autonomous driving isn't any one breakthrough — it's the convergence of all six directions into a unified, self-improving, universally safe mobility system.
          </p>
        </div>

        {/* Convergence ring */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {convergencePoints.map((cp, i) => {
            const CpIcon = cp.icon;
            return (
              <motion.div
                key={cp.label}
                className="glass flex flex-col items-center gap-2 px-5 py-4 rounded-xl relative overflow-hidden group hover:-translate-y-1 transition-transform"
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.35, ease: "backOut" }}
              >
                <div
                  className="absolute bottom-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: `linear-gradient(90deg, transparent, hsl(var(${cp.color})), transparent)` }}
                />
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: `hsl(var(${cp.color}) / 0.12)` }}
                >
                  <CpIcon className="w-5 h-5" style={{ color: `hsl(var(${cp.color}))` }} />
                </div>
                <span className="text-xs font-semibold text-foreground/80">{cp.label}</span>
              </motion.div>
            );
          })}
        </div>

        {/* Arrow down to vision */}
        <div className="flex justify-center mb-6">
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="text-muted-foreground/40"
          >
            <ArrowRight className="w-5 h-5 rotate-90" />
          </motion.div>
        </div>

        {/* Vision statement */}
        <div className="glass p-6 rounded-xl relative overflow-hidden text-center max-w-2xl mx-auto">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "linear-gradient(135deg, hsl(var(--primary) / 0.06), hsl(var(--accent) / 0.04), transparent)" }}
          />
          <Globe className="w-10 h-10 mx-auto text-primary mb-3 relative z-10" />
          <h3 className="text-xl font-extrabold tracking-tight mb-2 relative z-10">
            Towards a{" "}
            <span className="text-gradient-primary">Zero-Accident Future</span>
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed relative z-10">
            The convergence of foundation-model AI, affordable solid-state sensing, city-scale V2X, 
            living safety certification, and neural world models puts fully autonomous, universally safe 
            mobility within reach by the mid-2030s — reshaping urban planning, logistics, accessibility, 
            and saving over one million lives per year.
          </p>
          <div className="flex flex-wrap justify-center gap-2 pt-4 relative z-10">
            {["Zero Fatalities", "Universal Access", "Shared Mobility", "Reduced Emissions", "Reclaimed Cities"].map((tag) => (
              <span
                key={tag}
                className="glass text-[10px] font-semibold px-3 py-1.5 rounded-full text-primary border border-primary/20"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

/* ══════════════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════════════ */

const FutureScopePage = () => {
  const [activeDirection, setActiveDirection] = useState(futureDirections[0].id);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <FutureHero />

      {/* Stats */}
      <div className="container mx-auto px-6">
        <StatStrip />
      </div>

      {/* Body: side-nav + content */}
      <div className="container mx-auto px-6 flex gap-10 items-start">
        <SideNav active={activeDirection} />

        <div className="flex-1 min-w-0">
          {futureDirections.map((direction, i) => (
            <DirectionSection
              key={direction.id}
              direction={direction}
              index={i}
              onVisible={(id) => setActiveDirection(id)}
            />
          ))}
        </div>
      </div>

      {/* Convergence */}
      <ConvergenceSection />

      {/* Bottom CTA */}
      <motion.div
        className="py-16 text-center space-y-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <p className="text-muted-foreground text-sm max-w-xl mx-auto">
          The autonomous driving revolution is not a single event — it's a decade of compounding breakthroughs across AI, hardware, infrastructure, and regulation converging toward universal safe mobility.
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <a
            href="/challenges"
            className="inline-flex items-center gap-2 glass px-5 py-2.5 rounded-xl text-sm font-semibold text-primary border border-primary/20 hover:border-primary/40 hover:bg-primary/5 transition-all"
          >
            Review Challenges <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href="/dashboard"
            className="inline-flex items-center gap-2 glass px-5 py-2.5 rounded-xl text-sm font-semibold text-accent border border-accent/20 hover:border-accent/40 hover:bg-accent/5 transition-all"
          >
            View Results Dashboard <ArrowRight className="w-4 h-4" />
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

export default FutureScopePage;
