import * as fs from 'fs';
import * as path from 'path';

export function logger(e: Error) {
    const date = new Date();

    console.error(e);

    fs.appendFileSync(path.join(process.cwd(), `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}.err`), e.stack);
}