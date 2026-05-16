import { z } from "zod";

const envSchema = z.object({
  VITE_GRAPHQL_URL: z.url().default("http://localhost:3333/graphql")
});

export const env = envSchema.parse(import.meta.env);
