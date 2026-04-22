import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { useInvoices } from "@/context/InvoiceContext";
import StatusBadge from "@/components/StatusBadge";
import InvoiceForm from "@/components/InvoiceForm";
import DeleteModal from "@/components/DeleteModal";
import { formatCurrency, formatDate } from "@/lib/format";
import { toast } from "sonner";

const InvoiceDetail = () => {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { getInvoice, updateInvoice, deleteInvoice, markPaid } = useInvoices();
  const invoice = getInvoice(id);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  if (!invoice) {
    return (
      <div className="text-center">
        <h2 className="text-xl font-bold">Invoice not found</h2>
        <Link to="/" className="mt-4 inline-block text-brand hover:underline">Back to invoices</Link>
      </div>
    );
  }

  const canMarkPaid = invoice.status === "pending";
  const canEdit = invoice.status !== "paid";
  const canSend = invoice.status === "draft";

  const handleSend = () => {
    updateInvoice(invoice.id, { status: "pending" });
    toast.success("Invoice sent");
  };

  return (
    <>
      <Link to="/" className="inline-flex items-center gap-6 text-sm font-bold transition-colors hover:text-muted-foreground">
        <ChevronLeft className="h-3 w-3 stroke-[3] text-brand" />
        Go back
      </Link>

      {/* Status bar */}
      <div className="mt-8 flex items-center justify-between rounded-lg bg-surface p-6 shadow-card">
        <div className="flex w-full items-center justify-between sm:w-auto sm:gap-5">
          <span className="text-[13px] text-muted-foreground">Status</span>
          <StatusBadge status={invoice.status} />
        </div>
        <div className="hidden items-center gap-2 sm:flex">
          {canEdit && (
            <button onClick={() => setEditOpen(true)} className="rounded-full bg-secondary px-6 py-4 text-sm font-bold text-secondary-foreground transition-colors hover:bg-accent">
              Edit
            </button>
          )}
          <button onClick={() => setDeleteOpen(true)} className="rounded-full bg-destructive px-6 py-4 text-sm font-bold text-destructive-foreground transition-colors hover:bg-destructive-hover">
            Delete
          </button>
          {canSend && (
            <button onClick={handleSend} className="rounded-full bg-brand px-6 py-4 text-sm font-bold text-primary-foreground transition-colors hover:bg-brand-hover">
              Send Invoice
            </button>
          )}
          {canMarkPaid && (
            <button onClick={() => { markPaid(invoice.id); toast.success("Invoice marked as paid"); }} className="rounded-full bg-brand px-6 py-4 text-sm font-bold text-primary-foreground transition-colors hover:bg-brand-hover">
              Mark as Paid
            </button>
          )}
        </div>
      </div>

      {/* Detail card */}
      <article className="mt-4 rounded-lg bg-surface p-6 shadow-card sm:p-12">
        <header className="flex flex-col justify-between gap-8 sm:flex-row sm:items-start">
          <div>
            <h2 className="text-base font-bold tracking-tight">
              <span className="text-subtle">#</span>{invoice.id}
            </h2>
            <p className="mt-2 text-[13px] text-muted-foreground">{invoice.description}</p>
          </div>
          <address className="not-italic text-[11px] leading-[18px] text-muted-foreground sm:text-right">
            {invoice.senderAddress.street}<br />
            {invoice.senderAddress.city}<br />
            {invoice.senderAddress.postCode}<br />
            {invoice.senderAddress.country}
          </address>
        </header>

        <section className="mt-8 grid grid-cols-2 gap-8 sm:grid-cols-3">
          <div>
            <p className="text-[13px] text-muted-foreground">Invoice Date</p>
            <p className="mt-3 text-[15px] font-bold">{formatDate(invoice.createdAt)}</p>
            <p className="mt-8 text-[13px] text-muted-foreground">Payment Due</p>
            <p className="mt-3 text-[15px] font-bold">{formatDate(invoice.paymentDue)}</p>
          </div>
          <div>
            <p className="text-[13px] text-muted-foreground">Bill To</p>
            <p className="mt-3 text-[15px] font-bold">{invoice.clientName}</p>
            <address className="mt-2 not-italic text-[11px] leading-[18px] text-muted-foreground">
              {invoice.clientAddress.street}<br />
              {invoice.clientAddress.city}<br />
              {invoice.clientAddress.postCode}<br />
              {invoice.clientAddress.country}
            </address>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <p className="text-[13px] text-muted-foreground">Sent to</p>
            <p className="mt-3 break-all text-[15px] font-bold">{invoice.clientEmail}</p>
          </div>
        </section>

        {/* Items */}
        <section className="mt-10 overflow-hidden rounded-t-lg bg-muted">
          {/* Desktop header */}
          <div className="hidden grid-cols-[1fr_80px_100px_120px] gap-4 px-8 pt-8 text-[11px] text-muted-foreground sm:grid">
            <span>Item Name</span>
            <span className="text-center">QTY.</span>
            <span className="text-right">Price</span>
            <span className="text-right">Total</span>
          </div>
          <div className="space-y-6 px-6 py-6 sm:space-y-8 sm:px-8 sm:py-8">
            {invoice.items.map((item) => (
              <div key={item.id} className="grid grid-cols-2 sm:grid-cols-[1fr_80px_100px_120px] sm:gap-4">
                <div>
                  <p className="text-[15px] font-bold">{item.name}</p>
                  <p className="mt-2 text-[13px] font-bold text-muted-foreground sm:hidden">
                    {item.quantity} x {formatCurrency(item.price)}
                  </p>
                </div>
                <p className="hidden text-center text-[15px] font-bold text-brand sm:block">{item.quantity}</p>
                <p className="hidden text-right text-[15px] font-bold text-brand sm:block">{formatCurrency(item.price)}</p>
                <p className="justify-self-end text-right text-[15px] font-bold">{formatCurrency(item.quantity * item.price)}</p>
              </div>
            ))}
          </div>
        </section>
        <div className="flex items-center justify-between rounded-b-lg bg-[#1F213A] px-6 py-6 text-white dark:bg-[#0C0E16] sm:px-8">
          <span className="text-[11px] sm:text-[13px]">Amount Due</span>
          <span className="text-xl font-bold tracking-tight sm:text-2xl">{formatCurrency(invoice.total)}</span>
        </div>
      </article>

      {/* Mobile action bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-end gap-2 bg-surface px-6 py-5 shadow-card sm:hidden">
        {canEdit && (
          <button onClick={() => setEditOpen(true)} className="rounded-full bg-secondary px-5 py-4 text-sm font-bold text-secondary-foreground transition-colors hover:bg-accent">
            Edit
          </button>
        )}
        <button onClick={() => setDeleteOpen(true)} className="rounded-full bg-destructive px-5 py-4 text-sm font-bold text-destructive-foreground transition-colors hover:bg-destructive-hover">
          Delete
        </button>
        {canSend && (
          <button onClick={handleSend} className="rounded-full bg-brand px-5 py-4 text-sm font-bold text-primary-foreground transition-colors hover:bg-brand-hover">
            Send Invoice
          </button>
        )}
        {canMarkPaid && (
          <button onClick={() => { markPaid(invoice.id); toast.success("Marked as paid"); }} className="rounded-full bg-brand px-5 py-4 text-sm font-bold text-primary-foreground transition-colors hover:bg-brand-hover">
            Mark as Paid
          </button>
        )}
      </div>

      <InvoiceForm
        open={editOpen}
        onClose={() => setEditOpen(false)}
        initial={invoice}
        onSubmit={(data) => {
          updateInvoice(invoice.id, data);
          setEditOpen(false);
          toast.success("Invoice updated");
        }}
      />
      <DeleteModal
        open={deleteOpen}
        invoiceId={invoice.id}
        onCancel={() => setDeleteOpen(false)}
        onConfirm={() => {
          deleteInvoice(invoice.id);
          toast.success("Invoice deleted");
          navigate("/");
        }}
      />
    </>
  );
};

export default InvoiceDetail;
