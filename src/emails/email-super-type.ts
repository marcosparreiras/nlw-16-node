import type { Email } from "../bondaries/email-provider";
import { dayjs } from "../lib/dayjs";

export abstract class EmailSuperType {
  protected static fomartDate(date: Date): string {
    return dayjs(date).format("LL");
  }

  protected static makeEmail(
    to: { name: string | null; email: string },
    subject: string,
    content: string
  ): Email {
    const email: Email = {
      from: {
        name: "Equpe Plann.er",
        address: "equipe@plann.er",
      },
      to: {
        name: to.name ?? "",
        address: to.email,
      },
      subject: subject,
      html: content,
    };
    return email;
  }
}
