import type { TripRepository } from "../bondaries/trip-repository";
import { ClientError } from "../erros/client-error";

type Input = {
  tripId: string;
  participantId: string;
};

export class ConfirmParticipantUseCase {
  public constructor(readonly tripRepository: TripRepository) {}

  public async execute(input: Input): Promise<void> {
    const trip = await this.tripRepository.findById(input.tripId);
    if (trip === null) {
      throw new ClientError("Trip not found");
    }
    trip.confirmParticipant(input.participantId);
    await this.tripRepository.update(trip);
    return;
  }
}
