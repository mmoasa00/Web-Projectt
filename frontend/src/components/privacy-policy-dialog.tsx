"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

/**
 * Opens the privacy-policy text. The trigger is the words "سیاست حریم خصوصی" so
 * it can sit inline inside the sign-up consent label (per the brief).
 */
export function PrivacyPolicyDialog() {
  return (
    <Dialog>
      <DialogTrigger
        render={
          <button
            type="button"
            className="font-medium text-primary underline-offset-2 hover:underline"
          />
        }
      >
        سیاست حریم خصوصی
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>سیاست حریم خصوصی</DialogTitle>
          <DialogDescription>
            خلاصه‌ای از نحوه‌ی نگه‌داری و استفاده‌ی نوا از اطلاعات شما.
          </DialogDescription>
        </DialogHeader>
        <div className="scrollbar-slim max-h-72 space-y-3 overflow-y-auto text-sm leading-relaxed text-muted-foreground">
          <p>
            نوا اطلاعات حساب شما (نام نمایشی، ایمیل و ترجیحات) را تنها برای ارائه‌ی
            سرویس استریم موسیقی نگه می‌دارد و آن‌ها را در اختیار اشخاص ثالث قرار نمی‌دهد.
          </p>
          <p>
            تاریخچه‌ی پخش و علاقه‌مندی‌های شما برای بهبود پیشنهادها استفاده می‌شود.
            در هر زمان می‌توانید از بخش «تنظیمات» حساب خود را حذف کنید.
          </p>
          <p>
            با ثبت‌نام، می‌پذیرید که داده‌های لازم برای عملکرد سرویس (مانند پلی‌لیست‌ها
            و آمار شنیدن) ذخیره شوند. این متن صرفاً نمونه است و در فاز بعد تکمیل می‌شود.
          </p>
        </div>
        <DialogFooter showCloseButton />
      </DialogContent>
    </Dialog>
  );
}
