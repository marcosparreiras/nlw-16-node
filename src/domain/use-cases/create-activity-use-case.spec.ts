import { Trip } from "../entities/trip";
import { InMemoryTripRepository } from "../stubs/in-memory-trip-repository";
import { CreateActivityUseCase } from "./create-activity-use-case";

describe("CreateActivityUseCase", () => {
  it("Should be able to create a trip activity", async () => {
    const tripRepository: InMemoryTripRepository = new InMemoryTripRepository();
    const sut: CreateActivityUseCase = new CreateActivityUseCase(
      tripRepository
    );

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
      title: "My-fake-activity",
      occursAt: new Date("2030-01-01"),
    };
    const output = await sut.execute(input);

    expect(output.activityId).toBeTruthy();
    expect(trip.getActivities()).toHaveLength(1);
    expect(trip.getActivities()[0].getId()).toEqual(output.activityId);
  });
});
