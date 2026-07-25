import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private resend = new Resend(process.env.RESEND_API_KEY);

  async sendVerificationCode(email: string, code: string) {
    console.log(`Sending verification code ${code} to ${email}`);
    const result = await this.resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Verify your account',
      html: `
        <h2>Email Verification</h2>
        <p>Your verification code:</p>
        <h1>${code}</h1>
        <p>Expires in 10 minutes.</p>
      `,
    });
    console.log(result);
  }

  async sendReminder(email: string, event: any) {
    console.log(`Sending reminder for event ${event.title} to ${email}`);
    const result = await this.resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Reminder: Upcoming Event',
      html: `
        <h2>Reminder</h2>
        <p>You have an upcoming event in 24 hours:</p>
        <h3>${event.title}</h3>
        <p><strong>Date:</strong> ${event.week}, ${event.day}</p>
        <p><strong>Time:</strong> ${event.startTime} - ${event.endTime}</p>
      `,
    });
    console.log(result);
  }
}
