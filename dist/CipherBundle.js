import crypto from 'node:crypto';
export default class CipherBundle {
    /**
     * @param cipherKey A base64url encoded 256-bit key
     */
    constructor(cipherKey, encoding = 'base64url') {
        const cipherKeyHash = crypto.createHash('sha256');
        cipherKeyHash.update(cipherKey, encoding);
        this.key = crypto.createSecretKey(cipherKeyHash.digest());
    }
    /**
     * Encrypt text with AES256-GCM (with a random IV), into a base64url encoded
     * bundle in the format below.  The bundle can be decrypted via decrypt(bundle)
     *
     *   keyName.iv.authTag.cipherText
     *
     * @param plainText The text to encrypt
     *
     * @param keyName
     * (Optional) Defaults to 0.  An arbitrary tag to identify the
     * encryption key.  Useful with periodic key rotation.
     *
     * @returns The cipher bundle
     */
    encrypt(plainText, keyName = "0") {
        const iv = crypto.randomBytes(CipherBundle.IV_LENGTH);
        const cipher = crypto.createCipheriv(CipherBundle.CIPHER, this.key, iv);
        const cipherText = cipher.update(plainText, 'utf8');
        cipher.final();
        const authTag = cipher.getAuthTag();
        const ENC = CipherBundle.ENCODING;
        return new ParsedBundle(keyName, iv.toString(ENC), authTag.toString(ENC), cipherText.toString(ENC)).toString();
    }
    /**
     * Decrypt a string produced by the encrypt method (under the same key)
     *
     * @param bundle
     * A bundle string produced by the encrypt(plainText) method.
     * A bundle has this format:
     *
     *   keyName.iv.authTag.cipherText
     *
     */
    decrypt(bundle) {
        const parsed = ParsedBundle.fromString(bundle);
        const ENC = CipherBundle.ENCODING;
        const iv = Buffer.from(parsed.iv, ENC);
        const decipher = crypto.createDecipheriv(CipherBundle.CIPHER, this.key, iv);
        decipher.setAuthTag(parsed.authTagBytes());
        const decrypted = decipher.update(parsed.cipherTextBytes());
        decipher.final();
        return decrypted.toString('utf8');
    }
}
CipherBundle.ENCODING = 'base64url';
CipherBundle.CIPHER = 'id-aes256-GCM';
CipherBundle.IV_LENGTH = 12;
class ParsedBundle {
    constructor(keyName, iv, authTag, cipherText) {
        this.keyName = keyName;
        this.iv = iv;
        this.authTag = authTag;
        this.cipherText = cipherText;
    }
    ivBytes(encoding = CipherBundle.ENCODING) {
        return Buffer.from(this.iv, encoding);
    }
    authTagBytes(encoding = CipherBundle.ENCODING) {
        return Buffer.from(this.authTag, encoding);
    }
    cipherTextBytes(encoding = CipherBundle.ENCODING) {
        return Buffer.from(this.cipherText, encoding);
    }
    toString() {
        return `${this.keyName}.${this.iv}.${this.authTag}.${this.cipherText}`;
    }
    static fromString(bundle) {
        const components = bundle.split('.');
        return new ParsedBundle(components[0], components[1], components[2], components[3]);
    }
}
