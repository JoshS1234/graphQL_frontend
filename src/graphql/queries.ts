import { gql } from "@apollo/client";

export const GET_ALL_USERS = gql`
  query GetAllUsers {
    getAllUsers {
      id
      name
      email
      books {
        id
        title
        author
      }
    }
  }
`;

export const GET_ALL_BOOKS = gql`
  query GetAllBooks {
    getAllBooks {
      id
      title
      author
      user {
        id
        name
        email
      }
    }
  }
`;
