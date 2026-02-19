import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";

const Layout = () => {
  const { pathname } = useLocation();

  /* Scroll to top on page change */
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior }); }, [pathname]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      {/* pt-16 offsets the fixed 64px navbar */}
      <main className="pt-16">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
