import { useState } from "react";
import BookSearch from "./Components/BookSearch";
import BookForm from "./Components/BookForm";
// import BooksClient from "./api/BooksClient";

function App() {
  const [showForm, setShowForm] = useState(false);
  // const booksClient = new BooksClient();
  return (
    <>
      <div onClick={() => setShowForm(!showForm)} className="addButton">
        Add new
      </div>
      {!showForm && <BookSearch />}
      {showForm && (
        <BookForm
          onClose={() => setShowForm(false)}
          // booksClient={booksClient}
        />
      )}
    </>
  );
}

export default App;
