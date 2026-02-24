import { motion } from "framer-motion";
import { ArrowRight, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import HeroBackground from "./HeroBackground";
import NeuralVisual from "./NeuralVisual";

const Hero = () => (
  <section className="relative min-h-screen flex items-center overflow-hidden">
    <HeroBackground />

    <div className="relative z-10 container mx-auto px-6 py-20">
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Left content */}
        <div className="space-y-8">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="glass inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              Survey Paper — 2026
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            A Survey on{" "}
            <span className="text-gradient-primary">Deep Learning</span>-Based
            Computer Vision for{" "}
            <span className="text-gradient-primary">Autonomous Vehicles</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            className="text-lg sm:text-xl text-muted-foreground max-w-xl leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            Exploring perception, decision-making, and intelligent mobility
            using deep learning and computer vision.
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="flex flex-wrap gap-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
          >
            <Button size="lg" className="gap-2 glow-primary text-base font-semibold" asChild>
              <Link to="/references">
                <BookOpen className="w-5 h-5" />
                Read Paper
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="gap-2 text-base font-semibold border-foreground/10 bg-muted/30 backdrop-blur-sm hover:bg-muted/50"
              asChild
            >
              <Link to="/techniques">
                Explore Techniques
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="flex gap-8 pt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.6 }}
          >
            {[
              { value: "150+", label: "References" },
              { value: "12", label: "Techniques" },
              { value: "2026", label: "Published" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl font-bold text-gradient-primary">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right visual */}
        <motion.div
          className="hidden lg:block"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <NeuralVisual />
        </motion.div>
      </div>
    </div>

    {/* Bottom fade */}
    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
  </section>
);

export default Hero;
