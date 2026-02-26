import { motion, AnimatePresence } from "framer-motion";
import { useLocation, Outlet } from "react-router-dom";

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

const PageTransition = () => {
  const location = useLocation();

  // Check if navigating to/from detail pages for shared layout transitions
  const isDetailPage = location.pathname.match(/^\/(movie|tv)\/\d+/);

  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{
          duration: isDetailPage ? 0.3 : 0.2,
          ease: [0.25, 0.1, 0.25, 1]
        }}
        style={{ position: "relative" }}
      >
        <Outlet />
      </motion.div>
    </AnimatePresence>
  );
};

export default PageTransition;
