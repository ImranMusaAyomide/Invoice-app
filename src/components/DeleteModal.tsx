import { useEffect, useRef } from "react";

interface Props {
  open: boolean;
  invoiceId: string;
  onCancel: () => void;
  onConfirm: () => void;
}

const DeleteModal = ({ open, invoiceId, onCancel, onConfirm }: Props) => {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    cancelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
      if (e.key === "Tab" && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll<HTMLElement>('button, [href], input');
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
  }, [open, onCancel]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6 animate-fade-in" onClick={onCancel}>
      <div
        ref={dialogRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-title"
        aria-describedby="delete-desc"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[480px] rounded-lg bg-surface p-8 shadow-xl sm:p-12"
      >
        <h2 id="delete-title" className="text-2xl font-bold tracking-tight">Confirm Deletion</h2>
        <p id="delete-desc" className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Are you sure you want to delete invoice #{invoiceId}? This action cannot be undone.
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <button
            ref={cancelRef}
            onClick={onCancel}
            className="rounded-full bg-secondary px-6 py-4 text-sm font-bold text-secondary-foreground transition-colors hover:bg-accent"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-full bg-destructive px-6 py-4 text-sm font-bold text-destructive-foreground transition-colors hover:bg-destructive-hover"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
