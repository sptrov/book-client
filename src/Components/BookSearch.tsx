import { useState, useEffect, useContext } from "react";
import { ServerKeyContext } from "../main.tsx";
import { decryptData } from "../utils/utils.ts";
import { useBooksClient } from "../api/BooksClient.ts";
import { IBook } from "../types/types.ts";
import BookList from "./BookList.tsx";

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

    // Add delay before making request to reduce API calls (Debounce effect) usually would use a loadash debounce function
    setLoading(true);
    const timeoutId = setTimeout(fetchBooks, 500);
    return () => clearTimeout(timeoutId);
  }, [search, privateKey, searchBooks]);

  return (
    <>
      <div className="container">
        <h1>Search Books</h1>

        <input
          type="text"
          placeholder="Search for books..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />

        {loading && <p>Loading...</p>}
        {error && !loading && <p className="error">{error}</p>}

        <BookList books={books} />
      </div>
    </>
  );
}

export default BookSearch;
