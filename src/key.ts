const chars = `abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_$`;

export default class Key {

    private characters: string[] = [];

    constructor(length: number = 16) {
        for (let i = 0; i < length; i++)
            this.characters.push(chars[Math.floor(Math.random() * chars.length)]);
    }

    toString(): string {
        return this.characters.join('');
    }
}
