import type { Email } from "../bondaries/email-provider";
import { dayjs } from "../lib/dayjs";
import { env } from "../env";

type Input = {
  destination: string;
  startsDate: Date;
  endsDate: Date;
  tripId: string;
  tripOwnerName: string;
  tripOwnerEmail: string;
};

export class ConfirmTripEmail {
  public static create(input: Input): Email {
    const formattedStartDate = dayjs(input.startsDate).format("LL");
    const formattedEndDate = dayjs(input.endsDate).format("LL");
    const confirmationLink = `${env.API_BASE_URL}/trips/${input.tripId}/confirm`;

    const email = {
      from: {
        name: "Equpe Plann.er",
        address: "equipe@plann.er",
      },
      to: {
        name: input.tripOwnerName,
        address: input.tripOwnerEmail,
      },
      subject: `Confirme a sua viagem para ${input.destination} em ${formattedStartDate}`,
      html: `
      <div style="font-family: sans-serif; font-size: 16px; line-height: 1.6;">
        <p>Você solicitou a criação de uma viagem para <strong>${input.destination}</strong>, nas datas de <strong>${formattedStartDate}</strong> a <strong>${formattedEndDate}</strong><p>
        <p></p>
        <p>Para confirmar a sua viagem clique no link abaixo:</p>
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
