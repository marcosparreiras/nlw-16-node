import { dayjs } from "../../lib/dayjs";

type EmailData = {
  to: {
    name: string;
    address: string;
  };
  from: {
    name: string;
    address: string;
  };
  subject: string;
  html: string;
};

export abstract class Email {
  private data: EmailData;

  public getHtml(): string {
    return this.data.html;
  }
  public getSubject(): string {
    return this.data.subject;
  }
  public getTo(): {
    name: string;
    address: string;
  } {
    return this.data.to;
  }
  public getFrom(): {
    name: string;
    address: string;
  } {
    return this.data.from;
  }

  protected constructor(input: Omit<EmailData, "from">) {
    this.data = {
      from: {
        name: "Equpe Plann.er",
        address: "equipe@plann.er",
      },
      ...input,
    };
  }

  protected static fomartDate(date: Date): string {
    return dayjs(date).format("LL");
  }
}
