# GraphQL Frontend

A simple React + TypeScript frontend for the GraphQL Java backend.

## Setup

1. **Start the backend** (from `../graphQL`):

   ```bash
   cd ../graphQL && ./mvnw spring-boot:run
   ```

   The GraphQL API runs at `http://localhost:8080/graphql`.

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Start the dev server**:

   ```bash
   npm run dev
   ```

   The app runs at `http://localhost:5173`. Vite proxies `/graphql` to the backend, so no CORS configuration is needed during development.

## Features

- **Users**: List, create, and delete users
- **Books**: List, create, and delete books (assigned to users)
