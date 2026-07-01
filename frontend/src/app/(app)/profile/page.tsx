"use client";

import { useState } from "react";
import { ImagePlus, Pencil, Radio, UserPlus, Users } from "lucide-react";
import { toast } from "sonner";

import { TierBadge } from "@/components/tier-badge";
import { StatTile } from "@/components/stat-tile";
import { UserAvatar } from "@/components/user-avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ROLE_LABELS, TIERS, UNLIMITED } from "@/lib/config";
import { formatNumber, toFaDigits } from "@/lib/format";
import { useDb } from "@/lib/stores/db-store";
import { useCurrentUser } from "@/lib/stores/session-store";
import type { Gender, User } from "@/lib/types";

/** Edit profile: display name, gender, birth date, and the (tier-gated) avatar. */
function EditProfileDialog({ user }: { user: User }) {
  const updateUser = useDb((s) => s.updateUser);
  const [open, setOpen] = useState(false);
  const [displayName, setDisplayName] = useState(user.displayName);
  const [gender, setGender] = useState<Gender>(user.gender);
  const [birthDate, setBirthDate] = useState(user.birthDate ?? "");

  const canChangeAvatar = TIERS[user.subscriptionTier].canUploadAvatar;

  function save(event: React.FormEvent) {
    event.preventDefault();
    updateUser(user.id, { displayName: displayName.trim() || user.displayName, gender, birthDate });
    setOpen(false);
    toast.success("نمایه به‌روزرسانی شد");
  }

  function shuffleAvatar() {
    updateUser(user.id, { avatarSeed: Math.random().toString(36).slice(2) });
    toast.success("تصویر نمایه تغییر کرد");
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button variant="outline" onClick={() => setOpen(true)}>
        <Pencil />
        ویرایش نمایه
      </Button>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>ویرایش نمایه</DialogTitle>
        </DialogHeader>

        <div className="flex items-center gap-3">
          <UserAvatar
            name={displayName}
            seed={user.avatarSeed}
            url={user.avatarUrl}
            className="size-16"
          />
          {canChangeAvatar ? (
            <Button variant="outline" size="sm" onClick={shuffleAvatar}>
              <ImagePlus />
              تغییر تصویر
            </Button>
          ) : (
            <Tooltip>
              <TooltipTrigger
                render={
                  <span className="inline-flex">
                    <Button variant="outline" size="sm" disabled>
                      <ImagePlus />
                      تغییر تصویر
                    </Button>
                  </span>
                }
              />
              <TooltipContent>برای تغییر تصویر، اشتراک خود را ارتقا دهید</TooltipContent>
            </Tooltip>
          )}
        </div>

        <form id="edit-profile-form" onSubmit={save} className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="displayName">نام نمایشی</Label>
            <Input
              id="displayName"
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              className="h-10"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>جنسیت</Label>
              <Select value={gender} onValueChange={(v) => setGender(v as Gender)}>
                <SelectTrigger className="h-10 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="female">زن</SelectItem>
                  <SelectItem value="male">مرد</SelectItem>
                  <SelectItem value="other">سایر</SelectItem>
                  <SelectItem value="unspecified">نامشخص</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="birthDate">تاریخ تولد</Label>
              <Input
                id="birthDate"
                type="date"
                dir="ltr"
                value={birthDate}
                onChange={(event) => setBirthDate(event.target.value)}
                className="h-10"
              />
            </div>
          </div>
        </form>

        <DialogFooter>
          <Button type="submit" form="edit-profile-form">
            ذخیره
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function ProfilePage() {
  const user = useCurrentUser();
  if (!user) return null;

  const limit = TIERS[user.subscriptionTier].dailyStreamLimit;
  const remaining = limit === UNLIMITED ? null : Math.max(0, limit - user.dailyStreams);

  return (
    <div className="space-y-8">
      <header className="flex flex-col items-center gap-5 text-center sm:flex-row sm:items-end sm:text-start">
        <UserAvatar
          name={user.displayName}
          seed={user.avatarSeed}
          url={user.avatarUrl}
          className="size-32"
        />
        <div className="flex-1 space-y-2">
          <h1 className="font-heading text-3xl font-bold">{user.displayName}</h1>
          <p className="text-sm text-muted-foreground" dir="ltr">
            {user.username}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
            <TierBadge tier={user.subscriptionTier} />
            <span className="text-xs text-muted-foreground">{ROLE_LABELS[user.role]}</span>
          </div>
        </div>
        <EditProfileDialog user={user} />
      </header>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatTile label="دنبال‌کننده" value={formatNumber(user.followerCount)} icon={Users} />
        <StatTile
          label="دنبال‌شونده"
          value={formatNumber(user.followingIds.length)}
          icon={UserPlus}
        />
        <StatTile
          label="استریم امروز"
          value={
            remaining === null
              ? formatNumber(user.dailyStreams)
              : `${toFaDigits(user.dailyStreams)} / ${toFaDigits(limit)}`
          }
          icon={Radio}
        />
      </div>

      {remaining !== null ? (
        <p className="text-sm text-muted-foreground">
          {remaining > 0
            ? `امروز ${toFaDigits(remaining)} استریم دیگر باقی مانده است.`
            : "به سقف استریم روزانه رسیده‌اید. برای استریم نامحدود، اشتراک خود را ارتقا دهید."}
        </p>
      ) : null}
    </div>
  );
}
