import type { Email } from "../bondaries/email-provider";
import { dayjs } from "../lib/dayjs";
import { env } from "../env";

type Input = {
  destination: string;
  startsDate: Date;
  endsDate: Date;
  tripParticipantId: string;
  tripParticipantName: string | null;
  tripParticipantEmail: string;
};

export class ConfirmPresenceEmail {
  public static create(input: Input): Email {
    const formattedStartDate = dayjs(input.startsDate).format("LL");
    const formattedEndDate = dayjs(input.endsDate).format("LL");
    const confirmationLink = `${env.API_BASE_URL}/participants/${input.tripParticipantId}/confirm`;

    const email: Email = {
      from: {
        name: "Equpe Plann.er",
        address: "equipe@plann.er",
      },
      to: {
        name: input.tripParticipantName ?? "",
        address: input.tripParticipantEmail,
      },
      subject: `Confirme a sua presença na viagem para ${input.destination} em ${formattedStartDate}`,
      html: `
    <div style="font-family: sans-serif; font-size: 16px; line-height: 1.6;">
      <p>Você você foi convidado para uma viagem para <strong>${input.destination}</strong>, nas datas de <strong>${formattedStartDate}</strong> a <strong>${formattedEndDate}</strong><p>
      <p></p>
      <p>Para confirmar a sua presença na viagem clique no link abaixo:</p>
      <p></p>
      <p><a href="${confirmationLink}">Confirmar viagem</a></p>
      <p></p>
      <p>Caso você não saiba do que se trata esse e-mail, apenas o ignore.</p>
    </div>
    `.trim(),
    };
    return email;
  }
}
