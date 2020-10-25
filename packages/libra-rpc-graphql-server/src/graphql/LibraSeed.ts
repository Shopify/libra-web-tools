import gql from 'graphql-tag';

export default gql`
  mutation LibraSeed {
    createSeed {
      phrase
      key
      wallet {
        account {
          authKey
          address
        }
      }
    }
  }
`;
