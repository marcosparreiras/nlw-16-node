import fastify from "fastify";
import { prisma } from "./lib/prisma";

const app = fastify();

app.get("/cadastrar", async (request, reply) => {
  await prisma.trip.create({
    data: {
      destination: "Florianopolis",
      endsAt: new Date(),
      startsAt: new Date(),
    },
  });
  return reply.status(200).send({ message: "Registro cadastrado com sucesso" });
});

app.get("/listar", async (request, reply) => {
  const trips = await prisma.trip.findMany();
  return reply.status(200).send({ trips });
});

app.listen({ port: Number(process.env.PORT) }).then(() => {
  console.log(`Server is running on port ${process.env.PORT} 🚀`);
});
