import type { Trip } from "../entities/trip";

export interface TripRepository {
  save(trip: Trip): Promise<void>;
}
