import fastify from "fastify";

const app = fastify();

app.get("/test", async (request, reply) => {
  return reply.status(200).send({ message: "Hello World" });
});

app.listen({ port: Number(process.env.PORT) }).then(() => {
  console.log(`Server is running on port ${process.env.PORT} 🚀`);
});
