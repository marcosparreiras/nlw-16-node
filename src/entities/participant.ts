export class Participant {
  private email: string;

  public getEmail(): string {
    return this.email;
  }

  private constructor(email: string) {
    this.email = email;
  }

  public static createByEmail(email: string) {
    return new Participant(email);
  }
}
