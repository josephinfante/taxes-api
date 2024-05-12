import crypto from 'crypto';
import { JWT_SECRET } from '../../config';

const IV_LENGTH = 16; // For AES, this is always 16

export class Crypto {
    static encrypt(text: string): string {
        const iv = crypto.randomBytes(IV_LENGTH);
        const key = crypto.createHash('sha256').update(JWT_SECRET).digest(); // Ensure the key is 32 bytes
        const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
        let encrypted = cipher.update(text);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return `${iv.toString('hex')}-${encrypted.toString('hex')}`;
    }
    static decrypt(text: string): string {
        const [iv, data] = text.split('-').map((part) => Buffer.from(part, 'hex'));
        const key = crypto.createHash('sha256').update(JWT_SECRET).digest(); // Ensure the key is 32 bytes
        const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
        let decrypted = decipher.update(data);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    }
}