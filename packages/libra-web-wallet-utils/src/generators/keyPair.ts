import {eddsa as Eddsa} from 'elliptic';
// eslint-disable-next-line @typescript-eslint/camelcase
import {expand, extract, hash_length} from 'futoin-hkdf';

import {
  asUInt64LE,
  BufferLike,
  getBuffer,
  GetBufferOptions,
} from '../utilities';

import {
  derivedKeySalt,
  hashDigest,
  keyLength,
  masterKeySalt,
} from './constants';

export const dsaHashLength = hash_length(hashDigest);

export function keyPairFromSecret(secretKey: BufferLike) {
  return new Eddsa('ed25519').keyFromSecret(
    getBuffer(secretKey, {encoding: 'hex'}),
  );
}

export function generateKeyPair(
  seedKey: BufferLike,
  index: number | BigInt | Buffer = 0,
  options: GetBufferOptions = {encoding: 'hex'},
) {
  return keyPairFromSecret(
    expand(
      hashDigest,
      dsaHashLength,
      extract(
        hashDigest,
        dsaHashLength,
        getBuffer(seedKey, options),
        getBuffer(masterKeySalt),
      ),
      keyLength,
      Buffer.concat([
        Buffer.from(derivedKeySalt),
        Buffer.isBuffer(index) ? index : asUInt64LE(index),
      ]),
    ),
  );
}
