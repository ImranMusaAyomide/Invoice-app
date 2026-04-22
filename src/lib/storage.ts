import type { Invoice } from "@/types/invoice";

const KEY = "invoice-app:invoices";

export const loadInvoices = (): Invoice[] => {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Invoice[];
  } catch {
    return [];
  }
};

export const saveInvoices = (invoices: Invoice[]) => {
  localStorage.setItem(KEY, JSON.stringify(invoices));
};

export const generateInvoiceId = (existing: Invoice[]): string => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const taken = new Set(existing.map((i) => i.id));
  let id = "";
  do {
    const a = letters[Math.floor(Math.random() * 26)];
    const b = letters[Math.floor(Math.random() * 26)];
    const num = String(Math.floor(1000 + Math.random() * 9000));
    id = `${a}${b}${num}`;
  } while (taken.has(id));
  return id;
};
