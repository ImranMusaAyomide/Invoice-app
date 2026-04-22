export type InvoiceStatus = "draft" | "pending" | "paid";

export interface InvoiceItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Address {
  street: string;
  city: string;
  postCode: string;
  country: string;
}

export interface Invoice {
  id: string;
  createdAt: string;       // ISO
  paymentDue: string;      // ISO
  description: string;
  paymentTerms: number;    // days
  clientName: string;
  clientEmail: string;
  status: InvoiceStatus;
  senderAddress: Address;
  clientAddress: Address;
  items: InvoiceItem[];
  total: number;
}
