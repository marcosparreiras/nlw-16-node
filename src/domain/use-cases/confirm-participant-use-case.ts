import type { TripRepository } from "../bondaries/trip-repository";
import { ClientError } from "../erros/client-error";

type Input = {
  participantId: string;
};

export class ConfirmParticipantUseCase {
  public constructor(readonly tripRepository: TripRepository) {}

  public async execute(input: Input): Promise<void> {
    const participant = await this.tripRepository.findParticipantById(
      input.participantId
    );
    if (participant === null) {
      throw new ClientError("Participant not found");
    }
    participant.confirm();
    await this.tripRepository.updateParticipant(participant);
    return;
  }
}
