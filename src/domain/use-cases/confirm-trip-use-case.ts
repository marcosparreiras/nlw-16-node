import type { EmailProvider } from "../bondaries/email-provider";
import type { TripRepository } from "../bondaries/trip-repository";
import { ClientError } from "../erros/client-error";
import { ConfirmPresenceEmail } from "../value-objects/confirm-presence-email";

type Input = {
  id: string;
};

export class ConfirmTripUseCase {
  public constructor(
    readonly tripRepository: TripRepository,
    readonly emailProvider: EmailProvider
  ) {}

  public async execute(input: Input): Promise<void> {
    const trip = await this.tripRepository.findById(input.id);
    if (trip === null) {
      throw new ClientError("Trip not found");
    }
    if (trip.getIsConfirmed()) {
      return;
    }

    trip.confirm();
    await this.tripRepository.update(trip);

    await Promise.all(
      trip.getParticipants().map((participant) => {
        const email = ConfirmPresenceEmail.create({
          destination: trip.getDestination(),
          endsDate: trip.getEndsAt(),
          startsDate: trip.getStartsAt(),
          tripParticipantEmail: participant.getEmail(),
          tripParticipantId: participant.getId(),
          tripParticipantName: participant.getName(),
        });
        return this.emailProvider.sendEmail(email);
      })
    );
    return;
  }
}
