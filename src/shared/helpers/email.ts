
import { MAIL_USER } from "../../config";
import { emailTransporter } from "../connections/nodemailer/nodemailer";
import { CustomError } from "../errors/custom.error";
interface MailOptions {
    to: string;
    cc?: string;
    bcc?: string;
    subject: string;
    html: string;
}

export class Email {
    static async send(mailOptions: MailOptions): Promise<{ message: string }> {
        const { to, subject, html } = mailOptions;
        try {
            if (!to || !subject || !html) throw CustomError.badRequest('To, subject and html are required.');
            await emailTransporter().sendMail({
                from: MAIL_USER,
                to,
                cc: mailOptions.cc,
                bcc: mailOptions.bcc,
                subject,
                html,
            });
            return ({ message: 'ok'});
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw CustomError.internal();
        }
    }
}