import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../lib/prisma";
import { ClientError } from "../erros/client-error";

export async function createLink(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/trips/:id/links",
    {
      schema: {
        params: z.object({
          id: z.string().uuid(),
        }),
        body: z.object({
          title: z.string().min(4),
          url: z.string().url(),
        }),
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      const { title, url } = request.body;

      const trip = await prisma.trip.findUnique({
        where: { id },
      });

      if (!trip) {
        throw new ClientError("Trip not found");
      }

      const link = await prisma.link.create({
        data: {
          title,
          url,
          tripId: id,
        },
      });

      return reply.status(201).send({ linkId: link.id });
    }
  );
}
