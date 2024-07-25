import { randomUUID } from "node:crypto";

export class Link {
  private id: string;
  private title: string;
  private url: string;

  public getId(): string {
    return this.id;
  }
  public getTitle(): string {
    return this.title;
  }
  public getUrl(): string {
    return this.url;
  }

  private constructor(id: string, title: string, url: string) {
    this.id = id;
    this.title = title;
    this.url = url;
  }

  public static create(input: { title: string; url: string }) {
    const id = randomUUID();
    return new Link(id, input.title, input.url);
  }
}
