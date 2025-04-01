import { useState } from "react";
import BookSearch from "./Components/BookSearch";
import BookForm from "./Components/BookForm";

function App() {
  const [showForm, setShowForm] = useState(false);
  return (
    <>
      <button onClick={() => setShowForm(!showForm)} className="addButton">
        Add new
      </button>
      {!showForm && <BookSearch />}
      {showForm && <BookForm onClose={() => setShowForm(false)} />}
    </>
  );
}

export default App;
