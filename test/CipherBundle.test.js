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
    (0, globals_1.it)('encrypts and decrypts (base64url key)', () => {
        const key = node_crypto_1.default.randomBytes(32).toString('base64url');
        const cb = new CipherBundle_1.default(key);
        const bundle = cb.encrypt(PHRASE);
        const decrypted = cb.decrypt(bundle);
        console.log(`______________________________\n` +
            `  using a base64url key\n` +
            `______________________________\n` +
            `encryption key (base64url):\n${key}\n\n` +
            `bundle:\n${bundle}\n\n` +
            `decrypted:\n${decrypted}`);
        (0, globals_1.expect)(decrypted).toEqual(PHRASE);
    });
    (0, globals_1.it)('encrypts and decrypts (utf8)', () => {
        const key = 'superS3cretPassphras3!';
        const cb = new CipherBundle_1.default(key, 'utf-8');
        const bundle = cb.encrypt(PHRASE);
        const decrypted = cb.decrypt(bundle);
        console.log(`______________________________\n` +
            `  using a UTF-8 key\n` +
            `______________________________\n` +
            `encryption key (utf-8):\n` +
            `${key}\n\n` +
            `bundle:\n` +
            `${bundle}\n\n` +
            `decrypted:\n` +
            `${decrypted}`);
        (0, globals_1.expect)(decrypted).toEqual(PHRASE);
    });
    (0, globals_1.it)('setting a keyName prefix', () => {
        const key = node_crypto_1.default.randomBytes(32).toString('base64url');
        const cb = new CipherBundle_1.default(key);
        const bundle = cb.encrypt(PHRASE, "prod1");
        const decrypted = cb.decrypt(bundle);
        console.log(`______________________________\n` +
            `  using a keyName prefix\n` +
            `______________________________\n` +
            `encryption key:\n` +
            `${key}\n\n` +
            `bundle:\n` +
            `${bundle}\n\n` +
            `decrypted:\n` +
            `${decrypted}`);
        (0, globals_1.expect)(bundle.startsWith("prod1")).toEqual(true);
        (0, globals_1.expect)(decrypted).toEqual(PHRASE);
    });
});
