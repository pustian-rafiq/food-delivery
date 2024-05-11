import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

type mailOptions = {
  subject: string;
  email: string;
  name: string;
  activationCode: string;
  template: string;
};
@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}

  async sendMailToUser({
    subject,
    email,
    name,
    activationCode,
    template,
  }: mailOptions) {
    console.log('name email', name, email, activationCode);
    await this.mailerService.sendMail({
      to: email,
      subject,
      template,
      context: {
        name,
        activationCode,
      },
    });
  }
}
