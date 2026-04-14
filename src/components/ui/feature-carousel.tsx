"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface FeatureCarouselItem {
  src: string;
  alt: string;
  title?: string;
  description?: string;
  href?: string;
  tags?: string[];
}

interface HeroProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title: React.ReactNode;
  subtitle: string;
  images: FeatureCarouselItem[];
}

export const HeroSection = React.forwardRef<HTMLDivElement, HeroProps>(
  ({ title, subtitle, images, className, ...props }, ref) => {
    const [currentIndex, setCurrentIndex] = React.useState(Math.floor(images.length / 2));

    const handleNext = React.useCallback(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, [images.length]);

    const handlePrev = React.useCallback(() => {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    }, [images.length]);

    React.useEffect(() => {
      const timer = setInterval(() => {
        handleNext();
      }, 4000);

      return () => clearInterval(timer);
    }, [handleNext]);

    const activeImage = images[currentIndex];

    return (
      <div
        ref={ref}
        className={cn(
          "relative w-full overflow-x-hidden bg-background text-foreground p-4",
          className
        )}
        {...props}
      >
        <div className="absolute inset-0 z-0 opacity-20" aria-hidden="true">
          <div className="absolute bottom-0 left-[-20%] right-0 top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(14,165,233,0.18),rgba(255,255,255,0))]" />
          <div className="absolute bottom-0 right-[-20%] top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(16,185,129,0.18),rgba(255,255,255,0))]" />
        </div>

        <div className="relative z-10 flex w-full flex-col items-center text-center">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl max-w-4xl">
              {title}
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground md:text-xl">
              {subtitle}
            </p>
          </div>

          <div className="relative mt-10 w-full h-[350px] md:mt-14 md:h-[450px] flex items-center justify-center">
            <div className="relative h-full w-full flex items-center justify-center [perspective:1000px]">
              {images.map((image, index) => {
                const offset = index - currentIndex;
                const total = images.length;
                let pos = (offset + total) % total;
                if (pos > Math.floor(total / 2)) {
                  pos = pos - total;
                }

                const isCenter = pos === 0;
                const isAdjacent = Math.abs(pos) === 1;

                return (
                  <button
                    key={`${image.src}-${index}`}
                    type="button"
                    className={cn(
                      "absolute flex items-center justify-center transition-all duration-500 ease-in-out",
                      "w-48 h-96 md:w-64 md:h-[450px]"
                    )}
                    style={{
                      transform: `
                        translateX(${pos * 45}%)
                        scale(${isCenter ? 1 : isAdjacent ? 0.85 : 0.7})
                        rotateY(${pos * -10}deg)
                      `,
                      zIndex: isCenter ? 10 : isAdjacent ? 5 : 1,
                      opacity: isCenter ? 1 : isAdjacent ? 0.4 : 0,
                      filter: isCenter ? "blur(0px)" : "blur(4px)",
                      visibility: Math.abs(pos) > 1 ? "hidden" : "visible",
                    }}
                    onClick={() => setCurrentIndex(index)}
                    aria-label={image.title ? `Select ${image.title}` : `Select slide ${index + 1}`}
                  >
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="h-full w-full rounded-3xl border-2 border-foreground/10 object-cover shadow-2xl"
                    />
                  </button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="icon"
              className="absolute left-2 top-1/2 z-20 h-10 w-10 -translate-y-1/2 rounded-full bg-background/60 backdrop-blur-sm sm:left-8"
              onClick={handlePrev}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-2 top-1/2 z-20 h-10 w-10 -translate-y-1/2 rounded-full bg-background/60 backdrop-blur-sm sm:right-8"
              onClick={handleNext}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          {activeImage && (
            <div className="mt-8 max-w-2xl space-y-4">
              {activeImage.title && <h3 className="text-2xl font-semibold">{activeImage.title}</h3>}
              {activeImage.description && (
                <p className="text-muted-foreground md:text-base">{activeImage.description}</p>
              )}
              {activeImage.tags && activeImage.tags.length > 0 && (
                <div className="flex flex-wrap justify-center gap-2">
                  {activeImage.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-[10px] uppercase tracking-[0.18em]">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
              <div className="flex justify-center">
                {activeImage.href ? (
                  <Button size="lg" render={<Link href={activeImage.href} />}>
                    Explore this goal <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : null}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

HeroSection.displayName = "HeroSection";
