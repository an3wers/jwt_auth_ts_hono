import nodemailer from "nodemailer";
import { smptConnection } from "../../config.js";
import { isDev } from "../../utils/is-dev.js";

export class MailService {
  transport: ReturnType<typeof nodemailer.createTransport>;

  constructor() {
    this.transport = nodemailer.createTransport({
      host: smptConnection.host,
      port: isDev() ? 587 : 465,
      secure: isDev() ? false : true,
      auth: {
        user: smptConnection.user,
        pass: smptConnection.password,
      },
    });
  }

  async sendActivationMail(to: string, link: string) {}

  async testMail() {
    return await this.transport.sendMail({
      to: "an3wer@gmail.com",
      subject: "test mail subject",
      text: "This is a test mail",
    });
  }
}
