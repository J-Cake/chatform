"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var globState_1 = require("./globState");
var globState = globState_1.defaults;
var watchers = [];
var eventHandlers = [];
function invokeHandlers() {
    for (var _i = 0, watchers_1 = watchers; _i < watchers_1.length; _i++) {
        var handler = watchers_1[_i];
        handler(globState);
    }
}
var setState = function (state) {
    var _state = typeof state === "function" ? state(globState) : state;
    if (_state) {
        for (var _i = 0, _a = Object.keys(_state); _i < _a.length; _i++) {
            var i = _a[_i];
            // @ts-ignore
            globState[i] = _state[i];
        }
        invokeHandlers();
    }
    return globState;
};
exports.default = setState;
function onStateChange(callback) {
    watchers.push(callback);
    return watchers.length;
}
exports.onStateChange = onStateChange;
function removeStateListener(id) {
    if (watchers[id])
        delete watchers[id];
}
exports.removeStateListener = removeStateListener;
function on(event, callback) {
    eventHandlers.push({
        name: event,
        callback: callback
    });
    return eventHandlers.length;
}
exports.on = on;
function off(id) {
    if (eventHandlers[id])
        delete eventHandlers[id];
}
exports.off = off;
function dispatch(event, state) {
    if (typeof state === "function")
        setState(state(globState));
    else
        setState(state);
    var events = eventHandlers.filter(function (i) { return i.name === event; });
    for (var _i = 0, events_1 = events; _i < events_1.length; _i++) {
        var i = events_1[_i];
        i.callback(globState);
    }
}
exports.dispatch = dispatch;
function broadcast(event) {
    var events = eventHandlers.filter(function (i) { return i.name === event; });
    for (var _i = 0, events_2 = events; _i < events_2.length; _i++) {
        var i = events_2[_i];
        i.callback(globState);
    }
}
exports.broadcast = broadcast;
exports.utils = {};
exports.defaults = globState_1.defaults;
//# sourceMappingURL=stateManager.js.map