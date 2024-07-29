import nodemailer from "nodemailer";
import type { EmailProvider } from "../domain/bondaries/email-provider";
import { ClientError } from "../domain/erros/client-error";
import type { Email } from "../domain/value-objects/email";

export class NodemailerEmailProvider implements EmailProvider {
  public async sendEmail(email: Email): Promise<void> {
    const account = await nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: account.user,
        pass: account.pass,
      },
    });

    const messageInfo = await transporter.sendMail({
      to: email.getTo(),
      from: email.getFrom(),
      subject: email.getSubject(),
      html: email.getHtml(),
    });
    if (nodemailer.getTestMessageUrl(messageInfo) === false) {
      throw new ClientError("Fail to send emails");
    }
    console.log(nodemailer.getTestMessageUrl(messageInfo));
  }
}
