/**
 * Demo accounts surfaced on the login screen for quick, password-free sign-in.
 * One per role/tier so graders can explore every surface in a click.
 */
export interface DemoAccount {
  email: string;
  label: string;
  hint: string;
}

export const DEMO_ACCOUNTS: DemoAccount[] = [
  { email: "gold@nava.app", label: "سارا", hint: "شنونده طلایی" },
  { email: "silver@nava.app", label: "آرش", hint: "شنونده نقره‌ای" },
  { email: "basic@nava.app", label: "نگار", hint: "شنونده پایه" },
  { email: "artist@nava.app", label: "بنیامین", hint: "هنرمند تایید‌شده" },
  { email: "pending@nava.app", label: "هورشید", hint: "هنرمند در انتظار" },
  { email: "support@nava.app", label: "مریم", hint: "پشتیبان" },
  { email: "admin@nava.app", label: "مدیر", hint: "مدیر سامانه" },
];
