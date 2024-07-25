import { Trip } from "../entities/trip";
import { InMemoryTripRepository } from "../stubs/in-memory-trip-repository";
import { ConfirmParticipantUseCase } from "./confirm-participant-use-case";

describe("ConfirmParticipantUseCase", () => {
  let tripRepository: InMemoryTripRepository;
  let sut: ConfirmParticipantUseCase;

  beforeEach(() => {
    tripRepository = new InMemoryTripRepository();
    sut = new ConfirmParticipantUseCase(tripRepository);
  });

  it("Should be able to confirm a trip participant", async () => {
    const trip = Trip.createWithPaticipantsEmails({
      destination: "Belo Horizonte",
      startsAt: new Date("2030-01-01"),
      endsAt: new Date("2030-01-02"),
      ownerEmail: "johndoe@example.com",
      ownerName: "John Doe",
      participantsEmails: ["janydoe@example.com"],
    });

    tripRepository.items.push(trip);

    const input = {
      tripId: trip.getId(),
      participantId: trip.getParticipants()[0].getId(),
    };

    await sut.execute(input);
    expect(trip.getParticipants()[0].getIsConfirmed()).toBe(true);
  });
});
