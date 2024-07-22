import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../lib/prisma";

export async function getLinks(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/trips/:id/links",
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
        include: {
          links: true,
        },
      });

      if (trip === null) {
        throw new Error("Trip not found");
      }

      return reply.status(200).send({
        links: trip.links,
      });
    }
  );
}
