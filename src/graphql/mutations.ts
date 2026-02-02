import { gql } from "@apollo/client";

export const CREATE_USER = gql`
  mutation CreateUser($name: String!, $email: String!) {
    createUser(name: $name, email: $email) {
      id
      name
      email
    }
  }
`;

export const CREATE_BOOK = gql`
  mutation CreateBook(
    $title: String!
    $author: String!
    $userId: ID!
    $publishedYear: Int!
  ) {
    createBook(
      title: $title
      author: $author
      userId: $userId
      publishedYear: $publishedYear
    ) {
      id
      title
      author
      publishedYear
      user {
        id
        name
      }
    }
  }
`;

export const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id)
  }
`;

export const DELETE_BOOK = gql`
  mutation DeleteBook($id: ID!) {
    deleteBook(id: $id)
  }
`;
