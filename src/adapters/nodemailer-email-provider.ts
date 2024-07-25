import nodemailer from "nodemailer";
import type { Email, EmailProvider } from "../domain/bondaries/email-provider";
import { ClientError } from "../domain/erros/client-error";

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

    const messageInfo = await transporter.sendMail(email);
    if (nodemailer.getTestMessageUrl(messageInfo) === false) {
      throw new ClientError("Fail to send emails");
    }
    console.log(nodemailer.getTestMessageUrl(messageInfo));
  }
}
