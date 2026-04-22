import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import type { Invoice } from "@/types/invoice";
import { formatCurrency, formatDate } from "@/lib/format";
import StatusBadge from "./StatusBadge";

const InvoiceListItem = ({ invoice }: { invoice: Invoice }) => (
  <Link
    to={`/invoice/${invoice.id}`}
    className="
      group block rounded-lg bg-surface p-6 shadow-card border border-transparent
      transition-all hover:border-brand
    "
  >
    {/* Mobile layout */}
    <div className="grid grid-cols-2 gap-y-6 sm:hidden">
      <p className="text-[15px] font-bold">
        <span className="text-subtle">#</span>
        <span className="text-foreground">{invoice.id}</span>
      </p>
      <p className="justify-self-end text-[13px] text-muted-foreground dark:text-subtle">
        {invoice.clientName}
      </p>
      <div className="flex flex-col gap-2">
        <span className="text-[13px] text-muted-foreground dark:text-subtle">
          Due {formatDate(invoice.paymentDue)}
        </span>
        <span className="text-[15px] font-bold">{formatCurrency(invoice.total)}</span>
      </div>
      <div className="justify-self-end self-end">
        <StatusBadge status={invoice.status} />
      </div>
    </div>

    {/* Desktop / tablet layout */}
    <div className="hidden sm:grid sm:grid-cols-[100px_140px_1fr_120px_140px_auto] sm:items-center sm:gap-4">
      <p className="text-[15px] font-bold">
        <span className="text-subtle">#</span>
        <span className="text-foreground">{invoice.id}</span>
      </p>
      <p className="text-[13px] text-muted-foreground dark:text-subtle">
        Due {formatDate(invoice.paymentDue)}
      </p>
      <p className="text-[13px] text-muted-foreground dark:text-subtle">
        {invoice.clientName}
      </p>
      <p className="justify-self-end text-[15px] font-bold">{formatCurrency(invoice.total)}</p>
      <div className="justify-self-end">
        <StatusBadge status={invoice.status} />
      </div>
      <ChevronRight className="h-3 w-3 stroke-[3] text-brand" />
    </div>
  </Link>
);

export default InvoiceListItem;
