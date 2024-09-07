export interface TelegramUser {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    photo_url?: string;
    auth_date: number;
    hash: string;
}

export class TelegramLoginParsing {
    private botToken: string;

    constructor(botToken: string) {
        this.botToken = botToken;
    }

    public async verifyTelegramData(user: TelegramUser): Promise<boolean> {
        const dataCheckString = Object.keys(user)
            .filter((key) => key !== 'hash')
            .sort()
            .map((key) => `${key}=${user[key as keyof TelegramUser]}`)
            .join('\n');

        const secretKey = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(this.botToken));
        const key = await crypto.subtle.importKey("raw", secretKey, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);

        const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(dataCheckString));
        const generatedHash = Array.from(new Uint8Array(signature))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');

        return generatedHash === user.hash;
    }

    public parseUserData(user: TelegramUser): string {
        return `
            ID: ${user.id}
            Name: ${user.first_name} ${user.last_name || ""}
            Username: ${user.username || "N/A"}
            Photo URL: ${user.photo_url || "N/A"}
            Auth Date: ${new Date(user.auth_date * 1000).toLocaleString()}
        `;
    }
}
