import React, { type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface LaptopMockupProps {
  className?: string;
  frameClassName?: string;
  screenClassName?: string;
  screenBg?: string;
  shadow?: boolean;
  children?: ReactNode;
}

export function LaptopMockup({
  className,
  frameClassName,
  screenClassName,
  screenBg = "#fbfaf7",
  shadow = true,
  children,
}: LaptopMockupProps) {
  return (
    <div className={cn("relative w-full", className)}>
      <div
        className={cn(
          "relative rounded-[14px] bg-[#1a1a1c] px-[10px] pt-[14px] pb-[10px] ring-1 ring-black/30",
          shadow && "shadow-[0_40px_60px_-30px_rgba(15,23,42,0.45)]",
          frameClassName,
        )}
      >
        <div className="absolute left-1/2 top-[5px] h-[4px] w-[4px] -translate-x-1/2 rounded-full bg-[#2e2e30] ring-1 ring-black/50" />
        <div
          className={cn("relative w-full overflow-hidden rounded-[8px]", screenClassName)}
          style={{ aspectRatio: "16 / 10", background: screenBg }}
        >
          {children}
        </div>
      </div>
      <div className="mx-auto h-[4px] w-full bg-[#0c0c0d]" />
      <div
        className="relative mx-auto h-[16px]"
        style={{
          width: "104%",
          marginLeft: "-2%",
          background:
            "linear-gradient(180deg,#e4e4e4 0%,#bdbdbd 55%,#7a7a7a 100%)",
          clipPath: "polygon(2% 0, 98% 0, 100% 100%, 0% 100%)",
        }}
      >
        <div className="absolute left-1/2 top-0 h-[5px] w-[18%] -translate-x-1/2 rounded-b-[6px] bg-[#4a4a4c]" />
      </div>
    </div>
  );
}

export default LaptopMockup;
