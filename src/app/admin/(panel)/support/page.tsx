import Link from "next/link";
import { Card } from "@/components/ui/card";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/format";

export default async function AdminSupportPage() {
  const tickets = await prisma.supportTicket.findMany({ include: { user: true, order: true, messages: { orderBy: { createdAt: "desc" }, take: 1 } }, orderBy: { updatedAt: "desc" } });
  return <div className="space-y-6"><div><p className="text-sm font-bold text-primary">پشتیبانی</p><h1 className="mt-2 text-3xl font-black text-sky-950">تیکت‌های مشتریان</h1></div><div className="space-y-3">{tickets.length ? tickets.map(ticket => <Link key={ticket.id} href={`/admin/support/${ticket.id}`}><Card className="p-5 transition hover:bg-sky-50"><div className="flex justify-between gap-4"><div><p className="font-bold">{ticket.subject}</p><p className="mt-1 text-sm text-muted-foreground">{ticket.user.name} · {ticket.user.phone}</p></div><p className="text-xs text-muted-foreground">{ticket.status}</p></div><p className="mt-3 text-sm text-muted-foreground">{ticket.messages[0]?.body}</p><p className="mt-2 text-xs text-muted-foreground">{formatDate(ticket.updatedAt)}</p></Card></Link>) : <Card className="p-5 text-sm text-muted-foreground">تیکتی وجود ندارد.</Card>}</div></div>;
}
