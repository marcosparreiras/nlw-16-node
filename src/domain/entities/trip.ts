import { randomUUID } from "node:crypto";
import { ClientError } from "../erros/client-error";
import { dayjs } from "../../lib/dayjs";
import { Participant } from "./participant";
import { Link } from "./link";
import { Activity } from "./activity";

export class Trip {
  private id: string;
  private destination: string;
  private startsAt: Date;
  private endsAt: Date;
  private ownerName: string;
  private ownerEmail: string;
  private isConfirmed: boolean;
  private participants: Participant[];
  private links: Link[];
  private activities: Activity[];

  public getId(): string {
    return this.id;
  }
  public getDestination(): string {
    return this.destination;
  }
  public getStartsAt(): Date {
    return this.startsAt;
  }
  public getEndsAt(): Date {
    return this.endsAt;
  }
  public getOwnerName(): string {
    return this.ownerName;
  }
  public getOwnerEmail(): string {
    return this.ownerEmail;
  }
  public getIsConfirmed(): boolean {
    return this.isConfirmed;
  }
  public getParticipants(): Participant[] {
    return this.participants;
  }
  public getLinks(): Link[] {
    return this.links;
  }
  public getActivities(): Activity[] {
    return this.activities;
  }

  public confirm(): void {
    this.isConfirmed = true;
  }

  public confirmParticipant(participantId: string): void {
    const participant = this.participants.find(
      (p) => p.getId() === participantId
    );
    if (!participant) {
      throw new ClientError("Paticipant not found");
    }
    participant.confirm();
  }

  public inviteParticipant(email: string): Participant {
    const participant = Participant.createByEmail(email);
    this.participants.push(participant);
    return participant;
  }

  public createActivity(title: string, occursAt: Date): Activity {
    const activity = Activity.create({ title, occurs_at: occursAt });
    this.activities.push(activity);
    return activity;
  }

  public addLink(title: string, url: string): Link {
    const link = Link.create({ title, url });
    this.links.push(link);
    return link;
  }

  private constructor(
    id: string,
    destination: string,
    startsAt: Date,
    endsAt: Date,
    ownerName: string,
    ownerEmail: string,
    isConfirmed: boolean,
    participants: Participant[],
    links: Link[],
    activities: Activity[]
  ) {
    if (dayjs(startsAt).isBefore(new Date())) {
      throw new ClientError("Invalid trip start date");
    }

    if (dayjs(endsAt).isBefore(startsAt)) {
      throw new ClientError("Invalid trip end date");
    }
    this.id = id;
    this.destination = destination;
    this.startsAt = startsAt;
    this.endsAt = endsAt;
    this.ownerName = ownerName;
    this.ownerEmail = ownerEmail;
    this.isConfirmed = isConfirmed;
    this.participants = participants;
    this.links = links;
    this.activities = activities;
  }

  public static createWithPaticipantsEmails(input: {
    destination: string;
    startsAt: Date;
    endsAt: Date;
    ownerName: string;
    ownerEmail: string;
    participantsEmails: string[];
  }): Trip {
    const id = randomUUID();
    const isConfirmed = false;
    const participants: Participant[] = input.participantsEmails.map((email) =>
      Participant.createByEmail(email)
    );
    const links: Link[] = [];
    const activities: Activity[] = [];
    return new Trip(
      id,
      input.destination,
      input.startsAt,
      input.endsAt,
      input.ownerName,
      input.ownerEmail,
      isConfirmed,
      participants,
      links,
      activities
    );
  }
}
