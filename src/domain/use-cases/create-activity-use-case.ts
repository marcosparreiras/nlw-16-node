import type { TripRepository } from "../bondaries/trip-repository";
import { ClientError } from "../erros/client-error";

type Input = {
  tripId: string;
  title: string;
  occursAt: Date;
};

type Output = {
  activityId: string;
};

export class CreateActivityUseCase {
  public constructor(readonly tripRepository: TripRepository) {}

  public async execute(input: Input): Promise<Output> {
    const trip = await this.tripRepository.findById(input.tripId);
    if (trip === null) {
      throw new ClientError("Trip not found");
    }

    const activity = trip.createActivity(input.title, input.occursAt);
    await this.tripRepository.update(trip);
    return { activityId: activity.getId() };
  }
}
