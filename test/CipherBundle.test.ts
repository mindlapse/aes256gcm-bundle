import crypto from 'node:crypto'

import CipherBundle from '../src/CipherBundle'
import { expect, describe, it } from '@jest/globals'

describe('CipherBundle', () => {
    const PHRASE =
        'Hello world'

    it('encrypts and decrypts', () => {
        const key = crypto.randomBytes(32).toString('base64url')
        console.log(key)
        const cb = new CipherBundle(key)
        const bundle = cb.encrypt(PHRASE)
        console.log(bundle)

        expect(cb.decrypt(bundle)).toEqual(PHRASE)
    })
})
