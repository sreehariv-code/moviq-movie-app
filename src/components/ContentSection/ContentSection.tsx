import React from "react";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import MovieCard from "@/components/Card/MovieCard";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { Movie, TVShow } from "@/types/tmdb";

interface ContentSectionProps {
  title: string;
  data: (Movie | TVShow)[] | undefined;
  isLoading: boolean;
  type?: "movie" | "tv";
  viewAllLink?: string;
  enableLayoutAnimation?: boolean;
}

const ContentSection: React.FC<ContentSectionProps> = ({
  title,
  data,
  isLoading,
  type = "movie",
  viewAllLink,
  enableLayoutAnimation = true,
}) => {
  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-6 px-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            {title}
          </h2>
          {viewAllLink && (
            <Link
              to={viewAllLink}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors group"
            >
              View All
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </motion.div>

        {/* Content Carousel */}
        {isLoading ? (
          <ContentSkeleton />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="relative px-12">
              <Carousel
                opts={{
                  align: "start",
                  loop: false,
                  dragFree: true,
                }}
                className="w-full"
              >
                <CarouselContent className="-ml-2 md:-ml-4" viewportClassName="px-6 -mx-6 py-6 -my-6">
                  {data?.map((item, index) => (
                    <CarouselItem
                      key={item.id}
                      className="pl-2 md:pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6"
                    >
                      <MovieCard
                        id={item.id}
                        image={item.poster_path}
                        title={(item as Movie).title || (item as TVShow).name || ""}
                        type={(item as Movie | TVShow).media_type || type}
                        rating={item.vote_average}
                        year={
                          ((item as Movie).release_date || (item as TVShow).first_air_date)?.split(
                            "-"
                          )[0]
                        }
                        enableLayoutAnimation={enableLayoutAnimation && index < 10}
                        layoutPrefix={title.toLowerCase().replace(/\s+/g, '-') + "-"}
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="bg-background/80 hover:bg-background" />
                <CarouselNext className="bg-background/80 hover:bg-background" />
              </Carousel>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

const ContentSkeleton = () => (
  <div className="flex gap-4 overflow-hidden px-12">
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="flex-shrink-0 w-[160px] md:w-[200px]">
        <Skeleton className="aspect-[2/3] rounded-xl" />
        <Skeleton className="h-4 w-3/4 mt-3" />
        <Skeleton className="h-3 w-1/2 mt-1" />
      </div>
    ))}
  </div>
);

export default ContentSection;
