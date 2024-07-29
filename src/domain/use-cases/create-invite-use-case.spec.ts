import { Trip } from "../entities/trip";
import { FakeEmailProvider } from "../stubs/fake-email-provider";
import { InMemoryTripRepository } from "../stubs/in-memory-trip-repository";
import { ConfirmPresenceEmail } from "../value-objects/confirm-presence-email";
import { CreateInviteUseCase } from "./create-invite-use-case";

describe("CreateInviteUseCase", () => {
  let tripRepository: InMemoryTripRepository;
  let emailProvider: FakeEmailProvider;
  let sut: CreateInviteUseCase;

  beforeEach(() => {
    tripRepository = new InMemoryTripRepository();
    emailProvider = new FakeEmailProvider();
    sut = new CreateInviteUseCase(tripRepository, emailProvider);
  });

  it("Should be able to create an invite for a new trip participant", async () => {
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
      email: "josedoe@example.com",
    };
    const output = await sut.execute(input);

    expect(output.participantId).toBeTruthy();
    const newParticipant = trip
      .getParticipants()
      .find((p) => p.getId() === output.participantId);
    expect(newParticipant?.getEmail()).toEqual(input.email);
  });

  it("Should send an email to a participant invited", async () => {
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
      email: "josedoe@example.com",
    };
    await sut.execute(input);

    expect(emailProvider.sentEmails).toHaveLength(1);
    expect(emailProvider.sentEmails[0]).toBeInstanceOf(ConfirmPresenceEmail);
  });
});
