import nodemailer from 'nodemailer';
import { config } from '../config';

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: config.email.smtp.host,
      port: config.email.smtp.port,
      secure: false,
      auth: {
        user: config.email.smtp.user,
        pass: config.email.smtp.pass,
      },
    });
  }

  async sendVerificationEmail(email: string, token: string): Promise<void> {
    const verificationLink = `${config.server.url}/api/auth/verify-email/${token}`;

    const mailOptions = {
      from: config.email.from,
      to: email,
      subject: 'Email Verification',
      html: `
        <h1>Verify Your Email</h1>
        <p>Please click the link below to verify your email address:</p>
        <a href="${verificationLink}">Verify Email</a>
        <p>If you didn't create an account, you can safely ignore this email.</p>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending verification email:', error);
      throw new Error('Failed to send verification email');
    }
  }
}

export const emailService = new EmailService(); 