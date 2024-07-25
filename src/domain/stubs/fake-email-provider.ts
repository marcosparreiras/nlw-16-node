import type { Email, EmailProvider } from "../bondaries/email-provider";

export class FakeEmailProvider implements EmailProvider {
  public sentEmails: Email[] = [];

  async sendEmail(email: Email): Promise<void> {
    this.sentEmails.push(email);
  }
}
