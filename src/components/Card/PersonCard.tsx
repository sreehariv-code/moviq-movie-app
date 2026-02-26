import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import OptimizedImage from "@/components/OptimizedImage/OptimizedImage";
import defaultAvatar from "../../assets/avatar.jpg";

interface PersonCardProps {
  id: string | number;
  name: string;
  image: string | null | undefined;
  knownForDepartment?: string;
  knownFor?: unknown[];
  enableLayoutAnimation?: boolean;
}

const PersonCard: React.FC<PersonCardProps> = ({
  id,
  name,
  image,
  knownForDepartment,
  knownFor = [],
  enableLayoutAnimation = false,
}) => {
  const layoutId = enableLayoutAnimation ? `person-${id}` : undefined;

  return (
    <Link to={`/person/${id}`} className="block group">
      <motion.div
        whileHover={{ scale: 1.05, y: -8 }}
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative"
      >
        {/* Card Container */}
        <div className="relative rounded-xl overflow-hidden shadow-lg group-hover:shadow-2xl transition-shadow duration-300">
          {/* Profile Image */}
          <motion.div layoutId={layoutId}>
            <OptimizedImage
              src={image}
              alt={name}
              fallback={defaultAvatar}
              aspectRatio="2/3"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              className="object-top"
            />
          </motion.div>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

          {/* Hover Overlay with Icon */}
          <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0 }}
              whileHover={{ scale: 1 }}
              transition={{ duration: 0.2 }}
              className="w-16 h-16 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center"
            >
              <User className="w-8 h-8 text-primary-foreground" />
            </motion.div>
          </div>

          {/* Known For Department Badge */}
          {knownForDepartment && (
            <div className="absolute top-2 right-2 z-10">
              <Badge variant="secondary" className="text-xs backdrop-blur-sm bg-background/80">
                {knownForDepartment}
              </Badge>
            </div>
          )}
        </div>

        {/* Name Below Card (for better readability) */}
        <div className="mt-2 px-1">
          <h4 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
            {name}
          </h4>
          {knownForDepartment && (
            <p className="text-xs text-muted-foreground mt-0.5">
              {knownForDepartment}
            </p>
          )}
        </div>

        {/* Glow Effect on Hover */}
        <div className="absolute -inset-2 rounded-xl bg-gradient-to-b from-primary/0 via-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl -z-10" />
      </motion.div>
    </Link>
  );
};

export default PersonCard;
