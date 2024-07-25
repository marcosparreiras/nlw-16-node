import { randomUUID } from "node:crypto";

export class Activity {
  private id: string;
  private title: string;
  private occurs_at: Date;

  public getId(): string {
    return this.id;
  }
  public getTitle(): string {
    return this.title;
  }
  public getOccurs_at(): Date {
    return this.occurs_at;
  }

  private constructor(id: string, title: string, occurs_at: Date) {
    this.id = id;
    this.title = title;
    this.occurs_at = occurs_at;
  }

  public static create(input: { title: string; occurs_at: Date }) {
    const id = randomUUID();
    return new Activity(id, input.title, input.occurs_at);
  }
}
