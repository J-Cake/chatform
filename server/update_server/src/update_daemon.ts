// client

import * as WebSocket from 'ws';
import {ChildProcess, spawn} from 'child_process';

let isObserverClient: boolean = false;

async function init(url, requestUpgrade: boolean = false) {
    console.log("Daemon: Establishing Connection");

    let deliberateClose: boolean = false;

    const socket: WebSocket = new WebSocket(url);

    socket.onerror = function () {
        console.log('Daemon:', 'Connection Failure');
    };

    let terminalInterface: ChildProcess;

    if (process.platform === "win32")
        terminalInterface = spawn('C:\\Windows\\System32\\cmd.exe');
    else
        terminalInterface = spawn('bash');

    terminalInterface.on('exit', function () {
        if (!deliberateClose)
            socket.close();
        deliberateClose = false;
    });

    let serverOpen: boolean = false;
    const output: { type: 0 | 1 | 2 | 3, msg: string }[] = [];

    terminalInterface.stdout.on('data', data => {
        const val = data.toString();

        if (serverOpen)
            socket.send(JSON.stringify({type: 0, msg: val}));
        else
            output.push({type: 0, msg: val});
    });

    terminalInterface.stderr.on('data', data => {
        const val = data.toString();

        if (serverOpen)
            socket.send(JSON.stringify({type: 1, msg: val}));
        else
            output.push({type: 1, msg: val});
    });

    socket.on('open', function open() {
        console.log("Daemon: Connection Success");

        if (requestUpgrade)
            // if (process.stdout.isTTY) // request upgrade
            socket.send("upgrade");

        serverOpen = true;

        for (const i of output)
            socket.send(JSON.stringify(i));
    });

    socket.on("message", function (data) {
        const message = JSON.parse(data.toString());

        // message types:
        // 0: stdout,
        // 1: stderr,
        // 2: stdin,
        // 3: special command

        switch (message.type) {
            case 0:
                return process.stdout.write(message.msg);
            case 1:
                return process.stderr.write(message.msg);
            case 2:
                if (isObserverClient) // do nothing
                    return;
                else
                    return terminalInterface.stdin.write(message.msg);
            case 3:
                if (isObserverClient) // we have no instructions for observables yet
                    return;
                else if (message.msg === "upgraded") {
                    console.log("Daemon: Upgrade Success");
                    deliberateClose = true;
                    isObserverClient = true;
                    terminalInterface.kill("SIGINT");

                    process.stdin.on('data', data => socket.send(JSON.stringify({type: 2, msg: data.toString()}))); // set event listener

                    return;
                } else
                    return;
        }
    });

    socket.onclose = function () {
        // if (!deliberateClose) {
        console.log("Daemon: Connection Lost, retrying");
        init(url);
        // } else {
        //     console.log("Daemon: Daemon Disconnected");
        //     console.log("Daemon: No further connection attempt");
        // }
    };
}

export default init;
