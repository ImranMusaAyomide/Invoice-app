import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import type { InvoiceStatus } from "@/types/invoice";
import { cn } from "@/lib/utils";

interface Props {
  selected: InvoiceStatus[];
  onChange: (next: InvoiceStatus[]) => void;
}

const options: { value: InvoiceStatus; label: string }[] = [
  { value: "draft", label: "Draft" },
  { value: "pending", label: "Pending" },
  { value: "paid", label: "Paid" },
];

const StatusFilter = ({ selected, onChange }: Props) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggle = (v: InvoiceStatus) => {
    onChange(selected.includes(v) ? selected.filter((s) => s !== v) : [...selected, v]);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-3 text-sm font-bold text-foreground transition-colors hover:opacity-80"
        aria-haspopup="true"
        aria-expanded={open}
      >
        <span className="hidden sm:inline">Filter by status</span>
        <span className="sm:hidden">Filter</span>
        <ChevronDown className={cn("h-3 w-3 stroke-[3] text-brand transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="absolute right-0 top-10 z-50 w-48 rounded-lg bg-popover p-6 shadow-xl animate-fade-in">
          <div className="flex flex-col gap-4">
            {options.map((opt) => {
              const checked = selected.includes(opt.value);
              return (
                <label key={opt.value} className="flex cursor-pointer items-center gap-3 text-sm font-bold">
                  <span
                    className={cn(
                      "flex h-4 w-4 items-center justify-center rounded-sm border-2 transition-colors",
                      checked ? "border-brand bg-brand" : "border-transparent bg-secondary group-hover:border-brand"
                    )}
                  >
                    {checked && <Check className="h-3 w-3 text-white" strokeWidth={4} />}
                  </span>
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={checked}
                    onChange={() => toggle(opt.value)}
                  />
                  {opt.label}
                </label>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusFilter;
