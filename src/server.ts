import fastify from "fastify";
import { createTrip } from "./routes/create-trip";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";

const app = fastify();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(createTrip);

app.listen({ port: Number(process.env.PORT) }).then(() => {
  console.log(`Server is running on port ${process.env.PORT} 🚀`);
});
