/// <reference types="node" resolution-mode="require"/>
export default class CipherBundle {
    static ENCODING: BufferEncoding;
    private key;
    private static CIPHER;
    private static IV_LENGTH;
    /**
     * @param cipherKey A base64url encoded 256-bit key
     */
    constructor(cipherKey: string, encoding?: BufferEncoding);
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
    encrypt(plainText: string, keyName?: string): string;
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
    decrypt(bundle: string): string;
}
//# sourceMappingURL=CipherBundle.d.ts.map