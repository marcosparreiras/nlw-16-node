import type { EmailProvider } from "../bondaries/email-provider";
import type { Email } from "../value-objects/email";

export class FakeEmailProvider implements EmailProvider {
  public sentEmails: Email[] = [];

  async sendEmail(email: Email): Promise<void> {
    this.sentEmails.push(email);
  }
}
