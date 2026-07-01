"use client";

import { Volume1, Volume2, VolumeX } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { usePlayer } from "@/lib/stores/player-store";
import { cn } from "@/lib/utils";

/** Mute toggle + volume slider (also bound from Settings → "صدای سامانه"). */
export function VolumeControl({ className }: { className?: string }) {
  const volume = usePlayer((s) => s.volume);
  const muted = usePlayer((s) => s.muted);
  const setVolume = usePlayer((s) => s.setVolume);
  const toggleMute = usePlayer((s) => s.toggleMute);

  const effective = muted ? 0 : volume;
  const Icon = effective === 0 ? VolumeX : effective < 50 ? Volume1 : Volume2;

  return (
    <div dir="ltr" className={cn("flex items-center gap-2", className)}>
      <Button variant="ghost" size="icon-sm" onClick={toggleMute} aria-label="بی‌صدا">
        <Icon />
      </Button>
      <Slider
        value={[effective]}
        min={0}
        max={100}
        step={1}
        onValueChange={(v) => setVolume(Array.isArray(v) ? v[0] : v)}
        className="w-24"
        aria-label="میزان صدا"
      />
    </div>
  );
}
