export interface Email {
  from: {
    name: string;
    address: string;
  };
  to: {
    name: string;
    address: string;
  };
  subject: string;
  html: string;
}

export interface EmailProvider {
  sendEmail(email: Email): Promise<void>;
}
