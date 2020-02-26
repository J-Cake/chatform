const chars = `abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_$`;

export default class Key {
    private static keyList: string[] = [];

    private characters: string[] = [];
    private readonly seed?: string;
    private readonly length: number;

    constructor(length: number = 16, seed?: string) {
        this.seed = seed;
        this.length = length;

        function key(): string[] {
            const outputChars: string[] = [];

            if (seed && seed.length === length)
                for (let i = 0; i < length; i++)
                    outputChars.push(seed[(chars.indexOf(seed[Math.floor(Math.random() * chars.length)]) + 1) % chars.length]);
            else
                for (let i = 0; i < length; i++)
                    outputChars.push(chars[Math.floor(Math.random() * chars.length)]);

            return outputChars;
        }

        do {
            this.characters = key();
        } while (Key.keyList.includes(this.toString()));

        Key.keyList.push(this.toString());
    }

    static fromKey(key: string): Key {
        const output = new Key(key.length);

        const chars: string[] = [];
        for (const i of key)
            chars.push(i);

        output.characters = chars;

        return output;
    }

    next(): Key {
        if (this.seed) {
            const seedChars: string[] = [];

            for (const i of this.seed)
                seedChars.push(i);

            return new Key(this.length, seedChars.map((i, a) => chars[(chars.indexOf(i) + (this.length % a) + 1) % chars.length]).join(''));
        } else
            return new Key(this.length, this.characters.map(i => (chars.indexOf(i) + 1) % chars.length).join(''));
    }

    toString(): string {
        return this.characters.join('');
    }
}
