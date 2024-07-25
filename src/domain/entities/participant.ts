import { randomUUID } from "node:crypto";

export class Participant {
  private id: string;
  private email: string;
  private name: string | null;
  private isConfirmed: boolean;
  private isOwner: boolean;

  public getId(): string {
    return this.id;
  }
  public getEmail(): string {
    return this.email;
  }
  public getName(): string | null {
    return this.name;
  }
  public getIsConfirmed(): boolean {
    return this.isConfirmed;
  }
  public getIsOwner(): boolean {
    return this.isOwner;
  }

  public confirm(): void {
    this.isConfirmed = true;
  }

  private constructor(
    id: string,
    email: string,
    name: string | null,
    isConfirmed: boolean,
    isOwner: boolean
  ) {
    this.id = id;
    this.email = email;
    this.name = name;
    this.isConfirmed = isConfirmed;
    this.isOwner = isOwner;
  }

  public static createByEmail(email: string) {
    const id = randomUUID();
    const name = null;
    const isConfirmed = false;
    const isOwner = false;
    return new Participant(id, email, name, isConfirmed, isOwner);
  }
}
