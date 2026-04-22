import type { InvoiceStatus } from "@/types/invoice";
import { cn } from "@/lib/utils";

const styles: Record<InvoiceStatus, { bg: string; text: string; dot: string; label: string }> = {
  paid:    { bg: "bg-status-paid/10",    text: "text-status-paid",    dot: "bg-status-paid",    label: "Paid" },
  pending: { bg: "bg-status-pending/10", text: "text-status-pending", dot: "bg-status-pending", label: "Pending" },
  draft:   { bg: "bg-status-draft/10 dark:bg-white/5",   text: "text-status-draft dark:text-[#DFE3FA]", dot: "bg-status-draft dark:bg-[#DFE3FA]", label: "Draft" },
};

const StatusBadge = ({ status }: { status: InvoiceStatus }) => {
  const s = styles[status];
  return (
    <span className={cn("status-pill", s.bg, s.text)}>
      <span className={cn("status-dot", s.dot)} aria-hidden="true" />
      {s.label}
    </span>
  );
};

export default StatusBadge;
