import { motion } from "framer-motion";
import { useState } from "react";
import { Box, Layers, GitBranch, Brain } from "lucide-react";

const techniques = [
  {
    title: "3D Object Detection",
    icon: Box,
    description:
      "Identifies and localises vehicles, pedestrians, and obstacles in 3D space using point-cloud and multi-modal fusion networks.",
    useCase: "Used in LiDAR-camera fusion systems like PointPillars and BEVFusion for real-time obstacle avoidance.",
    color: "--primary",
  },
  {
    title: "Semantic Segmentation",
    icon: Layers,
    description:
      "Assigns a class label to every pixel, enabling the vehicle to distinguish roads, sidewalks, buildings, and vegetation.",
    useCase: "Powers drivable-area detection in Waymo and Tesla's vision stack using DeepLab and SegFormer architectures.",
    color: "--secondary",
  },
  {
    title: "Lane Detection",
    icon: GitBranch,
    description:
      "Detects lane markings and road boundaries under varying lighting, weather, and occlusion conditions.",
    useCase: "Enables highway autopilot and lane-keeping assist in production ADAS systems worldwide.",
    color: "--accent",
  },
  {
    title: "End-to-End Learning",
    icon: Brain,
    description:
      "Maps raw sensor input directly to driving commands, bypassing hand-engineered intermediate modules.",
    useCase: "Pioneered by NVIDIA's PilotNet; adopted in Tesla FSD for unified perception-to-control pipelines.",
    color: "--glow-accent",
  },
];

const FlipCard = ({
  tech,
  index,
}: {
  tech: (typeof techniques)[0];
  index: number;
}) => {
  const [flipped, setFlipped] = useState(false);
  const Icon = tech.icon;

  return (
    <motion.div
      className="perspective-[1000px] min-h-[320px]"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.12 }}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
    >
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 200, damping: 22 }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 glass flex flex-col items-center justify-center gap-5 p-6 text-center"
          style={{ backfaceVisibility: "hidden" }}
        >
          {/* Placeholder image area */}
          <div
            className="w-full h-28 rounded-xl flex items-center justify-center"
            style={{ background: `hsl(var(${tech.color}) / 0.08)` }}
          >
            <Icon
              className="w-12 h-12"
              style={{ color: `hsl(var(${tech.color}))` }}
            />
          </div>

          <h3 className="text-lg font-bold">{tech.title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {tech.description}
          </p>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 glass flex flex-col items-center justify-center gap-4 p-6 text-center"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <span
            className="text-xs font-semibold tracking-widest uppercase"
            style={{ color: `hsl(var(${tech.color}))` }}
          >
            Real-World Use
          </span>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {tech.useCase}
          </p>
          <div
            className="mt-2 w-10 h-1 rounded-full"
            style={{ background: `hsl(var(${tech.color}) / 0.5)` }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

const TechniquesSection = () => (
  <section className="relative py-24 overflow-hidden">
    <div className="container mx-auto px-6">
      {/* Heading */}
      <motion.div
        className="text-center mb-16 space-y-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <span className="glass inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary">
          Core Techniques
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Deep Learning for{" "}
          <span className="text-gradient-primary">Autonomous Driving</span>
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Hover each card to explore real-world applications of the key computer
          vision techniques surveyed in this paper.
        </p>
      </motion.div>

      {/* Cards grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {techniques.map((tech, i) => (
          <FlipCard key={tech.title} tech={tech} index={i} />
        ))}
      </div>
    </div>
  </section>
);

export default TechniquesSection;
