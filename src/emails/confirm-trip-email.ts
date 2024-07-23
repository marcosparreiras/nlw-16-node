import type { Email } from "../bondaries/email-provider";
import { env } from "../env";
import { EmailSuperType } from "./email-super-type";

type Input = {
  destination: string;
  startsDate: Date;
  endsDate: Date;
  tripId: string;
  tripOwnerName: string;
  tripOwnerEmail: string;
};

export class ConfirmTripEmail extends EmailSuperType {
  public static create(input: Input): Email {
    const formattedStartDate = this.fomartDate(input.startsDate);
    const formattedEndDate = this.fomartDate(input.endsDate);
    const confirmationLink = `${env.API_BASE_URL}/trips/${input.tripId}/confirm`;
    const to = {
      name: input.tripOwnerName,
      email: input.tripOwnerEmail,
    };
    const subject = `Confirme a sua viagem para ${input.destination} em ${formattedStartDate}`;
    const content = `
      <div style="font-family: sans-serif; font-size: 16px; line-height: 1.6;">
        <p>Você solicitou a criação de uma viagem para <strong>${input.destination}</strong>, nas datas de <strong>${formattedStartDate}</strong> a <strong>${formattedEndDate}</strong><p>
        <p></p>
        <p>Para confirmar a sua viagem clique no link abaixo:</p>
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
