"use client";

import { ChevronLeft, ChevronRight, RefreshCcw } from "lucide-react";
import ColorCard from "./ColorCard";
import { useCallback, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { fetchColors, fetchColorsWithLocks } from "@/app/actions/colors";
import { toast } from "sonner";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import { Spinner } from "./ui/spinner";

export default function Palette({ initialHexes }: { initialHexes: string[] }) {
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [history, setHistory] = useState<string[][]>([initialHexes]);
  const MAX_HISTORY_LENGTH = 999;

  const [isLoading, setIsLoading] = useState<boolean>(false);

  type Item = { id: string; hex: string; locked: boolean };
  const [items, setItems] = useState<Item[]>(
    initialHexes.map((h) => ({
      id: crypto.randomUUID(),
      hex: h,
      locked: false,
    }))
  );

  function appendToHistory(newHexes: string[]) {
    setHistory((prev) => {
      const next = [...prev, newHexes];
      if (next.length > MAX_HISTORY_LENGTH) {
        next.splice(0, next.length - MAX_HISTORY_LENGTH);
      }
      return next;
    });
  }

  const handleGenerateClick = useCallback(async () => {
    setIsLoading(true);
    try {
      const hexes = items.map((it) => it.hex);
      const locked = items.map((it) => it.locked);
      const newHexes = locked.some((v) => v)
        ? await fetchColorsWithLocks({ hexes, locked })
        : await fetchColors();

      setItems((prev) => prev.map((it, i) => ({ ...it, hex: newHexes[i] })));
      setTotalPages((prev) => {
        const next = Math.min(prev + 1, MAX_HISTORY_LENGTH);
        setCurrentPage(next);
        return next;
      });

      appendToHistory(newHexes);
    } catch {
      toast.error("Failed to generate colors. Please try again.");
      return;
    } finally {
      setIsLoading(false);
    }
  }, [items]);

  const handleSpacebar = useCallback(
    (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        handleGenerateClick();
      }
    },
    [handleGenerateClick]
  );

  const handleCKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "c") {
        const allColors = items.map((it) => it.hex).join(", ");
        navigator.clipboard.writeText(allColors);
        toast.success("All colors copied to clipboard!", {
          description: allColors,
        });
      }
    },
    [items]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleSpacebar);
    window.addEventListener("keydown", handleCKey);
    return () => {
      window.removeEventListener("keydown", handleSpacebar);
      window.removeEventListener("keydown", handleCKey);
    };
  }, [handleSpacebar, handleCKey]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 4 },
    })
  );

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setItems((prev) => {
      const oldIndex = prev.findIndex((it) => it.id === active.id);
      const newIndex = prev.findIndex((it) => it.id === over.id);
      return arrayMove(prev, oldIndex, newIndex);
    });
  };

  return (
    <div className="flex flex-col items-center h-full">
      <p className="hidden sm:block font-light text-neutral-500 select-none mb-3">
        Click a color block to copy its value, or press C to copy all values.
      </p>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={onDragEnd}
      >
        <SortableContext
          items={items.map((it) => it.id)}
          strategy={horizontalListSortingStrategy}
        >
          <div className="flex flex-col sm:flex-row flex-1 sm:flex-none">
            {items.map((item, idx) => (
              <ColorCard
                key={item.id}
                id={item.id}
                hex={item.hex}
                locked={item.locked}
                toggleLocked={() => {
                  setItems((prev) =>
                    prev.map((p, i) =>
                      i === idx ? { ...p, locked: !p.locked } : p
                    )
                  );
                }}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <div className="flex sm:flex-col w-screen sm:w-auto">
        <div className="flex justify-center items-center sm:mt-4 md:mt-8 gap-4">
          <Button
            className={`${
              currentPage > 1
                ? "cursor-pointer"
                : "text-neutral-400 hover:bg-transparent hover:text-neutral-400"
            }`}
            onClick={() => {
              if (currentPage > 1) {
                setCurrentPage((prev) => prev - 1);
                setItems((prev) =>
                  prev.map((it, i) => ({
                    ...it,
                    hex: history[currentPage - 2][i],
                  }))
                );
              }
            }}
            size="icon-lg"
            variant="ghost"
          >
            <ChevronLeft />
          </Button>

          <div className="flex gap-2 font-mono select-none">
            <p className="font-mono">{currentPage}</p>
            <p>/</p>
            <p className="font-mono">{totalPages}</p>
          </div>
          <Button
            size="icon-lg"
            variant="ghost"
            className={`${
              currentPage < totalPages
                ? "cursor-pointer"
                : "text-neutral-400 hover:bg-transparent hover:text-neutral-400"
            }`}
            onClick={() => {
              if (currentPage < totalPages) {
                setCurrentPage((prev) => prev + 1);
                setItems((prev) =>
                  prev.map((it, i) => ({
                    ...it,
                    hex: history[currentPage][i],
                  }))
                );
              }
            }}
          >
            <ChevronRight />
          </Button>
        </div>

        <div className="flex flex-col justify-center items-center sm:my-16 gap-3 flex-1 sm:flex-none">
          <Button
            className="cursor-pointer rounded-none sm:w-64 h-12 gap-4 text-lg font-normal w-full"
            size="lg"
            aria-label="Generate"
            onClick={handleGenerateClick}
          >
            {isLoading ? <Spinner /> : <RefreshCcw />}
            Generate
          </Button>
          <p className="hidden sm:block font-light text-neutral-500 select-none">
            Or just press the Spacebar to generate new palettes.
          </p>
        </div>
      </div>
    </div>
  );
}
