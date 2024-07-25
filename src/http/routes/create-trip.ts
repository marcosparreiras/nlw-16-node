import { z } from "zod";
import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../../lib/prisma";
import { dayjs } from "../../lib/dayjs";
import { ClientError } from "../../domain/erros/client-error";
import type { EmailProvider } from "../../domain/bondaries/email-provider";
import { NodemailerEmailProvider } from "../../adapters/nodemailer-email-provider";
import { ConfirmTripEmail } from "../../emails/confirm-trip-email";
import { CreateTripUseCase } from "../../domain/use-cases/create-trip-use-case";

export async function createTrip(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/trips",
    {
      schema: {
        body: z.object({
          destination: z.string().min(4),
          startsAt: z.coerce.date(),
          endsAt: z.coerce.date(),
          ownerName: z.string(),
          ownerEmail: z.string().email(),
          emailsToInvite: z.array(z.string().email()),
        }),
      },
    },
    async (request, reply) => {
      const {
        destination,
        startsAt,
        endsAt,
        ownerName,
        ownerEmail,
        emailsToInvite,
      } = request.body;

      if (dayjs(startsAt).isBefore(new Date())) {
        throw new ClientError("Invalid trip start date");
      }

      if (dayjs(endsAt).isBefore(startsAt)) {
        throw new ClientError("Invalid trip end date");
      }

      const { id } = await prisma.trip.create({
        data: {
          destination,
          startsAt,
          endsAt,
          particpants: {
            createMany: {
              data: [
                {
                  email: ownerEmail,
                  name: ownerName,
                  isOwner: true,
                  isConfirmed: true,
                },
                ...emailsToInvite.map((email) => ({ email })),
              ],
            },
          },
        },
        select: {
          id: true,
        },
      });

      const email = ConfirmTripEmail.create({
        destination,
        endsDate: endsAt,
        startsDate: startsAt,
        tripId: id,
        tripOwnerEmail: ownerEmail,
        tripOwnerName: ownerName,
      });

      const emailProvider: EmailProvider = new NodemailerEmailProvider();
      await emailProvider.sendEmail(email);

      return reply.status(201).send({ tripId: id });
    }
  );
}
