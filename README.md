# aes256gcm-bundle

A simple way to encrypt/decrypt fields to/from a string bundle, using AES256-GCM with a randomly generated IV.

---

## Installation
```bash

npm i aes256gcm-bundle

```

---

## Encrypt / Decrypt
```typescript

import CipherBundle from 'aes256gcm-bundle'


const cb = new CipherBundle(base64urlEncodedKey)

const bundle = cb.encrypt('Hello world')

// e.g.: "0.YFG9joOntVvgLLYQ.QL7k4BFI8ot8PJeqTXOyXQ.fQGNGGwvoKEQXg0"

const plainText = cb.decrypt(bundle)

// e.g.: "Hello world"


```

---

## Creating a CipherBundle
use a randomly generated base64url-encoded key (very secure)
```typescript

import crypto from 'node:crypto'
const key = crypto.randomBytes(32).toString('base64url')  
// example key: Bi-zMjDdm8ZuqbJQ5WstSwFUCLwVwsPcBQvah-pprSY

let cb = new CipherBundle(key)

```

or provide a key in another encoding (utf8, base64, hex, ...)
```typescript

cb = new CipherBundle(veryStrongPassword, 'utf8')

```

---

## Bundle format

Text passed to `encrypt()` creates a bundle in this dot-separated format: `keyName.iv.authTag.cipherText`.

Example bundle:

`prod1.2N6zOPNuH-3C8vFY.ZGhXywwmEgf14YR2shaiqQ.TIK7rtKvcqrEjG4`

### Bundle components

- The `keyName` is just a moniker that is set to `0` by default, but you can override it to denote (to you) which key was used to encrypt the bundle. It can be set to a meaningful value (e.g. `prod0`) and should be changed when rotating keys.

- The `iv` and `authTag` components are opaque base64url-encoded values that are needed to successfully decrypt the bundle.

- The `cipherText` component of the bundle is the AES256-GCM encryption of the plain text (with a random IV), encoded to a base64url string.
The key used for encryption is the SHA-256 of the key that you provide when creating a `CipherBundle` (described below).

---

## Key rotation / identification

To support key rotation/identification, you can pass an optional `keyName` parameter to `encrypt(text, keyName)`. The default prefix is `0` when `keyName` is not specified. The `keyName` parameter changes the prefix on your bundle to a tag that allows you to later identify which key was used to encrypt the bundle, under your own naming conventions. The name should be short but meaningful (example `prod1`), cannot include the `.` character, and should be changed alongside a key rotation (e.g. to `prod2`).

It is up to you to determine an appropriate key rotation schedule - after a billion encryptions with the same key, it is probably time to choose a new key!
Since the IV is randomly generated, there is a very small chance of a duplicate IV after many encryptions - this is significant known risk for AES256-GCM, 
but it can be mitigated by periodic key rotations.

Here is an example of setting a custom prefix for the bundle to identify the use of a new key:

```typescript

cb = new CipherBundle(prod1Key)

const bundle = cb.encrypt('Hello world', "prod1")

// example bundle: prod1.VqUyV8dr33MRITD5.7LiH24gOXaoGHw9sfJMNKA.r00A78iuZWNd748

const plainText = cb.decrypt(bundle)

// example plainText: Hello world

```
