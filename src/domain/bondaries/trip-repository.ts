import type { Trip } from "../entities/trip";

export interface TripRepository {
  findById(id: string): Promise<Trip | null>;
  create(trip: Trip): Promise<void>;
  update(trip: Trip): Promise<void>;
}
