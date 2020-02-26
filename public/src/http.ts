export enum Result {
    text,
    json,
}

export enum Method {
    get,
    post,
    put,
    delete,
    patch,
    head,
}

export default async function http<ReturnType = string>(url: string, resultParser: Result = Result.json, method: Method = Method.get, body?: any): Promise<ReturnType | string | ArrayBuffer> {
    let request: Response;

    if (method !== Method.get && method !== Method.head)
        request = await fetch(url, {
            method: Method[method].toUpperCase(),
            body: typeof body === 'object' ? JSON.stringify(body) : body
        });
    else
        request = await fetch(url, {
            method: Method[method].toUpperCase()
        });

    switch (resultParser) {
        case Result.text:
            return await request.text() as string;
        case Result.json:
            return await request.json() as ReturnType;
        default:
            return await request.arrayBuffer() as ArrayBuffer;
    }
}