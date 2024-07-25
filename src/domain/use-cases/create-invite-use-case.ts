import { ConfirmPresenceEmail } from "../../emails/confirm-presence-email";
import type { Email, EmailProvider } from "../bondaries/email-provider";
import type { TripRepository } from "../bondaries/trip-repository";
import { ClientError } from "../erros/client-error";

type Input = {
  tripId: string;
  email: string;
};

type Output = {
  participantId: string;
};

export class CreateInviteUseCase {
  public constructor(
    readonly tripRepository: TripRepository,
    readonly emailProvider: EmailProvider
  ) {}

  public async execute(input: Input): Promise<Output> {
    const trip = await this.tripRepository.findById(input.tripId);
    if (trip === null) {
      throw new ClientError("Trip not found");
    }
    const participant = trip.inviteParticipant(input.email);
    await this.tripRepository.update(trip);

    const email: Email = ConfirmPresenceEmail.create({
      destination: trip.getDestination(),
      endsDate: trip.getEndsAt(),
      startsDate: trip.getStartsAt(),
      tripParticipantEmail: participant.getEmail(),
      tripParticipantId: participant.getId(),
      tripParticipantName: participant.getName(),
    });

    await this.emailProvider.sendEmail(email);

    return {
      participantId: participant.getId(),
    };
  }
}
