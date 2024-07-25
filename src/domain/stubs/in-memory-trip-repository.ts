import type { TripRepository } from "../bondaries/trip-repository";
import type { Trip } from "../entities/trip";

export class InMemoryTripRepository implements TripRepository {
  public items: Trip[] = [];

  async findById(id: string): Promise<Trip | null> {
    const trip = this.items.find((item) => item.getId() === id);
    return trip ?? null;
  }

  async create(trip: Trip): Promise<void> {
    this.items.push(trip);
  }

  async update(trip: Trip): Promise<void> {
    const index = this.items.findIndex((item) => item.getId() === trip.getId());
    if (index === -1) {
      return;
    }
    this.items[index] = trip;
  }
}
