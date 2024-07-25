import type { Participant } from "../entities/participant";
import type { Trip } from "../entities/trip";

export interface TripRepository {
  findById(id: string): Promise<Trip | null>;
  findParticipantById(id: string): Promise<Participant | null>;
  create(trip: Trip): Promise<void>;
  update(trip: Trip): Promise<void>;
  updateParticipant(participant: Participant): Promise<void>;
}
