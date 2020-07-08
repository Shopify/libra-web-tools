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

  public static keyPairParts(keyPair: eddsa.KeyPair) {
    return {
      secretKey: keyPair.getSecret('hex'),
      publicKey: keyPair.getPublic('hex'),
    };
  }

  public static publicAuthKey(publicKey: string) {
    return sha3hash(publicKey).toString('hex');
  }

  public static authKeyParts(authKey: string) {
    return {
      address: authKey.slice(-32),
      authKeyPrefix: authKey.slice(0, 32),
    };
  }

  public readonly secretKey: string;
  public readonly publicKey: string;
  public readonly authKey: string;
  public readonly authKeyPrefix: string;
  public readonly address: string;

  constructor(public readonly keyPair: eddsa.KeyPair) {
    const {secretKey, publicKey} = LibraAccount.keyPairParts(keyPair);
    this.secretKey = secretKey;
    this.publicKey = publicKey;
    this.authKey = LibraAccount.publicAuthKey(publicKey);
    const {authKeyPrefix, address} = LibraAccount.authKeyParts(this.authKey);
    this.address = address;
    this.authKeyPrefix = authKeyPrefix;
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
      `       Auth Key: ${this.authKey}`,
      `        Address: ${this.address}`,
      `Auth Key Prefix: ${this.authKeyPrefix}`,
    ].join('\n');
  }
}
