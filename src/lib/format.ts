import type { OrderStatus } from "@prisma/client";

export function formatPrice(amount: number) {
  return new Intl.NumberFormat("fa-IR").format(amount) + " تومان";
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("fa-IR", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(date);
}

const orderStatusLabels: Record<OrderStatus, string> = {
  PENDING: "در انتظار پرداخت",
  PAID: "پرداخت‌شده",
  PROCESSING: "در حال آماده‌سازی",
  SHIPPED: "ارسال‌شده",
  DELIVERED: "تحویل‌شده",
  CANCELLED: "لغو‌شده"
};

export function formatOrderStatus(status: OrderStatus) {
  return orderStatusLabels[status];
}

export function orderStatusColor(status: OrderStatus) {
  switch (status) {
    case "PAID":
    case "DELIVERED":
      return "text-emerald-700 bg-emerald-50";
    case "PROCESSING":
    case "SHIPPED":
      return "text-sky-700 bg-sky-50";
    case "CANCELLED":
      return "text-red-700 bg-red-50";
    default:
      return "text-amber-700 bg-amber-50";
  }
}

export const adminOrderStatuses: OrderStatus[] = [
  "PAID",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED"
];
