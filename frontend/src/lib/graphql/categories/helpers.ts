import type { LucideIcon } from "lucide-react";
import {
  BadgeXIcon,
  BaggageClaimIcon,
  BookOpenIcon,
  BriefcaseBusinessIcon,
  CarFrontIcon,
  DumbbellIcon,
  GiftIcon,
  HeartPulseIcon,
  HouseIcon,
  MailboxIcon,
  PawPrintIcon,
  PiggyBankIcon,
  ReceiptTextIcon,
  ShoppingCartIcon,
  TicketIcon,
  ToolCaseIcon,
  UtensilsIcon
} from "lucide-react";

const ICON_BY_TOKEN: Record<string, LucideIcon> = {
  "briefcase-business": BriefcaseBusinessIcon,
  "car-front": CarFrontIcon,
  "heart-pulse": HeartPulseIcon,
  "piggy-bank": PiggyBankIcon,
  "shopping-cart": ShoppingCartIcon,
  ticket: TicketIcon,
  "tool-case": ToolCaseIcon,
  utensils: UtensilsIcon,
  "paw-print": PawPrintIcon,
  house: HouseIcon,
  gift: GiftIcon,
  dumbbell: DumbbellIcon,
  "book-open": BookOpenIcon,
  "baggage-claim": BaggageClaimIcon,
  mailbox: MailboxIcon,
  "receipt-text": ReceiptTextIcon
};

const ICON_COLOR_CLASS_BY_TOKEN: Record<string, string> = {
  green: "text-green-base",
  blue: "text-blue-base",
  purple: "text-purple-base",
  pink: "text-pink-base",
  red: "text-red-base",
  orange: "text-orange-base",
  yellow: "text-yellow-base"
};

const BG_CLASS_BY_TOKEN: Record<string, string> = {
  green: "bg-green-light",
  blue: "bg-blue-light",
  purple: "bg-purple-light",
  pink: "bg-pink-light",
  red: "bg-red-light",
  orange: "bg-orange-light",
  yellow: "bg-yellow-light"
};

const NAME_COLOR_CLASS_BY_TOKEN: Record<string, string> = {
  green: "text-green-dark",
  blue: "text-blue-dark",
  purple: "text-purple-dark",
  pink: "text-pink-dark",
  red: "text-red-dark",
  orange: "text-orange-dark",
  yellow: "text-yellow-dark"
};

export function getCategoryIconByToken(iconToken?: string | null): LucideIcon {
  if (!iconToken) {
    return BadgeXIcon;
  }

  return ICON_BY_TOKEN[iconToken] ?? BadgeXIcon;
}

export function getCategoryIconColorClass(colorToken?: string | null): string {
  if (!colorToken) {
    return "text-red-base";
  }

  return ICON_COLOR_CLASS_BY_TOKEN[colorToken] ?? "text-red-base";
}

export function getCategoryBgClass(colorToken?: string | null): string {
  if (!colorToken) {
    return "bg-red-light";
  }

  return BG_CLASS_BY_TOKEN[colorToken] ?? "bg-red-light";
}

export function getCategoryNameColorClass(colorToken?: string | null): string {
  if (!colorToken) {
    return "text-red-dark";
  }

  return NAME_COLOR_CLASS_BY_TOKEN[colorToken] ?? "text-red-dark";
}
