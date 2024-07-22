import { z } from "zod";
import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../lib/prisma";
import { getMailClient } from "../lib/mail";
import { dayjs } from "../lib/dayjs";
import nodemailer from "nodemailer";

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
        throw new Error("Trip not found");
      }
      if (trip.isConfirmed) {
        return reply.redirect(`http://localhost:3000/trips/${id}`);
      }
      await prisma.trip.update({
        where: { id },
        data: { isConfirmed: true },
      });

      const formattedStartDate = dayjs(trip.startsAt).format("LL");
      const formattedEndDate = dayjs(trip.endsAt).format("LL");

      const mail = await getMailClient();

      const messages = await Promise.all(
        trip.particpants.map((participant) => {
          const confirmationLink = `http://localhost:3333/participants/${participant.id}/confirm`;
          return mail.sendMail({
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
        })
      );

      messages.forEach((message) => {
        console.log(nodemailer.getTestMessageUrl(message));
      });

      return reply.redirect(`http://localhost:3000/trips/${id}`);
    }
  );
}
