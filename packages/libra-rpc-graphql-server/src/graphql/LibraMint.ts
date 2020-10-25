import gql from 'graphql-tag';

export default gql`
  mutation LibraMint($authKey: HexString!) {
    mint(
      input: {authKey: $authKey, amountInMicroLibras: 1e6, currencyCode: "LBR"}
    ) {
      sequenceNumber
      address
      balances {
        ...amountFields
      }
      receivedEvents {
        key
        sequenceNumber
        transactionVersion
        data {
          ... on ReceivedPaymentEventData {
            amount {
              ...amountFields
            }
            senderAddress
          }
        }
      }
    }
  }

  fragment amountFields on Amount {
    amount
    currency
  }
`;
