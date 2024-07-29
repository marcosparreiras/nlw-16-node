import type { Email } from "../value-objects/email";

export interface EmailProvider {
  sendEmail(email: Email): Promise<void>;
}
