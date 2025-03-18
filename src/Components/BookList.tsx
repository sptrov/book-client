import { IBook } from "../types/types";

interface BooksListProps {
  books: IBook[];
}

const BookList = ({ books }: BooksListProps) => {
  return (
    <div className="book-list">
      {books.map((book) => (
        <div key={book._id} className="book-item">
          <div className="book-details">
            <h2>{book.title}</h2>
            <p>by {book.author}</p>
          </div>
          <span className="release-date">
            {" "}
            {new Date(book.publicationDate).toDateString()}
          </span>
        </div>
      ))}
    </div>
  );
};

export default BookList;
