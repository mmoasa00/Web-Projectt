"use client";

import { Pause, Play, Repeat, Repeat1, Shuffle, SkipBack, SkipForward } from "lucide-react";

import { Button } from "@/components/ui/button";
import { usePlayer } from "@/lib/stores/player-store";
import { cn } from "@/lib/utils";

/**
 * Transport buttons: shuffle · previous · play/pause · next · repeat.
 * Forced `dir="ltr"` so the cluster reads like a standard media player.
 */
export function PlayerControls({ size = "default" }: { size?: "default" | "lg" }) {
  const isPlaying = usePlayer((s) => s.isPlaying);
  const repeat = usePlayer((s) => s.repeat);
  const shuffle = usePlayer((s) => s.shuffle);
  const togglePlay = usePlayer((s) => s.togglePlay);
  const next = usePlayer((s) => s.next);
  const previous = usePlayer((s) => s.previous);
  const cycleRepeat = usePlayer((s) => s.cycleRepeat);
  const toggleShuffle = usePlayer((s) => s.toggleShuffle);

  const big = size === "lg";
  const skipSize = big ? "icon-lg" : "icon";

  return (
    <div dir="ltr" className="flex items-center justify-center gap-1 sm:gap-2">
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={toggleShuffle}
        aria-pressed={shuffle}
        aria-label="پخش تصادفی"
        className={cn(shuffle && "text-primary")}
      >
        <Shuffle />
      </Button>

      <Button variant="ghost" size={skipSize} onClick={previous} aria-label="آهنگ قبلی">
        <SkipBack className="fill-current" />
      </Button>

      <Button
        onClick={togglePlay}
        aria-label={isPlaying ? "توقف" : "پخش"}
        className={cn("rounded-full", big ? "size-14" : "size-11")}
      >
        {isPlaying ? (
          <Pause className={cn("fill-current", big ? "size-6" : "size-5")} />
        ) : (
          <Play className={cn("fill-current", big ? "size-6 ms-0.5" : "size-5 ms-0.5")} />
        )}
      </Button>

      <Button variant="ghost" size={skipSize} onClick={next} aria-label="آهنگ بعدی">
        <SkipForward className="fill-current" />
      </Button>

      <Button
        variant="ghost"
        size="icon-sm"
        onClick={cycleRepeat}
        aria-label="حالت تکرار"
        className={cn(repeat !== "off" && "text-primary")}
      >
        {repeat === "one" ? <Repeat1 /> : <Repeat />}
      </Button>
    </div>
  );
}
