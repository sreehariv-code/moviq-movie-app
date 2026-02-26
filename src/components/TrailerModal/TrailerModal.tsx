import React from "react";
import { motion } from "framer-motion";
import { X, Play } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

interface TrailerModalProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  videoKey: string | undefined | null;
  title?: string;
}

const TrailerModal: React.FC<TrailerModalProps> = ({ isOpen, onClose, videoKey, title }) => {
  if (!videoKey) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-[95vw] p-0 bg-black border-none overflow-hidden">
        <DialogTitle className="sr-only">{title || "Trailer"}</DialogTitle>

        {/* Close button */}
        <button
          onClick={() => onClose(false)}
          className="absolute -top-12 right-0 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          <X className="w-6 h-6 text-white" />
        </button>

        {/* Video Container */}
        <div className="relative w-full aspect-video bg-black">
          <iframe
            src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&rel=0`}
            title={title || "Trailer"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface TrailerButtonProps {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

// Trailer button component to trigger the modal
export const TrailerButton: React.FC<TrailerButtonProps> = ({ onClick, disabled, className = "" }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    disabled={disabled}
    className={`flex items-center justify-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
  >
    <Play className="w-5 h-5 fill-current" />
    Watch Trailer
  </motion.button>
);

export default TrailerModal;
