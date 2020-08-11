import gql from 'graphql-tag';

export default gql`
  query LibraTest($phrase: String!, $address: HexString!) {
    metadata {
      version
      timestamp
    }
    wallet(phrase: $phrase) {
      seed {
        phrase
        key
      }
      account {
        secretKey
        publicKey
        authKey
        address
        libraAccount {
          sequenceNumber
          isFrozen
          balances {
            amount
            currency
          }
          role
        }
      }
    }
    received: account(address: $address) {
      receivedEvents {
        ...receivedEventFields
      }
    }
    sent: account(address: $address) {
      sentEvents {
        ...sentEventFields
      }
    }
    transactions: account(address: $address) {
      transactions {
        version
        hash
        vmStatus
        gasUsed
        data {
          __typename
          ... on UserTransactionData {
            ...userTransactionFields
          }
        }
      }
    }
  }

  fragment amountFields on Amount {
    amount
    currency
  }

  fragment accountFields on Account {
    sequenceNumber
    address
    authenticationKey
    balances {
      ...amountFields
    }
  }

  fragment sentEventDataFields on SentPaymentEventData {
    amount {
      ...amountFields
    }
    metadata
    receiver {
      ...accountFields
    }
  }

  fragment receivedEventDataFields on ReceivedPaymentEventData {
    amount {
      ...amountFields
    }
    metadata
    sender {
      ...accountFields
    }
  }

  fragment eventFields on Event {
    sequenceNumber
    transaction(includeEvents: true) {
      version
      hash
      vmStatus
      gasUsed
      data {
        ...userTransactionFields
      }
      events {
        data {
          __typename
          ... on MintEventData {
            amount {
              ...amountFields
            }
          }
        }
      }
    }
    data {
      __typename
    }
  }

  fragment receivedEventFields on Event {
    ...eventFields
    transaction(includeEvents: true) {
      events {
        data {
          ... on SentPaymentEventData {
            ...sentEventDataFields
          }
        }
      }
    }
    data {
      ... on ReceivedPaymentEventData {
        ...receivedEventDataFields
      }
    }
  }

  fragment sentEventFields on Event {
    ...eventFields
    transaction(includeEvents: true) {
      events {
        data {
          ... on ReceivedPaymentEventData {
            ...receivedEventDataFields
          }
        }
      }
    }
    data {
      ... on SentPaymentEventData {
        ...sentEventDataFields
      }
    }
  }

  fragment userTransactionFields on UserTransactionData {
    signatureScheme
    signature
    publicKey
    sequenceNumber
    maxGasAmount
    gasUnitPrice
    gasCurrency
    expirationTimestampSecs
    scriptHash
    script {
      __typename
      ... on MintScript {
        receiver {
          ...accountFields
        }
        amount
      }
      ... on PeerToPeerTransferScript {
        receiver {
          ...accountFields
        }
        amount
        currency
        metadata
        metadataSignature
      }
    }
  }
`;
