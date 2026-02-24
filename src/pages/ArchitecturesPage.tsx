import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  Layers, ScanLine, Grid3X3, Cpu, Zap, TrendingUp,
  CheckCircle2, XCircle, ChevronRight, Info,
  Activity, Network, GitCompare, BookOpen,
  Star, Sparkles, Target, Workflow, Table2,
  Rocket, GitBranch, Lightbulb, Calculator, Cog,
} from "lucide-react";

/* ══════════════════════════════════════════════════════════════════════════
   ARCHITECTURE DATA
══════════════════════════════════════════════════════════════════════════ */

type ArchId = "cnn" | "transformer" | "lidar";

interface HowItWorksStep {
  step: number;
  title: string;
  description: string;
  technical: string;
}

interface LayerDetail {
  name: string;
  operation: string;
  outputShape: string;
  parameters: string;
}

interface Architecture {
  id: ArchId;
  label: string;
  fullName: string;
  icon: React.ElementType;
  color: string;
  tagline: string;
  description: string;
  detailedDescription: string;
  year: string;
  papers: number;
  mathFoundation: string;
  howItWorks: HowItWorksStep[];
  layerBreakdown: LayerDetail[];
  pros: string[];
  cons: string[];
  useCases: string[];
  keyInnovations: { title: string; description: string; technical: string }[];
  variants: { name: string; description: string; improvement: string }[];
  examples: { name: string; year: number; metric: string; description: string }[];
  performance: { accuracy: number; speed: number; memory: number; scalability: number };
  deploymentConsiderations: string[];
}

const architectures: Architecture[] = [
  {
    id: "cnn",
    label: "CNN",
    fullName: "Convolutional Neural Networks",
    icon: Layers,
    color: "--primary",
    tagline: "The Foundation of Visual Perception",
    year: "2012",
    papers: 50000,
    description:
      "CNNs revolutionized computer vision by exploiting spatial locality through learned convolutional filters. They progressively extract hierarchical features from raw pixels — edges, textures, parts, and objects — forming the backbone of virtually all camera-based perception systems in autonomous vehicles.",
    detailedDescription:
      "Convolutional Neural Networks (CNNs) are a class of deep neural networks specifically designed to process data with grid-like topology, such as images. The key insight behind CNNs is that visual patterns are local and hierarchical — a car's wheel can be recognized by combining smaller patterns (circular shape, tire texture), which themselves are combinations of even simpler features (edges, gradients). CNNs exploit three fundamental ideas: (1) Local Connectivity — neurons only connect to a small region of the input, (2) Weight Sharing — the same filter is applied across the entire image, and (3) Spatial Pooling — progressive downsampling creates translation invariance. In autonomous vehicles, CNNs process camera feeds at 30-60 FPS, detecting vehicles, pedestrians, traffic signs, and lane markings in real-time. Modern architectures like ResNet and EfficientNet serve as feature extractors (backbones) for more complex tasks like object detection and semantic segmentation.",
    mathFoundation: "The convolution operation is defined as (I * K)(i,j) = Σₘ Σₙ I(i+m, j+n) · K(m,n), where I is the input image, K is the kernel (filter), and the output is a feature map. For a 3×3 kernel on a 224×224 RGB image, each output pixel is computed from 3×3×3=27 input values. With stride s and padding p, output size = ⌊(W - K + 2P)/S⌋ + 1.",
    howItWorks: [
      { step: 1, title: "Input Layer", description: "Raw image pixels (e.g., 224×224×3 RGB) enter the network", technical: "Pixel values normalized to [0,1] or [-1,1]. Batch normalization may be applied for faster convergence." },
      { step: 2, title: "Convolutional Layers", description: "Learnable filters slide across the image detecting patterns", technical: "Each filter learns a specific pattern (e.g., vertical edge). ReLU activation: f(x) = max(0,x) introduces non-linearity after each conv." },
      { step: 3, title: "Pooling Layers", description: "Spatial downsampling reduces computation and adds invariance", technical: "Max pooling takes maximum value in each 2×2 region, halving spatial dimensions while preserving strongest activations." },
      { step: 4, title: "Feature Hierarchy", description: "Early layers detect edges; deep layers detect objects", technical: "Layer 1: edges, gradients. Layer 2-3: textures, patterns. Layer 4+: object parts, semantic concepts." },
      { step: 5, title: "Fully Connected / Head", description: "Flattened features feed into task-specific output layers", technical: "For classification: softmax over N classes. For detection: bounding box regression + classification per anchor." },
    ],
    layerBreakdown: [
      { name: "Conv1", operation: "7×7 conv, 64 filters, stride 2", outputShape: "112×112×64", parameters: "9.4K" },
      { name: "Pool1", operation: "3×3 max pool, stride 2", outputShape: "56×56×64", parameters: "0" },
      { name: "Conv2_x", operation: "3×3 conv ×2, 64 filters", outputShape: "56×56×64", parameters: "74K" },
      { name: "Conv3_x", operation: "3×3 conv ×2, 128 filters", outputShape: "28×28×128", parameters: "230K" },
      { name: "Conv4_x", operation: "3×3 conv ×2, 256 filters", outputShape: "14×14×256", parameters: "920K" },
      { name: "Conv5_x", operation: "3×3 conv ×2, 512 filters", outputShape: "7×7×512", parameters: "3.7M" },
      { name: "Global Avg Pool", operation: "7×7 → 1×1", outputShape: "1×1×512", parameters: "0" },
      { name: "FC", operation: "512 → 1000 (ImageNet)", outputShape: "1000", parameters: "512K" },
    ],
    pros: [
      "Highly efficient on GPU hardware with optimized CUDA kernels — cuDNN provides 10×+ speedup",
      "Well-understood training dynamics: learning rate schedules, weight decay, dropout all well-studied",
      "Excellent for local pattern recognition — ideal for texture, edge, and shape detection",
      "Mature ecosystem with pretrained backbones (ResNet, EfficientNet, ConvNeXt) on ImageNet",
      "Real-time inference achievable on embedded platforms (Jetson, NPUs) via TensorRT optimization",
      "Translation equivariance: same object detected regardless of position in image",
    ],
    cons: [
      "Limited receptive field requires very deep stacking (100+ layers) for global context",
      "Struggles with long-range dependencies — distant pixels don't directly interact",
      "Fixed-size kernels may miss multi-scale objects without Feature Pyramid Networks",
      "No explicit modeling of geometric relationships or 3D structure",
      "Large models require significant GPU memory for training (ResNet-152: ~10GB batch 32)",
    ],
    useCases: [
      "Real-time 2D object detection (YOLO, SSD, RetinaNet) — 30-300 FPS on modern GPUs",
      "Feature extraction backbone for downstream tasks (Faster R-CNN, Mask R-CNN)",
      "Image classification and fine-grained recognition (vehicle make/model)",
      "Semantic segmentation with encoder-decoder architectures (U-Net, DeepLabV3+)",
      "Traffic sign recognition and lane marking detection",
    ],
    keyInnovations: [
      { title: "Residual Connections (ResNet)", description: "Skip connections enabling training of 100+ layer networks without gradient vanishing", technical: "y = F(x) + x, where F(x) is the residual mapping. Gradients flow directly through shortcut, solving vanishing gradient problem." },
      { title: "Batch Normalization", description: "Normalizes layer inputs for faster, more stable training", technical: "BN(x) = γ · (x - μ_B) / √(σ²_B + ε) + β, where μ_B and σ²_B are batch statistics. Reduces internal covariate shift." },
      { title: "Depthwise Separable Conv", description: "Factorized convolutions reducing parameters by 8-9× for mobile deployment", technical: "Standard: K×K×Cin×Cout params. Depthwise-separable: K×K×Cin + Cin×Cout. MobileNet uses this extensively." },
      { title: "Feature Pyramid Networks (FPN)", description: "Multi-scale feature extraction for detecting objects of various sizes", technical: "Top-down pathway with lateral connections combines high-res low-level features with semantic high-level features." },
      { title: "Squeeze-and-Excitation (SE)", description: "Channel attention mechanism to recalibrate feature responses", technical: "Global avg pool → FC → ReLU → FC → Sigmoid → Scale channels. Learns channel interdependencies." },
    ],
    variants: [
      { name: "ResNet", description: "Deep residual networks with skip connections", improvement: "Enabled 152-layer networks, 3.57% ImageNet top-5 error" },
      { name: "DenseNet", description: "Dense connections between all layers in a block", improvement: "Better gradient flow, feature reuse, 40% fewer parameters" },
      { name: "EfficientNet", description: "Compound scaling of depth, width, and resolution", improvement: "8× smaller than GPipe with equal accuracy, NAS-optimized" },
      { name: "ConvNeXt", description: "Modernized ResNet with transformer-inspired design choices", improvement: "87.8% ImageNet acc, competitive with ViT while being pure CNN" },
      { name: "RegNet", description: "Optimized design space with simple scaling rules", improvement: "Consistent performance across compute regimes, easy to scale" },
    ],
    examples: [
      { name: "ResNet-50", year: 2015, metric: "76.1% ImageNet", description: "50-layer residual network, standard backbone for detection/segmentation" },
      { name: "EfficientDet-D7", year: 2020, metric: "55.1 mAP COCO", description: "Compound-scaled detector with BiFPN, state-of-the-art efficiency" },
      { name: "YOLOv8-X", year: 2023, metric: "53.9 mAP @ 280 FPS", description: "Latest YOLO iteration with anchor-free detection and improved head" },
      { name: "ConvNeXt-XL", year: 2022, metric: "87.8% ImageNet", description: "Modernized CNN architecture rivaling Vision Transformers" },
    ],
    performance: { accuracy: 82, speed: 95, memory: 85, scalability: 70 },
    deploymentConsiderations: [
      "TensorRT optimization can achieve 2-5× speedup on NVIDIA hardware",
      "INT8 quantization reduces memory by 4× with <1% accuracy loss",
      "Batch size significantly impacts throughput — larger batches better utilize GPU parallelism",
      "Input resolution directly impacts compute: 2× resolution ≈ 4× compute",
      "Consider FP16 mixed precision for 2× memory savings during training",
    ],
  },
  {
    id: "transformer",
    label: "Transformer",
    fullName: "Vision Transformers & Attention",
    icon: Grid3X3,
    color: "--secondary",
    tagline: "Global Attention for Scene Understanding",
    year: "2020",
    papers: 15000,
    description:
      "Vision Transformers treat images as sequences of patches and leverage self-attention to model global relationships. Every patch can attend to every other patch, capturing long-range dependencies that CNNs miss. This paradigm shift has led to state-of-the-art results across detection, segmentation, and multi-task learning.",
    detailedDescription:
      "Vision Transformers (ViT) fundamentally reimagined how neural networks process images. Instead of local convolutions, ViT splits an image into fixed-size patches (typically 16×16 or 14×14 pixels), linearly embeds each patch into a vector, and processes the sequence with standard Transformer encoder blocks. The key mechanism is Self-Attention, where each patch computes attention weights with every other patch, allowing the model to capture global relationships from the very first layer. For a 224×224 image with 16×16 patches, this creates a sequence of 196 tokens (plus a learnable [CLS] token for classification). In autonomous driving, transformers excel at complex scene understanding: BEVFormer uses spatial cross-attention to transform multi-camera views into a unified Bird's-Eye View, while DETR eliminates hand-crafted components like Non-Maximum Suppression by treating object detection as a set prediction problem. The UniAD architecture demonstrates how transformers can unify perception, prediction, and planning into a single end-to-end model.",
    mathFoundation: "Self-Attention: Attention(Q,K,V) = softmax(QK^T / √d_k) · V, where Q=XW_Q, K=XW_K, V=XW_V are linear projections. For input X ∈ ℝ^(N×D), attention computes N×N similarity matrix — O(N²) complexity. Multi-head attention: MultiHead(Q,K,V) = Concat(head_1,...,head_h)W_O where head_i = Attention(QW_i^Q, KW_i^K, VW_i^V).",
    howItWorks: [
      { step: 1, title: "Patch Embedding", description: "Image split into non-overlapping patches, each linearly projected", technical: "224×224 image → 196 patches of 16×16 → Linear projection to D-dim vectors (typically D=768). Learnable [CLS] token prepended." },
      { step: 2, title: "Positional Encoding", description: "Position information added since attention is permutation-invariant", technical: "Learnable 1D position embeddings added to patch embeddings. Alternatives: 2D sinusoidal, relative position bias (Swin)." },
      { step: 3, title: "Multi-Head Self-Attention", description: "Each patch attends to all other patches via Q-K-V mechanism", technical: "h=12 heads, each with d_k=64 dimensions. Attention weights computed via scaled dot-product: softmax(QK^T/√64)." },
      { step: 4, title: "Feed-Forward Network", description: "MLP applied independently to each token position", technical: "Two linear layers with GELU activation: FFN(x) = GELU(xW_1 + b_1)W_2 + b_2. Hidden dim typically 4× embedding dim." },
      { step: 5, title: "Layer Normalization & Residuals", description: "Stabilize training and enable gradient flow", technical: "Pre-LN: y = x + Attention(LN(x)), y = y + FFN(LN(y)). LayerNorm normalizes across feature dimension per token." },
      { step: 6, title: "Classification Head", description: "[CLS] token output used for final prediction", technical: "MLP head on [CLS] token: Linear(D, num_classes). For detection: decoder queries attend to encoder features." },
    ],
    layerBreakdown: [
      { name: "Patch Embed", operation: "16×16 conv, stride 16, 768 out", outputShape: "196×768", parameters: "590K" },
      { name: "Pos Embed", operation: "Learnable 197×768", outputShape: "197×768", parameters: "151K" },
      { name: "Block 1-12", operation: "MHSA + FFN per block", outputShape: "197×768", parameters: "7M each" },
      { name: "MHSA", operation: "12 heads, 64 dim each", outputShape: "197×768", parameters: "2.4M" },
      { name: "FFN", operation: "768→3072→768", outputShape: "197×768", parameters: "4.7M" },
      { name: "LayerNorm", operation: "Normalize features", outputShape: "197×768", parameters: "1.5K" },
      { name: "MLP Head", operation: "[CLS] → 1000 classes", outputShape: "1000", parameters: "768K" },
    ],
    pros: [
      "Captures global context from the first layer — any patch can attend to any other patch",
      "Scales predictably with data and compute — performance improves log-linearly",
      "Multi-head attention enables parallel specialization (different heads learn different relationships)",
      "Excellent transfer learning from large pretrained models (ImageNet-21k, JFT-300M)",
      "Unified architecture for vision, language, and multimodal tasks (shared paradigm)",
      "Set-based detection (DETR) eliminates NMS and anchor design heuristics",
    ],
    cons: [
      "Quadratic complexity O(N²) with sequence length — limits high-resolution processing",
      "Requires large datasets (10M+ images) to match CNN performance from scratch",
      "Higher memory footprint during training — attention matrices grow quadratically",
      "Less inductive bias — needs more data to learn spatial structure that CNNs get for free",
      "Slower inference than optimized CNNs without specialized kernels (FlashAttention, etc.)",
    ],
    useCases: [
      "End-to-end object detection without NMS (DETR, Deformable-DETR, DINO)",
      "Bird's-Eye View perception from multi-camera input (BEVFormer, BEVDet)",
      "Unified multi-task autonomous driving (UniAD: detection + tracking + prediction + planning)",
      "Multi-modal sensor fusion (camera + LiDAR + radar in single architecture)",
      "Dense prediction tasks with hierarchical transformers (Swin-based segmentation)",
    ],
    keyInnovations: [
      { title: "Self-Attention Mechanism", description: "Global receptive field in O(1) layers via Query-Key-Value computation", technical: "Attention(Q,K,V) = softmax(QK^T/√d)V. Each token computes weighted sum of all values based on query-key similarity." },
      { title: "Positional Encoding", description: "Injects spatial structure into permutation-invariant attention", technical: "Learnable: E_pos ∈ ℝ^(N×D) added to patch embeddings. Sinusoidal: PE(pos,2i) = sin(pos/10000^(2i/d))." },
      { title: "Set-based Detection (DETR)", description: "Object detection as set prediction with Hungarian matching", technical: "N learnable object queries attend to encoder features. Bipartite matching loss assigns predictions to ground truth." },
      { title: "Deformable Attention", description: "Sparse attention sampling at learned locations for efficiency", technical: "Attend to K sampled points per query instead of all spatial locations. Reduces complexity from O(N²) to O(NK)." },
      { title: "Spatial Cross-Attention (BEVFormer)", description: "Projects multi-view camera features to Bird's-Eye View", technical: "BEV queries sample features from 2D images via camera geometry. Enables 3D reasoning from 2D inputs." },
    ],
    variants: [
      { name: "ViT (Vision Transformer)", description: "Original patch-based image transformer", improvement: "88.6% ImageNet with JFT-300M pretraining, proved transformers work for vision" },
      { name: "DeiT (Data-efficient ViT)", description: "Knowledge distillation from CNN teachers", improvement: "Matches ViT accuracy with ImageNet-1K only, no JFT pretraining needed" },
      { name: "Swin Transformer", description: "Hierarchical design with shifted windows", improvement: "Linear complexity O(N), builds feature pyramids, serves as general backbone" },
      { name: "DETR", description: "End-to-end object detection with transformer decoder", improvement: "Eliminates NMS, anchors, and hand-crafted components. Clean, simple design." },
      { name: "BEVFormer", description: "Spatial-temporal transformer for BEV perception", improvement: "State-of-the-art on nuScenes: 56.9 NDS from cameras alone" },
    ],
    examples: [
      { name: "ViT-H/14", year: 2020, metric: "88.6% ImageNet", description: "Huge ViT with 632M params, proved transformers scale for vision" },
      { name: "DETR", year: 2020, metric: "43.3 mAP COCO", description: "First end-to-end transformer detector, eliminated NMS and anchors" },
      { name: "BEVFormer", year: 2022, metric: "56.9 NDS nuScenes", description: "Unified spatio-temporal BEV representation from multi-camera input" },
      { name: "UniAD", year: 2023, metric: "SOTA Multi-Task", description: "Unified transformer for perception, prediction, and planning" },
    ],
    performance: { accuracy: 92, speed: 60, memory: 55, scalability: 95 },
    deploymentConsiderations: [
      "FlashAttention reduces memory from O(N²) to O(N) and speeds up 2-4×",
      "Window attention (Swin) enables processing of high-resolution images",
      "Knowledge distillation from large models improves small model performance",
      "Mixed precision (FP16/BF16) essential for training large transformers",
      "Model parallelism needed for very large models (1B+ parameters)",
    ],
  },
  {
    id: "lidar",
    label: "LiDAR Nets",
    fullName: "3D Point Cloud Networks",
    icon: ScanLine,
    color: "--accent",
    tagline: "Native 3D Perception from Point Clouds",
    year: "2017",
    papers: 8000,
    description:
      "LiDAR networks process sparse, unordered 3D point clouds directly, avoiding information loss from 2D projection. They voxelize or pillarize the point cloud, apply sparse 3D convolutions, and project to Bird's-Eye View for unified detection. These architectures are essential for accurate depth estimation and 3D bounding box prediction.",
    detailedDescription:
      "LiDAR (Light Detection and Ranging) sensors emit laser pulses and measure return times to create precise 3D point clouds of the environment. Unlike cameras that capture dense 2D images, LiDAR produces sparse, unordered sets of 3D points — typically 100,000-300,000 points per scan at 10-20 Hz. Processing this data presents unique challenges: points have no inherent order (unlike image pixels), the data is extremely sparse (>99% of 3D space is empty), and different regions of the scene have vastly different point densities (nearby objects have thousands of points, distant objects may have only a few). Point cloud networks address these challenges through three main paradigms: (1) Point-based methods (PointNet, PointNet++) process raw points directly using shared MLPs and symmetric aggregation functions, (2) Voxel-based methods (VoxelNet, SECOND) discretize space into 3D voxels and apply sparse 3D convolutions, and (3) Pillar-based methods (PointPillars) create vertical columns and use efficient 2D convolutions. Modern approaches like CenterPoint and BEVFusion combine these ideas with Bird's-Eye View representations for state-of-the-art 3D detection.",
    mathFoundation: "PointNet: f({x_1,...,x_n}) = γ(MAX_{i=1..n}(h(x_i))), where h is a shared MLP and MAX is element-wise maximum (symmetric function). This achieves permutation invariance. For voxelization: given points P = {(x,y,z,r)_i}, voxels V at resolution (vx,vy,vz) have indices (⌊x/vx⌋, ⌊y/vy⌋, ⌊z/vz⌋). Sparse convolution: only compute outputs for non-empty voxels, reducing FLOPs by 10-100×.",
    howItWorks: [
      { step: 1, title: "Point Cloud Acquisition", description: "LiDAR sensor outputs 3D points with (x, y, z, intensity)", technical: "64-beam LiDAR produces ~120K points/frame. Each point: (x,y,z) position in sensor frame + intensity (reflectance). Range: 0.1-200m." },
      { step: 2, title: "Voxelization / Pillarization", description: "Discretize continuous 3D space into a grid structure", technical: "Voxel: 3D grid (e.g., 0.1m × 0.1m × 0.2m). Pillar: 2D grid with all points in vertical column (e.g., 0.2m × 0.2m × ∞). Points grouped by cell." },
      { step: 3, title: "Point Feature Encoding", description: "Learn features for points within each cell", technical: "PointPillars: augment (x,y,z,r) with (x_c,y_c,z_c) offset from pillar center + (x_p,y_p) offset from point mean. MLP → 64-dim features." },
      { step: 4, title: "Sparse 3D Convolution", description: "Apply 3D convolutions only to occupied voxels", technical: "Build hash table of occupied voxels. Gather inputs, apply conv kernel, scatter outputs. SpConv library: 10× faster than dense." },
      { step: 5, title: "BEV Projection", description: "Collapse 3D features to 2D Bird's-Eye View", technical: "Stack/concatenate features along Z-axis. Result: (H/vx) × (W/vy) × C feature map representing scene from above." },
      { step: 6, title: "Detection Head", description: "Predict 3D bounding boxes from BEV features", technical: "Anchor-based: regress (Δx,Δy,Δz,Δw,Δl,Δh,Δθ) per anchor. Center-based: predict heatmap of centers + regression." },
    ],
    layerBreakdown: [
      { name: "Pillar Feature Net", operation: "MLP: 10→64, max pool", outputShape: "P×64", parameters: "10K" },
      { name: "Scatter to BEV", operation: "Place pillar features in grid", outputShape: "432×496×64", parameters: "0" },
      { name: "Backbone (2D CNN)", operation: "3 blocks of strided conv", outputShape: "216×248×128", parameters: "4.8M" },
      { name: "Neck (FPN)", operation: "Upsample & concat", outputShape: "216×248×384", parameters: "2.1M" },
      { name: "Detection Head", operation: "Conv for cls + reg", outputShape: "216×248×(A×8)", parameters: "1.2M" },
      { name: "NMS / Center Head", operation: "Post-process predictions", outputShape: "N×7", parameters: "0" },
    ],
    pros: [
      "Direct 3D geometry understanding — no depth ambiguity unlike monocular cameras",
      "Sparse convolutions exploit 99%+ sparsity of point clouds for massive efficiency gains",
      "Robust to lighting conditions — LiDAR works in complete darkness and direct sunlight",
      "Precise distance measurements (±2cm) critical for safety-critical decisions",
      "BEV representation naturally enables sensor fusion with cameras and radar",
      "Accurate 3D bounding boxes with position, size, and orientation",
    ],
    cons: [
      "Expensive LiDAR sensors ($1K for solid-state, $10K-$75K for mechanical spinning)",
      "Sparse data in distant regions (1/r² point density decay) limits long-range accuracy",
      "Weather sensitivity — rain, fog, snow scatter laser pulses causing noise/dropouts",
      "Less semantic richness than cameras — no color, texture, or fine-grained appearance",
      "Limited angular resolution compared to high-res cameras (0.1° vs 0.01° per pixel)",
    ],
    useCases: [
      "3D object detection for vehicles, pedestrians, cyclists (core perception task)",
      "LiDAR-camera sensor fusion (BEVFusion combines complementary strengths)",
      "HD map generation and localization (centimeter-accurate positioning)",
      "Simultaneous Localization and Mapping (SLAM) for navigation",
      "Free space detection and drivable area segmentation",
    ],
    keyInnovations: [
      { title: "PointNet Architecture", description: "First deep learning architecture processing raw point clouds directly", technical: "Shared MLP + symmetric max-pooling achieves permutation invariance. T-Net learns input/feature transformations for alignment." },
      { title: "Pillar Encoding (PointPillars)", description: "Converts point cloud to pseudo-image for efficient 2D CNN processing", technical: "Points binned into vertical pillars → MLP features → scatter to BEV grid. 62 FPS on single GPU, 4× faster than VoxelNet." },
      { title: "Sparse 3D Convolution", description: "Only compute outputs for non-empty voxels", technical: "Hash-based indexing of active voxels. Build rulebook of (input_idx, output_idx, kernel_offset). 10-100× faster than dense." },
      { title: "CenterPoint Detection", description: "Anchor-free detection predicting object centers as heatmaps", technical: "Predict Gaussian heatmap of object centers + regression for (z, size, rotation, velocity). Simpler than anchor-based methods." },
      { title: "BEV Fusion", description: "Unified Bird's-Eye View representation fusing LiDAR and camera", technical: "Lift camera features to 3D via depth prediction → project to BEV → concatenate with LiDAR BEV features → fused detection." },
    ],
    variants: [
      { name: "PointNet++", description: "Hierarchical learning with local neighborhoods", improvement: "Captures local structure missing in PointNet via ball queries and farthest point sampling" },
      { name: "VoxelNet", description: "End-to-end 3D voxel-based detection", improvement: "First to learn features directly from voxelized point cloud, avoiding hand-crafted features" },
      { name: "SECOND", description: "Sparse convolutions for efficient voxel processing", improvement: "20× faster than VoxelNet via sparse conv, enabled real-time LiDAR detection" },
      { name: "PointPillars", description: "Pillar-based encoding with 2D CNN backbone", improvement: "62 Hz inference, simple and efficient architecture that became widely adopted" },
      { name: "CenterPoint", description: "Anchor-free 3D detection using center heatmaps", improvement: "State-of-the-art on nuScenes and Waymo, simpler than anchor-based approaches" },
    ],
    examples: [
      { name: "PointPillars", year: 2019, metric: "77.4 mAP KITTI", description: "Fast pillar-based detector running at 62 Hz, widely deployed baseline" },
      { name: "CenterPoint", year: 2021, metric: "67.3 NDS nuScenes", description: "Anchor-free 3D detector with center heatmap prediction, strong baseline" },
      { name: "VoxelNeXt", year: 2023, metric: "70.1 NDS nuScenes", description: "Fully sparse voxel-based detector without dense BEV, efficient design" },
      { name: "BEVFusion", year: 2022, metric: "72.9 NDS (fusion)", description: "State-of-the-art LiDAR-camera fusion in unified BEV space" },
    ],
    performance: { accuracy: 88, speed: 75, memory: 70, scalability: 80 },
    deploymentConsiderations: [
      "Sparse convolution libraries (SpConv, MinkowskiEngine) essential for efficiency",
      "Point cloud preprocessing (ground removal, range filtering) reduces compute",
      "Voxel/pillar resolution balances accuracy vs speed — coarser is faster",
      "Multi-sweep accumulation improves sparse regions but adds latency",
      "Sensor calibration critical — LiDAR-camera extrinsics must be precise for fusion",
    ],
  },
];

/* ══════════════════════════════════════════════════════════════════════════
   ANIMATED DIAGRAM COMPONENTS
══════════════════════════════════════════════════════════════════════════ */

/* CNN Diagram — Animated convolutional layers */
const CNNDiagram = () => {
  const layers = [
    { w: 64, h: 64, depth: 4, label: "Input\n224×224", color: "hsl(var(--primary) / 0.25)" },
    { w: 48, h: 48, depth: 8, label: "Conv 1\n112×112", color: "hsl(var(--primary) / 0.40)" },
    { w: 34, h: 34, depth: 12, label: "Conv 2\n56×56", color: "hsl(var(--primary) / 0.55)" },
    { w: 22, h: 22, depth: 14, label: "Conv 3\n28×28", color: "hsl(var(--primary) / 0.70)" },
    { w: 13, h: 13, depth: 14, label: "Conv 4\n14×14", color: "hsl(var(--primary) / 0.85)" },
    { w: 6, h: 26, depth: 2, label: "FC\nOutput", color: "hsl(var(--accent) / 0.80)" },
  ];

  const centerY = 110;
  const gap = 12;
  let cursor = 18;
  const positions: number[] = [];
  layers.forEach((l, i) => {
    positions.push(cursor);
    cursor += l.w + (i < layers.length - 1 ? gap + l.depth * 0.6 : 0);
  });

  return (
    <svg viewBox="0 0 340 220" className="w-full h-full" style={{ overflow: "visible" }}>
      <defs>
        <filter id="cnn-glow">
          <feGaussianBlur stdDeviation="2" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Connecting lines */}
      {layers.slice(0, -1).map((l, i) => {
        const x1 = positions[i] + l.w + l.depth * 0.5;
        const x2 = positions[i + 1];
        return (
          <motion.line
            key={`conn-${i}`}
            x1={x1} y1={centerY} x2={x2} y2={centerY}
            stroke="hsl(var(--primary) / 0.2)"
            strokeWidth="1"
            strokeDasharray="3 3"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 + i * 0.15 }}
          />
        );
      })}

      {/* Feature map blocks */}
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
            <polygon
              points={`${x},${y} ${x + d},${y - d * 0.5} ${x + l.w + d},${y - d * 0.5} ${x + l.w},${y}`}
              fill={l.color}
              stroke="hsl(var(--foreground) / 0.08)"
              strokeWidth="0.5"
            />
            <polygon
              points={`${x + l.w},${y} ${x + l.w + d},${y - d * 0.5} ${x + l.w + d},${y + l.h - d * 0.5} ${x + l.w},${y + l.h}`}
              fill={l.color}
              stroke="hsl(var(--foreground) / 0.08)"
              strokeWidth="0.5"
              style={{ filter: "brightness(0.75)" }}
            />
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
          <motion.g key={`lbl-${i}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 + i * 0.13 }}>
            {lines.map((line, li) => (
              <text key={li} x={x} y={centerY + l.h / 2 + 16 + li * 11} textAnchor="middle" fontSize="8" fill="hsl(var(--muted-foreground))">
                {line}
              </text>
            ))}
          </motion.g>
        );
      })}

      {/* Animated kernel */}
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
      >
        kernel
      </motion.text>
    </svg>
  );
};

/* Transformer Diagram — Patch tokenization + attention */
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

  const headColors = ["hsl(var(--secondary))", "hsl(var(--primary))", "hsl(var(--accent))"];
  const headCx = [230, 258, 286];
  const headCy = [80, 55, 80];

  const attentionLinks = [
    { from: 7, to: headColors[0], hx: headCx[0], hy: headCy[0] },
    { from: 12, to: headColors[0], hx: headCx[0], hy: headCy[0] },
    { from: 3, to: headColors[1], hx: headCx[1], hy: headCy[1] },
    { from: 17, to: headColors[1], hx: headCx[1], hy: headCy[1] },
    { from: 9, to: headColors[2], hx: headCx[2], hy: headCy[2] },
    { from: 11, to: headColors[2], hx: headCx[2], hy: headCy[2] },
  ];

  return (
    <svg viewBox="0 0 340 220" className="w-full h-full" style={{ overflow: "visible" }}>
      <defs>
        <filter id="tr-glow">
          <feGaussianBlur stdDeviation="2" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
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

      <motion.text
        x={startX + (patchCols * (patchSize + gap)) / 2} y={startY + patchRows * (patchSize + gap) + 14}
        textAnchor="middle" fontSize="8" fill="hsl(var(--muted-foreground))"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
      >
        Image Patches (tokens)
      </motion.text>

      {/* Arrow to attention */}
      <motion.line
        x1={startX + patchCols * (patchSize + gap)} y1={startY + (patchRows * (patchSize + gap)) / 2}
        x2={170} y2={90}
        stroke="hsl(var(--secondary) / 0.3)" strokeWidth="1" strokeDasharray="4 3"
        initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.9 }}
      />
      <motion.text
        x={153} y={68}
        textAnchor="middle" fontSize="7" fill="hsl(var(--secondary) / 0.6)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
      >
        Linear Projection
      </motion.text>

      {/* Attention lines */}
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

      {/* Attention heads */}
      {headCx.map((x, i) => (
        <motion.g key={`head-${i}`} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.4 + i * 0.15, type: "spring" }}>
          <circle cx={x} cy={headCy[i]} r="14" fill={headColors[i]} fillOpacity="0.15" stroke={headColors[i]} strokeWidth="1" filter="url(#tr-glow)" />
          <text x={x} y={headCy[i] + 3} textAnchor="middle" fontSize="7" fontWeight="600" fill={headColors[i]}>
            H{i + 1}
          </text>
        </motion.g>
      ))}

      <motion.text
        x={258} y={115}
        textAnchor="middle" fontSize="8" fill="hsl(var(--muted-foreground))"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.9 }}
      >
        Multi-Head Attention
      </motion.text>

      {/* Output MLP */}
      <motion.rect
        x={230} y={140} width={56} height={28}
        rx="4" fill="hsl(var(--secondary) / 0.15)" stroke="hsl(var(--secondary) / 0.3)" strokeWidth="1"
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.1 }}
      />
      <motion.text
        x={258} y={158}
        textAnchor="middle" fontSize="8" fill="hsl(var(--secondary))"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2 }}
      >
        FFN / MLP
      </motion.text>

      {/* Final output */}
      <motion.rect
        x={230} y={182} width={56} height={24}
        rx="4" fill="hsl(var(--accent) / 0.2)" stroke="hsl(var(--accent) / 0.4)" strokeWidth="1"
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.4 }}
      />
      <motion.text
        x={258} y={198}
        textAnchor="middle" fontSize="8" fill="hsl(var(--accent))"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }}
      >
        Output
      </motion.text>
    </svg>
  );
};

/* LiDAR Diagram — Point cloud to BEV */
const LiDARDiagram = () => {
  const points: { x: number; y: number; z: number }[] = [];
  for (let i = 0; i < 60; i++) {
    points.push({
      x: 20 + Math.random() * 80,
      y: 30 + Math.random() * 90,
      z: Math.random(),
    });
  }

  const pillarX = 140;
  const pillarW = 50;
  const pillarH = 90;
  const pillarY = 55;
  const numPillars = 6;

  const bevX = 220;
  const bevY = 50;
  const bevW = 90;
  const bevH = 70;

  return (
    <svg viewBox="0 0 340 220" className="w-full h-full" style={{ overflow: "visible" }}>
      <defs>
        <filter id="lidar-glow">
          <feGaussianBlur stdDeviation="2" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Point cloud */}
      {points.map((p, i) => (
        <motion.circle
          key={`pt-${i}`}
          cx={p.x} cy={p.y}
          r={1.5 + p.z * 2}
          fill={`hsl(var(--accent) / ${0.3 + p.z * 0.5})`}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: i * 0.015 }}
        />
      ))}
      <motion.text
        x={60} y={140}
        textAnchor="middle" fontSize="8" fill="hsl(var(--muted-foreground))"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
      >
        3D Point Cloud
      </motion.text>

      {/* Arrow to pillars */}
      <motion.line
        x1={105} y1={85} x2={135} y2={85}
        stroke="hsl(var(--accent) / 0.3)" strokeWidth="1" strokeDasharray="4 3"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ delay: 1.2, duration: 0.4 }}
      />

      {/* Pillars */}
      {Array.from({ length: numPillars }).map((_, i) => {
        const h = 30 + Math.random() * 50;
        const x = pillarX + (i % 3) * 17;
        const y = pillarY + Math.floor(i / 3) * 48;
        return (
          <motion.rect
            key={`pil-${i}`}
            x={x} y={y + (pillarH - h) / 2}
            width={12} height={h}
            rx="2"
            fill={`hsl(var(--accent) / ${0.2 + (i % 3) * 0.15})`}
            stroke="hsl(var(--accent) / 0.4)"
            strokeWidth="0.5"
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 1 }}
            style={{ originY: `${y + pillarH / 2}px` }}
            transition={{ delay: 1.5 + i * 0.1, type: "spring" }}
          />
        );
      })}
      <motion.text
        x={pillarX + 24} y={pillarY + pillarH + 16}
        textAnchor="middle" fontSize="8" fill="hsl(var(--muted-foreground))"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.1 }}
      >
        Pillars
      </motion.text>

      {/* Arrow to BEV */}
      <motion.line
        x1={pillarX + pillarW + 5} y1={pillarY + pillarH / 2}
        x2={bevX - 5} y2={bevY + bevH / 2}
        stroke="hsl(var(--accent) / 0.3)" strokeWidth="1" strokeDasharray="4 3"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ delay: 2.2, duration: 0.4 }}
      />

      {/* BEV map */}
      <motion.rect
        x={bevX} y={bevY}
        width={bevW} height={bevH}
        rx="4"
        fill="hsl(var(--accent) / 0.08)"
        stroke="hsl(var(--accent) / 0.3)"
        strokeWidth="1"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2.4 }}
      />
      {/* Grid lines */}
      {Array.from({ length: 4 }).map((_, i) => (
        <motion.line
          key={`grid-h-${i}`}
          x1={bevX} y1={bevY + (i + 1) * (bevH / 5)}
          x2={bevX + bevW} y2={bevY + (i + 1) * (bevH / 5)}
          stroke="hsl(var(--accent) / 0.15)"
          strokeWidth="0.5"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 + i * 0.05 }}
        />
      ))}
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.line
          key={`grid-v-${i}`}
          x1={bevX + (i + 1) * (bevW / 6)}
          y1={bevY}
          x2={bevX + (i + 1) * (bevW / 6)}
          y2={bevY + bevH}
          stroke="hsl(var(--accent) / 0.15)"
          strokeWidth="0.5"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 + i * 0.05 }}
        />
      ))}
      <motion.text
        x={bevX + bevW / 2} y={bevY + bevH + 16}
        textAnchor="middle" fontSize="8" fill="hsl(var(--muted-foreground))"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.8 }}
      >
        Bird's Eye View
      </motion.text>

      {/* Detection box */}
      <motion.rect
        x={bevX + 25} y={bevY + 20}
        width={35} height={25}
        rx="2" fill="none"
        stroke="hsl(var(--primary))"
        strokeWidth="1.5"
        filter="url(#lidar-glow)"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.6, delay: 3 }}
      />
      <motion.text
        x={bevX + 42} y={bevY + 16}
        textAnchor="middle" fontSize="7" fill="hsl(var(--primary))"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.2 }}
      >
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

/* ══════════════════════════════════════════════════════════════════════════
   UTILITY COMPONENTS
══════════════════════════════════════════════════════════════════════════ */

const GlassCard = ({ children, className = "", style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) => (
  <div className={`glass relative overflow-hidden ${className}`} style={style}>
    {children}
  </div>
);

const ProgressBar = ({ value, color, label, delay = 0 }: { value: number; color: string; label: string; delay?: number }) => (
  <div className="space-y-1.5">
    <div className="flex justify-between text-xs">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold" style={{ color: `hsl(var(${color}))` }}>
        {value}%
      </span>
    </div>
    <div className="h-2 bg-foreground/5 rounded-full overflow-hidden">
      <motion.div
        className="h-full rounded-full"
        style={{ background: `linear-gradient(90deg, hsl(var(${color}) / 0.5), hsl(var(${color})))` }}
        initial={{ width: 0 }}
        whileInView={{ width: `${value}%` }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay, ease: "easeOut" }}
      />
    </div>
  </div>
);

/* ══════════════════════════════════════════════════════════════════════════
   PAGE SECTIONS
══════════════════════════════════════════════════════════════════════════ */

/* Hero Section */
const HeroSection = () => (
  <section className="relative pt-32 pb-20 overflow-hidden">
    {/* Background effects */}
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-20 left-1/4 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[150px]" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-secondary/5 blur-[120px]" />
    </div>

    <div className="container mx-auto px-6 relative z-10">
      <motion.div
        className="text-center max-w-4xl mx-auto space-y-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <motion.div
          className="glass inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Network className="w-4 h-4" />
          Deep Learning Architectures
        </motion.div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
          How Machines{" "}
          <span className="text-gradient-primary">Learn to See</span>
        </h1>

        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Explore the three dominant architecture families powering autonomous vehicle perception:
          Convolutional Neural Networks, Vision Transformers, and LiDAR Point Cloud Networks.
        </p>

        <motion.div
          className="flex flex-wrap justify-center gap-6 pt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {architectures.map((arch) => {
            const Icon = arch.icon;
            return (
              <div
                key={arch.id}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: `hsl(var(${arch.color}) / 0.1)`, border: `1px solid hsl(var(${arch.color}) / 0.2)` }}
                >
                  <Icon className="w-4 h-4" style={{ color: `hsl(var(${arch.color}))` }} />
                </div>
                <span>{arch.label}</span>
              </div>
            );
          })}
        </motion.div>
      </motion.div>
    </div>
  </section>
);

/* Main Architecture Explorer */
const ArchitectureExplorer = () => {
  const [active, setActive] = useState<ArchId>("cnn");
  const [expandedSection, setExpandedSection] = useState<string | null>("overview");
  const arch = architectures.find((a) => a.id === active)!;

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <section className="py-20">
      <div className="container mx-auto px-6">
        {/* Tab selector */}
        <div className="flex justify-center mb-12">
          <div className="glass inline-flex gap-1 p-1.5 rounded-xl">
            {architectures.map((a) => {
              const Icon = a.icon;
              const isActive = a.id === active;
              return (
                <motion.button
                  key={a.id}
                  onClick={() => { setActive(a.id); setExpandedSection("overview"); }}
                  className="relative flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold transition-colors"
                  style={isActive ? { color: `hsl(var(${a.color}))` } : { color: "hsl(var(--muted-foreground))" }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
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

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            {/* Main grid - Diagram + Overview */}
            <div className="grid lg:grid-cols-2 gap-8 mb-12">
              {/* Diagram */}
              <GlassCard className="p-6 min-h-[320px]">
                <div
                  className="absolute top-0 left-0 right-0 h-[2px] rounded-t-xl"
                  style={{ background: `linear-gradient(90deg, transparent, hsl(var(${arch.color})), transparent)` }}
                />
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: `hsl(var(${arch.color}))` }}>
                    Architecture Diagram
                  </span>
                  <span className="glass px-2 py-1 text-[10px] font-medium text-muted-foreground rounded-full">
                    Interactive
                  </span>
                </div>
                <div className="flex items-center justify-center h-[260px]">
                  {diagrams[active]}
                </div>
              </GlassCard>

              {/* Description + Performance */}
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: `hsl(var(${arch.color}) / 0.1)`, border: `1px solid hsl(var(${arch.color}) / 0.2)` }}
                    >
                      <arch.icon className="w-5 h-5" style={{ color: `hsl(var(${arch.color}))` }} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">{arch.fullName}</h2>
                      <p className="text-sm text-muted-foreground">Since {arch.year} • {arch.papers.toLocaleString()}+ papers</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{arch.description}</p>
                </div>

                {/* Performance metrics */}
                <GlassCard className="p-4 space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                    Performance Profile
                  </p>
                  <ProgressBar value={arch.performance.accuracy} color={arch.color} label="Accuracy" delay={0} />
                  <ProgressBar value={arch.performance.speed} color={arch.color} label="Inference Speed" delay={0.1} />
                  <ProgressBar value={arch.performance.memory} color={arch.color} label="Memory Efficiency" delay={0.2} />
                  <ProgressBar value={arch.performance.scalability} color={arch.color} label="Scalability" delay={0.3} />
                </GlassCard>
              </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════
               DETAILED DESCRIPTION SECTION
            ═══════════════════════════════════════════════════════════ */}
            <GlassCard className="p-6 mb-8">
              <button
                onClick={() => toggleSection("detailed")}
                className="w-full flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `hsl(var(${arch.color}) / 0.1)` }}>
                    <BookOpen className="w-5 h-5" style={{ color: `hsl(var(${arch.color}))` }} />
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-bold">In-Depth Overview</h3>
                    <p className="text-sm text-muted-foreground">Comprehensive technical explanation</p>
                  </div>
                </div>
                <ChevronRight className={`w-5 h-5 text-muted-foreground transition-transform ${expandedSection === "detailed" ? "rotate-90" : ""}`} />
              </button>
              <AnimatePresence>
                {expandedSection === "detailed" && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-6 border-t border-foreground/5 mt-6">
                      <p className="text-muted-foreground leading-relaxed text-[15px]">{arch.detailedDescription}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </GlassCard>

            {/* ═══════════════════════════════════════════════════════════
               MATHEMATICAL FOUNDATION SECTION
            ═══════════════════════════════════════════════════════════ */}
            <GlassCard className="p-6 mb-8">
              <button
                onClick={() => toggleSection("math")}
                className="w-full flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `hsl(var(${arch.color}) / 0.1)` }}>
                    <Calculator className="w-5 h-5" style={{ color: `hsl(var(${arch.color}))` }} />
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-bold">Mathematical Foundation</h3>
                    <p className="text-sm text-muted-foreground">Core equations and formulas</p>
                  </div>
                </div>
                <ChevronRight className={`w-5 h-5 text-muted-foreground transition-transform ${expandedSection === "math" ? "rotate-90" : ""}`} />
              </button>
              <AnimatePresence>
                {expandedSection === "math" && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-6 border-t border-foreground/5 mt-6">
                      <div className="glass p-4 rounded-lg bg-foreground/[0.02] font-mono text-sm leading-relaxed">
                        <code className="text-muted-foreground whitespace-pre-wrap">{arch.mathFoundation}</code>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </GlassCard>

            {/* ═══════════════════════════════════════════════════════════
               HOW IT WORKS SECTION
            ═══════════════════════════════════════════════════════════ */}
            <GlassCard className="p-6 mb-8">
              <button
                onClick={() => toggleSection("howitworks")}
                className="w-full flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `hsl(var(${arch.color}) / 0.1)` }}>
                    <Workflow className="w-5 h-5" style={{ color: `hsl(var(${arch.color}))` }} />
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-bold">How It Works</h3>
                    <p className="text-sm text-muted-foreground">Step-by-step processing pipeline</p>
                  </div>
                </div>
                <ChevronRight className={`w-5 h-5 text-muted-foreground transition-transform ${expandedSection === "howitworks" ? "rotate-90" : ""}`} />
              </button>
              <AnimatePresence>
                {expandedSection === "howitworks" && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-6 border-t border-foreground/5 mt-6 space-y-4">
                      {arch.howItWorks.map((step, i) => (
                        <motion.div
                          key={step.step}
                          className="relative pl-8"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                        >
                          {/* Step number */}
                          <div
                            className="absolute left-0 top-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                            style={{ background: `hsl(var(${arch.color}) / 0.2)`, color: `hsl(var(${arch.color}))` }}
                          >
                            {step.step}
                          </div>
                          {/* Connecting line */}
                          {i < arch.howItWorks.length - 1 && (
                            <div
                              className="absolute left-[11px] top-6 w-0.5 h-full"
                              style={{ background: `hsl(var(${arch.color}) / 0.15)` }}
                            />
                          )}
                          <div className="pb-4">
                            <h4 className="font-semibold mb-1">{step.title}</h4>
                            <p className="text-sm text-muted-foreground mb-2">{step.description}</p>
                            <div className="glass p-3 rounded-lg text-xs text-muted-foreground bg-foreground/[0.02]">
                              <span className="font-semibold" style={{ color: `hsl(var(${arch.color}))` }}>Technical: </span>
                              {step.technical}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </GlassCard>

            {/* ═══════════════════════════════════════════════════════════
               LAYER BREAKDOWN TABLE
            ═══════════════════════════════════════════════════════════ */}
            <GlassCard className="p-6 mb-8">
              <button
                onClick={() => toggleSection("layers")}
                className="w-full flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `hsl(var(${arch.color}) / 0.1)` }}>
                    <Table2 className="w-5 h-5" style={{ color: `hsl(var(${arch.color}))` }} />
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-bold">Layer-by-Layer Breakdown</h3>
                    <p className="text-sm text-muted-foreground">Detailed architecture specifications</p>
                  </div>
                </div>
                <ChevronRight className={`w-5 h-5 text-muted-foreground transition-transform ${expandedSection === "layers" ? "rotate-90" : ""}`} />
              </button>
              <AnimatePresence>
                {expandedSection === "layers" && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-6 border-t border-foreground/5 mt-6 overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-foreground/10">
                            <th className="text-left py-3 px-4 font-semibold">Layer</th>
                            <th className="text-left py-3 px-4 font-semibold">Operation</th>
                            <th className="text-left py-3 px-4 font-semibold">Output Shape</th>
                            <th className="text-right py-3 px-4 font-semibold">Parameters</th>
                          </tr>
                        </thead>
                        <tbody>
                          {arch.layerBreakdown.map((layer, i) => (
                            <motion.tr
                              key={layer.name}
                              className="border-b border-foreground/5 hover:bg-foreground/[0.02] transition-colors"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: i * 0.05 }}
                            >
                              <td className="py-3 px-4 font-medium" style={{ color: `hsl(var(${arch.color}))` }}>{layer.name}</td>
                              <td className="py-3 px-4 text-muted-foreground font-mono text-xs">{layer.operation}</td>
                              <td className="py-3 px-4 text-muted-foreground font-mono text-xs">{layer.outputShape}</td>
                              <td className="py-3 px-4 text-right text-muted-foreground">{layer.parameters}</td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </GlassCard>

            {/* Pros, Cons, Use Cases - Row */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {/* Pros */}
              <GlassCard className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <h3 className="font-bold text-emerald-400">Strengths</h3>
                </div>
                <ul className="space-y-3">
                  {arch.pros.map((pro, i) => (
                    <motion.li
                      key={i}
                      className="flex gap-2 text-sm text-muted-foreground"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <ChevronRight className="w-4 h-4 text-emerald-400/60 shrink-0 mt-0.5" />
                      <span>{pro}</span>
                    </motion.li>
                  ))}
                </ul>
              </GlassCard>

              {/* Cons */}
              <GlassCard className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <XCircle className="w-5 h-5 text-rose-400" />
                  <h3 className="font-bold text-rose-400">Limitations</h3>
                </div>
                <ul className="space-y-3">
                  {arch.cons.map((con, i) => (
                    <motion.li
                      key={i}
                      className="flex gap-2 text-sm text-muted-foreground"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <ChevronRight className="w-4 h-4 text-rose-400/60 shrink-0 mt-0.5" />
                      <span>{con}</span>
                    </motion.li>
                  ))}
                </ul>
              </GlassCard>

              {/* Use Cases */}
              <GlassCard className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="w-5 h-5" style={{ color: `hsl(var(${arch.color}))` }} />
                  <h3 className="font-bold" style={{ color: `hsl(var(${arch.color}))` }}>Use Cases</h3>
                </div>
                <ul className="space-y-3">
                  {arch.useCases.map((use, i) => (
                    <motion.li
                      key={i}
                      className="flex gap-2 text-sm text-muted-foreground"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <ChevronRight className="w-4 h-4 shrink-0 mt-0.5" style={{ color: `hsl(var(${arch.color}) / 0.6)` }} />
                      <span>{use}</span>
                    </motion.li>
                  ))}
                </ul>
              </GlassCard>
            </div>

            {/* ═══════════════════════════════════════════════════════════
               KEY INNOVATIONS (Enhanced)
            ═══════════════════════════════════════════════════════════ */}
            <div className="mb-12">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Lightbulb className="w-5 h-5" style={{ color: `hsl(var(${arch.color}))` }} />
                Key Innovations
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {arch.keyInnovations.map((innovation, i) => (
                  <motion.div
                    key={innovation.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <GlassCard className="p-5 h-full">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                        style={{ background: `hsl(var(${arch.color}) / 0.1)` }}
                      >
                        <Sparkles className="w-5 h-5" style={{ color: `hsl(var(${arch.color}))` }} />
                      </div>
                      <h4 className="font-bold mb-2">{innovation.title}</h4>
                      <p className="text-sm text-muted-foreground mb-3">{innovation.description}</p>
                      <div className="glass p-3 rounded-lg text-xs bg-foreground/[0.02]">
                        <code className="text-muted-foreground">{innovation.technical}</code>
                      </div>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════
               ARCHITECTURE VARIANTS
            ═══════════════════════════════════════════════════════════ */}
            <div className="mb-12">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <GitBranch className="w-5 h-5" style={{ color: `hsl(var(${arch.color}))` }} />
                Architecture Variants
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {arch.variants.map((variant, i) => (
                  <motion.div
                    key={variant.name}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <GlassCard className="p-4 h-full">
                      <h4 className="font-bold mb-1" style={{ color: `hsl(var(${arch.color}))` }}>{variant.name}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{variant.description}</p>
                      <div className="flex items-start gap-2 text-xs">
                        <span className="text-emerald-400 font-medium shrink-0">Improvement:</span>
                        <span className="text-muted-foreground">{variant.improvement}</span>
                      </div>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════
               NOTABLE MODELS (Enhanced)
            ═══════════════════════════════════════════════════════════ */}
            <div className="mb-12">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Star className="w-5 h-5" style={{ color: `hsl(var(${arch.color}))` }} />
                Notable Models
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {arch.examples.map((model, i) => (
                  <motion.div
                    key={model.name}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <GlassCard className="p-4 h-full hover:border-foreground/10 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-bold">{model.name}</p>
                        <span className="text-xs text-muted-foreground">{model.year}</span>
                      </div>
                      <div
                        className="inline-block px-2 py-1 rounded-full text-xs font-medium mb-3"
                        style={{ background: `hsl(var(${arch.color}) / 0.1)`, color: `hsl(var(${arch.color}))` }}
                      >
                        {model.metric}
                      </div>
                      <p className="text-xs text-muted-foreground">{model.description}</p>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════
               DEPLOYMENT CONSIDERATIONS
            ═══════════════════════════════════════════════════════════ */}
            <GlassCard className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `hsl(var(${arch.color}) / 0.1)` }}>
                  <Rocket className="w-5 h-5" style={{ color: `hsl(var(${arch.color}))` }} />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Deployment Considerations</h3>
                  <p className="text-sm text-muted-foreground">Production optimization tips</p>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {arch.deploymentConsiderations.map((tip, i) => (
                  <motion.div
                    key={i}
                    className="flex gap-2 p-3 rounded-lg bg-foreground/[0.02]"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Cog className="w-4 h-4 shrink-0 mt-0.5" style={{ color: `hsl(var(${arch.color}))` }} />
                    <span className="text-sm text-muted-foreground">{tip}</span>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

/* Architecture Comparison Section */
const ComparisonSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const metrics = [
    { label: "Accuracy", key: "accuracy" as const, icon: Target },
    { label: "Speed", key: "speed" as const, icon: Zap },
    { label: "Memory", key: "memory" as const, icon: Cpu },
    { label: "Scalability", key: "scalability" as const, icon: TrendingUp },
  ];

  return (
    <section ref={ref} className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-accent/3 blur-[150px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="glass inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-accent mb-4">
            <GitCompare className="w-4 h-4" />
            Side-by-Side Comparison
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight mb-4">
            Architecture <span className="text-gradient-primary">Trade-offs</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Compare the three architecture families across key performance dimensions to understand
            when each approach excels.
          </p>
        </motion.div>

        {/* Comparison table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <GlassCard className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-foreground/5">
                    <th className="text-left p-4 font-semibold text-sm">Metric</th>
                    {architectures.map((arch) => (
                      <th key={arch.id} className="p-4 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center"
                            style={{ background: `hsl(var(${arch.color}) / 0.1)`, border: `1px solid hsl(var(${arch.color}) / 0.2)` }}
                          >
                            <arch.icon className="w-5 h-5" style={{ color: `hsl(var(${arch.color}))` }} />
                          </div>
                          <span className="font-bold">{arch.label}</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {metrics.map((metric, mi) => {
                    const Icon = metric.icon;
                    return (
                      <tr key={metric.key} className="border-b border-foreground/5 last:border-0">
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium">{metric.label}</span>
                          </div>
                        </td>
                        {architectures.map((arch) => (
                          <td key={arch.id} className="p-4">
                            <div className="flex flex-col items-center gap-2">
                              <div className="w-full max-w-[120px]">
                                <div className="h-2 bg-foreground/5 rounded-full overflow-hidden">
                                  <motion.div
                                    className="h-full rounded-full"
                                    style={{ background: `hsl(var(${arch.color}))` }}
                                    initial={{ width: 0 }}
                                    animate={inView ? { width: `${arch.performance[metric.key]}%` } : {}}
                                    transition={{ duration: 1, delay: 0.3 + mi * 0.1 }}
                                  />
                                </div>
                              </div>
                              <span className="text-sm font-semibold" style={{ color: `hsl(var(${arch.color}))` }}>
                                {arch.performance[metric.key]}%
                              </span>
                            </div>
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </motion.div>

        {/* Quick insights */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          {architectures.map((arch, i) => (
            <motion.div
              key={arch.id}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5 + i * 0.1 }}
            >
              <GlassCard className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: `hsl(var(${arch.color}) / 0.1)` }}
                  >
                    <arch.icon className="w-4 h-4" style={{ color: `hsl(var(${arch.color}))` }} />
                  </div>
                  <h4 className="font-bold">{arch.label}</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {arch.id === "cnn" && "Best choice for real-time applications where latency is critical. Excellent on embedded hardware."}
                  {arch.id === "transformer" && "Optimal for complex scene understanding requiring global context. Shines with large-scale data."}
                  {arch.id === "lidar" && "Essential for accurate 3D perception and depth estimation. Critical for safety-focused applications."}
                </p>
                <div className="flex items-center gap-1 text-xs font-medium" style={{ color: `hsl(var(${arch.color}))` }}>
                  <Info className="w-3 h-3" />
                  <span>
                    {arch.id === "cnn" && "95% inference speed efficiency"}
                    {arch.id === "transformer" && "92% accuracy on complex scenes"}
                    {arch.id === "lidar" && "Native 3D geometry understanding"}
                  </span>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* Evolution Timeline */
const TimelineSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const timeline = [
    { year: "2012", title: "AlexNet & CNNs", description: "Deep CNNs win ImageNet, sparking the deep learning revolution", color: "--primary" },
    { year: "2015", title: "ResNet", description: "Residual connections enable training of 150+ layer networks", color: "--primary" },
    { year: "2016", title: "YOLO v1", description: "First real-time object detector achieves 45 FPS", color: "--primary" },
    { year: "2017", title: "PointNet", description: "First deep learning architecture for raw point clouds", color: "--accent" },
    { year: "2017", title: "Transformer", description: "Attention Is All You Need paper published (NLP)", color: "--secondary" },
    { year: "2019", title: "PointPillars", description: "Efficient pillar encoding enables real-time LiDAR detection", color: "--accent" },
    { year: "2020", title: "DETR & ViT", description: "Transformers enter computer vision with end-to-end detection", color: "--secondary" },
    { year: "2022", title: "BEVFormer", description: "Transformer-based BEV perception becomes state-of-the-art", color: "--secondary" },
    { year: "2023", title: "UniAD", description: "Unified multi-task transformer for end-to-end autonomous driving", color: "--secondary" },
  ];

  return (
    <section ref={ref} className="py-20">
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="glass inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary mb-4">
            <Activity className="w-4 h-4" />
            Historical Evolution
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight mb-4">
            The Journey of <span className="text-gradient-primary">Neural Architectures</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A decade of rapid innovation has transformed machine perception from basic image classification
            to unified end-to-end autonomous driving systems.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Center line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-foreground/10 to-transparent" />

          <div className="space-y-8">
            {timeline.map((item, i) => (
              <motion.div
                key={`${item.year}-${item.title}`}
                className={`flex items-center gap-8 ${i % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className={`flex-1 ${i % 2 === 0 ? "text-right" : "text-left"}`}>
                  <GlassCard className="inline-block p-4 max-w-md">
                    <div className="flex items-center gap-2 mb-2" style={{ justifyContent: i % 2 === 0 ? "flex-end" : "flex-start" }}>
                      <span
                        className="text-xs font-bold px-2 py-0.5 rounded-full"
                        style={{ background: `hsl(var(${item.color}) / 0.1)`, color: `hsl(var(${item.color}))` }}
                      >
                        {item.year}
                      </span>
                    </div>
                    <h4 className="font-bold mb-1">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </GlassCard>
                </div>

                {/* Center dot */}
                <div className="relative z-10">
                  <div
                    className="w-4 h-4 rounded-full border-2"
                    style={{ background: `hsl(var(${item.color}))`, borderColor: `hsl(var(${item.color}))`, boxShadow: `0 0 12px hsl(var(${item.color}) / 0.5)` }}
                  />
                </div>

                <div className="flex-1" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

/* ══════════════════════════════════════════════════════════════════════════
   MAIN PAGE COMPONENT
══════════════════════════════════════════════════════════════════════════ */

const ArchitecturesPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <ArchitectureExplorer />
      <ComparisonSection />
      <TimelineSection />
    </div>
  );
};

export default ArchitecturesPage;
