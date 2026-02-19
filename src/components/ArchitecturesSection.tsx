import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layers, ScanLine, Grid3X3 } from "lucide-react";

/* ─── Types ─────────────────────────────────────────────────────────────── */

type ArchId = "cnn" | "transformer" | "lidar";

/* ─── Architecture meta ─────────────────────────────────────────────────── */

const architectures: {
  id: ArchId;
  label: string;
  icon: React.ElementType;
  color: string;
  tagline: string;
  description: string;
  bullets: { heading: string; detail: string }[];
  examples: string[];
}[] = [
  {
    id: "cnn",
    label: "CNN",
    icon: Layers,
    color: "--primary",
    tagline: "Convolutional Neural Networks",
    description:
      "CNNs exploit spatial locality by sliding learned filters across an image. Stacked convolution and pooling layers progressively extract edges, textures, and semantic features — forming the backbone of most camera-based perception pipelines.",
    bullets: [
      { heading: "Local Feature Learning", detail: "Shared convolutional kernels detect edges and textures at every spatial location simultaneously." },
      { heading: "Hierarchical Representations", detail: "Early layers capture low-level gradients; deep layers encode semantic concepts like cars and pedestrians." },
      { heading: "Efficiency via Weight Sharing", detail: "Fewer parameters than fully-connected layers, enabling real-time inference on embedded hardware." },
    ],
    examples: ["ResNet-50", "EfficientDet", "YOLO v8", "VGGNet"],
  },
  {
    id: "transformer",
    label: "Transformer",
    icon: Grid3X3,
    color: "--secondary",
    tagline: "Vision Transformers & Attention",
    description:
      "Transformers treat an image as a sequence of patches and model global relationships via self-attention. By attending to distant scene regions simultaneously, they capture long-range context critical for occlusion handling and multi-object reasoning.",
    bullets: [
      { heading: "Global Self-Attention", detail: "Every patch queries every other patch — no inductive locality bias, so distant cues inform local predictions." },
      { heading: "Multi-Head Attention", detail: "Parallel attention heads specialize: one tracks vehicles, another tracks road markings, another tracks motion." },
      { heading: "Scalable Pre-training", detail: "Transformer encoders fine-tuned from large vision-language models transfer robustly to rare AV scenarios." },
    ],
    examples: ["ViT", "DETR", "BEVFormer", "UniAD"],
  },
  {
    id: "lidar",
    label: "LiDAR Nets",
    icon: ScanLine,
    color: "--accent",
    tagline: "3D Point-Cloud Networks",
    description:
      "LiDAR sensors return sparse 3D point clouds rather than dense pixel grids. Specialized networks voxelize or pillarize this data, apply sparse 3D convolutions in range space, and project to a Bird's-Eye View (BEV) for unified detection and tracking.",
    bullets: [
      { heading: "Voxel & Pillar Encoding", detail: "PointPillars discretizes points into vertical columns (pillars) — orders-of-magnitude faster than full 3D vox grids." },
      { heading: "Sparse 3D Convolutions", detail: "Only occupied voxels are processed, exploiting the natural sparsity of LiDAR returns for efficiency." },
      { heading: "BEV Projection", detail: "Bird's-Eye View feature maps fuse camera and LiDAR cues on a shared ground-plane canvas." },
    ],
    examples: ["PointNet++", "PointPillars", "VoxelNet", "BEVFusion"],
  },
];

/* ─── Diagrams ──────────────────────────────────────────────────────────── */

/* CNN diagram — animated conv layers */
const CNNDiagram = () => {
  const layers = [
    { w: 64, h: 64, depth: 4,  label: "Input\n224×224", color: "hsl(var(--primary) / 0.25)" },
    { w: 48, h: 48, depth: 8,  label: "Conv 1\n112×112", color: "hsl(var(--primary) / 0.40)" },
    { w: 34, h: 34, depth: 12, label: "Conv 2\n56×56",   color: "hsl(var(--primary) / 0.55)" },
    { w: 22, h: 22, depth: 14, label: "Conv 3\n28×28",   color: "hsl(var(--primary) / 0.70)" },
    { w: 13, h: 13, depth: 14, label: "Conv 4\n14×14",   color: "hsl(var(--primary) / 0.85)" },
    { w: 6,  h: 26, depth: 2,  label: "FC\nOutput",      color: "hsl(var(--accent) / 0.80)" },
  ];

  const totalW = 340;
  const centerY = 110;
  const gap = 12;

  // x positions
  let cursor = 18;
  const positions: number[] = [];
  layers.forEach((l, i) => {
    positions.push(cursor);
    cursor += l.w + (i < layers.length - 1 ? gap + l.depth * 0.6 : 0);
  });

  return (
    <svg viewBox={`0 0 ${totalW} 220`} className="w-full h-full" style={{ overflow: "visible" }}>
      <defs>
        <filter id="cnn-glow">
          <feGaussianBlur stdDeviation="2" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Connecting lines */}
      {layers.slice(0, -1).map((l, i) => {
        const x1 = positions[i] + l.w + l.depth * 0.5;
        const x2 = positions[i + 1];
        return (
          <motion.line
            key={`conn-${i}`}
            x1={x1} y1={centerY}
            x2={x2} y2={centerY}
            stroke="hsl(var(--primary) / 0.2)"
            strokeWidth="1"
            strokeDasharray="3 3"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 + i * 0.15 }}
          />
        );
      })}

      {/* Feature map blocks (3-D isometric-ish) */}
      {layers.map((l, i) => {
        const x = positions[i];
        const y = centerY - l.h / 2;
        const d = l.depth * 0.55;

        return (
          <motion.g
            key={`layer-${i}`}
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            style={{ originX: `${x + l.w / 2}px`, originY: `${centerY}px` }}
            transition={{ duration: 0.45, delay: i * 0.13, ease: "backOut" }}
            filter="url(#cnn-glow)"
          >
            {/* depth face (top) */}
            <polygon
              points={`${x},${y} ${x + d},${y - d * 0.5} ${x + l.w + d},${y - d * 0.5} ${x + l.w},${y}`}
              fill={l.color}
              stroke="hsl(var(--foreground) / 0.08)"
              strokeWidth="0.5"
            />
            {/* depth face (right) */}
            <polygon
              points={`${x + l.w},${y} ${x + l.w + d},${y - d * 0.5} ${x + l.w + d},${y + l.h - d * 0.5} ${x + l.w},${y + l.h}`}
              fill={l.color}
              stroke="hsl(var(--foreground) / 0.08)"
              strokeWidth="0.5"
              style={{ filter: "brightness(0.75)" }}
            />
            {/* front face */}
            <rect
              x={x} y={y}
              width={l.w} height={l.h}
              fill={l.color}
              rx="2"
              stroke="hsl(var(--foreground) / 0.10)"
              strokeWidth="0.5"
              style={{ filter: "brightness(1.1)" }}
            />
          </motion.g>
        );
      })}

      {/* Labels */}
      {layers.map((l, i) => {
        const x = positions[i] + l.w / 2;
        const lines = l.label.split("\n");
        return (
          <motion.g key={`lbl-${i}`}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.5 + i * 0.13 }}>
            {lines.map((line, li) => (
              <text
                key={li}
                x={x} y={centerY + l.h / 2 + 16 + li * 11}
                textAnchor="middle"
                fontSize="8"
                fill="hsl(var(--muted-foreground))"
              >{line}</text>
            ))}
          </motion.g>
        );
      })}

      {/* Animated kernel scan on first layer */}
      <motion.rect
        x={positions[0]} y={centerY - 24}
        width={18} height={18}
        rx="2"
        fill="none"
        stroke="hsl(var(--accent))"
        strokeWidth="1.5"
        animate={{ x: [positions[0], positions[0] + 46, positions[0], positions[0] + 46, positions[0]] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      <motion.text
        x={positions[0] + 9} y={centerY - 30}
        textAnchor="middle" fontSize="7"
        fill="hsl(var(--accent))"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >kernel</motion.text>
    </svg>
  );
};

/* Transformer diagram — patch tokenization + attention */
const TransformerDiagram = () => {
  const patchCols = 5;
  const patchRows = 4;
  const patchSize = 18;
  const gap = 3;
  const startX = 20;
  const startY = 24;

  const patches: { cx: number; cy: number; pi: number }[] = [];
  for (let r = 0; r < patchRows; r++) {
    for (let c = 0; c < patchCols; c++) {
      patches.push({
        cx: startX + c * (patchSize + gap) + patchSize / 2,
        cy: startY + r * (patchSize + gap) + patchSize / 2,
        pi: r * patchCols + c,
      });
    }
  }

  // attention head target positions (right panel)
  const headColors = ["hsl(var(--secondary))", "hsl(var(--primary))", "hsl(var(--accent))"];
  const headCx = [230, 258, 286];
  const headCy = [80, 55, 80];

  // which patches each head "attends" to
  const attentionLinks = [
    { from: 7,  to: headColors[0], hx: headCx[0], hy: headCy[0] },
    { from: 12, to: headColors[0], hx: headCx[0], hy: headCy[0] },
    { from: 3,  to: headColors[1], hx: headCx[1], hy: headCy[1] },
    { from: 17, to: headColors[1], hx: headCx[1], hy: headCy[1] },
    { from: 9,  to: headColors[2], hx: headCx[2], hy: headCy[2] },
    { from: 11, to: headColors[2], hx: headCx[2], hy: headCy[2] },
  ];

  return (
    <svg viewBox="0 0 340 220" className="w-full h-full" style={{ overflow: "visible" }}>
      <defs>
        <filter id="tr-glow">
          <feGaussianBlur stdDeviation="2" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Image patches */}
      {patches.map(({ cx, cy, pi }) => (
        <motion.rect
          key={`patch-${pi}`}
          x={cx - patchSize / 2} y={cy - patchSize / 2}
          width={patchSize} height={patchSize}
          rx="2"
          fill={`hsl(var(--secondary) / ${0.06 + (pi % 5) * 0.05})`}
          stroke="hsl(var(--secondary) / 0.20)"
          strokeWidth="0.5"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: pi * 0.025, ease: "backOut" }}
        />
      ))}

      {/* Patch label */}
      <motion.text x={startX + (patchCols * (patchSize + gap)) / 2} y={startY + patchRows * (patchSize + gap) + 14}
        textAnchor="middle" fontSize="8" fill="hsl(var(--muted-foreground))"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
        Image Patches (tokens)
      </motion.text>

      {/* Arrow: patches → attention */}
      <motion.line
        x1={startX + patchCols * (patchSize + gap)} y1={startY + (patchRows * (patchSize + gap)) / 2}
        x2={170} y2={90}
        stroke="hsl(var(--secondary) / 0.3)" strokeWidth="1" strokeDasharray="4 3"
        initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.9 }}
      />
      <motion.text x={153} y={68}
        textAnchor="middle" fontSize="7" fill="hsl(var(--secondary) / 0.6)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
        Linear Projection
      </motion.text>

      {/* Attention lines (patch → head) */}
      {attentionLinks.map(({ from, to, hx, hy }, li) => (
        <motion.line
          key={`attn-${li}`}
          x1={patches[from].cx + patchSize / 2} y1={patches[from].cy}
          x2={hx} y2={hy}
          stroke={to}
          strokeWidth="0.8"
          strokeOpacity="0.45"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.7, delay: 1.1 + li * 0.1 }}
        />
      ))}

      {/* Multi-head circles */}
      {headColors.map((hc, hi) => (
        <motion.g key={`head-${hi}`}
          initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          style={{ originX: `${headCx[hi]}px`, originY: `${headCy[hi]}px` }}
          transition={{ duration: 0.45, delay: 1.0 + hi * 0.12, ease: "backOut" }}
          filter="url(#tr-glow)"
        >
          <circle cx={headCx[hi]} cy={headCy[hi]} r={14} fill={hc.replace(")", " / 0.15)")} stroke={hc.replace(")", " / 0.5)")} strokeWidth="1" />
          <text x={headCx[hi]} y={headCy[hi] + 3} textAnchor="middle" fontSize="7" fill={hc}>H{hi + 1}</text>
        </motion.g>
      ))}
      <motion.text x={258} y={108} textAnchor="middle" fontSize="8" fill="hsl(var(--muted-foreground))"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
        Multi-Head Attention
      </motion.text>

      {/* Concat arrow → output */}
      <motion.line
        x1={258} y1={114} x2={258} y2={145}
        stroke="hsl(var(--secondary) / 0.35)" strokeWidth="1" strokeDasharray="4 3"
        initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.4, delay: 1.6 }}
      />

      {/* Output box */}
      <motion.rect
        x={222} y={145} width={72} height={22} rx="4"
        fill="hsl(var(--secondary) / 0.12)"
        stroke="hsl(var(--secondary) / 0.35)"
        strokeWidth="1"
        initial={{ opacity: 0, scaleY: 0 }} animate={{ opacity: 1, scaleY: 1 }}
        style={{ originY: "145px" }}
        transition={{ duration: 0.35, delay: 1.7 }}
      />
      <motion.text x={258} y={160} textAnchor="middle" fontSize="8" fill="hsl(var(--secondary))"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.85 }}>
        Context-Aware Output
      </motion.text>

      {/* Pulsing attention weights */}
      {attentionLinks.map(({ from, to }, li) => (
        <motion.circle
          key={`pulse-${li}`}
          r="3"
          fill={to}
          initial={{ opacity: 0 }}
          animate={{
            cx: [patches[from].cx + patchSize / 2, headCx[li % 3]],
            cy: [patches[from].cy, headCy[li % 3]],
            opacity: [0, 0.9, 0],
          }}
          transition={{ duration: 1.6, repeat: Infinity, delay: 1.5 + li * 0.4, ease: "easeInOut" }}
        />
      ))}
    </svg>
  );
};

/* LiDAR diagram — point cloud → pillars → BEV → detect */
const LiDARDiagram = () => {
  // scattered 3-D-looking points
  const rawPoints = [
    [28,55],[42,40],[55,65],[38,75],[62,48],[35,88],[72,60],[50,82],[45,30],[68,75],
    [22,68],[60,35],[80,50],[30,45],[70,85],[48,58],[57,42],[25,78],[85,65],[40,55],
  ];

  // pillar columns
  const pillars = [
    { x: 140, w: 10, heights: [30, 20, 35, 15, 28] },
    { x: 155, w: 10, heights: [18, 32, 22, 40, 12] },
    { x: 170, w: 10, heights: [25, 15, 42, 20, 30] },
    { x: 185, w: 10, heights: [35, 28, 18, 25, 22] },
  ];
  const pillarBaseY = 130;

  // BEV grid cells
  const bevCells: { x: number; y: number; intensity: number }[] = [];
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      bevCells.push({ x: 238 + c * 14, y: 80 + r * 14, intensity: Math.random() * 0.5 + 0.1 });
    }
  }

  // detected box on BEV
  const detBox = { x: 248, y: 90, w: 28, h: 20 };

  return (
    <svg viewBox="0 0 340 220" className="w-full h-full" style={{ overflow: "visible" }}>
      <defs>
        <filter id="lidar-glow">
          <feGaussianBlur stdDeviation="2.5" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* ── Stage 1: Raw Point Cloud ── */}
      {rawPoints.map(([cx, cy], i) => (
        <motion.circle
          key={`pt-${i}`}
          cx={cx} cy={cy} r="2"
          fill="hsl(var(--accent))"
          filter="url(#lidar-glow)"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 1, 0.7], scale: 1 }}
          transition={{ duration: 0.4, delay: i * 0.04, repeat: Infinity, repeatDelay: 3.5 }}
        />
      ))}
      <motion.text x={52} y={155} textAnchor="middle" fontSize="8" fill="hsl(var(--muted-foreground))"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
        Raw Point Cloud
      </motion.text>
      <motion.text x={52} y={165} textAnchor="middle" fontSize="7" fill="hsl(var(--muted-foreground) / 0.6)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
        (LiDAR returns)
      </motion.text>

      {/* Arrow 1 */}
      <motion.line x1={101} y1={80} x2={128} y2={80}
        stroke="hsl(var(--accent) / 0.4)" strokeWidth="1.2" strokeDasharray="4 3"
        initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.0 }}
      />
      <motion.polygon points="128,77 133,80 128,83" fill="hsl(var(--accent) / 0.5)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }} />
      <motion.text x={115} y={73} textAnchor="middle" fontSize="7" fill="hsl(var(--accent) / 0.6)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}>
        Voxelize
      </motion.text>

      {/* ── Stage 2: Pillar Encoding ── */}
      {pillars.map((p, pi) =>
        p.heights.map((_h, hi) => {
          const hue = `hsl(var(--accent) / ${0.15 + hi * 0.1})`;
          const baseY = pillarBaseY - p.heights.slice(0, hi + 1).reduce((a, b) => a + b, 0);
          return (
            <motion.rect
              key={`pil-${pi}-${hi}`}
              x={p.x} y={baseY}
              width={p.w - 1} height={p.heights[hi]}
              fill={hue}
              stroke="hsl(var(--accent) / 0.25)"
              strokeWidth="0.4"
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{ scaleY: 1, opacity: 1 }}
              style={{ originY: `${pillarBaseY}px` }}
              transition={{ duration: 0.4, delay: 1.2 + pi * 0.12 + hi * 0.05 }}
            />
          );
        })
      )}
      <motion.text x={170} y={150} textAnchor="middle" fontSize="8" fill="hsl(var(--muted-foreground))"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}>
        Pillar Encoding
      </motion.text>
      <motion.text x={170} y={160} textAnchor="middle" fontSize="7" fill="hsl(var(--muted-foreground) / 0.6)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}>
        (sparse 3D conv)
      </motion.text>

      {/* Arrow 2 */}
      <motion.line x1={207} y1={80} x2={226} y2={80}
        stroke="hsl(var(--accent) / 0.4)" strokeWidth="1.2" strokeDasharray="4 3"
        initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.4, delay: 1.8 }}
      />
      <motion.polygon points="226,77 231,80 226,83" fill="hsl(var(--accent) / 0.5)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.1 }} />
      <motion.text x={217} y={73} textAnchor="middle" fontSize="7" fill="hsl(var(--accent) / 0.6)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.9 }}>
        Project
      </motion.text>

      {/* ── Stage 3: BEV Grid ── */}
      {bevCells.map((cell, ci) => (
        <motion.rect
          key={`bev-${ci}`}
          x={cell.x} y={cell.y}
          width={13} height={13}
          rx="1"
          fill={`hsl(var(--accent) / ${cell.intensity})`}
          stroke="hsl(var(--accent) / 0.12)"
          strokeWidth="0.4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 2.0 + ci * 0.03 }}
        />
      ))}
      <motion.text x={260} y={160} textAnchor="middle" fontSize="8" fill="hsl(var(--muted-foreground))"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }}>
        BEV Feature Map
      </motion.text>

      {/* Detected bounding box */}
      <motion.rect
        x={detBox.x} y={detBox.y}
        width={detBox.w} height={detBox.h}
        rx="1.5" fill="none"
        stroke="hsl(var(--accent))"
        strokeWidth="1.5"
        filter="url(#lidar-glow)"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.6, delay: 2.7 }}
      />
      <motion.text x={detBox.x + detBox.w / 2} y={detBox.y - 4}
        textAnchor="middle" fontSize="7" fill="hsl(var(--accent))"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.0 }}>
        Car 0.94
      </motion.text>
    </svg>
  );
};

const diagrams: Record<ArchId, React.ReactNode> = {
  cnn: <CNNDiagram />,
  transformer: <TransformerDiagram />,
  lidar: <LiDARDiagram />,
};

/* ─── Section ───────────────────────────────────────────────────────────── */

const ArchitecturesSection = () => {
  const [active, setActive] = useState<ArchId>("cnn");
  const arch = architectures.find((a) => a.id === active)!;

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[140px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-accent/5 blur-[120px]" />
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
            <Layers className="w-4 h-4" />
            Deep Learning Architectures
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            How Machines{" "}
            <span className="text-gradient-primary">Learn to See</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Three architecture families power modern autonomous perception. Select
            one to explore its internal structure and real-world role.
          </p>
        </motion.div>

        {/* Tab selector */}
        <div className="flex justify-center mb-10">
          <div className="glass inline-flex gap-1 p-1 rounded-xl">
            {architectures.map((a) => {
              const Icon = a.icon;
              const isActive = a.id === active;
              return (
                <motion.button
                  key={a.id}
                  onClick={() => setActive(a.id)}
                  className="relative flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors"
                  style={isActive ? { color: `hsl(var(${a.color}))` } : { color: "hsl(var(--muted-foreground))" }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="arch-tab-bg"
                      className="absolute inset-0 rounded-lg"
                      style={{ background: `hsl(var(${a.color}) / 0.12)`, border: `1px solid hsl(var(${a.color}) / 0.25)` }}
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <Icon className="w-4 h-4 relative z-10" />
                  <span className="relative z-10">{a.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Main content grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            className="grid lg:grid-cols-2 gap-8 items-start"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
          >
            {/* ── Left: Diagram ── */}
            <div className="relative glass p-4 sm:p-6 min-h-[280px] flex flex-col">
              {/* top accent */}
              <div
                className="absolute top-0 left-0 right-0 h-[2px] rounded-t-xl"
                style={{ background: `linear-gradient(90deg, transparent, hsl(var(${arch.color})), transparent)` }}
              />

              <div className="flex items-center justify-between mb-4">
                <span
                  className="text-xs font-semibold uppercase tracking-widest"
                  style={{ color: `hsl(var(${arch.color}))` }}
                >
                  Architecture Diagram
                </span>
                <span className="text-xs text-muted-foreground glass px-2 py-0.5 rounded-full">
                  {arch.tagline}
                </span>
              </div>

              <div className="flex-1 flex items-center justify-center min-h-[220px]">
                {diagrams[active]}
              </div>
            </div>

            {/* ── Right: Description + bullets + chips ── */}
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold mb-3">{arch.tagline}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">{arch.description}</p>
              </div>

              {/* Bullet points */}
              <div className="space-y-3">
                {arch.bullets.map((b, bi) => (
                  <motion.div
                    key={b.heading}
                    className="glass p-4 flex gap-3 items-start"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.35, delay: bi * 0.1 }}
                  >
                    <div
                      className="mt-0.5 w-2 h-2 rounded-full shrink-0"
                      style={{ background: `hsl(var(${arch.color}))`, boxShadow: `0 0 6px hsl(var(${arch.color}) / 0.6)` }}
                    />
                    <div>
                      <p className="text-sm font-semibold mb-0.5">{b.heading}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">{b.detail}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Example model chips */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2.5">
                  Notable Models
                </p>
                <div className="flex flex-wrap gap-2">
                  {arch.examples.map((ex, ei) => (
                    <motion.span
                      key={ex}
                      className="px-3 py-1 text-xs font-medium rounded-full border"
                      style={{
                        color: `hsl(var(${arch.color}))`,
                        borderColor: `hsl(var(${arch.color}) / 0.3)`,
                        background: `hsl(var(${arch.color}) / 0.07)`,
                      }}
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.25, delay: 0.3 + ei * 0.07 }}
                    >
                      {ex}
                    </motion.span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default ArchitecturesSection;
