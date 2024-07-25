import { randomUUID } from "node:crypto";
import { ClientError } from "../erros/client-error";
import { dayjs } from "../lib/dayjs";
import { Participant } from "./participant";
import type { Link } from "./link";
import type { Activity } from "./activity";

export class Trip {
  private id: string;
  private destination: string;
  private startsAt: Date;
  private endsAt: Date;
  private ownerName: string;
  private ownerEmail: string;
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
  public getParticipants(): Participant[] {
    return this.participants;
  }

  public getLinks(): Link[] {
    return this.links;
  }

  public getActivities(): Activity[] {
    return this.activities;
  }

  private constructor(
    id: string,
    destination: string,
    startsAt: Date,
    endsAt: Date,
    ownerName: string,
    ownerEmail: string,
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
      participants,
      links,
      activities
    );
  }
}
