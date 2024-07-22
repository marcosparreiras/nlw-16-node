import z from "zod";

const envSchema = z.object({
  PORT: z.coerce.number(),
  DATABASE_URL: z.string(),
  FRONT_END_BASE_URL: z.string().url(),
  API_BASE_URL: z.string().url(),
});

export const env = envSchema.parse(process.env);
