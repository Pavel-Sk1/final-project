export function normalizePhoneDigits(input: string | number): string {
  const digits = String(input).replace(/\D/g, "").slice(0, 11);
  if (!digits) return "";
  let num = digits;
  if (num.startsWith("8")) {
    num = "7" + num.slice(1);
  }
  if (num.length === 10 && !num.startsWith("7")) {
    num = "7" + num;
  }
  return num.slice(0, 11);
}

export function formatPhonePretty(input: string | number): string {
  const num = normalizePhoneDigits(input);
  if (num.length < 11) {
    const b = num.startsWith("7") ? num.slice(1) : num;
    let result = "+7";
    if (b.length > 0) result += " (" + b.slice(0, 3);
    if (b.length >= 3) result += ")";
    if (b.length > 3) result += " " + b.slice(3, 6);
    if (b.length > 6) result += "-" + b.slice(6, 8);
    if (b.length > 8) result += "-" + b.slice(8, 10);
    return result;
  }
  const body = num.slice(1);
  return `+7 (${body.slice(0, 3)}) ${body.slice(3, 6)}-${body.slice(6, 8)}-${body.slice(8, 10)}`;
}

export function formatTelHref(input: string | number): string {
  const num = normalizePhoneDigits(input);
  return num ? `tel:+${num}` : "tel:";
}

export function formatPhoneInputMask(value: string): string {
  const normalized = normalizePhoneDigits(value);
  const b = normalized.startsWith("7") ? normalized.slice(1) : normalized;
  let formatted = "+7";
  if (b.length > 0) formatted += " (" + b.slice(0, 3);
  if (b.length >= 3) formatted += ")";
  if (b.length > 3) formatted += " " + b.slice(3, 6);
  if (b.length > 6) formatted += "-" + b.slice(6, 8);
  if (b.length > 8) formatted += "-" + b.slice(8, 10);
  return formatted;
}


