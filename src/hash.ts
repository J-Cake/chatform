import * as crypto from 'crypto';

export default function hash(seed: string, salt: number): string {
    const hashRound = function (hash: string): string {
        const hashStream: crypto.Hash = crypto.createHash('sha256');

        hashStream.update(hash);
        return hashStream.digest('hex');
    };

    const hashHistory: string[] = [];

    for (let i = 0; i <= salt; i++)
        hashHistory.push(hashRound(hashHistory[hashHistory.length - 1] || seed));

    return hashHistory[hashHistory.length - 1];
}
