import * as crypto from 'crypto';

export default function hash(seed: string, salt: number): string {
    const hashRound = function (hash: string): string {
        const hashStream: crypto.Hash = crypto.createHash('sha256');

        hashStream.update(hash);
        return hashStream.digest('hex');
    };

    const hashHistory: string[] = [];

    const saltRounds: number = Math.max(1, Math.min(salt, 99));

    for (let i = 0; i <= saltRounds; i++)
        hashHistory.push(hashRound(hashHistory[hashHistory.length - 1] || seed));

    return String(saltRounds).padStart(3, '0') + hashHistory[hashHistory.length - 1];
}
