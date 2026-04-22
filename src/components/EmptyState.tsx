import emptyIllustration from "@/assets/empty-state.svg";

const EmptyState = () => (
  <div className="mx-auto mt-24 flex max-w-sm flex-col items-center text-center animate-fade-in">
    <img src={emptyIllustration} alt="" aria-hidden="true" width={242} height={200} />
    <h2 className="mt-16 text-2xl font-bold tracking-tight">There is nothing here</h2>
    <p className="mt-6 text-[13px] text-muted-foreground">
      Create an invoice by clicking the <span className="font-bold">New Invoice</span> button and get started
    </p>
  </div>
);

export default EmptyState;
