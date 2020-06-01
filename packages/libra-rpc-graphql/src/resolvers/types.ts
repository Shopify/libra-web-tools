export enum EventDataType {
  ReceivedPaymentEventData = 'receivedpayment',
  SentPaymentEventData = 'sentpayment',
  NewBlockEventData = 'newblock',
  MintEventData = 'mint',
  UnknownEventData = 'unknown',
}

export enum ScriptType {
  PeerToPeerTransferScript = 'peer_to_peer_transaction',
  MintScript = 'mint_transaction',
  UnknownScript = 'unknown_transaction',
}

export enum TransactionDataType {
  BlockMetadataTransactionData = 'blockmetadata',
  WriteSetTransactionData = 'writeset',
  UserTransactionData = 'user',
  UnknownTransactionData = 'unknown',
}
