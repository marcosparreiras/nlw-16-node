import { FakeEmailProvider } from "../stubs/fake-email-provider";
import { InMemoryTripRepository } from "../stubs/in-memory-trip-repository";
import { ConfirmTripEmail } from "../value-objects/confirm-trip-email";
import { CreateTripUseCase } from "./create-trip-use-case";

describe("CreateTripUseCase", () => {
  let tripRepository: InMemoryTripRepository;
  let emailProvider: FakeEmailProvider;
  let sut: CreateTripUseCase;

  beforeEach(() => {
    tripRepository = new InMemoryTripRepository();
    emailProvider = new FakeEmailProvider();
    sut = new CreateTripUseCase(tripRepository, emailProvider);
  });

  it("Should be able to create a trip", async () => {
    const input = {
      destination: "Belo Horizonte",
      startsAt: new Date("2040-01-01"),
      endsAt: new Date("2040-02-01"),
      ownerName: "John Doe",
      ownerEmail: "johndoe@example.com",
      emailsToInvite: ["janydoe@example.com", "piterdoe@example.com"],
    };
    const { tripId } = await sut.execute(input);

    expect(tripId).toBeTruthy();

    expect(tripRepository.items).toHaveLength(1);
    expect(tripRepository.items[0].getDestination()).toEqual(input.destination);
    expect(tripRepository.items[0].getParticipants()).toHaveLength(2);
  });

  it("Should send a email a confirmation trip email on trip creation", async () => {
    const input = {
      destination: "Belo Horizonte",
      startsAt: new Date("2040-01-01"),
      endsAt: new Date("2040-02-01"),
      ownerName: "John Doe",
      ownerEmail: "johndoe@example.com",
      emailsToInvite: ["janydoe@example.com", "piterdoe@example.com"],
    };
    await sut.execute(input);

    expect(emailProvider.sentEmails).toHaveLength(1);
    expect(emailProvider.sentEmails[0]).toBeInstanceOf(ConfirmTripEmail);
  });
});
