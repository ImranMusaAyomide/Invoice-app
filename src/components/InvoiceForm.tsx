import { useEffect, useRef } from "react";
import { useForm, useFieldArray, FormProvider, useFormContext, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDays, format } from "date-fns";
import { Trash2, Plus, ChevronLeft, Calendar, ChevronDown } from "lucide-react";
import { invoiceFormSchema, type InvoiceFormValues } from "@/lib/invoiceSchema";
import type { Invoice, InvoiceStatus } from "@/types/invoice";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/format";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onClose: () => void;
  initial?: Invoice;
  onSubmit: (data: Omit<Invoice, "id">) => void;
}

const blankAddress = { street: "", city: "", postCode: "", country: "" };
const defaults: InvoiceFormValues = {
  senderAddress: blankAddress,
  clientName: "",
  clientEmail: "",
  clientAddress: blankAddress,
  createdAt: format(new Date(), "yyyy-MM-dd"),
  paymentTerms: 30,
  description: "",
  items: [],
};

const InvoiceForm = ({ open, onClose, initial, onSubmit }: Props) => {
  const isEdit = !!initial;
  const methods = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: initial
      ? {
          senderAddress: initial.senderAddress,
          clientName: initial.clientName,
          clientEmail: initial.clientEmail,
          clientAddress: initial.clientAddress,
          createdAt: initial.createdAt,
          paymentTerms: initial.paymentTerms,
          description: initial.description,
          items: initial.items,
        }
      : defaults,
  });

  const { handleSubmit, reset, formState: { errors } } = methods;
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      reset(
        initial
          ? {
              senderAddress: initial.senderAddress,
              clientName: initial.clientName,
              clientEmail: initial.clientEmail,
              clientAddress: initial.clientAddress,
              createdAt: initial.createdAt,
              paymentTerms: initial.paymentTerms,
              description: initial.description,
              items: initial.items,
            }
          : defaults
      );
    }
  }, [open, initial, reset]);

  useEffect(() => {
    if (!open) return;
    // Move focus to the first focusable element inside the panel
    requestAnimationFrame(() => {
      const first = panelRef.current?.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      first?.focus();
    });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const buildPayload = (values: InvoiceFormValues, status: InvoiceStatus): Omit<Invoice, "id"> => {
    const total = values.items.reduce((s, i) => s + i.quantity * i.price, 0);
    return {
      ...values,
      status,
      total,
      paymentDue: format(addDays(new Date(values.createdAt), values.paymentTerms), "yyyy-MM-dd"),
    };
  };

  const submitAsPending = handleSubmit((values) => {
    onSubmit(buildPayload(values, "pending"));
  }, () => toast.error("All fields must be added"));

  const saveAsDraft = () => {
    // Drafts don't require validation
    const values = methods.getValues();
    onSubmit(buildPayload(values, "draft"));
  };

  const saveChanges = handleSubmit((values) => {
    // Editing a draft keeps it as draft; otherwise preserve original status
    const nextStatus: InvoiceStatus = initial?.status === "draft" ? "draft" : initial!.status;
    onSubmit(buildPayload(values, nextStatus));
  }, () => toast.error("All fields must be added"));

  const saveAndSend = handleSubmit((values) => {
    onSubmit(buildPayload(values, "pending"));
  }, () => toast.error("All fields must be added"));

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 bg-black/50 animate-fade-in"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label={isEdit ? `Edit invoice ${initial?.id}` : "New invoice"}
    >
      <div
        ref={panelRef}
        className="
          fixed inset-y-0 left-0 flex w-full flex-col bg-background animate-slide-in-left
          sm:max-w-[616px]
          lg:left-[103px] lg:rounded-r-3xl
          lg:top-0 lg:bottom-0
          md:top-20 lg:top-0
          top-[72px] md:top-20 lg:top-0
        "
      >
        {/* Mobile back btn */}
        <button onClick={onClose} className="flex items-center gap-6 px-6 pt-8 text-sm font-bold lg:hidden">
          <ChevronLeft className="h-3 w-3 stroke-[3] text-brand" />
          Go back
        </button>

        <FormProvider {...methods}>
          <form className="flex flex-1 flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto px-6 pt-8 pb-10 sm:px-14 sm:pt-14">
              <h2 className="text-2xl font-bold tracking-tight">
                {isEdit ? (
                  <>
                    Edit <span className="text-subtle">#</span>
                    {initial?.id}
                  </>
                ) : (
                  "New Invoice"
                )}
              </h2>

              {/* Bill From */}
              <h3 className="mt-12 text-sm font-bold text-brand">Bill From</h3>
              <div className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-3">
                <Field name="senderAddress.street" label="Street Address" className="col-span-2 sm:col-span-3" />
                <Field name="senderAddress.city" label="City" />
                <Field name="senderAddress.postCode" label="Post Code" />
                <Field name="senderAddress.country" label="Country" className="col-span-2 sm:col-span-1" />
              </div>

              {/* Bill To */}
              <h3 className="mt-12 text-sm font-bold text-brand">Bill To</h3>
              <div className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-3">
                <Field name="clientName" label="Client's Name" className="col-span-2 sm:col-span-3" />
                <Field name="clientEmail" label="Client's Email" type="email" placeholder="e.g. email@example.com" className="col-span-2 sm:col-span-3" />
                <Field name="clientAddress.street" label="Street Address" className="col-span-2 sm:col-span-3" />
                <Field name="clientAddress.city" label="City" />
                <Field name="clientAddress.postCode" label="Post Code" />
                <Field name="clientAddress.country" label="Country" className="col-span-2 sm:col-span-1" />
              </div>

              <div className="mt-12 grid grid-cols-2 gap-6">
                <Field name="createdAt" label="Invoice Date" type="date" />
                <Controller
                  control={methods.control}
                  name="paymentTerms"
                  render={({ field }) => (
                    <FieldWrap label="Payment Terms" name="paymentTerms" error={errors.paymentTerms?.message}>
                      <div className="relative">
                        <select
                          {...field}
                          value={field.value}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          className="h-12 w-full appearance-none rounded-md border border-input bg-surface px-5 pr-10 text-sm font-bold text-foreground transition-colors hover:border-brand focus:border-brand focus:outline-none"
                        >
                          <option value={1}>Net 1 Day</option>
                          <option value={7}>Net 7 Days</option>
                          <option value={14}>Net 14 Days</option>
                          <option value={30}>Net 30 Days</option>
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-brand" />
                      </div>
                    </FieldWrap>
                  )}
                />
                <Field name="description" label="Project Description" placeholder="e.g. Graphic Design Service" className="col-span-2" />
              </div>

              <ItemList />
            </div>

            {/* Footer actions */}
            <div className="border-t border-border bg-background px-6 py-6 sm:px-14">
              {isEdit ? (
                <div className="flex flex-wrap justify-end gap-2">
                  <button type="button" onClick={onClose} className="rounded-full bg-secondary px-6 py-4 text-sm font-bold text-secondary-foreground transition-colors hover:bg-accent">
                    Cancel
                  </button>
                  <button type="button" onClick={saveChanges} className="rounded-full bg-brand px-6 py-4 text-sm font-bold text-primary-foreground transition-colors hover:bg-brand-hover">
                    Save Changes
                  </button>
                  {initial?.status === "draft" && (
                    <button type="button" onClick={saveAndSend} className="rounded-full bg-[#373B53] px-6 py-4 text-sm font-bold text-[#888EB0] transition-colors hover:bg-[#0C0E16]">
                      Save &amp; Send
                    </button>
                  )}
                </div>
              ) : (
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <button type="button" onClick={onClose} className="rounded-full bg-secondary px-6 py-4 text-sm font-bold text-secondary-foreground transition-colors hover:bg-accent">
                    Discard
                  </button>
                  <div className="ml-auto flex gap-2">
                    <button type="button" onClick={saveAsDraft} className="rounded-full bg-[#373B53] px-4 py-4 text-sm font-bold text-[#888EB0] transition-colors hover:bg-[#0C0E16] sm:px-6">
                      Save as Draft
                    </button>
                    <button type="button" onClick={submitAsPending} className="rounded-full bg-brand px-4 py-4 text-sm font-bold text-primary-foreground transition-colors hover:bg-brand-hover sm:px-6">
                      Save & Send
                    </button>
                  </div>
                </div>
              )}
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

const FieldWrap = ({ label, name, error, children }: { label: string; name: string; error?: string; children: React.ReactNode }) => (
  <div>
    <div className="mb-2 flex items-center justify-between gap-2">
      <label htmlFor={name} className={cn("text-sm text-muted-foreground", error && "text-destructive")}>{label}</label>
      {error && <span className="text-xs font-semibold text-destructive">{error}</span>}
    </div>
    {children}
  </div>
);

const Field = ({ name, label, type = "text", placeholder, className }: { name: string; label: string; type?: string; placeholder?: string; className?: string }) => {
  const { register, formState: { errors } } = useFormContext();
  const error = name.split(".").reduce<unknown>((acc, k) => (acc as Record<string, unknown> | undefined)?.[k], errors) as { message?: string } | undefined;
  const isDate = type === "date";
  return (
    <div className={className}>
      <FieldWrap label={label} name={name} error={error?.message}>
        <div className="relative">
          <input
            id={name}
            type={type}
            placeholder={placeholder}
            {...register(name as never)}
            className={cn(
              "h-12 w-full rounded-md border border-input bg-surface px-5 text-sm font-bold text-foreground transition-colors hover:border-brand focus:border-brand focus:outline-none",
              isDate && "pr-10",
              error && "border-destructive"
            )}
          />
          {isDate && (
            <Calendar className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-brand" />
          )}
        </div>
      </FieldWrap>
    </div>
  );
};

const ItemList = () => {
  const { control, register, watch, formState: { errors } } = useFormContext<InvoiceFormValues>();
  const { fields, append, remove } = useFieldArray({ control, name: "items" });
  const items = watch("items");

  return (
    <div className="mt-16">
      <h3 className="text-lg font-bold text-[#777F98]">Item List</h3>
      <div className="mt-6 flex flex-col gap-12 sm:gap-4">
        {/* Header (sm+) */}
        {fields.length > 0 && (
          <div className="hidden text-xs text-muted-foreground sm:grid sm:grid-cols-[1fr_60px_100px_100px_20px] sm:gap-4">
            <span>Item Name</span>
            <span>Qty.</span>
            <span>Price</span>
            <span>Total</span>
            <span />
          </div>
        )}

        {fields.map((f, idx) => {
          const qty = items?.[idx]?.quantity ?? 0;
          const price = items?.[idx]?.price ?? 0;
          const total = qty * price;
          const itemErrors = errors.items?.[idx];
          return (
            <div key={f.id} className="grid grid-cols-[1fr_60px_100px_24px] gap-4 sm:grid-cols-[1fr_60px_100px_100px_20px] sm:items-end">
              <div className="col-span-4 sm:col-span-1">
                <FieldWrap label="Item Name" name={`items.${idx}.name`} error={itemErrors?.name?.message}>
                  <input
                    {...register(`items.${idx}.name` as const)}
                    className={cn(
                      "h-12 w-full rounded-md border border-input bg-surface px-5 text-sm font-bold text-foreground transition-colors hover:border-brand focus:border-brand focus:outline-none",
                      itemErrors?.name && "border-destructive"
                    )}
                  />
                </FieldWrap>
              </div>
              <FieldWrap label="Qty." name={`items.${idx}.quantity`} error={itemErrors?.quantity?.message}>
                <input
                  type="number"
                  min={1}
                  {...register(`items.${idx}.quantity` as const, { valueAsNumber: true })}
                  className={cn(
                    "h-12 w-full rounded-md border border-input bg-surface px-3 text-sm font-bold text-foreground transition-colors hover:border-brand focus:border-brand focus:outline-none",
                    itemErrors?.quantity && "border-destructive"
                  )}
                />
              </FieldWrap>
              <FieldWrap label="Price" name={`items.${idx}.price`} error={itemErrors?.price?.message}>
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  {...register(`items.${idx}.price` as const, { valueAsNumber: true })}
                  className={cn(
                    "h-12 w-full rounded-md border border-input bg-surface px-3 text-sm font-bold text-foreground transition-colors hover:border-brand focus:border-brand focus:outline-none",
                    itemErrors?.price && "border-destructive"
                  )}
                />
              </FieldWrap>
              <div className="hidden sm:block">
                <span className="mb-2 block text-sm text-muted-foreground">Total</span>
                <span className="block py-3 text-sm font-bold text-brand">{formatCurrency(total)}</span>
              </div>
              <button
                type="button"
                onClick={() => remove(idx)}
                className="text-muted-foreground transition-colors hover:text-destructive"
                aria-label={`Delete item ${idx + 1}`}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          );
        })}

        <button
          type="button"
          onClick={() => append({ id: crypto.randomUUID(), name: "", quantity: 1, price: 0 })}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-secondary text-sm font-bold text-secondary-foreground transition-colors hover:bg-accent"
        >
          <Plus className="h-3 w-3 stroke-[3]" /> Add New Item
        </button>

        {errors.items && typeof errors.items.message === "string" && (
          <p className="text-xs font-semibold text-destructive">- {errors.items.message}</p>
        )}
      </div>
    </div>
  );
};

export default InvoiceForm;
