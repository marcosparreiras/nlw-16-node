import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../lib/prisma";
import { dayjs } from "../../lib/dayjs";
import { ClientError } from "../../domain/erros/client-error";

export async function getActivities(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/trips/:id/activities",
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
          activities: {
            orderBy: {
              occurs_at: "asc",
            },
          },
        },
      });

      if (trip === null) {
        throw new ClientError("Trip not found");
      }

      const tripDaysQty = dayjs(trip.endsAt).diff(trip.startsAt, "days");

      const activities = Array.from({
        length: tripDaysQty + 1,
      }).map((_, index) => {
        const date = dayjs(trip.startsAt).add(index, "days");
        return {
          [date.toString()]: trip.activities.filter((activity) =>
            dayjs(activity.occurs_at).isSame(date, "day")
          ),
        };
      });

      return reply.status(200).send({
        activities,
      });
    }
  );
}
