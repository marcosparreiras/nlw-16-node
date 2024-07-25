import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../lib/prisma";
import { ClientError } from "../../domain/erros/client-error";

export async function getTripDatails(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/trips/:id",
    {
      schema: {
        params: z.object({
          id: z.string().uuid(),
        }),
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      const trip = await prisma.trip.findUnique({
        where: { id },
        select: {
          id: true,
          destination: true,
          startsAt: true,
          endsAt: true,
          isConfirmed: true,
        },
      });

      if (trip === null) {
        throw new ClientError("Trip not found");
      }

      return reply.status(200).send({ trip });
    }
  );
}
