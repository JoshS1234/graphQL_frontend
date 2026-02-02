import { useQuery, useMutation } from "@apollo/client";
import { GET_ALL_USERS, GET_ALL_BOOKS } from "./graphql/queries";
import {
  CREATE_USER,
  CREATE_BOOK,
  DELETE_USER,
  DELETE_BOOK,
} from "./graphql/mutations";
import { useState } from "react";

function App() {
  const [activeTab, setActiveTab] = useState<"users" | "books">("users");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [userId, setUserId] = useState("");

  const {
    data: usersData,
    loading: usersLoading,
    error: usersError,
  } = useQuery(GET_ALL_USERS);
  const {
    data: booksData,
    loading: booksLoading,
    error: booksError,
  } = useQuery(GET_ALL_BOOKS);

  const [createUser] = useMutation(CREATE_USER, {
    refetchQueries: [{ query: GET_ALL_USERS }],
  });
  const [createBook] = useMutation(CREATE_BOOK, {
    refetchQueries: [{ query: GET_ALL_BOOKS }, { query: GET_ALL_USERS }],
  });
  const [deleteUser] = useMutation(DELETE_USER, {
    refetchQueries: [{ query: GET_ALL_USERS }, { query: GET_ALL_BOOKS }],
  });
  const [deleteBook] = useMutation(DELETE_BOOK, {
    refetchQueries: [{ query: GET_ALL_BOOKS }, { query: GET_ALL_USERS }],
  });

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    await createUser({ variables: { name: name.trim(), email: email.trim() } });
    setName("");
    setEmail("");
  };

  const handleCreateBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !author.trim() || !userId.trim()) return;
    await createBook({
      variables: { title: title.trim(), author: author.trim(), userId },
    });
    setTitle("");
    setAuthor("");
    setUserId("");
  };

  const users = usersData?.getAllUsers ?? [];
  const books = booksData?.getAllBooks ?? [];

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>GraphQL App</h1>
        <nav style={styles.nav}>
          <button
            style={{
              ...styles.tab,
              ...(activeTab === "users" ? styles.tabActive : {}),
            }}
            onClick={() => setActiveTab("users")}
          >
            Users
          </button>
          <button
            style={{
              ...styles.tab,
              ...(activeTab === "books" ? styles.tabActive : {}),
            }}
            onClick={() => setActiveTab("books")}
          >
            Books
          </button>
        </nav>
      </header>

      <main style={styles.main}>
        {activeTab === "users" && (
          <section style={styles.section}>
            <h2>Users</h2>
            <form onSubmit={handleCreateUser} style={styles.form}>
              <input
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={styles.input}
              />
              <input
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
              />
              <button type="submit" style={styles.button}>
                Add User
              </button>
            </form>
            {usersLoading ? (
              <p>Loading...</p>
            ) : usersError ? (
              <p style={styles.error}>Error: {usersError.message}</p>
            ) : (
              <ul style={styles.list}>
                {users.map(
                  (u: {
                    id: string;
                    name: string;
                    email: string;
                    books: { id: string; title: string }[];
                  }) => (
                    <li key={u.id} style={styles.listItem}>
                      <div>
                        <strong>{u.name}</strong> — {u.email}
                        {u.books?.length > 0 && (
                          <span style={styles.badge}>
                            {" "}
                            {u.books.length} book(s)
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => deleteUser({ variables: { id: u.id } })}
                        style={styles.deleteBtn}
                        title="Delete user"
                      >
                        ×
                      </button>
                    </li>
                  )
                )}
              </ul>
            )}
          </section>
        )}

        {activeTab === "books" && (
          <section style={styles.section}>
            <h2>Books</h2>
            <form onSubmit={handleCreateBook} style={styles.form}>
              <input
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={styles.input}
              />
              <input
                placeholder="Author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                style={styles.input}
              />
              <select
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                style={styles.select}
                required
              >
                <option value="">Select user</option>
                {users.map((u: { id: string; name: string }) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
              <button type="submit" style={styles.button} disabled={!userId}>
                Add Book
              </button>
            </form>
            {booksLoading ? (
              <p>Loading...</p>
            ) : booksError ? (
              <p style={styles.error}>Error: {booksError.message}</p>
            ) : (
              <ul style={styles.list}>
                {books.map(
                  (b: {
                    id: string;
                    title: string;
                    author: string;
                    user?: { name: string };
                  }) => (
                    <li key={b.id} style={styles.listItem}>
                      <div>
                        <strong>{b.title}</strong> by {b.author}
                        {b.user && (
                          <span style={styles.badge}> — {b.user.name}</span>
                        )}
                      </div>
                      <button
                        onClick={() => deleteBook({ variables: { id: b.id } })}
                        style={styles.deleteBtn}
                        title="Delete book"
                      >
                        ×
                      </button>
                    </li>
                  )
                )}
              </ul>
            )}
          </section>
        )}
      </main>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { maxWidth: 600, margin: "0 auto", padding: 24 },
  header: { marginBottom: 32 },
  title: { margin: 0, fontSize: 28 },
  nav: { display: "flex", gap: 8, marginTop: 16 },
  tab: {
    padding: "8px 16px",
    background: "#2d3139",
    border: "none",
    borderRadius: 8,
    color: "#e4e6eb",
    cursor: "pointer",
  },
  tabActive: { background: "#4a90d9", color: "#fff" },
  main: {},
  section: {},
  form: { display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 },
  input: {
    padding: 12,
    borderRadius: 8,
    border: "1px solid #3d424a",
    background: "#252830",
    color: "#e4e6eb",
    fontSize: 16,
  },
  select: {
    padding: 12,
    borderRadius: 8,
    border: "1px solid #3d424a",
    background: "#252830",
    color: "#e4e6eb",
    fontSize: 16,
  },
  button: {
    padding: 12,
    borderRadius: 8,
    border: "none",
    background: "#4a90d9",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 600,
  },
  list: { listStyle: "none", padding: 0, margin: 0 },
  listItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    background: "#252830",
    borderRadius: 8,
    marginBottom: 8,
  },
  badge: { color: "#9ca3af", fontWeight: 400 },
  deleteBtn: {
    background: "#dc3545",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    width: 32,
    height: 32,
    cursor: "pointer",
    fontSize: 18,
    lineHeight: 1,
  },
  error: { color: "#f87171" },
};

export default App;
