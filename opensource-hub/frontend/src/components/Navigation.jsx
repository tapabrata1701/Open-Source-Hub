import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code2, Menu, X, Terminal, Trophy } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const token = localStorage.getItem("token");

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  // Close the menu when navigating routes on mobile
  React.useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Projects", path: "/projects", icon: <Terminal size={18} /> },
    { name: "Leaderboard", path: "/leaderboard", icon: <Trophy size={18} /> },
    { name: "Profile", path: "/profile", icon: <Terminal size={18} /> },
  ];

  return (
    <>
      {/* Desktop & Mobile Header wrapper */}
      <nav className="fixed top-0 left-0 w-full z-[100] px-4 sm:px-6 py-4 transition-all glass-super backdrop-blur-2xl bg-primary/80 border-b border-white/5">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 text-2xl font-bold tracking-tighter"
          >
            <Code2 className="text-accent-cyan" size={32} />
            <span className="text-gradient">OSHub</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <div className="flex items-center gap-6 text-sm font-medium">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 hover:text-white transition-colors ${location.pathname === link.path ? "text-accent-neon" : "text-text-dim"}`}
                >
                  {link.icon} {link.name}
                </Link>
              ))}
            </div>
            <div className="flex items-center gap-4">
              {token ? (
                <button
                  onClick={handleLogout}
                  className="glass px-6 py-2 rounded-full font-bold hover:bg-white/10 transition-colors border border-red-500/20 text-red-400 hover:text-red-300 shadow-[0_0_15px_rgba(239,68,68,0.1)] hover:shadow-[0_0_25px_rgba(239,68,68,0.3)]"
                >
                  Log Out
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-sm font-bold text-text-dim hover:text-white transition-colors"
                  >
                    Log In
                  </Link>
                  <Link to="/signup">
                    <button className="glass px-6 py-2 rounded-full font-bold hover:bg-white/10 transition-colors shadow-[0_0_15px_rgba(34,211,238,0.2)] hover:shadow-[0_0_25px_rgba(168,85,247,0.4)]">
                      Join Movement
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            className="lg:hidden p-2 text-text-dim hover:text-white transition-colors"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[90] bg-primary/95 backdrop-blur-3xl pt-24 px-6 pb-6 flex flex-col lg:hidden overflow-y-auto"
          >
            <div className="flex flex-col gap-6 text-xl font-bold">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-4 border-b border-white/10 pb-4 ${location.pathname === link.path ? "text-accent-neon" : "text-text-main"}`}
                >
                  {link.icon} {link.name}
                </Link>
              ))}
            </div>

            <div className="mt-12 flex flex-col gap-4">
              {token ? (
                <button
                  onClick={handleLogout}
                  className="w-full text-center py-4 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 font-bold rounded-xl min-h-[48px] flex items-center justify-center transition-colors"
                >
                  Log Out
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="w-full text-center py-4 bg-white/5 border border-white/10 rounded-xl font-bold min-h-[48px] flex items-center justify-center"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/signup"
                    className="w-full text-center py-4 bg-gradient-to-r from-accent-neon to-accent-cyan text-white font-bold rounded-xl min-h-[48px] flex items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.3)]"
                  >
                    Create Account
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;
