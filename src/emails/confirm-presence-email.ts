import type { Email } from "../bondaries/email-provider";
import { dayjs } from "../lib/dayjs";
import { env } from "../env";
import { EmailSuperType } from "./email-super-type";

type Input = {
  destination: string;
  startsDate: Date;
  endsDate: Date;
  tripParticipantId: string;
  tripParticipantName: string | null;
  tripParticipantEmail: string;
};

export class ConfirmPresenceEmail extends EmailSuperType {
  public static create(input: Input): Email {
    const formattedStartDate = this.fomartDate(input.startsDate);
    const formattedEndDate = this.fomartDate(input.endsDate);
    const confirmationLink = `${env.API_BASE_URL}/participants/${input.tripParticipantId}/confirm`;

    const to = {
      name: input.tripParticipantName,
      email: input.tripParticipantEmail,
    };

    const subject = `Confirme a sua presença na viagem para ${input.destination} em ${formattedStartDate}`;
    const content = `
    <div style="font-family: sans-serif; font-size: 16px; line-height: 1.6;">
      <p>Você você foi convidado para uma viagem para <strong>${input.destination}</strong>, nas datas de <strong>${formattedStartDate}</strong> a <strong>${formattedEndDate}</strong><p>
      <p></p>
      <p>Para confirmar a sua presença na viagem clique no link abaixo:</p>
      <p></p>
      <p><a href="${confirmationLink}">Confirmar viagem</a></p>
      <p></p>
      <p>Caso você não saiba do que se trata esse e-mail, apenas o ignore.</p>
    </div>
    `.trim();

    const email: Email = this.makeEmail(to, subject, content);

    return email;
  }
}
