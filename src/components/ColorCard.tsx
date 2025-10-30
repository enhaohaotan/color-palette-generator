"use client";

import { LockKeyhole, LockKeyholeOpen } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { hex2Rgb, rgb2Hex } from "@/lib/colors";
import { useEffect, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function ColorCard({
  id,
  hex,
  locked,
  toggleLocked,
}: {
  id: string;
  hex: string;
  locked: boolean;
  toggleLocked: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
    cursor: "grab",
    touchAction: "none" as const,
    zIndex: isDragging ? 9999 : "auto",
  };

  const [colorValue, setColorValue] = useState<string>(hex);
  useEffect(() => {
    setColorValue(hex);
  }, [hex]);

  function handleCopyClick() {
    navigator.clipboard.writeText(colorValue);
    toast.success(`Color copied to clipboard!`, {
      description: colorValue,
    });
  }

  function handleSwitchClick() {
    if (colorValue.startsWith("#")) {
      setColorValue(hex2Rgb(colorValue).join(","));
    } else {
      setColorValue(rgb2Hex(colorValue.split(",").map(Number)));
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="h-full flex-1"
    >
      <div className="text-center relative flex-1 h-full">
        <div
          className="h-full flex-1 sm:h-36 w-screen sm:w-30 md:w-36 lg:w-48 cursor-pointer sm:hover:scale-105 hover:z-9999 hover:relative"
          style={
            {
              ["--color-card"]: hex,
              backgroundColor: "var(--color-card)",
              transition:
                "scale 100ms ease-in-out, background-color 500ms ease-in-out",
            } as React.CSSProperties & {
              ["--color-card"]?: string;
            }
          }
          onClick={handleCopyClick}
        />
        <div className="w-full flex justify-between items-center flex-row sm:flex-col md:flex-row lg:pr-2 absolute bottom-0 z-10 sm:relative">
          <Button
            variant="ghost"
            className="font-mono uppercase cursor-pointer select-none"
            size="sm"
            onClick={handleSwitchClick}
          >
            {colorValue}
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={toggleLocked}
            className="cursor-pointer"
          >
            {locked ? (
              <LockKeyhole />
            ) : (
              <LockKeyholeOpen className="text-neutral-50 sm:text-neutral-400" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
