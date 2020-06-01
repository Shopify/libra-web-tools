import {pbkdf2Sync} from 'pbkdf2';

import {BufferLike, getBuffer} from '../utilities';

import {
  hashDigest,
  keyIterations,
  keyLength,
  mnemonicSalt,
  seedKeySalt,
} from './constants';
import {generateSeedPhrase} from './seedPhrase';

export interface SeedKeyOptions {
  salt?: string | Buffer;
  iterations?: number;
  length?: number;
}

export function generateSeedKey(
  phrase?: BufferLike,
  {
    salt = seedKeySalt,
    iterations = keyIterations,
    length = keyLength,
  }: SeedKeyOptions = {},
) {
  return pbkdf2Sync(
    getBuffer(phrase || generateSeedPhrase()),
    getBuffer(`${mnemonicSalt}${salt}`),
    iterations,
    length,
    hashDigest,
  );
}
