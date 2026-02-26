import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Film, Home, Search, ArrowLeft, Ghost } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO/SEO";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 pt-20">
      <SEO
        title="404 - Page Not Found"
        description="The page you're looking for doesn't exist. Return to MoviQ home or search for movies and TV shows."
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full text-center"
      >
        {/* 404 Icon/Illustration */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="flex justify-center mb-8"
        >
          <div className="relative">
            {/* Large 404 Text */}
            <div className="text-[120px] md:text-[180px] font-bold text-primary/20 leading-none">
              404
            </div>

            {/* Floating Ghost Icon */}
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            >
              <Ghost className="w-20 h-20 text-primary" />
            </motion.div>
          </div>
        </motion.div>

        {/* Error Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Page Not Found
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
            Oops! The page you're looking for seems to have vanished into thin
            air. It might have been moved, deleted, or never existed.
          </p>

          {/* Suggestions */}
          <div className="mb-8 bg-muted/30 rounded-xl p-6 max-w-md mx-auto">
            <h2 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">
              Here's what you can do:
            </h2>
            <ul className="text-sm text-muted-foreground space-y-2 text-left">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Check the URL for typos</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Use the search to find what you're looking for</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Go back to the home page and start fresh</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Link to="/">
              <Button size="lg" className="gap-2 min-w-[160px]">
                <Home className="w-4 h-4" />
                Go Home
              </Button>
            </Link>

            <Link to="/search">
              <Button variant="outline" size="lg" className="gap-2 min-w-[160px]">
                <Search className="w-4 h-4" />
                Search
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="lg"
              className="gap-2 min-w-[160px]"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </Button>
          </div>

          {/* Popular Links */}
          <div className="mt-12 pt-8 border-t border-border/50">
            <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">
              Popular Pages
            </h3>
            <div className="flex flex-wrap gap-2 justify-center">
              <Link to="/movies/popular">
                <Button variant="secondary" size="sm" className="gap-2">
                  <Film className="w-3 h-3" />
                  Popular Movies
                </Button>
              </Link>
              <Link to="/movies/trending">
                <Button variant="secondary" size="sm" className="gap-2">
                  <Film className="w-3 h-3" />
                  Trending Movies
                </Button>
              </Link>
              <Link to="/tv/popular">
                <Button variant="secondary" size="sm" className="gap-2">
                  <Film className="w-3 h-3" />
                  Popular TV Shows
                </Button>
              </Link>
              <Link to="/tv/trending">
                <Button variant="secondary" size="sm" className="gap-2">
                  <Film className="w-3 h-3" />
                  Trending TV
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
