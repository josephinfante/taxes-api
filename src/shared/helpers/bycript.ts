import bycript from 'bcrypt';

export class Bycript {
    private static readonly SALT_ROUNDS = 10;

    static async encrypt(password: string): Promise<string> {
        return await bycript.hash(password, Bycript.SALT_ROUNDS);
    }

    static async compare(password: string, encryptedPassword: string): Promise<boolean> {
        return await bycript.compare(password, encryptedPassword);
    }
}