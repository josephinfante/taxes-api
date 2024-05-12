import nodemailer, { Transporter } from 'nodemailer';
import { MAIL_PASSWORD, MAIL_USER } from '../../../config';

export function emailTransporter(): Transporter {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: MAIL_USER,
            pass: MAIL_PASSWORD,
        },
    });
}