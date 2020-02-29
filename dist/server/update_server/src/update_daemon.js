"use strict";
// client
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var WebSocket = require("ws");
var child_process_1 = require("child_process");
var isObserverClient = false;
function init(url, requestUpgrade) {
    if (requestUpgrade === void 0) { requestUpgrade = false; }
    return __awaiter(this, void 0, void 0, function () {
        var deliberateClose, socket, terminalInterface, serverOpen, output;
        return __generator(this, function (_a) {
            console.log("Daemon: Establishing Connection");
            deliberateClose = false;
            socket = new WebSocket(url);
            socket.onerror = function () {
                console.log('Daemon:', 'Connection Failure');
            };
            if (process.platform === "win32")
                terminalInterface = child_process_1.spawn('C:\\Windows\\System32\\cmd.exe');
            else
                terminalInterface = child_process_1.spawn('bash');
            terminalInterface.on('exit', function () {
                if (!deliberateClose)
                    socket.close();
                deliberateClose = false;
            });
            serverOpen = false;
            output = [];
            terminalInterface.stdout.on('data', function (data) {
                var val = data.toString();
                if (serverOpen)
                    socket.send(JSON.stringify({ type: 0, msg: val }));
                else
                    output.push({ type: 0, msg: val });
            });
            terminalInterface.stderr.on('data', function (data) {
                var val = data.toString();
                if (serverOpen)
                    socket.send(JSON.stringify({ type: 1, msg: val }));
                else
                    output.push({ type: 1, msg: val });
            });
            socket.on('open', function open() {
                console.log("Daemon: Connection Success");
                if (requestUpgrade)
                    // if (process.stdout.isTTY) // request upgrade
                    socket.send("upgrade");
                serverOpen = true;
                for (var _i = 0, output_1 = output; _i < output_1.length; _i++) {
                    var i = output_1[_i];
                    socket.send(JSON.stringify(i));
                }
            });
            socket.on("message", function (data) {
                var message = JSON.parse(data.toString());
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
                            process.stdin.on('data', function (data) { return socket.send(JSON.stringify({ type: 2, msg: data.toString() })); }); // set event listener
                            return;
                        }
                        else
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
            return [2 /*return*/];
        });
    });
}
exports.default = init;
//# sourceMappingURL=update_daemon.js.map