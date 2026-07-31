"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { TextField } from "@mui/material";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function OtpLoginForm({ next }: { next?: string }) {
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [seconds, setSeconds] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const digitRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (!expiresAt) return;
    const timer = window.setInterval(() => setSeconds(Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000))), 500);
    return () => window.clearInterval(timer);
  }, [expiresAt]);

  const requestOtp = async () => {
    setLoading(true); setError(null);
    const response = await fetch("/api/auth/request-otp", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ phone }) });
    const data = await response.json(); setLoading(false);
    if (!response.ok) return setError(data.error);
    setExpiresAt(data.expiresAt); setCode("");
    window.setTimeout(() => digitRefs.current[0]?.focus(), 0);
  };

  const verifyOtp = async () => {
    setLoading(true); setError(null);
    const response = await fetch("/api/auth/verify-otp", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ phone, code }) });
    const data = await response.json(); setLoading(false);
    if (!response.ok) return setError(data.error);
    window.localStorage.setItem("radman_access_token", data.token);
    window.location.assign(next?.startsWith("/") ? next : "/account");
  };

  const updateDigit = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const nextCode = code.padEnd(5, " ").split("");
    nextCode[index] = digit;
    setCode(nextCode.join("").replace(/\s/g, ""));
    if (digit && index < 4) digitRefs.current[index + 1]?.focus();
  };

  const active = Boolean(expiresAt && seconds > 0);
  const time = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;

  return <div className="space-y-5">
    {!active ? <><Input value={phone} onChange={(event) => setPhone(event.target.value)} type="tel" inputMode="tel" placeholder="شماره موبایل" dir="ltr" className="h-12 rounded-xl" /><Button type="button" className="w-full" disabled={loading || phone.trim().length < 8} onClick={requestOtp}>{loading ? <><Loader2 className="size-4 animate-spin" /> در حال ارسال</> : "دریافت کد تأیید"}</Button></> : <>
      <div className="flex items-center justify-between gap-3 text-sm"><p className="text-muted-foreground">کد ورود به <span dir="ltr" className="font-bold text-foreground">{phone}</span> ارسال شد.</p><span className="font-bold text-primary" dir="ltr">{time}</span></div>
      <div><p className="mb-3 text-sm font-bold text-foreground">کد تأیید</p><div className="flex justify-center gap-2" dir="ltr">{Array.from({ length: 5 }, (_, index) => <TextField key={index} inputRef={(element) => { digitRefs.current[index] = element; }} value={code[index] ?? ""} onChange={(event) => updateDigit(index, event.target.value)} onKeyDown={(event) => { if (event.key === "Backspace" && !code[index] && index > 0) digitRefs.current[index - 1]?.focus(); }} slotProps={{ htmlInput: { inputMode: "numeric", maxLength: 1, "aria-label": `رقم ${index + 1} کد تأیید` } }} sx={{ width: 48, "& .MuiOutlinedInput-root": { borderRadius: "12px", backgroundColor: "#fff" }, "& input": { textAlign: "center", fontSize: 20, fontWeight: 800, py: 1.25, px: 0 } }} />)}</div></div>
      <Button type="button" className="w-full" disabled={loading || code.length !== 5} onClick={verifyOtp}>{loading ? <><Loader2 className="size-4 animate-spin" /> در حال بررسی</> : "تأیید و ورود"}</Button>
      <div className="grid grid-cols-2 gap-3"><Button type="button" variant="outline" disabled={loading || active} onClick={requestOtp}>ارسال مجدد {active ? `(${time})` : ""}</Button><Button type="button" variant="ghost" disabled={loading} onClick={() => { setExpiresAt(null); setCode(""); setError(null); }}>اصلاح شماره</Button></div>
    </>}
    {error ? <p className="rounded-xl bg-red-50 p-3 text-sm text-destructive">{error}</p> : null}
  </div>;
}
