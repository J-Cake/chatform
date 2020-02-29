// server

import * as WebSocket from 'ws';

const port = Number(process.env.PORT);

const watchers: WebSocket[] = [];

const server = new WebSocket.Server({port, noServer: true});

server.on("connection", function (client) {
    client.on('message', data => {
        if (data === "upgrade") {
            console.log("Daemon Server: Client Upgraded");
            watchers.push(client); // client has requested to become an observer.
            client.send(JSON.stringify({type: 3, msg: "upgraded"}));
        } else {
            const message = JSON.parse(data.toString());

            console.log("Daemon: Incoming message", message.type);

            if (message.type === 2)
                server.clients.forEach(i => i.send(data));
            else
                watchers.forEach(i => i.send(data));
        }
    });

    client.on('close', async function () {
        const index = watchers.findIndex(i => i === client);
        if (index > -1)
            watchers.splice(index, 1);

        console.log("Daemon Server: Client Disconnected");
    });

    console.log("Daemon Server: Connection Established");
});

async function start() {
    console.log("Daemon Server: Active on", port);

    function exit() {
        server.close();

        console.log("Daemon Server: Closing");

        process.exit(0);
    }

    process.on('exit', () => exit());

    // let client: WebSocket = await init();

    // process.stdin.on('data', data => {
    //     server.clients.forEach(i => {
    //         if (i.readyState === WebSocket.OPEN)
    //             i.send(JSON.stringify({type: 2, msg: data}));
    //     });
    // });
}

(async function () {
    await start();
})();
