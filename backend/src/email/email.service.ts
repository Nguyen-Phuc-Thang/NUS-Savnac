import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
    private resend = new Resend(
        process.env.RESEND_API_KEY,
    );

    async sendVerificationCode(
        email: string,
        code: string,
    ) {
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
}