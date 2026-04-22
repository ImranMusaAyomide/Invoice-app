import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import type { Invoice } from "@/types/invoice";
import { loadInvoices, saveInvoices, generateInvoiceId } from "@/lib/storage";
import { seedInvoices } from "@/lib/seed";

interface Ctx {
  invoices: Invoice[];
  getInvoice: (id: string) => Invoice | undefined;
  addInvoice: (data: Omit<Invoice, "id">) => Invoice;
  updateInvoice: (id: string, data: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;
  markPaid: (id: string) => void;
}

const InvoiceContext = createContext<Ctx | null>(null);

export const InvoiceProvider = ({ children }: { children: ReactNode }) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = loadInvoices();
    if (stored.length === 0 && !localStorage.getItem("invoice-app:seeded")) {
      setInvoices(seedInvoices);
      saveInvoices(seedInvoices);
      localStorage.setItem("invoice-app:seeded", "1");
    } else {
      setInvoices(stored);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveInvoices(invoices);
  }, [invoices, hydrated]);

  const getInvoice = useCallback((id: string) => invoices.find((i) => i.id === id), [invoices]);

  const addInvoice = useCallback((data: Omit<Invoice, "id">) => {
    const newInvoice: Invoice = { ...data, id: generateInvoiceId(invoices) };
    setInvoices((prev) => [newInvoice, ...prev]);
    return newInvoice;
  }, [invoices]);

  const updateInvoice = useCallback((id: string, data: Partial<Invoice>) => {
    setInvoices((prev) => prev.map((i) => (i.id === id ? { ...i, ...data } : i)));
  }, []);

  const deleteInvoice = useCallback((id: string) => {
    setInvoices((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const markPaid = useCallback((id: string) => {
    setInvoices((prev) => prev.map((i) => (i.id === id ? { ...i, status: "paid" } : i)));
  }, []);

  return (
    <InvoiceContext.Provider value={{ invoices, getInvoice, addInvoice, updateInvoice, deleteInvoice, markPaid }}>
      {children}
    </InvoiceContext.Provider>
  );
};

export const useInvoices = () => {
  const ctx = useContext(InvoiceContext);
  if (!ctx) throw new Error("useInvoices must be used within InvoiceProvider");
  return ctx;
};
