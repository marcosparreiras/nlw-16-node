import type { TripRepository } from "../bondaries/trip-repository";
import type { Participant } from "../entities/participant";
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

  async findParticipantById(id: string): Promise<Participant | null> {
    let participantIndex: number = 0;
    const trip = this.items.find((item) => {
      participantIndex = item.getParticipants().findIndex((participant) => {
        return participant.getId() === id;
      });
      return participantIndex !== -1;
    });

    return trip ? trip.getParticipants()[participantIndex] : null;
  }

  async updateParticipant(participant: Participant): Promise<void> {
    let participantIndex: number = 0;
    const trip = this.items.find((item) => {
      participantIndex = item.getParticipants().findIndex((participant) => {
        return participant.getId() === participant.getId();
      });
      return participantIndex !== -1;
    });
    if (!trip) {
      return;
    }
    trip.getParticipants()[participantIndex] = participant;
  }
}
