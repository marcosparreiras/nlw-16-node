import { Trip } from "../entities/trip";
import { InMemoryTripRepository } from "../stubs/in-memory-trip-repository";
import { CreateLinkUseCase } from "./create-link-use-case";

describe("CreateLinkUseCase", () => {
  let tripRepository: InMemoryTripRepository;
  let sut: CreateLinkUseCase;

  beforeEach(() => {
    tripRepository = new InMemoryTripRepository();
    sut = new CreateLinkUseCase(tripRepository);
  });

  it("Should be able to create a trip link", async () => {
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
      title: "fake-link",
      url: "http://fake-url.com",
    };
    const output = await sut.execute(input);

    expect(output.linkId).toBeTruthy();
    expect(trip.getLinks()).toHaveLength(1);
    expect(trip.getLinks()[0].getId()).toEqual(output.linkId);
  });
});
