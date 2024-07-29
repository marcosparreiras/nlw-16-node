import { Trip } from "../entities/trip";
import { FakeEmailProvider } from "../stubs/fake-email-provider";
import { InMemoryTripRepository } from "../stubs/in-memory-trip-repository";
import { ConfirmPresenceEmail } from "../value-objects/confirm-presence-email";
import { ConfirmTripUseCase } from "./confirm-trip-use-case";

describe("ConfirmTripUseCase", () => {
  let tripRepository: InMemoryTripRepository;
  let emailProvider: FakeEmailProvider;
  let sut: ConfirmTripUseCase;

  beforeEach(() => {
    tripRepository = new InMemoryTripRepository();
    emailProvider = new FakeEmailProvider();
    sut = new ConfirmTripUseCase(tripRepository, emailProvider);
  });

  it("Should be able to confirm a trip", async () => {
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
      id: trip.getId(),
    };
    await sut.execute(input);

    expect(trip.getIsConfirmed()).toBe(true);
  });

  it("Should sent emails to participants confirm presence", async () => {
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
      id: trip.getId(),
    };
    await sut.execute(input);

    expect(emailProvider.sentEmails).toHaveLength(2);
    expect(emailProvider.sentEmails[1]).toBeInstanceOf(ConfirmPresenceEmail);
    expect(emailProvider.sentEmails[0]).toBeInstanceOf(ConfirmPresenceEmail);
  });
});
