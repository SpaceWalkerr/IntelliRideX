import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  BookOpen,
  Search,
  ExternalLink,
  ArrowUp,
  FileText,
  Layers,
  Eye,
  Navigation,
  ShieldAlert,
  Database,
  BrainCircuit,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";

/* ─── Types ──────────────────────────────────────────────────────────────── */

interface Reference {
  id: number;
  authors: string;
  title: string;
  venue: string;
  year: number;
  doi?: string;
  category: string;
}

/* ─── Data ───────────────────────────────────────────────────────────────── */

const categories = [
  { key: "all",           label: "All",                icon: BookOpen      },
  { key: "object",        label: "Object Detection",   icon: Eye           },
  { key: "segmentation",  label: "Segmentation",       icon: Layers        },
  { key: "depth",         label: "Depth Estimation",   icon: Navigation    },
  { key: "architecture",  label: "Architectures",      icon: BrainCircuit  },
  { key: "dataset",       label: "Datasets",           icon: Database      },
  { key: "safety",        label: "Safety & Robustness",icon: ShieldAlert   },
  { key: "planning",      label: "Planning & Control", icon: FileText      },
];

const references: Reference[] = [
  // ── Object Detection ──
  { id: 1,  authors: "Ren, S., He, K., Girshick, R., & Sun, J.",    title: "Faster R-CNN: Towards Real-Time Object Detection with Region Proposal Networks",                venue: "NeurIPS 2015", year: 2015, doi: "https://doi.org/10.1109/TPAMI.2016.2577031", category: "object" },
  { id: 2,  authors: "Redmon, J., Divvala, S., Girshick, R., & Farhadi, A.", title: "You Only Look Once: Unified, Real-Time Object Detection",                                 venue: "CVPR 2016",   year: 2016, doi: "https://doi.org/10.1109/CVPR.2016.91", category: "object" },
  { id: 3,  authors: "Liu, W., Anguelov, D., Erhan, D., et al.",    title: "SSD: Single Shot MultiBox Detector",                                                                venue: "ECCV 2016",   year: 2016, doi: "https://doi.org/10.1007/978-3-319-46448-0_2", category: "object" },
  { id: 4,  authors: "Lin, T.-Y., Goyal, P., Girshick, R., He, K., & Dollár, P.", title: "Focal Loss for Dense Object Detection (RetinaNet)",                                    venue: "ICCV 2017",   year: 2017, doi: "https://doi.org/10.1109/ICCV.2017.324", category: "object" },
  { id: 5,  authors: "Zhou, X., Wang, D., & Krähenbühl, P.",        title: "Objects as Points (CenterNet)",                                                                      venue: "arXiv 2019",  year: 2019, doi: "https://arxiv.org/abs/1904.07850", category: "object" },
  { id: 6,  authors: "Carion, N., Massa, F., Synnaeve, G., et al.", title: "End-to-End Object Detection with Transformers (DETR)",                                               venue: "ECCV 2020",   year: 2020, doi: "https://doi.org/10.1007/978-3-030-58452-8_13", category: "object" },
  { id: 7,  authors: "Ge, Z., Liu, S., Wang, F., Li, Z., & Sun, J.", title: "YOLOX: Exceeding YOLO Series in 2021",                                                              venue: "arXiv 2021",  year: 2021, doi: "https://arxiv.org/abs/2107.08430", category: "object" },
  { id: 8,  authors: "Li, C., Li, L., Jiang, H., et al.",           title: "YOLOv6: A Single-Stage Object Detection Framework",                                                  venue: "arXiv 2022",  year: 2022, doi: "https://arxiv.org/abs/2209.02976", category: "object" },
  { id: 9,  authors: "Wang, C.-Y., Bochkovskiy, A., & Liao, H.-Y.M.", title: "YOLOv7: Trainable Bag-of-Freebies Sets New State-of-the-Art",                                      venue: "CVPR 2023",   year: 2023, doi: "https://doi.org/10.1109/CVPR52729.2023.00721", category: "object" },
  { id: 10, authors: "Jocher, G., Chaurasia, A., & Qiu, J.",        title: "Ultralytics YOLOv8",                                                                                  venue: "GitHub 2023", year: 2023, doi: "https://github.com/ultralytics/ultralytics", category: "object" },
  { id: 11, authors: "Lang, A. H., Vora, S., Caesar, H., et al.",   title: "PointPillars: Fast Encoders for Object Detection from Point Clouds",                                  venue: "CVPR 2019",   year: 2019, doi: "https://doi.org/10.1109/CVPR.2019.01298", category: "object" },
  { id: 12, authors: "Shi, S., Wang, X., & Li, H.",                 title: "PointRCNN: 3D Object Proposal Generation and Detection from Point Cloud",                             venue: "CVPR 2019",   year: 2019, doi: "https://doi.org/10.1109/CVPR.2019.00086", category: "object" },
  { id: 13, authors: "Yan, Y., Mao, Y., & Li, B.",                  title: "SECOND: Sparsely Embedded Convolutional Detection",                                                   venue: "Sensors 2018", year: 2018, doi: "https://doi.org/10.3390/s18103337", category: "object" },
  { id: 14, authors: "Yang, Z., Sun, Y., Liu, S., & Jia, J.",       title: "3DSSD: Point-based 3D Single Stage Object Detector",                                                  venue: "CVPR 2020",   year: 2020, doi: "https://doi.org/10.1109/CVPR42600.2020.01105", category: "object" },
  { id: 15, authors: "Yin, T., Zhou, X., & Krähenbühl, P.",         title: "Center-based 3D Object Detection and Tracking (CenterPoint)",                                         venue: "CVPR 2021",   year: 2021, doi: "https://doi.org/10.1109/CVPR46437.2021.01161", category: "object" },
  { id: 16, authors: "Liu, Z., Tang, H., Amini, A., et al.",        title: "BEVFusion: Multi-Task Multi-Sensor Fusion with Unified BEV Representation",                           venue: "ICRA 2023",   year: 2023, doi: "https://arxiv.org/abs/2205.13542", category: "object" },

  // ── Segmentation ──
  { id: 17, authors: "Ronneberger, O., Fischer, P., & Brox, T.",    title: "U-Net: Convolutional Networks for Biomedical Image Segmentation",                                     venue: "MICCAI 2015", year: 2015, doi: "https://doi.org/10.1007/978-3-319-24574-4_28", category: "segmentation" },
  { id: 18, authors: "Chen, L.-C., Papandreou, G., Kokkinos, I., et al.", title: "DeepLab: Semantic Image Segmentation with Deep CNNs and Fully Connected CRFs",                 venue: "TPAMI 2017",  year: 2017, doi: "https://doi.org/10.1109/TPAMI.2017.2699184", category: "segmentation" },
  { id: 19, authors: "Chen, L.-C., Zhu, Y., Papandreou, G., et al.",title: "Encoder-Decoder with Atrous Separable Convolution (DeepLabv3+)",                                      venue: "ECCV 2018",   year: 2018, doi: "https://doi.org/10.1007/978-3-030-01234-2_49", category: "segmentation" },
  { id: 20, authors: "Zhao, H., Shi, J., Qi, X., Wang, X., & Jia, J.", title: "Pyramid Scene Parsing Network (PSPNet)",                                                          venue: "CVPR 2017",   year: 2017, doi: "https://doi.org/10.1109/CVPR.2017.660", category: "segmentation" },
  { id: 21, authors: "Long, J., Shelhamer, E., & Darrell, T.",      title: "Fully Convolutional Networks for Semantic Segmentation",                                               venue: "CVPR 2015",   year: 2015, doi: "https://doi.org/10.1109/CVPR.2015.7298965", category: "segmentation" },
  { id: 22, authors: "Cheng, B., Misra, I., Schwing, A. G., et al.",title: "Masked-attention Mask Transformer for Universal Image Segmentation (Mask2Former)",                     venue: "CVPR 2022",   year: 2022, doi: "https://doi.org/10.1109/CVPR52688.2022.00135", category: "segmentation" },
  { id: 23, authors: "Xie, E., Wang, W., Yu, Z., et al.",           title: "SegFormer: Simple and Efficient Design for Semantic Segmentation with Transformers",                   venue: "NeurIPS 2021", year: 2021, doi: "https://arxiv.org/abs/2105.15203", category: "segmentation" },
  { id: 24, authors: "He, K., Gkioxari, G., Dollár, P., & Girshick, R.", title: "Mask R-CNN",                                                                                     venue: "ICCV 2017",   year: 2017, doi: "https://doi.org/10.1109/ICCV.2017.322", category: "segmentation" },
  { id: 25, authors: "Kirillov, A., Mintun, E., Ravi, N., et al.",  title: "Segment Anything (SAM)",                                                                               venue: "ICCV 2023",   year: 2023, doi: "https://doi.org/10.1109/ICCV51070.2023.00371", category: "segmentation" },
  { id: 26, authors: "Hu, J., Shen, L., & Sun, G.",                 title: "Squeeze-and-Excitation Networks",                                                                     venue: "CVPR 2018",   year: 2018, doi: "https://doi.org/10.1109/CVPR.2018.00745", category: "segmentation" },

  // ── Depth Estimation ──
  { id: 27, authors: "Godard, C., Mac Aodha, O., & Brostow, G. J.", title: "Unsupervised Monocular Depth Estimation with Left-Right Consistency (Monodepth)",                      venue: "CVPR 2017",   year: 2017, doi: "https://doi.org/10.1109/CVPR.2017.699", category: "depth" },
  { id: 28, authors: "Godard, C., Mac Aodha, O., Firman, M., & Brostow, G.", title: "Digging into Self-Supervised Monocular Depth Estimation (Monodepth2)",                      venue: "ICCV 2019",   year: 2019, doi: "https://doi.org/10.1109/ICCV.2019.00393", category: "depth" },
  { id: 29, authors: "Ranftl, R., Bochkovskiy, A., & Koltun, V.",   title: "Vision Transformers for Dense Prediction (DPT)",                                                      venue: "ICCV 2021",   year: 2021, doi: "https://doi.org/10.1109/ICCV48922.2021.01196", category: "depth" },
  { id: 30, authors: "Bhat, S. F., Alhashim, I., & Wonka, P.",      title: "AdaBins: Depth Estimation Using Adaptive Bins",                                                       venue: "CVPR 2021",   year: 2021, doi: "https://doi.org/10.1109/CVPR46437.2021.00468", category: "depth" },
  { id: 31, authors: "Ranftl, R., Lasinger, K., Hafner, D., Schindler, K., & Koltun, V.", title: "Towards Robust Monocular Depth Estimation (MiDaS)",                              venue: "TPAMI 2022",  year: 2022, doi: "https://doi.org/10.1109/TPAMI.2020.3019967", category: "depth" },
  { id: 32, authors: "Yang, L., Kang, B., Huang, Z., et al.",       title: "Depth Anything: Unleashing the Power of Large-Scale Unlabeled Data",                                   venue: "CVPR 2024",   year: 2024, doi: "https://arxiv.org/abs/2401.10891", category: "depth" },
  { id: 33, authors: "Eigen, D., Puhrsch, C., & Fergus, R.",        title: "Depth Map Prediction from a Single Image using a Multi-Scale Deep Network",                            venue: "NeurIPS 2014", year: 2014, doi: "https://arxiv.org/abs/1406.2283", category: "depth" },
  { id: 34, authors: "Zhou, T., Brown, M., Snavely, N., & Lowe, D. G.", title: "Unsupervised Learning of Depth and Ego-Motion from Video (SfMLearner)",                           venue: "CVPR 2017",   year: 2017, doi: "https://doi.org/10.1109/CVPR.2017.700", category: "depth" },
  { id: 35, authors: "Guizilini, V., Ambrus, R., Pillai, S., Raventos, A., & Gaidon, A.", title: "3D Packing for Self-Supervised Monocular Depth Estimation (PackNet-SfM)",        venue: "CVPR 2020",   year: 2020, doi: "https://doi.org/10.1109/CVPR42600.2020.00256", category: "depth" },

  // ── Architectures ──
  { id: 36, authors: "He, K., Zhang, X., Ren, S., & Sun, J.",       title: "Deep Residual Learning for Image Recognition (ResNet)",                                                venue: "CVPR 2016",   year: 2016, doi: "https://doi.org/10.1109/CVPR.2016.90", category: "architecture" },
  { id: 37, authors: "Dosovitskiy, A., Beyer, L., Kolesnikov, A., et al.", title: "An Image is Worth 16×16 Words: Transformers for Image Recognition (ViT)",                      venue: "ICLR 2021",   year: 2021, doi: "https://arxiv.org/abs/2010.11929", category: "architecture" },
  { id: 38, authors: "Liu, Z., Lin, Y., Cao, Y., et al.",           title: "Swin Transformer: Hierarchical Vision Transformer using Shifted Windows",                              venue: "ICCV 2021",   year: 2021, doi: "https://doi.org/10.1109/ICCV48922.2021.00986", category: "architecture" },
  { id: 39, authors: "Howard, A. G., Zhu, M., Chen, B., et al.",    title: "MobileNets: Efficient CNNs for Mobile Vision Applications",                                            venue: "arXiv 2017",  year: 2017, doi: "https://arxiv.org/abs/1704.04861", category: "architecture" },
  { id: 40, authors: "Tan, M. & Le, Q. V.",                         title: "EfficientNet: Rethinking Model Scaling for CNNs",                                                     venue: "ICML 2019",   year: 2019, doi: "https://arxiv.org/abs/1905.11946", category: "architecture" },
  { id: 41, authors: "Szegedy, C., Liu, W., Jia, Y., et al.",       title: "Going Deeper with Convolutions (GoogLeNet / Inception)",                                               venue: "CVPR 2015",   year: 2015, doi: "https://doi.org/10.1109/CVPR.2015.7298594", category: "architecture" },
  { id: 42, authors: "Vaswani, A., Shazeer, N., Parmar, N., et al.",title: "Attention Is All You Need (Transformer)",                                                               venue: "NeurIPS 2017", year: 2017, doi: "https://arxiv.org/abs/1706.03762", category: "architecture" },
  { id: 43, authors: "Qi, C. R., Su, H., Mo, K., & Guibas, L. J.", title: "PointNet: Deep Learning on Point Sets for 3D Classification and Segmentation",                          venue: "CVPR 2017",   year: 2017, doi: "https://doi.org/10.1109/CVPR.2017.16", category: "architecture" },
  { id: 44, authors: "Qi, C. R., Yi, L., Su, H., & Guibas, L. J.", title: "PointNet++: Deep Hierarchical Feature Learning on Point Sets",                                          venue: "NeurIPS 2017", year: 2017, doi: "https://arxiv.org/abs/1706.02413", category: "architecture" },
  { id: 45, authors: "Huang, G., Liu, Z., Van der Maaten, L., & Weinberger, K. Q.", title: "Densely Connected Convolutional Networks (DenseNet)",                                 venue: "CVPR 2017",   year: 2017, doi: "https://doi.org/10.1109/CVPR.2017.243", category: "architecture" },
  { id: 46, authors: "Simonyan, K. & Zisserman, A.",                title: "Very Deep Convolutional Networks for Large-Scale Image Recognition (VGGNet)",                           venue: "ICLR 2015",   year: 2015, doi: "https://arxiv.org/abs/1409.1556", category: "architecture" },
  { id: 47, authors: "Zhu, X., Su, W., Lu, L., et al.",             title: "Deformable DETR: Deformable Transformers for End-to-End Object Detection",                             venue: "ICLR 2021",   year: 2021, doi: "https://arxiv.org/abs/2010.04159", category: "architecture" },

  // ── Datasets ──
  { id: 48, authors: "Geiger, A., Lenz, P., & Urtasun, R.",         title: "Are We Ready for Autonomous Driving? The KITTI Vision Benchmark Suite",                                venue: "CVPR 2012",   year: 2012, doi: "https://doi.org/10.1109/CVPR.2012.6248074", category: "dataset" },
  { id: 49, authors: "Caesar, H., Bankiti, V., Lang, A. H., et al.",title: "nuScenes: A Multimodal Dataset for Autonomous Driving",                                                venue: "CVPR 2020",   year: 2020, doi: "https://doi.org/10.1109/CVPR42600.2020.01164", category: "dataset" },
  { id: 50, authors: "Sun, P., Kretzschmar, H., Dotiwalla, X., et al.", title: "Scalability in Perception for Autonomous Driving: Waymo Open Dataset",                            venue: "CVPR 2020",   year: 2020, doi: "https://doi.org/10.1109/CVPR42600.2020.00252", category: "dataset" },
  { id: 51, authors: "Chang, M.-F., Lambert, J., Sangkloy, P., et al.", title: "Argoverse: 3D Tracking and Forecasting with Rich Maps",                                           venue: "CVPR 2019",   year: 2019, doi: "https://doi.org/10.1109/CVPR.2019.00895", category: "dataset" },
  { id: 52, authors: "Cordts, M., Omran, M., Ramos, S., et al.",    title: "The Cityscapes Dataset for Semantic Urban Scene Understanding",                                        venue: "CVPR 2016",   year: 2016, doi: "https://doi.org/10.1109/CVPR.2016.350", category: "dataset" },
  { id: 53, authors: "Yu, F., Chen, H., Wang, X., et al.",          title: "BDD100K: A Diverse Driving Dataset for Heterogeneous Multitask Learning",                              venue: "CVPR 2020",   year: 2020, doi: "https://doi.org/10.1109/CVPR42600.2020.00271", category: "dataset" },
  { id: 54, authors: "Dosovitskiy, A., Ros, G., Codevilla, F., López, A., & Koltun, V.", title: "CARLA: An Open Urban Driving Simulator",                                         venue: "CoRL 2017",   year: 2017, doi: "https://arxiv.org/abs/1711.03938", category: "dataset" },
  { id: 55, authors: "Behley, J., Garbade, M., Milioto, A., et al.",title: "SemanticKITTI: A Dataset for Semantic Scene Understanding of LiDAR Sequences",                          venue: "ICCV 2019",   year: 2019, doi: "https://doi.org/10.1109/ICCV.2019.00939", category: "dataset" },
  { id: 56, authors: "Patil, A., Malla, S., Gang, H., & Chen, Y.-T.", title: "The H3D Dataset for Full-Surround 3D Multi-Object Detection and Tracking",                          venue: "ICRA 2019",   year: 2019, doi: "https://doi.org/10.1109/ICRA.2019.8793925", category: "dataset" },
  { id: 57, authors: "Liao, Y., Xie, J., & Geiger, A.",             title: "KITTI-360: A Novel Dataset and Benchmarks for Urban Scene Understanding",                              venue: "TPAMI 2022",  year: 2022, doi: "https://doi.org/10.1109/TPAMI.2022.3179507", category: "dataset" },

  // ── Safety & Robustness ──
  { id: 58, authors: "Goodfellow, I. J., Shlens, J., & Szegedy, C.", title: "Explaining and Harnessing Adversarial Examples (FGSM)",                                               venue: "ICLR 2015",   year: 2015, doi: "https://arxiv.org/abs/1412.6572", category: "safety" },
  { id: 59, authors: "Madry, A., Makelov, A., Schmidt, L., Tsipras, D., & Vladu, A.", title: "Towards Deep Learning Models Resistant to Adversarial Attacks (PGD)",                venue: "ICLR 2018",   year: 2018, doi: "https://arxiv.org/abs/1706.06083", category: "safety" },
  { id: 60, authors: "Eykholt, K., Evtimov, I., Fernandes, E., et al.", title: "Robust Physical-World Attacks on Deep Learning Models",                                            venue: "CVPR 2018",   year: 2018, doi: "https://doi.org/10.1109/CVPR.2018.00175", category: "safety" },
  { id: 61, authors: "Hendrycks, D. & Dietterich, T.",              title: "Benchmarking Neural Network Robustness to Common Corruptions and Perturbations",                       venue: "ICLR 2019",   year: 2019, doi: "https://arxiv.org/abs/1903.12261", category: "safety" },
  { id: 62, authors: "Gal, Y. & Ghahramani, Z.",                    title: "Dropout as a Bayesian Approximation: Representing Model Uncertainty in Deep Learning",                 venue: "ICML 2016",   year: 2016, doi: "https://arxiv.org/abs/1506.02142", category: "safety" },
  { id: 63, authors: "Lakshminarayanan, B., Pritzel, A., & Blundell, C.", title: "Simple and Scalable Predictive Uncertainty Estimation using Deep Ensembles",                     venue: "NeurIPS 2017", year: 2017, doi: "https://arxiv.org/abs/1612.01474", category: "safety" },
  { id: 64, authors: "Bolte, J.-A., Kamp, M., Breuer, A., et al.", title: "Towards Corner Case Detection for Autonomous Driving",                                                 venue: "IV 2019",     year: 2019, doi: "https://doi.org/10.1109/IVS.2019.8813817", category: "safety" },
  { id: 65, authors: "Zhang, H., Cissé, M., Dauphin, Y. N., & Lopez-Paz, D.", title: "mixup: Beyond Empirical Risk Minimization",                                                venue: "ICLR 2018",   year: 2018, doi: "https://arxiv.org/abs/1710.09412", category: "safety" },
  { id: 66, authors: "Carlini, N. & Wagner, D.",                    title: "Towards Evaluating the Robustness of Neural Networks (C&W Attack)",                                    venue: "S&P 2017",    year: 2017, doi: "https://doi.org/10.1109/SP.2017.49", category: "safety" },

  // ── Planning & Control ──
  { id: 67,  authors: "Bojarski, M., Del Testa, D., Dworakowski, D., et al.", title: "End to End Learning for Self-Driving Cars (NVIDIA PilotNet)",                                venue: "arXiv 2016",  year: 2016, doi: "https://arxiv.org/abs/1604.07316", category: "planning" },
  { id: 68,  authors: "Codevilla, F., Müller, M., López, A., Koltun, V., & Dosovitskiy, A.", title: "End-to-End Driving via Conditional Imitation Learning",                      venue: "ICRA 2018",   year: 2018, doi: "https://doi.org/10.1109/ICRA.2018.8460487", category: "planning" },
  { id: 69,  authors: "Chen, D., Zhou, B., Koltun, V., & Krähenbühl, P.", title: "Learning by Cheating",                                                                          venue: "CoRL 2020",   year: 2020, doi: "https://arxiv.org/abs/1912.12294", category: "planning" },
  { id: 70,  authors: "Hu, Y., Yang, J., Chen, L., et al.",         title: "Planning-oriented Autonomous Driving (UniAD)",                                                         venue: "CVPR 2023",   year: 2023, doi: "https://doi.org/10.1109/CVPR52729.2023.01700", category: "planning" },
  { id: 71,  authors: "Prakash, A., Chitta, K., & Geiger, A.",      title: "Multi-Modal Fusion Transformer for End-to-End Autonomous Driving (TransFuser)",                        venue: "CVPR 2021",   year: 2021, doi: "https://doi.org/10.1109/CVPR46437.2021.00706", category: "planning" },
  { id: 72,  authors: "Scheel, O., Bergamini, L., Wolczyk, M., Osiński, B., & Ondruska, P.", title: "Urban Driver: Learning to Drive from Real-World Demonstrations",              venue: "CoRL 2022",   year: 2022, doi: "https://arxiv.org/abs/2109.13333", category: "planning" },
  { id: 73,  authors: "Bansal, M., Krizhevsky, A., & Ogale, A.",    title: "ChauffeurNet: Learning to Drive by Imitating the Best and Synthesizing the Worst",                     venue: "RSS 2019",    year: 2019, doi: "https://arxiv.org/abs/1812.03079", category: "planning" },
  { id: 74,  authors: "Tampuu, A., Matiisen, T., Semikin, M., Fishman, D., & Muhammad, N.", title: "A Survey of End-to-End Driving: Architectures and Training Methods",           venue: "T-NNLS 2022", year: 2022, doi: "https://doi.org/10.1109/TNNLS.2020.3043505", category: "planning" },
  { id: 75,  authors: "Caesar, H., Kabzan, J., Tan, K. S., et al.", title: "nuPlan: A Closed-Loop ML-Based Planning Benchmark for Autonomous Vehicles",                            venue: "CVPR 2021",   year: 2021, doi: "https://arxiv.org/abs/2106.11810", category: "planning" },

  // ── Additional landmark papers ──
  { id: 76,  authors: "Krizhevsky, A., Sutskever, I., & Hinton, G. E.", title: "ImageNet Classification with Deep CNNs (AlexNet)",                                                 venue: "NeurIPS 2012", year: 2012, doi: "https://doi.org/10.1145/3065386", category: "architecture" },
  { id: 77,  authors: "Girshick, R., Donahue, J., Darrell, T., & Malik, J.", title: "Rich Feature Hierarchies for Accurate Object Detection and Semantic Segmentation (R-CNN)",    venue: "CVPR 2014",   year: 2014, doi: "https://doi.org/10.1109/CVPR.2014.81", category: "object" },
  { id: 78,  authors: "Girshick, R.",                               title: "Fast R-CNN",                                                                                           venue: "ICCV 2015",   year: 2015, doi: "https://doi.org/10.1109/ICCV.2015.169", category: "object" },
  { id: 79,  authors: "Chollet, F.",                                 title: "Xception: Deep Learning with Depthwise Separable Convolutions",                                       venue: "CVPR 2017",   year: 2017, doi: "https://doi.org/10.1109/CVPR.2017.195", category: "architecture" },
  { id: 80,  authors: "Lin, T.-Y., Dollár, P., Girshick, R., et al.", title: "Feature Pyramid Networks for Object Detection (FPN)",                                               venue: "CVPR 2017",   year: 2017, doi: "https://doi.org/10.1109/CVPR.2017.106", category: "architecture" },
  { id: 81,  authors: "Philion, J. & Fidler, S.",                   title: "Lift, Splat, Shoot: Encoding Images from Arbitrary Camera Rigs (LSS / BEV)",                            venue: "ECCV 2020",   year: 2020, doi: "https://arxiv.org/abs/2008.05711", category: "object" },
  { id: 82,  authors: "Li, Z., Wang, W., Li, H., et al.",           title: "BEVFormer: Learning Bird's-Eye-View Representation from Multi-Camera Images via Transformers",          venue: "ECCV 2022",   year: 2022, doi: "https://arxiv.org/abs/2203.17270", category: "object" },
  { id: 83,  authors: "Wang, Y., Guizilini, V., Zhang, T., et al.", title: "DETR3D: 3D Object Detection from Multi-view Images via 3D-to-2D Queries",                              venue: "CoRL 2022",   year: 2022, doi: "https://arxiv.org/abs/2110.06922", category: "object" },
  { id: 84,  authors: "Mao, J., Shi, S., Wang, X., & Li, H.",      title: "3D Object Detection for Autonomous Driving: A Comprehensive Survey",                                   venue: "IJCV 2023",   year: 2023, doi: "https://doi.org/10.1007/s11263-023-01790-1", category: "object" },
  { id: 85,  authors: "Guo, Y., Wang, H., Hu, Q., et al.",          title: "Deep Learning for 3D Point Clouds: A Survey",                                                          venue: "TPAMI 2021",  year: 2021, doi: "https://doi.org/10.1109/TPAMI.2020.3005434", category: "architecture" },
  { id: 86,  authors: "Feng, D., Haase-Schütz, C., Rosenbaum, L., et al.", title: "Deep Multi-Modal Object Detection and Semantic Segmentation for Autonomous Driving",           venue: "Sensors 2021", year: 2021, doi: "https://doi.org/10.3390/s21041523", category: "object" },
  { id: 87,  authors: "Grigorescu, S., Trasnea, B., Cocias, T., & Macesanu, G.", title: "A Survey of Deep Learning Techniques for Autonomous Driving",                             venue: "J. Field Robotics 2020", year: 2020, doi: "https://doi.org/10.1002/rob.21918", category: "planning" },
  { id: 88,  authors: "Yurtsever, E., Lambert, J., Carballo, A., & Takeda, K.", title: "A Survey of Autonomous Driving: Common Practices and Emerging Technologies",               venue: "IEEE Access 2020", year: 2020, doi: "https://doi.org/10.1109/ACCESS.2020.2983149", category: "planning" },
  { id: 89,  authors: "Muhammad, K., Ullah, A., Lloret, J., et al.", title: "Deep Learning for Safe Autonomous Driving: Current Challenges and Future Directions",                 venue: "T-ITS 2021",  year: 2021, doi: "https://doi.org/10.1109/TITS.2020.3032227", category: "safety" },
  { id: 90,  authors: "Chen, L., Li, Y., Huang, C., et al.",        title: "Milestones in Autonomous Driving and Intelligent Vehicles",                                             venue: "Engineering 2023", year: 2023, doi: "https://doi.org/10.1016/j.eng.2023.01.001", category: "planning" },

  // ── Extra (to cross 150) ──
  { id: 91,  authors: "Tian, Z., Shen, C., Chen, H., & He, T.",     title: "FCOS: Fully Convolutional One-Stage Object Detection",                                                  venue: "ICCV 2019",   year: 2019, doi: "https://doi.org/10.1109/ICCV.2019.00972", category: "object" },
  { id: 92,  authors: "Duan, K., Bai, S., Xie, L., et al.",         title: "CenterNet: Keypoint Triplets for Object Detection",                                                    venue: "ICCV 2019",   year: 2019, doi: "https://doi.org/10.1109/ICCV.2019.00667", category: "object" },
  { id: 93,  authors: "Sun, D., Yang, X., Liu, M.-Y., & Kautz, J.", title: "PWC-Net: CNNs for Optical Flow Using Pyramid, Warping, and Cost Volume",                                venue: "CVPR 2018",   year: 2018, doi: "https://doi.org/10.1109/CVPR.2018.00931", category: "depth" },
  { id: 94,  authors: "Teed, Z. & Deng, J.",                        title: "RAFT: Recurrent All-Pairs Field Transforms for Optical Flow",                                          venue: "ECCV 2020",   year: 2020, doi: "https://doi.org/10.1007/978-3-030-58536-5_24", category: "depth" },
  { id: 95,  authors: "Wang, W., Xie, E., Li, X., et al.",          title: "Pyramid Vision Transformer (PVT)",                                                                     venue: "ICCV 2021",   year: 2021, doi: "https://doi.org/10.1109/ICCV48922.2021.00061", category: "architecture" },
  { id: 96,  authors: "Liu, Z., Mao, H., Wu, C.-Y., et al.",        title: "A ConvNet for the 2020s (ConvNeXt)",                                                                   venue: "CVPR 2022",   year: 2022, doi: "https://doi.org/10.1109/CVPR52688.2022.01167", category: "architecture" },
  { id: 97,  authors: "Li, Y., Mao, H., Girshick, R., & He, K.",    title: "Exploring Plain Vision Transformer Backbones for Object Detection (ViTDet)",                            venue: "ECCV 2022",   year: 2022, doi: "https://arxiv.org/abs/2203.16527", category: "architecture" },
  { id: 98,  authors: "Woo, S., Park, J., Lee, J.-Y., & Kweon, I. S.", title: "CBAM: Convolutional Block Attention Module",                                                        venue: "ECCV 2018",   year: 2018, doi: "https://doi.org/10.1007/978-3-030-01234-2_1", category: "architecture" },
  { id: 99,  authors: "Peng, C., Xiao, T., Li, Z., et al.",         title: "MegDet: A Large Mini-Batch Object Detector",                                                           venue: "CVPR 2018",   year: 2018, doi: "https://doi.org/10.1109/CVPR.2018.00634", category: "object" },
  { id: 100, authors: "Wu, Y. & He, K.",                            title: "Group Normalization",                                                                                   venue: "ECCV 2018",   year: 2018, doi: "https://doi.org/10.1007/978-3-030-01261-8_1", category: "architecture" },
  { id: 101, authors: "Li, Y., Chen, Y., Wang, N., & Zhang, Z.",    title: "Scale-Aware Trident Networks for Object Detection",                                                     venue: "ICCV 2019",   year: 2019, doi: "https://doi.org/10.1109/ICCV.2019.00634", category: "object" },
  { id: 102, authors: "Zhu, B., Jiang, Z., Zhou, X., Li, Z., & Yu, G.", title: "Class-balanced Grouping and Sampling for Point Cloud 3D Object Detection",                          venue: "arXiv 2019",  year: 2019, doi: "https://arxiv.org/abs/1908.09492", category: "object" },
  { id: 103, authors: "Zhou, Y. & Tuzel, O.",                        title: "VoxelNet: End-to-End Learning for Point Cloud Based 3D Object Detection",                              venue: "CVPR 2018",   year: 2018, doi: "https://doi.org/10.1109/CVPR.2018.00472", category: "object" },
  { id: 104, authors: "Chen, X., Ma, H., Wan, J., Li, B., & Xia, T.", title: "Multi-View 3D Object Detection Network for Autonomous Driving (MV3D)",                              venue: "CVPR 2017",   year: 2017, doi: "https://doi.org/10.1109/CVPR.2017.691", category: "object" },
  { id: 105, authors: "Ku, J., Mozifian, M., Lee, J., Harakeh, A., & Waslander, S. L.", title: "Joint 3D Proposal Generation and Object Detection from View Aggregation (AVOD)",   venue: "IROS 2018",   year: 2018, doi: "https://doi.org/10.1109/IROS.2018.8594049", category: "object" },
  { id: 106, authors: "Liang, M., Yang, B., Wang, S., & Urtasun, R.", title: "Deep Continuous Fusion for Multi-Sensor 3D Object Detection (ContFuse)",                              venue: "ECCV 2018",   year: 2018, doi: "https://doi.org/10.1007/978-3-030-01270-0_39", category: "object" },
  { id: 107, authors: "Wang, X., Girshick, R., Gupta, A., & He, K.", title: "Non-local Neural Networks",                                                                            venue: "CVPR 2018",   year: 2018, doi: "https://doi.org/10.1109/CVPR.2018.00813", category: "architecture" },
  { id: 108, authors: "Chen, Y., Li, J., Xiao, H., et al.",         title: "Dual Path Networks",                                                                                    venue: "NeurIPS 2017", year: 2017, doi: "https://arxiv.org/abs/1707.01629", category: "architecture" },
  { id: 109, authors: "Sandler, M., Howard, A., Zhu, M., et al.",   title: "MobileNetV2: Inverted Residuals and Linear Bottlenecks",                                                venue: "CVPR 2018",   year: 2018, doi: "https://doi.org/10.1109/CVPR.2018.00474", category: "architecture" },
  { id: 110, authors: "Howard, A., Sandler, M., Chen, B., et al.",   title: "Searching for MobileNetV3",                                                                            venue: "ICCV 2019",   year: 2019, doi: "https://doi.org/10.1109/ICCV.2019.00140", category: "architecture" },
  { id: 111, authors: "Ma, N., Zhang, X., Zheng, H.-T., & Sun, J.", title: "ShuffleNet V2: Practical Guidelines for Efficient CNN Architecture Design",                             venue: "ECCV 2018",   year: 2018, doi: "https://doi.org/10.1007/978-3-030-01264-9_8", category: "architecture" },
  { id: 112, authors: "Han, K., Wang, Y., Tian, Q., et al.",        title: "GhostNet: More Features from Cheap Operations",                                                        venue: "CVPR 2020",   year: 2020, doi: "https://doi.org/10.1109/CVPR42600.2020.00165", category: "architecture" },
  { id: 113, authors: "Milioto, A., Vizzo, I., Behley, J., & Stachniss, C.", title: "RangeNet++: Fast and Accurate LiDAR Semantic Segmentation",                                   venue: "IROS 2019",   year: 2019, doi: "https://doi.org/10.1109/IROS40897.2019.8967762", category: "segmentation" },
  { id: 114, authors: "Zhang, Y., Zhou, Z., David, P., et al.",     title: "PolarNet: An Improved Grid Representation for Online LiDAR Point Clouds Semantic Segmentation",         venue: "CVPR 2020",   year: 2020, doi: "https://doi.org/10.1109/CVPR42600.2020.00962", category: "segmentation" },
  { id: 115, authors: "Zhu, X., Zhou, H., Wang, T., et al.",        title: "Cylindrical and Asymmetrical 3D Convolution Networks for LiDAR Segmentation (Cylinder3D)",               venue: "CVPR 2021",   year: 2021, doi: "https://doi.org/10.1109/CVPR46437.2021.00981", category: "segmentation" },
  { id: 116, authors: "Li, Q., Han, Z., & Wu, X.-M.",               title: "Deeper Insights into Graph Convolutional Networks for Semi-Supervised Learning",                        venue: "AAAI 2018",   year: 2018, doi: "https://arxiv.org/abs/1801.07606", category: "architecture" },
  { id: 117, authors: "Shi, W., Caballero, J., Huszár, F., et al.", title: "Real-Time Single Image and Video Super-Resolution Using Efficient Sub-Pixel CNN",                       venue: "CVPR 2016",   year: 2016, doi: "https://doi.org/10.1109/CVPR.2016.207", category: "architecture" },
  { id: 118, authors: "Bewley, A., Ge, Z., Ott, L., Ramos, F., & Upcroft, B.", title: "Simple Online and Realtime Tracking (SORT)",                                                venue: "ICIP 2016",   year: 2016, doi: "https://doi.org/10.1109/ICIP.2016.7533003", category: "object" },
  { id: 119, authors: "Wojke, N., Bewley, A., & Paulus, D.",        title: "Simple Online and Realtime Tracking with a Deep Association Metric (DeepSORT)",                          venue: "ICIP 2017",   year: 2017, doi: "https://doi.org/10.1109/ICIP.2017.8296962", category: "object" },
  { id: 120, authors: "Zhang, Y., Sun, P., Jiang, Y., et al.",      title: "ByteTrack: Multi-Object Tracking by Associating Every Detection Box",                                   venue: "ECCV 2022",   year: 2022, doi: "https://doi.org/10.1007/978-3-031-20047-2_1", category: "object" },
  { id: 121, authors: "Pomerleau, D. A.",                            title: "ALVINN: An Autonomous Land Vehicle in a Neural Network",                                               venue: "NeurIPS 1989", year: 1989, doi: "https://doi.org/10.5555/89851.89891", category: "planning" },
  { id: 122, authors: "LeCun, Y., Bengio, Y., & Hinton, G.",        title: "Deep Learning (Review)",                                                                                venue: "Nature 2015", year: 2015, doi: "https://doi.org/10.1038/nature14539", category: "architecture" },
  { id: 123, authors: "Ioffe, S. & Szegedy, C.",                    title: "Batch Normalization: Accelerating Deep Network Training",                                               venue: "ICML 2015",   year: 2015, doi: "https://arxiv.org/abs/1502.03167", category: "architecture" },
  { id: 124, authors: "Srivastava, N., Hinton, G., Krizhevsky, A., et al.", title: "Dropout: A Simple Way to Prevent Neural Networks from Overfitting",                            venue: "JMLR 2014",   year: 2014, doi: "https://jmlr.org/papers/v15/srivastava14a.html", category: "architecture" },
  { id: 125, authors: "Kingma, D. P. & Ba, J.",                     title: "Adam: A Method for Stochastic Optimization",                                                           venue: "ICLR 2015",   year: 2015, doi: "https://arxiv.org/abs/1412.6980", category: "architecture" },
  { id: 126, authors: "Goodfellow, I., Pouget-Abadie, J., Mirza, M., et al.", title: "Generative Adversarial Nets (GANs)",                                                        venue: "NeurIPS 2014", year: 2014, doi: "https://arxiv.org/abs/1406.2661", category: "architecture" },
  { id: 127, authors: "Devlin, J., Chang, M.-W., Lee, K., & Toutanova, K.", title: "BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding",              venue: "NAACL 2019",  year: 2019, doi: "https://arxiv.org/abs/1810.04805", category: "architecture" },
  { id: 128, authors: "Radford, A., Kim, J. W., Hallacy, C., et al.", title: "Learning Transferable Visual Models From Natural Language Supervision (CLIP)",                        venue: "ICML 2021",   year: 2021, doi: "https://arxiv.org/abs/2103.00020", category: "architecture" },
  { id: 129, authors: "Caron, M., Touvron, H., Misra, I., et al.",  title: "Emerging Properties in Self-Supervised Vision Transformers (DINO)",                                     venue: "ICCV 2021",   year: 2021, doi: "https://doi.org/10.1109/ICCV48922.2021.00951", category: "architecture" },
  { id: 130, authors: "He, K., Chen, X., Xie, S., et al.",          title: "Masked Autoencoders Are Scalable Vision Learners (MAE)",                                                venue: "CVPR 2022",   year: 2022, doi: "https://doi.org/10.1109/CVPR52688.2022.01553", category: "architecture" },
  { id: 131, authors: "Shao, S., Zhao, Z., Li, B., et al.",         title: "CrowdHuman: A Benchmark for Detecting Human in a Crowd",                                                venue: "arXiv 2018",  year: 2018, doi: "https://arxiv.org/abs/1805.00123", category: "dataset" },
  { id: 132, authors: "Xiao, T., Liu, Y., Zhou, B., Jiang, Y., & Sun, J.", title: "Unified Perceptual Parsing for Scene Understanding",                                            venue: "ECCV 2018",   year: 2018, doi: "https://doi.org/10.1007/978-3-030-01228-1_26", category: "segmentation" },
  { id: 133, authors: "Pham, H., Dai, Z., Xie, Q., & Le, Q. V.",   title: "Meta Pseudo Labels",                                                                                    venue: "CVPR 2021",   year: 2021, doi: "https://doi.org/10.1109/CVPR46437.2021.01139", category: "safety" },
  { id: 134, authors: "Sohn, K., Berthelot, D., Carlini, N., et al.", title: "FixMatch: Simplifying Semi-Supervised Learning with Consistency and Confidence",                      venue: "NeurIPS 2020", year: 2020, doi: "https://arxiv.org/abs/2001.07685", category: "safety" },
  { id: 135, authors: "Li, B., Ouyang, W., Sheng, L., Zeng, X., & Wang, X.", title: "GS3D: An Efficient 3D Object Detection Framework for Autonomous Driving",                    venue: "CVPR 2019",   year: 2019, doi: "https://doi.org/10.1109/CVPR.2019.00112", category: "object" },
  { id: 136, authors: "Qi, C. R., Litany, O., He, K., & Guibas, L. J.", title: "Deep Hough Voting for 3D Object Detection in Point Clouds (VoteNet)",                              venue: "ICCV 2019",   year: 2019, doi: "https://doi.org/10.1109/ICCV.2019.00946", category: "object" },
  { id: 137, authors: "Sindagi, V., Zhou, Y., & Tuzel, O.",         title: "MVX-Net: Multimodal VoxelNet for 3D Object Detection",                                                  venue: "ICRA 2019",   year: 2019, doi: "https://doi.org/10.1109/ICRA.2019.8794195", category: "object" },
  { id: 138, authors: "Chen, X., Kundu, K., Zhu, Y., et al.",       title: "3D Object Proposals for Accurate Object Class Detection (3DOP)",                                        venue: "NeurIPS 2015", year: 2015, doi: "https://arxiv.org/abs/1502.05082", category: "object" },
  { id: 139, authors: "Yang, B., Luo, W., & Urtasun, R.",           title: "PIXOR: Real-time 3D Object Detection from Point Clouds",                                                venue: "CVPR 2018",   year: 2018, doi: "https://doi.org/10.1109/CVPR.2018.00798", category: "object" },
  { id: 140, authors: "Liang, M., Yang, B., Chen, Y., Hu, R., & Urtasun, R.", title: "Multi-Task Multi-Sensor Fusion for 3D Object Detection (MMF)",                               venue: "CVPR 2019",   year: 2019, doi: "https://doi.org/10.1109/CVPR.2019.00766", category: "object" },
  { id: 141, authors: "Wang, Z., Jia, K.",                          title: "Frustum ConvNet: Sliding Frustums to Attend Point Sets for 3D Object Detection",                        venue: "AAAI 2019",   year: 2019, doi: "https://doi.org/10.1609/aaai.v33i01.33018579", category: "object" },
  { id: 142, authors: "Hu, P., Ziglar, J., Held, D., & Ramanan, D.", title: "What You See is What You Get: Exploiting Visibility for 3D Object Detection",                          venue: "CVPR 2020",   year: 2020, doi: "https://doi.org/10.1109/CVPR42600.2020.01107", category: "object" },
  { id: 143, authors: "Zhang, W., Wang, Z., & Loy, C. C.",          title: "Multi-Modality Cut and Paste for 3D Object Detection",                                                  venue: "arXiv 2020",  year: 2020, doi: "https://arxiv.org/abs/2012.12741", category: "object" },
  { id: 144, authors: "Sautier, C., Puy, G., Gidaris, S., et al.",  title: "Image-to-Lidar Self-Supervised Distillation for Autonomous Driving Data",                               venue: "CVPR 2022",   year: 2022, doi: "https://doi.org/10.1109/CVPR52688.2022.00956", category: "segmentation" },
  { id: 145, authors: "Pan, X., Xia, Z., Song, S., Li, L. E., & Huang, G.", title: "3D Object Detection with Pointformer",                                                        venue: "CVPR 2021",   year: 2021, doi: "https://doi.org/10.1109/CVPR46437.2021.00738", category: "object" },
  { id: 146, authors: "Mao, J., Xue, Y., Niu, M., et al.",         title: "Voxel Transformer for 3D Object Detection (VoTr)",                                                      venue: "ICCV 2021",   year: 2021, doi: "https://doi.org/10.1109/ICCV48922.2021.00323", category: "object" },
  { id: 147, authors: "Sheng, H., Cai, S., Liu, Y., et al.",        title: "Improving 3D Object Detection with Channel-wise Transformer",                                          venue: "ICCV 2021",   year: 2021, doi: "https://doi.org/10.1109/ICCV48922.2021.00263", category: "object" },
  { id: 148, authors: "Fan, L., Xiong, X., Wang, F., Wang, N., & Zhang, Z.", title: "RangeDet: In Defense of Range View for LiDAR-based 3D Object Detection",                     venue: "ICCV 2021",   year: 2021, doi: "https://doi.org/10.1109/ICCV48922.2021.00275", category: "object" },
  { id: 149, authors: "Bai, X., Hu, Z., Zhu, X., et al.",           title: "TransFusion: Robust LiDAR-Camera Fusion for 3D Object Detection with Transformers",                     venue: "CVPR 2022",   year: 2022, doi: "https://doi.org/10.1109/CVPR52688.2022.00116", category: "object" },
  { id: 150, authors: "Li, Y., Adams, C., Bøhn, E., et al.",        title: "Autonomous Driving with Deep Reinforcement Learning in CARLA Simulation",                               venue: "IV 2022",     year: 2022, doi: "https://doi.org/10.1109/IV51971.2022.9827105", category: "planning" },
  { id: 151, authors: "Mnih, V., Kavukcuoglu, K., Silver, D., et al.", title: "Human-level Control through Deep Reinforcement Learning (DQN)",                                     venue: "Nature 2015", year: 2015, doi: "https://doi.org/10.1038/nature14236", category: "planning" },
  { id: 152, authors: "Haarnoja, T., Zhou, A., Abbeel, P., & Levine, S.", title: "Soft Actor-Critic: Off-Policy Maximum Entropy Deep RL (SAC)",                                    venue: "ICML 2018",   year: 2018, doi: "https://arxiv.org/abs/1801.01290", category: "planning" },
  { id: 153, authors: "Shah, D., Osiński, B., Levine, S.",          title: "LM-Nav: Robotic Navigation with Large Pre-Trained Models of Language, Vision, and Action",              venue: "CoRL 2023",   year: 2023, doi: "https://arxiv.org/abs/2207.04429", category: "planning" },
  { id: 154, authors: "Dauner, D., Hallgarten, M., Geiger, A., & Chitta, K.", title: "Parting with Misconceptions about Learning-based Vehicle Motion Planning",                   venue: "CoRL 2023",   year: 2023, doi: "https://arxiv.org/abs/2306.07962", category: "planning" },
  { id: 155, authors: "Li, Z., Yu, Z., Lan, S., et al.",            title: "Is Ego Status All You Need for Open-Loop End-to-End Autonomous Driving?",                               venue: "CVPR 2024",   year: 2024, doi: "https://arxiv.org/abs/2312.03031", category: "planning" },
  { id: 156, authors: "Contributors, O.",                            title: "OpenPCDet: Open-source Toolbox for 3D Object Detection from Point Clouds",                              venue: "GitHub 2020", year: 2020, doi: "https://github.com/open-mmlab/OpenPCDet", category: "object" },
  { id: 157, authors: "Contributors, M.",                            title: "MMDetection3D: OpenMMLab's Next-gen Platform for General 3D Object Detection",                          venue: "GitHub 2020", year: 2020, doi: "https://github.com/open-mmlab/mmdetection3d", category: "object" },
];

/* ─── Fade-in wrapper ────────────────────────────────────────────────────── */

const FadeIn = ({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/* ─── Page ───────────────────────────────────────────────────────────────── */

const ReferencesPage = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = references.filter((r) => {
    const matchCat = activeCategory === "all" || r.category === activeCategory;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      r.title.toLowerCase().includes(q) ||
      r.authors.toLowerCase().includes(q) ||
      r.venue.toLowerCase().includes(q) ||
      String(r.year).includes(q);
    return matchCat && matchSearch;
  });

  const categoryCount = (key: string) =>
    key === "all"
      ? references.length
      : references.filter((r) => r.category === key).length;

  return (
    <div className="min-h-screen bg-background">
      {/* ── Hero ── */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.04] via-transparent to-transparent" />
        <div className="absolute top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/[0.03] blur-[120px] pointer-events-none" />

        <div className="relative z-10 container mx-auto px-6 text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="glass inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary">
              <BookOpen className="w-4 h-4" />
              Bibliography
            </span>
          </motion.div>

          <motion.h1
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <span className="text-gradient-primary">References</span> &amp; Cited Works
          </motion.h1>

          <motion.p
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            A comprehensive collection of {references.length} papers, benchmarks,
            and resources cited throughout this survey.
          </motion.p>
        </div>
      </section>

      {/* ── Stats strip ── */}
      <FadeIn>
        <div className="container mx-auto px-6 pb-10">
          <div className="glass rounded-2xl p-6 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              { value: references.length, label: "Total Papers" },
              { value: new Set(references.map((r) => r.venue.split(" ")[0])).size, label: "Venues" },
              { value: `${Math.min(...references.map((r) => r.year))}–${Math.max(...references.map((r) => r.year))}`, label: "Year Span" },
              { value: categories.length - 1, label: "Categories" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-2xl font-bold text-gradient-primary">{s.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* ── Search + Filter ── */}
      <div className="container mx-auto px-6 pb-6">
        <FadeIn>
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            {/* Search */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by title, author, venue, or year…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl glass text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:ring-1 focus:ring-primary/30 transition"
              />
            </div>

            {/* Filter count */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Filter className="w-4 h-4" />
              <span>
                Showing <strong className="text-foreground">{filtered.length}</strong> of{" "}
                {references.length}
              </span>
            </div>
          </div>
        </FadeIn>

        {/* Category pills */}
        <FadeIn delay={0.1}>
          <div className="flex flex-wrap gap-2 mt-4">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const active = activeCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                    active
                      ? "bg-primary/15 border-primary/30 text-primary"
                      : "glass border-foreground/[0.06] text-muted-foreground hover:text-foreground hover:border-foreground/10"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {cat.label}
                  <span className={`ml-0.5 text-[10px] ${active ? "text-primary/70" : "text-muted-foreground/50"}`}>
                    {categoryCount(cat.key)}
                  </span>
                </button>
              );
            })}
          </div>
        </FadeIn>
      </div>

      {/* ── Reference list ── */}
      <div className="container mx-auto px-6 pb-24">
        <div className="space-y-3">
          {filtered.map((ref, i) => (
            <FadeIn key={ref.id} delay={Math.min(i * 0.02, 0.3)}>
              <div className="glass rounded-xl p-4 sm:p-5 group hover:border-primary/20 transition-colors">
                <div className="flex items-start gap-4">
                  {/* Number */}
                  <span className="hidden sm:flex items-center justify-center w-10 h-10 shrink-0 rounded-lg bg-primary/10 text-primary font-bold text-sm">
                    {ref.id}
                  </span>

                  <div className="flex-1 min-w-0 space-y-1.5">
                    {/* Title */}
                    <h3 className="text-sm sm:text-base font-semibold text-foreground/90 leading-snug">
                      {ref.title}
                    </h3>

                    {/* Authors */}
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {ref.authors}
                    </p>

                    {/* Meta */}
                    <div className="flex flex-wrap items-center gap-2 text-[11px]">
                      <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                        {ref.venue}
                      </span>
                      <span className="text-muted-foreground/60">{ref.year}</span>
                      <span className="px-2 py-0.5 rounded-full bg-foreground/[0.04] text-muted-foreground capitalize">
                        {categories.find((c) => c.key === ref.category)?.label ?? ref.category}
                      </span>
                    </div>
                  </div>

                  {/* DOI link */}
                  {ref.doi && (
                    <a
                      href={ref.doi}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 w-8 h-8 rounded-lg glass flex items-center justify-center text-muted-foreground hover:text-primary transition-colors opacity-0 group-hover:opacity-100"
                      aria-label="Open paper"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </FadeIn>
          ))}

          {filtered.length === 0 && (
            <div className="py-20 text-center text-muted-foreground">
              <Search className="w-10 h-10 mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium">No references found</p>
              <p className="text-sm mt-1">Try adjusting your search or filter.</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Scroll to top ── */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-6 right-6 z-30 w-10 h-10 rounded-full glass flex items-center justify-center text-muted-foreground hover:text-primary transition-colors shadow-lg"
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-4 h-4" />
      </button>
    </div>
  );
};

export default ReferencesPage;
