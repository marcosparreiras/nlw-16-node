import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../lib/prisma";
import { ClientError } from "../erros/client-error";
import { env } from "../env";

export async function confirmParticipant(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().patch(
    "/participants/:id/confirm",
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
      });

      if (participant === null) {
        throw new ClientError("Participant not found");
      }

      if (!participant.isConfirmed) {
        await prisma.particpant.update({
          where: { id },
          data: { isConfirmed: true },
        });
      }

      return reply.redirect(
        `${env.FRONT_END_BASE_URL}/trips/${participant.tripId}`
      );
    }
  );
}
