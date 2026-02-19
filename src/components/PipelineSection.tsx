import { motion } from "framer-motion";
import { Eye, Layers, Route, Radio, ArrowRight } from "lucide-react";
import { useState } from "react";

const steps = [
  {
    title: "Sensors",
    icon: Radio,
    description: "LiDAR, cameras, and radar capture rich environmental data for real-time scene understanding.",
    color: "--accent",
  },
  {
    title: "Perception",
    icon: Eye,
    description: "Deep learning models detect objects, pedestrians, and traffic signs from raw sensor inputs.",
    color: "--primary",
  },
  {
    title: "Segmentation",
    icon: Layers,
    description: "Semantic and instance segmentation partition scenes into meaningful regions for analysis.",
    color: "--secondary",
  },
  {
    title: "Planning",
    icon: Route,
    description: "Motion planning algorithms generate safe, optimal trajectories for autonomous navigation.",
    color: "--glow-accent",
  },
];

const PipelineCard = ({
  step,
  index,
}: {
  step: (typeof steps)[0];
  index: number;
}) => {
  const [hovered, setHovered] = useState(false);
  const Icon = step.icon;

  return (
    <motion.div
      className="relative flex-1 min-w-[200px]"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
    >
      <motion.div
        className="glass p-6 cursor-pointer h-full flex flex-col items-center text-center gap-4 transition-colors"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        animate={{
          scale: hovered ? 1.05 : 1,
          borderColor: hovered
            ? `hsl(var(${step.color}) / 0.3)`
            : "hsl(var(--foreground) / 0.08)",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {/* Step number */}
        <span className="text-xs font-semibold text-muted-foreground tracking-widest uppercase">
          Step {index + 1}
        </span>

        {/* Icon */}
        <motion.div
          className="w-14 h-14 rounded-2xl flex items-center justify-center"
          style={{
            background: `hsl(var(${step.color}) / 0.12)`,
          }}
          animate={{ rotate: hovered ? 8 : 0 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <Icon
            className="w-7 h-7"
            style={{ color: `hsl(var(${step.color}))` }}
          />
        </motion.div>

        {/* Title */}
        <h3 className="text-lg font-bold">{step.title}</h3>

        {/* Description — expands on hover */}
        <motion.p
          className="text-sm text-muted-foreground leading-relaxed overflow-hidden"
          initial={{ height: 0, opacity: 0 }}
          animate={{
            height: hovered ? "auto" : 0,
            opacity: hovered ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
        >
          {step.description}
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

const PipelineSection = () => (
  <section className="relative py-24 overflow-hidden">
    <div className="container mx-auto px-6">
      {/* Section heading */}
      <motion.div
        className="text-center mb-16 space-y-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <span className="glass inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary">
          Research Pipeline
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          From <span className="text-gradient-primary">Sensors</span> to{" "}
          <span className="text-gradient-primary">Decisions</span>
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          The autonomous driving stack processes raw data through a series of
          deep-learning stages to produce safe driving behaviour.
        </p>
      </motion.div>

      {/* Pipeline flow */}
      <div className="flex flex-col md:flex-row items-stretch gap-4">
        {steps.map((step, i) => (
          <div key={step.title} className="flex items-center flex-1 min-w-0">
            <PipelineCard step={step} index={i} />

            {/* Arrow connector (hidden on last card & mobile) */}
            {i < steps.length - 1 && (
              <motion.div
                className="hidden md:flex items-center justify-center px-2 text-muted-foreground/40"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.15 }}
              >
                <ArrowRight className="w-5 h-5" />
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default PipelineSection;
