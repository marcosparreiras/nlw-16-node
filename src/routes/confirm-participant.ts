import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../lib/prisma";

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
        throw new Error("Participant not found");
      }

      if (!participant.isConfirmed) {
        await prisma.particpant.update({
          where: { id },
          data: { isConfirmed: true },
        });
      }

      return reply.redirect(
        `http://localhost:3000/trips/${participant.tripId}`
      );
    }
  );
}
