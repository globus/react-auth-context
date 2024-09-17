/**
 * Uses Node.js built-in modules to provide the necessary polyfills for the browser environment.
 */
const { webcrypto } = require('node:crypto');
const util = require('node:util');

/**
 * @see https://nodejs.org/docs/latest-v20.x/api/crypto.html#cryptowebcrypto
 */
Object.defineProperty(globalThis, 'crypto', {
  value: webcrypto
});

/**
 * @see https://nodejs.org/docs/latest-v20.x/api/util.html#class-utiltextencoder
 */
Object.defineProperty(globalThis, 'TextEncoder', {
  value: util.TextEncoder
});