import {eddsa} from 'elliptic';

import {generateKeyPair, keyPairFromSecret} from './generators';
// import {signTransactionData} from './transaction';
import {BufferLike, sha3hash} from './utilities';

export class LibraAccount {
  public static fromSecretKey(secretKey: BufferLike) {
    return new LibraAccount(keyPairFromSecret(secretKey));
  }

  public static fromSeed(seed: BufferLike, index: number | BigInt | Buffer) {
    return new LibraAccount(generateKeyPair(seed, index));
  }

  constructor(public readonly keyPair: eddsa.KeyPair) {}

  get publicKey() {
    return this.keyPair.getPublic('hex');
  }

  get secretKey() {
    return this.keyPair.getSecret('hex');
  }

  get address() {
    return sha3hash(this.keyPair.getPublic()).toString('hex');
  }

  get authKeyPrefix() {
    return this.address.slice(0, 32);
  }

  get shortAddress() {
    return this.address.slice(-32);
  }

  // NOTE: not working :(
  // might be able to port over the jLibra implementation
  // see: https://github.com/ketola/jlibra/blob/master/jlibra-core/src/test/java/dev/jlibra/serialization/lcs/LCSSerializerTest.java
  // signTransactionData(
  //   toAddress: BufferLike,
  //   amount: number,
  //   sequenceNumber: number,
  //   maxGasAmount?: number,
  //   gasUnitPrice?: number,
  //   expiration?: number,
  // ) {
  //   return signTransactionData(
  //     this.keyPair,
  //     toAddress,
  //     amount,
  //     sequenceNumber,
  //     maxGasAmount,
  //     gasUnitPrice,
  //     expiration,
  //   ).toString('hex');
  // }

  toString() {
    return [
      `     Secret Key: ${this.secretKey}`,
      `     Public Key: ${this.publicKey}`,
      `       Auth Key: ${this.address}`,
      `  Short Address: ${this.shortAddress}`,
      `Auth Key Prefix: ${this.authKeyPrefix}`,
    ].join('\n');
  }
}
