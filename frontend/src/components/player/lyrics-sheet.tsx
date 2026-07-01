"use client";

import { Mic2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

/** Lyrics panel for the desktop player (mobile uses the in-player toggle). */
export function LyricsSheet({ title, lyrics }: { title: string; lyrics?: string }) {
  return (
    <Sheet>
      <SheetTrigger
        render={<Button variant="ghost" size="icon" aria-label="متن آهنگ" />}
      >
        <Mic2 />
      </SheetTrigger>
      <SheetContent side="left" className="flex w-full flex-col p-0 sm:max-w-md">
        <SheetHeader className="border-b">
          <SheetTitle>متن آهنگ — {title}</SheetTitle>
        </SheetHeader>
        <div className="scrollbar-slim flex-1 overflow-y-auto p-6">
          {lyrics ? (
            <p className="leading-loose whitespace-pre-line text-muted-foreground">
              {lyrics}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              برای این آهنگ متنی ثبت نشده است.
            </p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
