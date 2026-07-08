"use client";

import Link from "next/link";
import { UserCheck } from "lucide-react";

import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { byId, getPendingArtists } from "@/lib/data/selectors";
import { formatShortDate } from "@/lib/format";
import { useDb } from "@/lib/stores/db-store";

export default function ApprovalsPage() {
  const artists = useDb((s) => s.artists);
  const users = useDb((s) => s.users);

  const pending = getPendingArtists(artists);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">احراز هویت هنرمندان</h1>
        <p className="text-sm text-muted-foreground">
          درخواست‌های در انتظار تایید را بررسی کنید.
        </p>
      </div>

      {pending.length === 0 ? (
        <EmptyState
          icon={UserCheck}
          title="درخواستی در انتظار نیست"
          description="همه‌ی درخواست‌های احراز هویت بررسی شده‌اند."
        />
      ) : (
        <div className="rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>نام هنری</TableHead>
                <TableHead className="hidden sm:table-cell">ایمیل</TableHead>
                <TableHead className="hidden md:table-cell">تاریخ درخواست</TableHead>
                <TableHead className="text-end">عملیات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pending.map((artist) => {
                const email = byId(users, artist.userId)?.email ?? "—";
                return (
                  <TableRow key={artist.id}>
                    <TableCell className="font-medium">{artist.name}</TableCell>
                    <TableCell className="hidden text-muted-foreground sm:table-cell" dir="ltr">
                      {email}
                    </TableCell>
                    <TableCell className="hidden text-muted-foreground md:table-cell">
                      {formatShortDate(artist.requestedAt)}
                    </TableCell>
                    <TableCell className="text-end">
                      <Button
                        variant="outline"
                        size="sm"
                        render={<Link href={`/dashboard/approvals/${artist.id}`} />}
                      >
                        مشاهده نمونه‌کارها
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
