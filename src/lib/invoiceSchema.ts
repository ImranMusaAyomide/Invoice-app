import { z } from "zod";

export const addressSchema = z.object({
  street: z.string().trim().min(1, "can't be empty").max(100),
  city: z.string().trim().min(1, "can't be empty").max(60),
  postCode: z.string().trim().min(1, "can't be empty").max(20),
  country: z.string().trim().min(1, "can't be empty").max(60),
});

export const itemSchema = z.object({
  id: z.string(),
  name: z.string().trim().min(1, "can't be empty").max(100),
  quantity: z.number({ error: "required" }).min(1, "min 1"),
  price: z.number({ error: "required" }).min(0, "min 0"),
});

export const invoiceFormSchema = z.object({
  senderAddress: addressSchema,
  clientName: z.string().trim().min(1, "can't be empty").max(100),
  clientEmail: z.string().trim().min(1, "can't be empty").email("invalid email").max(255),
  clientAddress: addressSchema,
  createdAt: z.string().min(1, "can't be empty"),
  paymentTerms: z.number().int().min(1),
  description: z.string().trim().min(1, "can't be empty").max(200),
  items: z.array(itemSchema).min(1, "An item must be added"),
});

export type InvoiceFormValues = z.infer<typeof invoiceFormSchema>;
