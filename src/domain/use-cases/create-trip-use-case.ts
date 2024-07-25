import type { EmailProvider } from "../bondaries/email-provider";
import type { TripRepository } from "../bondaries/trip-repository";
import { ConfirmTripEmail } from "../../emails/confirm-trip-email";
import { Trip } from "../entities/trip";

type Input = {
  destination: string;
  startsAt: Date;
  endsAt: Date;
  ownerName: string;
  ownerEmail: string;
  emailsToInvite: string[];
};

type Output = {
  tripId: string;
};

export class CreateTripUseCase {
  public constructor(
    readonly tripRepository: TripRepository,
    readonly emailProvider: EmailProvider
  ) {}

  public async execute(input: Input): Promise<Output> {
    const trip = Trip.createWithPaticipantsEmails({
      destination: input.destination,
      startsAt: input.startsAt,
      endsAt: input.endsAt,
      ownerName: input.ownerName,
      ownerEmail: input.ownerEmail,
      participantsEmails: input.emailsToInvite,
    });

    await this.tripRepository.create(trip);

    const email = ConfirmTripEmail.create({
      destination: input.destination,
      endsDate: input.endsAt,
      startsDate: input.startsAt,
      tripId: trip.getId(),
      tripOwnerEmail: input.ownerEmail,
      tripOwnerName: input.ownerName,
    });

    await this.emailProvider.sendEmail(email);

    return { tripId: trip.getId() };
  }
}
