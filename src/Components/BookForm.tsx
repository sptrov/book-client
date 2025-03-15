import { useState } from "react";
import { useBooksClient } from "../api/BooksClient";

interface BookFormProps {
  onClose: () => void;
}

function BookForm({ onClose }: BookFormProps) {
  const booksClient = useBooksClient();
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    publicationDate: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(false);
    setMessage("");

    try {
      const result = await booksClient.createBook(formData);

      if (result && result.error) {
        setMessage(result.error);
        setError(true);
        return;
      }
      setMessage(" Book added successfully!");
      setFormData({ title: "", author: "", publicationDate: "" });
    } catch {
      setMessage("Failed to add book.");
    }
    setTimeout(() => {
      onClose();
    }, 500);
  };

  return (
    <div className="form-container">
      <h2>Add a New Book</h2>
      {message && <p className={error ? "error" : "message"}>{message}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="author"
          placeholder="Author"
          value={formData.author}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="publicationDate"
          value={formData.publicationDate}
          onChange={handleChange}
          required
        />
        <div className="button-container">
          {" "}
          <button type="submit">Add Book</button>
          <button onClick={onClose} type="submit">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default BookForm;
