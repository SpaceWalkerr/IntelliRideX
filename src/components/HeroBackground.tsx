import { motion } from "framer-motion";

const blobs = [
  { color: "bg-primary/20", size: "w-[500px] h-[500px]", pos: "top-[-10%] left-[-5%]", duration: 18 },
  { color: "bg-secondary/20", size: "w-[400px] h-[400px]", pos: "bottom-[-5%] right-[-5%]", duration: 22 },
  { color: "bg-accent/10", size: "w-[300px] h-[300px]", pos: "top-[40%] right-[20%]", duration: 15 },
  { color: "bg-primary/10", size: "w-[250px] h-[250px]", pos: "bottom-[20%] left-[30%]", duration: 20 },
];

const HeroBackground = () => (
  <div className="absolute inset-0 overflow-hidden">
    {/* Gradient base */}
    <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />
    
    {/* Grid overlay */}
    <div
      className="absolute inset-0 opacity-[0.03]"
      style={{
        backgroundImage: `linear-gradient(hsl(var(--primary) / 0.3) 1px, transparent 1px),
                          linear-gradient(90deg, hsl(var(--primary) / 0.3) 1px, transparent 1px)`,
        backgroundSize: "60px 60px",
      }}
    />

    {/* Floating blobs */}
    {blobs.map((blob, i) => (
      <motion.div
        key={i}
        className={`absolute rounded-full blur-[100px] ${blob.color} ${blob.size} ${blob.pos}`}
        animate={{
          x: [0, 30, -20, 0],
          y: [0, -25, 15, 0],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{
          duration: blob.duration,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    ))}
  </div>
);

export default HeroBackground;
