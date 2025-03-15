import { useState, useEffect, useContext, useMemo, useCallback } from "react";
import { ServerKeyContext } from "../main.tsx";
import { decryptData } from "../utils/utils.ts";
import { useBooksClient } from "../api/BooksClient.ts";
import { IBook } from "../types/types.ts";

function BookSearch() {
  const { searchBooks } = useBooksClient();
  const [search, setSearch] = useState("");
  const [books, setBooks] = useState<Array<IBook> | []>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { privateKey } = useContext(ServerKeyContext);

  useEffect(() => {
    if (search.trim() === "") {
      setBooks([]);
      return;
    }

    const fetchBooks = async () => {
      setError("");

      try {
        const data = await searchBooks(search);
        if (data && data.error) {
          setError("Failed to fetch books.");
          setLoading(false);
          setBooks([]);
          return;
        }
        const books: Array<IBook> = await decryptData(
          data.encryptedData ?? "",
          privateKey ?? "",
          data.encryptedKey ?? "",
          data.authTag
        );

        setBooks(books);
      } catch (err) {
        console.log(err);
        setError("Failed to fetch books.");
      }

      setLoading(false);
    };

    // Add delay before making request to reduce API calls (Debounce effect)
    setLoading(true);
    const timeoutId = setTimeout(fetchBooks, 500);
    return () => clearTimeout(timeoutId);
  }, [search, privateKey, searchBooks]);

  return (
    <>
      <div className="container">
        <h2>Search Books</h2>

        <input
          type="text"
          placeholder="Search for books..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />

        {loading && <p>Loading...</p>}
        {error && <p className="error">{error}</p>}

        <ul className="book-list">
          {books.length === 0 && !loading && search && <p>No results found.</p>}
          {books.map((book) => (
            <li key={book._id}>
              <strong>{book.title}</strong> by {book.author} (
              {new Date(book.publicationDate).toDateString()})
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default BookSearch;
