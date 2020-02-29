import * as http from 'http';

export default function (port: number) {
    const server = http.createServer(function (req, res) {
        res.writeHead(101, {
            Upgrade: "websocket",
            Connection: "Upgrade",
            port
        });
        res.end(port);
    });

    server.listen(port, function () {
        console.log("Daemon HTTP Process: Active on", port);
    });

    return server;
}
