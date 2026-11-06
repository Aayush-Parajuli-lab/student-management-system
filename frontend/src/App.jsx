import { useEffect, useState } from "react";
import "./App.css";

const API = "http://localhost:8000";
const emptyForm = { name: "", email: "", course: "", age: "" };

export default function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadStudents = async () => {
    setLoading(true);
    try {
      const url = search
        ? `${API}/students?q=${encodeURIComponent(search)}`
        : `${API}/students`;
      const res = await fetch(url);
      if (!res.ok) throw new Error();
      setStudents(await res.json());
      setError("");
    } catch {
      setError("Could not reach the server. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(loadStudents, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const url = editingId ? `${API}/students/${editingId}` : `${API}/students`;
      const res = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          age: form.age ? Number(form.age) : null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(typeof data.detail === "string" ? data.detail : "Invalid input");
        return;
      }

      resetForm();
      loadStudents();
    } catch {
      setError("Could not reach the server. Is the backend running?");
    }
  };

  const handleEdit = (s) => {
    setEditingId(s.id);
    setForm({
      name: s.name,
      email: s.email,
      course: s.course ?? "",
      age: s.age ?? "",
    });
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this student?")) return;
    try {
      const res = await fetch(`${API}/students/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      if (editingId === id) resetForm();
      loadStudents();
    } catch {
      setError("Could not delete student");
    }
  };

  return (
    <div className="container">
      <h1>🎓 Student Management System</h1>

      <form className="card form" onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input name="course" placeholder="Course" value={form.course} onChange={handleChange} />
        <input name="age" type="number" min="1" placeholder="Age" value={form.age} onChange={handleChange} />
        <div className="actions">
          <button type="submit">{editingId ? "Update Student" : "Add Student"}</button>
          {editingId && (
            <button type="button" className="secondary" onClick={resetForm}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="card">
        <input
          type="search"
          placeholder="Search by name or course..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {error && <div className="error">{error}</div>}

      <div className="card table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Course</th>
              <th>Age</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="status">Loading...</td>
              </tr>
            ) : students.length === 0 ? (
              <tr>
                <td colSpan="6" className="status">No students found</td>
              </tr>
            ) : (
              students.map((s) => (
                <tr key={s.id}>
                  <td>{s.id}</td>
                  <td>{s.name}</td>
                  <td>{s.email}</td>
                  <td>{s.course}</td>
                  <td>{s.age}</td>
                  <td>
                    <div className="row-actions">
                      <button className="secondary" onClick={() => handleEdit(s)}>Edit</button>
                      <button className="danger" onClick={() => handleDelete(s.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
