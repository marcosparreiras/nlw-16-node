import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { dayjs } from "../lib/dayjs";
import { prisma } from "../lib/prisma";

export async function updateTrip(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().put(
    "/trips/:id",
    {
      schema: {
        params: z.object({
          id: z.string().uuid(),
        }),
        body: z.object({
          destination: z.string().min(4),
          startsAt: z.coerce.date(),
          endsAt: z.coerce.date(),
        }),
      },
    },
    async (request, reply) => {
      const { destination, startsAt, endsAt } = request.body;
      const { id } = request.params;

      const trip = await prisma.trip.findUnique({
        where: { id },
      });
      if (trip === null) {
        throw new Error("Trip not found");
      }

      if (dayjs(startsAt).isBefore(new Date())) {
        throw new Error("Invalid trip start date");
      }

      if (dayjs(endsAt).isBefore(startsAt)) {
        throw new Error("Invalid trip end date");
      }

      await prisma.trip.update({
        data: {
          destination,
          startsAt,
          endsAt,
        },
        where: {
          id,
        },
      });

      return reply.status(204).send();
    }
  );
}
