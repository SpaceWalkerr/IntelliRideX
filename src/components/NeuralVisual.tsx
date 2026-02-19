import { motion } from "framer-motion";

const nodes = [
  { x: 50, y: 30, delay: 0 },
  { x: 80, y: 60, delay: 0.2 },
  { x: 30, y: 70, delay: 0.4 },
  { x: 65, y: 45, delay: 0.1 },
  { x: 40, y: 20, delay: 0.3 },
  { x: 75, y: 80, delay: 0.5 },
  { x: 20, y: 50, delay: 0.15 },
  { x: 55, y: 75, delay: 0.35 },
  { x: 85, y: 25, delay: 0.25 },
  { x: 45, y: 55, delay: 0.45 },
];

const connections = [
  [0, 3], [0, 4], [1, 3], [1, 5], [2, 6], [2, 7],
  [3, 8], [4, 8], [5, 7], [6, 9], [7, 9], [3, 9],
];

const NeuralVisual = () => (
  <motion.div
    className="relative w-full h-full min-h-[400px]"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 1, delay: 0.5 }}
  >
    {/* Glow ring */}
    <motion.div
      className="absolute inset-8 rounded-full border border-primary/20"
      animate={{ rotate: 360 }}
      transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      style={{ boxShadow: "0 0 60px hsl(var(--primary) / 0.1)" }}
    />
    <motion.div
      className="absolute inset-16 rounded-full border border-accent/10"
      animate={{ rotate: -360 }}
      transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
    />

    <svg viewBox="0 0 100 100" className="w-full h-full">
      {/* Connection lines */}
      {connections.map(([a, b], i) => (
        <motion.line
          key={`line-${i}`}
          x1={nodes[a].x}
          y1={nodes[a].y}
          x2={nodes[b].x}
          y2={nodes[b].y}
          stroke="hsl(var(--primary) / 0.2)"
          strokeWidth="0.3"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.8 + i * 0.05 }}
        />
      ))}

      {/* Traveling pulses */}
      {connections.slice(0, 6).map(([a, b], i) => (
        <motion.circle
          key={`pulse-${i}`}
          r="0.8"
          fill="hsl(var(--accent))"
          filter="url(#glow)"
          initial={{ opacity: 0 }}
          animate={{
            cx: [nodes[a].x, nodes[b].x],
            cy: [nodes[a].y, nodes[b].y],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 2 + i * 0.3,
            repeat: Infinity,
            delay: i * 0.8,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Nodes */}
      {nodes.map((node, i) => (
        <motion.circle
          key={`node-${i}`}
          cx={node.x}
          cy={node.y}
          r="1.5"
          fill="hsl(var(--primary))"
          filter="url(#glow)"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 + node.delay }}
        />
      ))}

      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
    </svg>

  </motion.div>
);

export default NeuralVisual;
