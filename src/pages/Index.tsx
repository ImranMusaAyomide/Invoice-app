import { useState } from "react";
import { useInvoices } from "@/context/InvoiceContext";
import StatusFilter from "@/components/StatusFilter";
import InvoiceListItem from "@/components/InvoiceListItem";
import EmptyState from "@/components/EmptyState";
import InvoiceForm from "@/components/InvoiceForm";
import { Plus } from "lucide-react";
import type { InvoiceStatus } from "@/types/invoice";
import { toast } from "sonner";

const Index = () => {
  const { invoices, addInvoice } = useInvoices();
  const [filter, setFilter] = useState<InvoiceStatus[]>([]);
  const [formOpen, setFormOpen] = useState(false);

  const filtered = filter.length === 0 ? invoices : invoices.filter((i) => filter.includes(i.status));

  return (
    <>
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-[2rem]">Invoices</h1>
          <p className="mt-1 text-[13px] text-muted-foreground">
            {filtered.length === 1 ? "There is 1 invoice" : `There are ${filtered.length} total invoices`}
          </p>
        </div>

        <div className="flex items-center gap-4 sm:gap-10">
          <StatusFilter selected={filter} onChange={setFilter} />
          <button
            onClick={() => setFormOpen(true)}
            className="flex items-center gap-2 rounded-full bg-brand py-2 pl-2 pr-4 text-sm font-bold text-primary-foreground transition-colors hover:bg-brand-hover sm:gap-4 sm:py-2 sm:pl-2 sm:pr-4"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white">
              <Plus className="h-3 w-3 stroke-[3] text-brand" />
            </span>
            <span>New <span className="hidden sm:inline">Invoice</span></span>
          </button>
        </div>
      </header>

      {filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <ul className="mt-8 flex flex-col gap-4">
          {filtered.map((inv) => (
            <li key={inv.id}>
              <InvoiceListItem invoice={inv} />
            </li>
          ))}
        </ul>
      )}

      <InvoiceForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={(data) => {
          addInvoice(data);
          setFormOpen(false);
          toast.success("Invoice created");
        }}
      />
    </>
  );
};

export default Index;
