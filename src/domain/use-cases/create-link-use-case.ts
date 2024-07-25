import type { TripRepository } from "../bondaries/trip-repository";
import { ClientError } from "../erros/client-error";

type Input = {
  tripId: string;
  title: string;
  url: string;
};

type Output = {
  linkId: string;
};

export class CreateLinkUseCase {
  public constructor(readonly tripRepository: TripRepository) {}

  public async execute(input: Input): Promise<Output> {
    const trip = await this.tripRepository.findById(input.tripId);
    if (trip === null) {
      throw new ClientError("Trip not found");
    }
    const link = trip.addLink(input.title, input.url);
    await this.tripRepository.update(trip);
    return {
      linkId: link.getId(),
    };
  }
}
