import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../lib/prisma";
import { getMailClient } from "../lib/mail";
import { dayjs } from "../lib/dayjs";
import nodemailer from "nodemailer";
import { ClientError } from "../erros/client-error";
import { env } from "../env";

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
      const { email } = request.body;

      const trip = await prisma.trip.findUnique({
        where: { id },
      });

      if (trip === null) {
        throw new ClientError("Trip not found");
      }

      const participant = await prisma.particpant.create({
        data: {
          email,
          tripId: id,
        },
      });

      const formattedStartDate = dayjs(trip.startsAt).format("LL");
      const formattedEndDate = dayjs(trip.endsAt).format("LL");
      const mail = await getMailClient();
      const confirmationLink = `${env.FRONT_END_BASE_URL}/participants/${participant.id}/confirm`;

      const message = await mail.sendMail({
        from: {
          name: "Equpe Plann.er",
          address: "equipe@plann.er",
        },
        to: {
          name: participant.name ?? "",
          address: participant.email,
        },
        subject: `Confirme a sua presença na viagem para ${trip.destination} em ${formattedStartDate}`,
        html: `
    <div style="font-family: sans-serif; font-size: 16px; line-height: 1.6;">
      <p>Você você foi convidado para uma viagem para <strong>${trip.destination}</strong>, nas datas de <strong>${formattedStartDate}</strong> a <strong>${formattedEndDate}</strong><p>
      <p></p>
      <p>Para confirmar a sua presença na viagem clique no link abaixo:</p>
      <p></p>
      <p><a href="${confirmationLink}">Confirmar viagem</a></p>
      <p></p>
      <p>Caso você não saiba do que se trata esse e-mail, apenas o ignore.</p>
    </div>
    `.trim(),
      });

      console.log(nodemailer.getTestMessageUrl(message));
      return reply.status(201).send({ participantId: participant.id });
    }
  );
}
