type OtpRequest = { expiresAt: number };

const requests = new Map<string, OtpRequest>();

export function issueDevelopmentOtp(phone: string) {
  const expiresAt = Date.now() + 2 * 60 * 1000;
  requests.set(phone, { expiresAt });
  return expiresAt;
}

export function verifyDevelopmentOtp(phone: string, code: string) {
  const request = requests.get(phone);
  if (!request || request.expiresAt < Date.now()) return false;
  const valid = code === (process.env.DEV_OTP_CODE ?? "11111");
  if (valid) requests.delete(phone);
  return valid;
}
