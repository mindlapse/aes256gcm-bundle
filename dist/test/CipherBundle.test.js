"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_crypto_1 = __importDefault(require("node:crypto"));
const CipherBundle_1 = __importDefault(require("../src/CipherBundle"));
const globals_1 = require("@jest/globals");
(0, globals_1.describe)('CipherBundle', () => {
    const PHRASE = 'Hello world';
    (0, globals_1.it)('encrypts and decrypts', () => {
        const key = node_crypto_1.default.randomBytes(32).toString('base64url');
        console.log(key);
        const cb = new CipherBundle_1.default(key);
        const bundle = cb.encrypt(PHRASE);
        console.log(bundle);
        (0, globals_1.expect)(cb.decrypt(bundle)).toEqual(PHRASE);
    });
});
