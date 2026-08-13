import Link from "next/link";
import { createTicket } from "@/app/account/support/actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { requireCustomer } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/format";

export default async function SupportPage() {
  const user = await requireCustomer();
  const [tickets, orders] = await Promise.all([
    prisma.supportTicket.findMany({ where: { userId: user.id }, orderBy: { updatedAt: "desc" }, include: { messages: { orderBy: { createdAt: "desc" }, take: 1 } } }),
    prisma.order.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, take: 20 })
  ]);
  return <div className="container grid gap-8 py-12 lg:grid-cols-[minmax(0,1fr)_380px]"><section><h1 className="text-3xl font-black text-sky-950">پشتیبانی</h1><div className="mt-6 space-y-3">{tickets.length ? tickets.map(ticket => <Link key={ticket.id} href={`/account/support/${ticket.id}`} className="block rounded-xl border bg-white p-5 hover:bg-sky-50"><div className="flex justify-between gap-3"><p className="font-bold">{ticket.subject}</p><span className="text-xs text-muted-foreground">{ticket.status}</span></div><p className="mt-2 text-sm text-muted-foreground">{ticket.messages[0]?.body}</p><p className="mt-2 text-xs text-muted-foreground">{formatDate(ticket.updatedAt)}</p></Link>) : <Card className="p-5 text-sm text-muted-foreground">هنوز تیکتی ثبت نکرده‌اید.</Card>}</div></section><Card className="h-fit p-5"><h2 className="font-bold">تیکت جدید</h2><form action={createTicket} className="mt-4 space-y-4"><Input name="subject" placeholder="موضوع درخواست" required /><select name="orderId" className="h-11 w-full rounded-xl border bg-white px-3 text-sm"><option value="">بدون ارتباط با سفارش</option>{orders.map(order => <option value={order.id} key={order.id}>سفارش {order.id}</option>)}</select><Textarea name="body" placeholder="پیام شما" required /><Button type="submit" className="w-full">ثبت تیکت</Button></form></Card></div>;
}
