const crypto = require('crypto');
const bcrypt = require('bcrypt');
const Hashids = require('hashids/cjs');

// TODO: use most common english letters for fun in case they generate actual words
const hashids = new Hashids('this is my salt', 8, 'abcdefghijklmnopqrstuvwxyz');

export class SecurityUtils {

    static async newAccessToken(maxLength: number = 64): Promise<string> {
        const sizeInBytes = Math.floor(maxLength / 2);
        const data = await crypto.randomBytes(sizeInBytes);

        // return crypto.createHash('sha256').update(based).digest('base64');

        return data.toString('hex');
    }

    static encodeId(id: number): string {
        return hashids.encode(id);
    }

    static decodeId(id: string): number {
        return hashids.decode(id);
    }

    // for storing in databases?
    static hash(data: string) {
        return crypto.createHash('sha256').update(data).digest('base64');
    }

    static async passwordHash(password: string): Promise<string> {
        return bcrypt.hashSync(password, 10);
    }

    static async passwordVerify(password: string, hash: string): Promise<boolean> {
        return bcrypt.compareSync(password, hash);
    }
}