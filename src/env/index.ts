import z from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().default(3333),
  DATABASE_URL: z.string().default("file:./dev.db"),
  FRONT_END_BASE_URL: z.string().url().default("http://localhost:3000"),
  API_BASE_URL: z.string().url().default("http://localhost:3333"),
});

export const env = envSchema.parse(process.env);
