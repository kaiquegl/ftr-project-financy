import { z } from "zod";

const categoryItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  icon: z.string(),
  color: z.string()
});

type CategoryItem = z.infer<typeof categoryItemSchema>;

export { type CategoryItem, categoryItemSchema };
