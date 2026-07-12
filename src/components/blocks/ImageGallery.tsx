"use client";

import { Media } from "@/payload-types";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useId } from "react";

export type ImageGalleryProps = {};

const ImageGallery: React.FC<{
  node: any;
}> = ({ node }) => {
  const id = useId();
  const images = node.fields.images;
  if (!images || !images[0].url) return null;
  return (
    <div className="my-8">
      <Carousel opts={{ align: "start" }} className="mb-4 lg:mb-8">
        <div className="overflow-hidden rounded-xs">
          <CarouselContent className="not-prose -ml-2 rounded-xs">
            {node.fields.images.map((image: Media) => (
              <CarouselItem
                key={`${id}_${image.id}`}
                className="aspect-5/6 basis-1/2 pl-2"
              >
                <img
                  src={image.sizes?.half?.url || image.url || ""}
                  alt=""
                  className="h-full w-full rounded-xs object-cover object-center"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </div>

        <CarouselPrevious className="hidden md:flex" />
        <CarouselNext className="hidden md:flex" />
      </Carousel>
    </div>
  );
};
export default ImageGallery;
