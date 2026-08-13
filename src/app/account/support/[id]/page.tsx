import Link from "next/link";
import { notFound } from "next/navigation";
import { replyToTicket } from "@/app/account/support/actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { requireCustomer } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/format";

export default async function TicketPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireCustomer(); const { id } = await params;
  const ticket = await prisma.supportTicket.findFirst({ where: { id, userId: user.id }, include: { messages: { orderBy: { createdAt: "asc" } } } }); if (!ticket) notFound();
  return <div className="container max-w-3xl space-y-5 py-12"><Link href="/account/support" className="text-sm font-semibold text-primary">بازگشت به پشتیبانی</Link><Card className="p-6"><h1 className="text-2xl font-black">{ticket.subject}</h1><div className="mt-6 space-y-4">{ticket.messages.map(message => <div key={message.id} className={`rounded-xl p-4 text-sm ${message.isAdmin ? "bg-sky-50" : "bg-slate-100"}`}><p className="font-bold">{message.isAdmin ? "پشتیبانی رادمان" : "شما"}</p><p className="mt-2 whitespace-pre-wrap">{message.body}</p><p className="mt-2 text-xs text-muted-foreground">{formatDate(message.createdAt)}</p></div>)}</div><form action={replyToTicket} className="mt-6 space-y-3"><input type="hidden" name="ticketId" value={ticket.id} /><Textarea name="body" placeholder="پاسخ شما" required /><Button type="submit">ارسال پاسخ</Button></form></Card></div>;
}
