import { Trip } from "../entities/trip";
import { ClientError } from "../erros/client-error";
import { InMemoryTripRepository } from "../stubs/in-memory-trip-repository";
import { UpdateTripUseCase } from "./update-trip-use-case";

describe("UpdateTripUseCase", () => {
  let tripRepository: InMemoryTripRepository;
  let sut: UpdateTripUseCase;

  beforeEach(() => {
    tripRepository = new InMemoryTripRepository();
    sut = new UpdateTripUseCase(tripRepository);
  });

  it("Should be able to update a trip details", async () => {
    const trip = Trip.createWithPaticipantsEmails({
      destination: "Belo Horiozonte",
      startsAt: new Date("2030-01-01"),
      endsAt: new Date("2030-01-02"),
      ownerEmail: "johnDoe@example.com",
      ownerName: "John Doe",
      participantsEmails: ["janydoe@example.com", "piterdoe@example.com"],
    });
    tripRepository.items.push(trip);

    const input = {
      tripId: trip.getId(),
      destination: "Sao Paulo",
      startsAt: new Date("2030-01-01"),
      endsAt: new Date("2030-01-02"),
    };
    await sut.execute(input);

    expect(trip.getDestination()).toEqual(input.destination);
  });

  it("Should not be able to reschedle with to an invalid date", async () => {
    const trip = Trip.createWithPaticipantsEmails({
      destination: "Belo Horiozonte",
      startsAt: new Date("2030-01-01"),
      endsAt: new Date("2030-01-02"),
      ownerEmail: "johnDoe@example.com",
      ownerName: "John Doe",
      participantsEmails: ["janydoe@example.com", "piterdoe@example.com"],
    });
    tripRepository.items.push(trip);

    const input = {
      tripId: trip.getId(),
      destination: "Sao Paulo",
      startsAt: new Date("2030-01-03"),
      endsAt: new Date("2030-01-02"),
    };

    await expect(() => sut.execute(input)).rejects.toBeInstanceOf(ClientError);
  });
});
