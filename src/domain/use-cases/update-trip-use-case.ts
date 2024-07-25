import type { TripRepository } from "../bondaries/trip-repository";
import { ClientError } from "../erros/client-error";

type Input = {
  tripId: string;
  destination: string;
  startsAt: Date;
  endsAt: Date;
};

export class UpdateTripUseCase {
  public constructor(readonly tripRepository: TripRepository) {}

  public async execute(input: Input): Promise<void> {
    const trip = await this.tripRepository.findById(input.tripId);
    if (trip === null) {
      throw new ClientError("Trip not found");
    }
    trip.setDestination(input.destination);
    trip.reschedule(input.startsAt, input.endsAt);

    await this.tripRepository.update(trip);
    return;
  }
}
