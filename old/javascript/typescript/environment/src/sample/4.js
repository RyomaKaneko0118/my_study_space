"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _HelloWorldPromise_promise;
Object.defineProperty(exports, "__esModule", { value: true });
var HelloWorldPromise = /** @class */ (function () {
    function HelloWorldPromise() {
        _HelloWorldPromise_promise.set(this, void 0);
        __classPrivateFieldSet(this, _HelloWorldPromise_promise, Promise.resolve("Hello"), "f");
    }
    HelloWorldPromise.prototype.then = function (onfulfilled, onrejected) {
        return __classPrivateFieldGet(this, _HelloWorldPromise_promise, "f").then(onfulfilled, onrejected);
    };
    return HelloWorldPromise;
}());
_HelloWorldPromise_promise = new WeakMap();
new HelloWorldPromise()
    .then(function (value) { return value.toUpperCase(); })
    .then(function (value) { return console.log(value); });