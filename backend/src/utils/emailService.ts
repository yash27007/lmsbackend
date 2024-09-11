import nodemailer from 'nodemailer';
import env from "dotenv";
env.config();
interface MailOptions {
  from: string;
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export const sendVerificationEmail = async ({ from, to, subject, html }: MailOptions): Promise<void> => {
  try {
    const email:string = process.env.EMAIL!;
    const password:string = process.env.GMAIL_APP_PASSWORD!;
    // console.log(email,password);

    if (!email || !password) {
      throw new Error('Email credentials are not set in environment variables');
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // Use TLS
      auth: {
        user: email,
        pass: password,
      },
    });

    const mailOptions = {
      from,
      to,
      subject,
      html,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Verification email sent to ${to}`);
  } catch (error: any) {
    console.error(`Error sending verification email: ${error}`);
    throw new Error(`Failed to send verification email: ${error.message}`);
  }
};