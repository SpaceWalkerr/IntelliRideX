import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Cpu } from "lucide-react";

/* ─── Nav items ─────────────────────────────────────────────────────────── */

const navItems = [
  { label: "Home",          path: "/",              ready: true  },
  { label: "Techniques",    path: "/techniques",    ready: true  },
  { label: "Architectures", path: "/architectures", ready: false },
  { label: "Datasets",      path: "/datasets",      ready: true  },
  { label: "Challenges",    path: "/challenges",    ready: false },
  { label: "Dashboard",     path: "/dashboard",     ready: true  },
  { label: "Future Scope",  path: "/future-scope",  ready: false },
];

/* ─── Navbar ─────────────────────────────────────────────────────────────── */

const Navbar = () => {
  const [scrolled, setScrolled]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();

  /* Close mobile menu on route change */
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  /* Detect scroll for blur transition */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (path: string) =>
    path === "/" ? pathname === "/" : pathname.startsWith(path);

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled ? "bg-background/70 backdrop-blur-xl border-b border-foreground/[0.06] shadow-lg shadow-black/20" : "bg-transparent"
        }`}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">

            {/* ── Logo ── */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-primary/10 border border-primary/20 group-hover:border-primary/40 transition-colors">
                <Cpu className="w-4 h-4 text-primary" />
              </div>
              <div className="leading-tight">
                <span className="text-sm font-extrabold tracking-tight text-foreground/90">IntelliRideX</span>
                <span className="hidden sm:block text-[9px] text-muted-foreground font-medium tracking-widest uppercase leading-none">
                  Survey 2025
                </span>
              </div>
            </Link>

            {/* ── Desktop nav ── */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => {
                const active = isActive(item.path);
                return (
                  <div key={item.path} className="relative group">
                    <Link
                      to={item.ready ? item.path : "#"}
                      onClick={(e) => !item.ready && e.preventDefault()}
                      className={`relative px-3.5 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-1.5 ${
                        active
                          ? "text-primary"
                          : item.ready
                          ? "text-muted-foreground hover:text-foreground/90 hover:bg-foreground/[0.04]"
                          : "text-muted-foreground/40 cursor-default"
                      }`}
                    >
                      {item.label}
                      {!item.ready && (
                        <span className="text-[8px] font-bold uppercase tracking-wider px-1 py-0.5 rounded bg-muted/60 text-muted-foreground/50 leading-none">
                          soon
                        </span>
                      )}
                      {/* Active underline pill */}
                      {active && (
                        <motion.div
                          layoutId="nav-active"
                          className="absolute inset-0 rounded-lg bg-primary/10 border border-primary/20"
                          transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        />
                      )}
                    </Link>
                  </div>
                );
              })}
            </nav>

            {/* ── Read Paper CTA + Hamburger ── */}
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="hidden sm:inline-flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-semibold bg-primary/10 border border-primary/25 text-primary hover:bg-primary/20 transition-colors glow-primary"
              >
                Read Paper
              </a>
              <button
                className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg glass text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setMobileOpen((v) => !v)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* ── Mobile drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />

            {/* Panel */}
            <motion.nav
              className="fixed top-16 left-0 right-0 z-30 lg:hidden border-b border-foreground/[0.06] bg-background/95 backdrop-blur-xl px-6 py-4"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ type: "spring", stiffness: 320, damping: 30 }}
            >
              <div className="flex flex-col gap-1">
                {navItems.map((item) => {
                  const active = isActive(item.path);
                  return (
                    <Link
                      key={item.path}
                      to={item.ready ? item.path : "#"}
                      onClick={(e) => !item.ready && e.preventDefault()}
                      className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                        active
                          ? "bg-primary/10 border border-primary/20 text-primary"
                          : item.ready
                          ? "hover:bg-foreground/[0.04] text-muted-foreground hover:text-foreground"
                          : "text-muted-foreground/35 cursor-default"
                      }`}
                    >
                      {item.label}
                      {!item.ready && (
                        <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-muted/60 text-muted-foreground/40">
                          coming soon
                        </span>
                      )}
                    </Link>
                  );
                })}

                <div className="mt-3 pt-3 border-t border-foreground/[0.06]">
                  <a
                    href="#"
                    className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold bg-primary/10 border border-primary/25 text-primary hover:bg-primary/20 transition-colors"
                  >
                    Read Paper
                  </a>
                </div>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
