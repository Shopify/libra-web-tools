import {SHA3} from 'sha3';

import {BufferLike, getBuffer} from './getBuffer';

export function sha3hash(...messages: BufferLike[]) {
  return new SHA3(256)
    .update(Buffer.concat(messages.map((message) => getBuffer(message))))
    .digest();
}
