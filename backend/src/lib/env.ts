import { z } from "zod";

const envSchema = z.object({
  FRONTEND_URL: z.url().default("http://localhost:5173"),
  DATABASE_URL: z.url().default("file:./dev.db"),
  AUTH_SECRET: z.string().default("financy-dev-auth-secret-change-me"),
  PORT: z.coerce.number().default(3333),
  NODE_ENV: z.enum(["development", "production"]).default("development")
});

export const env = envSchema.parse(process.env);
