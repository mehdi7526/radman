import { prisma } from "@/lib/db";

type NotifyInput = {
  type: string;
  title: string;
  body: string;
};

export async function notify(input: NotifyInput) {
  await prisma.notification.create({ data: input });

  if (process.env.NODE_ENV !== "production") {
    console.info(`[notification:${input.type}] ${input.title} — ${input.body}`);
  }
}

export async function notifyOrderCreated(order: {
  id: string;
  customerName: string;
  customerPhone: string;
  total: number;
}) {
  await notify({
    type: "order_created",
    title: "سفارش جدید",
    body: `${order.customerName} (${order.customerPhone}) — سفارش ${order.id}`
  });
}

export async function notifyOrderPaid(order: {
  id: string;
  customerName: string;
  total: number;
  referenceId?: string | null;
}) {
  await notify({
    type: "order_paid",
    title: "پرداخت موفق",
    body: `سفارش ${order.id} — ${order.customerName} — ${order.referenceId ?? "بدون کد پیگیری"}`
  });
}

export async function notifyCustomerOrderConfirmation(order: {
  id: string;
  customerEmail?: string | null;
  customerPhone: string;
}) {
  const target = order.customerEmail ?? order.customerPhone;
  await notify({
    type: "customer_order_confirmation",
    title: "تأیید سفارش مشتری",
    body: `سفارش ${order.id} برای ${target} ثبت شد (شبیه‌سازی ایمیل/SMS)`
  });
}
