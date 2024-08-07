import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../lib/prisma";
import { ClientError } from "../../domain/erros/client-error";
import { dayjs } from "../../lib/dayjs";

export async function createActivity(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/trips/:id/activities",
    {
      schema: {
        params: z.object({
          id: z.string().uuid(),
        }),
        body: z.object({
          title: z.string().min(4),
          occursAt: z.coerce.date(),
        }),
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      const { title, occursAt } = request.body;

      const trip = await prisma.trip.findUnique({
        where: { id },
      });

      if (!trip) {
        throw new ClientError("Trip not found");
      }

      if (
        dayjs(occursAt).isBefore(trip.startsAt) ||
        dayjs(occursAt).isAfter(trip.endsAt)
      ) {
        throw new ClientError("Invalid activity date");
      }

      const activity = await prisma.activity.create({
        data: {
          title,
          occurs_at: occursAt,
          tripId: id,
        },
      });

      return reply.status(201).send({ activityId: activity.id });
    }
  );
}
