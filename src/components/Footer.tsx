import { Link } from "react-router-dom";
import { Cpu, Github, ExternalLink, Heart, ArrowUp } from "lucide-react";

const quickLinks = [
  { label: "Home", path: "/" },
  { label: "Techniques", path: "/techniques" },
  { label: "Architectures", path: "/architectures" },
  { label: "Datasets", path: "/datasets" },
  { label: "Challenges", path: "/challenges" },
  { label: "Dashboard", path: "/dashboard" },
  { label: "Future Scope", path: "/future-scope" },
  { label: "References", path: "/references" },
];

const resources = [
  { label: "KITTI Benchmark", href: "https://www.cvlibs.net/datasets/kitti/" },
  { label: "nuScenes", href: "https://www.nuscenes.org/" },
  { label: "Waymo Open Dataset", href: "https://waymo.com/open/" },
  { label: "Argoverse", href: "https://www.argoverse.org/" },
];

const Footer = () => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="relative border-t border-foreground/[0.06] bg-background/80 backdrop-blur-xl">
      {/* Glow line at top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="container mx-auto px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* ── Brand ── */}
          <div className="sm:col-span-2 lg:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-2.5 group w-fit">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-primary/10 border border-primary/20 group-hover:border-primary/40 transition-colors">
                <Cpu className="w-4 h-4 text-primary" />
              </div>
              <div className="leading-tight">
                <span className="text-sm font-extrabold tracking-tight text-foreground/90">IntelliRideX</span>
                <span className="block text-[9px] text-muted-foreground font-medium tracking-widest uppercase leading-none">
                  Survey 2026
                </span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              An interactive research survey exploring deep learning-based
              computer vision techniques for autonomous vehicles.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://github.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg glass flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* ── Quick Links ── */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-foreground/60">
              Pages
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Resources ── */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-foreground/60">
              Resources
            </h4>
            <ul className="space-y-2">
              {resources.map((r) => (
                <li key={r.label}>
                  <a
                    href={r.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1.5"
                  >
                    {r.label}
                    <ExternalLink className="w-3 h-3 opacity-40" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ── About ── */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-foreground/60">
              About
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              This project is a comprehensive survey on deep learning
              approaches for autonomous driving perception, planning, and
              decision-making systems.
            </p>
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors group"
            >
              Back to top
              <ArrowUp className="w-3 h-3 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="mt-14 pt-6 border-t border-foreground/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p className="flex items-center gap-1">
            © {new Date().getFullYear()} IntelliRideX — Built with
            <Heart className="w-3 h-3 text-red-400 fill-red-400 mx-0.5" />
            by Suraj Nandan
          </p>
          <p className="text-muted-foreground/60">
            Deep Learning &middot; Computer Vision &middot; Autonomous Vehicles
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
