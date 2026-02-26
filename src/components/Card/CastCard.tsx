import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import OptimizedImage from "@/components/OptimizedImage/OptimizedImage";
import notFoundImage from "../../assets/avatar.jpg";

interface CastCardProps {
  id?: string | number;
  name?: string;
  character?: string;
  image: string | null | undefined;
  isCircular?: boolean;
}

const CastCard: React.FC<CastCardProps> = ({ id, name, character, image, isCircular = true }) => {
  const cardContent = (
    <motion.div
      whileHover={{ y: -5 }}
      className="flex flex-col items-center text-center group cursor-pointer"
    >
      {/* Profile Image */}
      <div
        className={`relative overflow-hidden ${
          isCircular
            ? "w-24 h-24 md:w-28 md:h-28 rounded-full"
            : "w-full rounded-xl"
        } mb-3`}
      >
        <div className="transition-transform duration-300 group-hover:scale-110">
          <OptimizedImage
            src={image}
            alt={name || "Cast member"}
            fallback={notFoundImage}
            aspectRatio={isCircular ? "1/1" : "2/3"}
            sizes="185px"
            className="object-top"
          />
        </div>
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Name */}
      <h3 className="font-semibold text-sm text-foreground line-clamp-1 group-hover:text-primary transition-colors">
        {name || "Unknown"}
      </h3>

      {/* Character/Role */}
      {character && (
        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
          {character}
        </p>
      )}
    </motion.div>
  );

  // Wrap with Link if id is provided
  if (id) {
    return <Link to={`/person/${id}`}>{cardContent}</Link>;
  }

  return cardContent;
};

export default CastCard;
