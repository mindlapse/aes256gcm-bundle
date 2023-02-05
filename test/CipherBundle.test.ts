import crypto from 'node:crypto'

import CipherBundle from '../src/CipherBundle'
import { expect, describe, it } from '@jest/globals'

describe('CipherBundle', () => {
    const PHRASE =
        'Hello world'

    it('encrypts and decrypts (base64url key)', () => {
        const key = crypto.randomBytes(32).toString('base64url')
        const cb = new CipherBundle(key)
        const bundle = cb.encrypt(PHRASE)
        const decrypted = cb.decrypt(bundle)

        console.log(
            `______________________________\n` +
            `  using a base64url key\n` +
            `______________________________\n` +
            `encryption key (base64url):\n${key}\n\n` +
            `bundle:\n${bundle}\n\n` +
            `decrypted:\n${decrypted}`
        );

        expect(decrypted).toEqual(PHRASE)
    })

    it('encrypts and decrypts (utf8)', () => {
        const key = 'superS3cretPassphras3!'
        const cb = new CipherBundle(key, 'utf-8')
        const bundle = cb.encrypt(PHRASE)
        const decrypted = cb.decrypt(bundle)

        console.log(
            `______________________________\n` +
            `  using a UTF-8 key\n`+
            `______________________________\n` +
            `encryption key (utf-8):\n` +
            `${key}\n\n` +
            `bundle:\n` +
            `${bundle}\n\n` +
            `decrypted:\n` +
            `${decrypted}`
        );

        expect(decrypted).toEqual(PHRASE)
    })


    it('setting a keyName prefix', () => {
        const key = crypto.randomBytes(32).toString('base64url')
        const cb = new CipherBundle(key)
        const bundle = cb.encrypt(PHRASE, "prod1")
        const decrypted = cb.decrypt(bundle)

        console.log(
            `______________________________\n` +
            `  using a keyName prefix\n`+
            `______________________________\n` +
            `encryption key:\n` +
            `${key}\n\n` +
            `bundle:\n` +
            `${bundle}\n\n` +
            `decrypted:\n` +
            `${decrypted}`
        );

        expect(bundle.startsWith("prod1")).toEqual(true)
        expect(decrypted).toEqual(PHRASE)
    })


})
