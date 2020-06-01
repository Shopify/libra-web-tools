import {Root} from 'protobufjs';

// create the json via
// protobufjs.parse(protoContent).root.toJSON()
import proto from './transaction.proto.json';
// const proto = require('./transaction.proto.json');

export const root = Root.fromJSON(proto);
export const RawTransaction = root.lookupType('types.RawTransaction');
export const SignedTransaction = root.lookupType('types.SignedTransaction');
