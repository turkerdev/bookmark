import { z } from "zod";

export const Input = z.object({
  name: z.string().min(1),
  url: z.string().url().min(1),
  icon: z.string().min(1),
  adminKey: z.string().min(1),
});
export type TInput = z.infer<typeof Input>;
