import type { TripRepository } from "../bondaries/trip-repository";
import type { Trip } from "../entities/trip";

export class InMemoryTripRepository implements TripRepository {
  public items: Trip[] = [];

  async save(trip: Trip): Promise<void> {
    this.items.push(trip);
  }
}
