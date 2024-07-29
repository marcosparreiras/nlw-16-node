import { z } from "zod";
import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../../lib/prisma";
import { ClientError } from "../../domain/erros/client-error";
import { env } from "../../env";
import type { EmailProvider } from "../../domain/bondaries/email-provider";
import { NodemailerEmailProvider } from "../../adapters/nodemailer-email-provider";
import { ConfirmPresenceEmail } from "../../domain/value-objects/confirm-presence-email";

export async function confirmTrip(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/trips/:id/confirm",
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
          particpants: {
            where: {
              isOwner: false,
            },
          },
        },
      });

      if (trip === null) {
        throw new ClientError("Trip not found");
      }
      if (trip.isConfirmed) {
        return reply.redirect(`${env.FRONT_END_BASE_URL}/trips/${id}`);
      }
      await prisma.trip.update({
        where: { id },
        data: { isConfirmed: true },
      });

      const emailProvider: EmailProvider = new NodemailerEmailProvider();

      await Promise.all(
        trip.particpants.map((participant) => {
          const email = ConfirmPresenceEmail.create({
            destination: trip.destination,
            endsDate: trip.endsAt,
            startsDate: trip.startsAt,
            tripParticipantEmail: participant.email,
            tripParticipantId: participant.id,
            tripParticipantName: participant.name,
          });
          return emailProvider.sendEmail(email);
        })
      );

      return reply.redirect(`${env.FRONT_END_BASE_URL}/trips/${id}`);
    }
  );
}
