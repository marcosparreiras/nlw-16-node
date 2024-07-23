import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../lib/prisma";
import { ClientError } from "../erros/client-error";
import type { Email, EmailProvider } from "../bondaries/email-provider";
import { NodemailerEmailProvider } from "../adapters/nodemailer-email-provider";
import { ConfirmPresenceEmail } from "../emails/confirm-presence-email";

export async function createInvite(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/trips/:id/invites",
    {
      schema: {
        params: z.object({
          id: z.string().uuid(),
        }),
        body: z.object({
          email: z.string().email(),
        }),
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      const { email: participantEmail } = request.body;

      const trip = await prisma.trip.findUnique({
        where: { id },
      });

      if (trip === null) {
        throw new ClientError("Trip not found");
      }

      const participant = await prisma.particpant.create({
        data: {
          email: participantEmail,
          tripId: id,
        },
      });

      const emailProvider: EmailProvider = new NodemailerEmailProvider();
      const email: Email = ConfirmPresenceEmail.create({
        destination: trip.destination,
        endsDate: trip.endsAt,
        startsDate: trip.startsAt,
        tripParticipantEmail: participant.email,
        tripParticipantId: participant.id,
        tripParticipantName: participant.name,
      });

      await emailProvider.sendEmail(email);

      return reply.status(201).send({ participantId: participant.id });
    }
  );
}
