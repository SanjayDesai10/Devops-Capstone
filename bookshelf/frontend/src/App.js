import React, { useState, useEffect, useCallback } from "react";
import "./App.css";

const API_BASE = "/api/books";

/* ─── Helper ─── */
const starString = (n) => (n ? "★".repeat(n) + "☆".repeat(5 - n) : "");

/* ─── Main App ─── */
function App() {
  const [books, setBooks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [toast, setToast] = useState(null);
  const [form, setForm] = useState({
    title: "",
    author: "",
    genre: "",
    status: "wishlist",
    rating: "",
  });

  /* --- Fetch books --- */
  const fetchBooks = useCallback(async () => {
    try {
      const url = filter === "all" ? API_BASE + "/" : `${API_BASE}/?status=${filter}`;
      const res = await fetch(url);
      const data = await res.json();
      setBooks(data);
    } catch (err) {
      console.error("Failed to fetch books:", err);
    }
  }, [filter]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  /* --- Toast --- */
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  /* --- Modal open/close --- */
  const openAdd = () => {
    setEditing(null);
    setForm({ title: "", author: "", genre: "", status: "wishlist", rating: "" });
    setShowModal(true);
  };

  const openEdit = (book) => {
    setEditing(book);
    setForm({
      title: book.title,
      author: book.author,
      genre: book.genre || "",
      status: book.status,
      rating: book.rating || "",
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditing(null);
  };

  /* --- Save (create or update) --- */
  const handleSave = async (e) => {
    e.preventDefault();
    const payload = {
      title: form.title,
      author: form.author,
      genre: form.genre || null,
      status: form.status,
      rating: form.rating ? parseInt(form.rating, 10) : null,
    };

    try {
      if (editing) {
        await fetch(`${API_BASE}/${editing.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        showToast("📖 Book updated!");
      } else {
        await fetch(API_BASE + "/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        showToast("📚 Book added!");
      }
      closeModal();
      fetchBooks();
    } catch (err) {
      console.error("Save failed:", err);
    }
  };

  /* --- Delete --- */
  const handleDelete = async (id) => {
    if (!window.confirm("Remove this book?")) return;
    try {
      await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
      showToast("🗑️ Book removed");
      fetchBooks();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  /* --- Stats --- */
  const allBooks = books;
  const stats = {
    total: allBooks.length,
    reading: allBooks.filter((b) => b.status === "reading").length,
    completed: allBooks.filter((b) => b.status === "completed").length,
    wishlist: allBooks.filter((b) => b.status === "wishlist").length,
  };

  const filters = ["all", "reading", "completed", "wishlist"];

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <h1>📚 BookShelf</h1>
        <p>Your personal book collection manager</p>
      </header>

      {/* Stats */}
      <div className="status-bar">
        <div className="stat-card">
          <div className="label">Total</div>
          <div className="value">{stats.total}</div>
        </div>
        <div className="stat-card">
          <div className="label">Reading</div>
          <div className="value">{stats.reading}</div>
        </div>
        <div className="stat-card">
          <div className="label">Completed</div>
          <div className="value">{stats.completed}</div>
        </div>
        <div className="stat-card">
          <div className="label">Wishlist</div>
          <div className="value">{stats.wishlist}</div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="toolbar">
        <div className="filter-tabs">
          {filters.map((f) => (
            <button
              key={f}
              className={`filter-tab ${filter === f ? "active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <button className="btn-add" id="btn-add-book" onClick={openAdd}>
          + Add Book
        </button>
      </div>

      {/* Book Grid */}
      {books.length === 0 ? (
        <div className="empty-state">
          <div className="icon">📖</div>
          <p>No books yet. Add your first book!</p>
        </div>
      ) : (
        <div className="book-grid">
          {books.map((book) => (
            <div key={book.id} className="book-card">
              <div className="book-card-header">
                <h3>{book.title}</h3>
                <span className={`status-badge ${book.status}`}>{book.status}</span>
              </div>
              <div className="author">by {book.author}</div>
              <div className="meta">
                {book.genre && <span>🏷️ {book.genre}</span>}
                {book.rating && <span className="stars">{starString(book.rating)}</span>}
              </div>
              <div className="book-card-actions">
                <button className="btn-edit" onClick={() => openEdit(book)}>
                  ✏️ Edit
                </button>
                <button className="btn-delete" onClick={() => handleDelete(book.id)}>
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{editing ? "Edit Book" : "Add New Book"}</h2>
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                  id="title"
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. The Great Gatsby"
                />
              </div>
              <div className="form-group">
                <label htmlFor="author">Author</label>
                <input
                  id="author"
                  type="text"
                  required
                  value={form.author}
                  onChange={(e) => setForm({ ...form, author: e.target.value })}
                  placeholder="e.g. F. Scott Fitzgerald"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="genre">Genre</label>
                  <input
                    id="genre"
                    type="text"
                    value={form.genre}
                    onChange={(e) => setForm({ ...form, genre: e.target.value })}
                    placeholder="e.g. Fiction"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="rating">Rating (1-5)</label>
                  <select
                    id="rating"
                    value={form.rating}
                    onChange={(e) => setForm({ ...form, rating: e.target.value })}
                  >
                    <option value="">No rating</option>
                    <option value="1">⭐</option>
                    <option value="2">⭐⭐</option>
                    <option value="3">⭐⭐⭐</option>
                    <option value="4">⭐⭐⭐⭐</option>
                    <option value="5">⭐⭐⭐⭐⭐</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  <option value="wishlist">📋 Wishlist</option>
                  <option value="reading">📖 Reading</option>
                  <option value="completed">✅ Completed</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn-save">
                  {editing ? "Update" : "Add Book"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

export default App;
