import crypto, { KeyObject, CipherGCM, DecipherGCM } from 'node:crypto'

export default class CipherBundle {
    public static ENCODING = 'base64url' as BufferEncoding

    private key: KeyObject
    private static CIPHER = 'id-aes256-GCM'
    private static IV_LENGTH = 12

    /**
     * @param cipherKey A base64url encoded 256-bit key
     */
    constructor(cipherKey: string) {
        this.key = crypto.createSecretKey(cipherKey, CipherBundle.ENCODING)
    }

    /**
     * Encrypt text with AES256-GCM (with a random IV), into a base64url encoded
     * bundle in the format below.  The bundle can be decrypted via decrypt(bundle)
     *
     *   keyIdx.iv.authTag.cipherText
     *
     * @param plainText The text to encrypt
     *
     * @param keyIdx
     * (Optional) Defaults to 0.  An arbitrary number to identify the
     * encryption key.  Useful with periodic key rotation.
     *
     * @returns The cipher bundle
     */
    encrypt(plainText: string, keyIdx = 0): string {
        const iv = crypto.randomBytes(CipherBundle.IV_LENGTH)
        const cipher = crypto.createCipheriv(
            CipherBundle.CIPHER,
            this.key,
            iv
        ) as CipherGCM

        const cipherText = cipher.update(plainText, 'utf8')
        cipher.final()

        const authTag = cipher.getAuthTag()
        const ENC = CipherBundle.ENCODING

        return new ParsedBundle(
            keyIdx,
            iv.toString(ENC),
            authTag.toString(ENC),
            cipherText.toString(ENC)
        ).toString()
    }

    /**
     * Decrypt a string produced by the encrypt method (under the same key)
     *
     * @param bundle
     * A bundle string produced by the encrypt(plainText) method.
     * A bundle has this format:
     *
     *   keyIdx.iv.authTag.cipherText
     *
     */
    decrypt(bundle: string): string {
        const parsed = ParsedBundle.fromString(bundle)

        const ENC = CipherBundle.ENCODING
        const iv = Buffer.from(parsed.iv, ENC)

        const decipher = crypto.createDecipheriv(
            CipherBundle.CIPHER,
            this.key,
            iv
        ) as DecipherGCM
        decipher.setAuthTag(parsed.authTagBytes())

        const decrypted = decipher.update(parsed.cipherTextBytes())
        decipher.final()

        return decrypted.toString('utf8')
    }
}

class ParsedBundle {
    keyIdx: number
    iv: string
    authTag: string
    cipherText: string

    constructor(
        keyIdx: number,
        iv: string,
        authTag: string,
        cipherText: string
    ) {
        this.keyIdx = keyIdx
        this.iv = iv
        this.authTag = authTag
        this.cipherText = cipherText
    }

    ivBytes(encoding = CipherBundle.ENCODING): Uint8Array {
        return Buffer.from(this.iv, encoding)
    }

    authTagBytes(encoding = CipherBundle.ENCODING): Uint8Array {
        return Buffer.from(this.authTag, encoding)
    }

    cipherTextBytes(encoding = CipherBundle.ENCODING): Uint8Array {
        return Buffer.from(this.cipherText, encoding)
    }

    toString() {
        return `${this.keyIdx}.${this.iv}.${this.authTag}.${this.cipherText}`
    }

    static fromString(bundle: string): ParsedBundle {
        const components = bundle.split('.')

        return new ParsedBundle(
            parseInt(components[0]),
            components[1],
            components[2],
            components[3]
        )
    }
}
