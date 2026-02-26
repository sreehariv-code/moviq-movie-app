import React from "react";
import {
  Carousel as EmblaCarousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Card from "../Card/Card";

interface CarouselItem {
  id: string | number;
  poster_path: string | null;
  title: string;
}

interface CarouselProps {
  data: CarouselItem[];
}

const Carousel: React.FC<CarouselProps> = ({ data }) => {
  if (!data || data.length === 0) return null;

  return (
    <div className="relative px-12">
      <EmblaCarousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {data.map((movie) => (
            <CarouselItem
              key={movie.id}
              className="pl-2 md:pl-4 basis-1/2 md:basis-1/4 lg:basis-1/5"
            >
              <Card
                id={movie.id}
                image={movie.poster_path}
                title={movie.title}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </EmblaCarousel>
    </div>
  );
};

export default Carousel;
