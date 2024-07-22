import fastify from "fastify";
import cors from "@fastify/cors";
import { createTrip } from "./routes/create-trip";
import { confirmTrip } from "./routes/confirm-trip";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";

const app = fastify();
app.register(cors, {
  origin: "*",
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(createTrip);
app.register(confirmTrip);

app.listen({ port: Number(process.env.PORT) }).then(() => {
  console.log(`Server is running on port ${process.env.PORT} 🚀`);
});
