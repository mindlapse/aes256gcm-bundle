# aes256gcm-bundle

A simple utility to encrypt and decrypt text using AES256-GCM with a randomly generated IV

Text passed to `encrypt()` will be output in this dot-separated format:
`keyIdx.iv.authTag.cipherText`

The `iv`, `authTag`, and `cipherText` components are each base64url-encoded, and `cipherText` is AES256-GCM encrypted under the key that you provide.

You can set `keyIdx` to denote (to you) which key was used to encrypt the `cipherText`.  By default this is set to 0, but should be changed after a key rotation.
It's up to you to determine an appropriate key rotation schedule - after a billion encryptions with the same key, it's probably time to choose a new one!

## Install
```bash
npm i aes256gcm-bundle
```


## Create a symmetric key 
```typescript
import crypto from 'node:crypto'

const key = crypto.randomBytes(32).toString('base64url')
// example key: HtVjjixcnCUEyUP9ndKc-NlTyLyDQwDX0hrQklqDVZo
```


## Encrypt
```typescript
import CipherBundle from 'aes256gcm-bundle'

const cb = new CipherBundle(key)
const bundle = km.encrypt('Hello world')

console.log(bundle) // example output: 0.uYmPp8RWQLnQC3z3.fIFpqKhgDGVOahxLCdg7NA.vBDezhOldki8_5E

```


## Decrypt
```typescript
import CipherBundle from 'aes256gcm-bundle'

const cb = new CipherBundle(key)
const plainText = km.decrypt("0.uYmPp8RWQLnQC3z3.fIFpqKhgDGVOahxLCdg7NA.vBDezhOldki8_5E")

console.log(plainText) // example output: Hello world
```
