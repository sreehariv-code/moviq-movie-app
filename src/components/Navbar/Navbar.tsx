import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Film, Menu, X, TrendingUp, Flame, Star, Home, Tv, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWatchlist } from "@/context/WatchlistContext";
import ThemeToggle from "@/components/ui/ThemeToggle";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { watchlistCount } = useWatchlist();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { name: "Home", path: "/", icon: Home },
    { name: "Movies", path: "/movies", icon: Film },
    { name: "TV Shows", path: "/tv", icon: Tv },
    { name: "Watchlist", path: "/watchlist", icon: Heart, badge: watchlistCount },
  ];

  const quickLinks = [
    { name: "Popular Movies", path: "/movies/popular", icon: Flame },
    { name: "Trending Movies", path: "/movies/trending", icon: TrendingUp },
    { name: "Top Rated Movies", path: "/movies/top-rated", icon: Star },
    { name: "Popular TV", path: "/tv/popular", icon: Flame },
    { name: "Trending TV", path: "/tv/trending", icon: TrendingUp },
    { name: "Top Rated TV", path: "/tv/top-rated", icon: Star },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled
            ? "glass shadow-md"
            : "bg-linear-to-b from-background/80 to-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group" aria-label="Moviq Home">
              <Film className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" aria-hidden="true" />
              <span className="text-xl md:text-2xl font-bold tracking-tight">
                Movi<span className="text-primary">Q</span>
              </span>
            </Link>

            {/* Navigation Links - Desktop */}
            <ul className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className={cn(
                      "relative text-sm font-medium transition-colors hover:text-primary flex items-center gap-2",
                      location.pathname === link.path
                        ? "text-primary"
                        : "text-foreground/70"
                    )}
                  >
                    {link.name}
                    {link.badge !== undefined && link.badge > 0 && (
                      <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-primary text-primary-foreground">
                        {link.badge}
                      </span>
                    )}
                    {location.pathname === link.path && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"
                      />
                    )}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Link
                to="/search"
                aria-label="Search movies and tv shows"
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full transition-all",
                  "hover:bg-white/10 hover:scale-105",
                  "border border-white/10"
                )}
              >
                <Search className="w-4 h-4" />
                <span className="hidden sm:inline text-sm">Search</span>
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Menu Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-background border-l border-border z-50 md:hidden overflow-y-auto"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-2">
                    <Film className="w-6 h-6 text-primary" />
                    <span className="text-lg font-bold">
                      Movi<span className="text-primary">Q</span>
                    </span>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Main Navigation */}
                <div className="mb-8">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                    Navigation
                  </h3>
                  <ul className="space-y-1">
                    {navLinks.map((link) => {
                      const Icon = link.icon;
                      const isActive = location.pathname === link.path;
                      return (
                        <li key={link.path}>
                          <Link
                            to={link.path}
                            className={cn(
                              "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                              isActive
                                ? "bg-primary/10 text-primary"
                                : "text-foreground/70 hover:bg-white/5 hover:text-foreground"
                            )}
                          >
                            <Icon className="w-5 h-5" />
                            <span className="font-medium">{link.name}</span>
                            {link.badge !== undefined && link.badge > 0 && (
                              <span className="ml-auto px-2 py-0.5 text-xs font-bold rounded-full bg-primary text-primary-foreground">
                                {link.badge}
                              </span>
                            )}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* Quick Links */}
                <div>
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                    Quick Access
                  </h3>
                  <ul className="space-y-1">
                    {quickLinks.map((link) => {
                      const Icon = link.icon;
                      const isActive = location.pathname === link.path;
                      return (
                        <li key={link.path}>
                          <Link
                            to={link.path}
                            className={cn(
                              "flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm",
                              isActive
                                ? "bg-primary/10 text-primary"
                                : "text-foreground/60 hover:bg-white/5 hover:text-foreground"
                            )}
                          >
                            <Icon className="w-4 h-4" />
                            <span>{link.name}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
