import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../lib/prisma";
import { ClientError } from "../erros/client-error";

export async function getParticipant(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/participants/:id",
    {
      schema: {
        params: z.object({
          id: z.string().uuid(),
        }),
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      const participant = await prisma.particpant.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          email: true,
          isConfirmed: true,
        },
      });

      if (participant === null) {
        throw new ClientError("Participant not found");
      }
      return reply.status(200).send({ participant });
    }
  );
}
