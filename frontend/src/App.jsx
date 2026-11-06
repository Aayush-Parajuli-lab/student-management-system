import { useEffect, useState } from "react";

const API = "http://localhost:8000";
const emptyForm = { name: "", email: "", course: "", age: "" };

export default function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const loadStudents = () => {
    const url = search
      ? `${API}/students?q=${encodeURIComponent(search)}`
      : `${API}/students`;
    fetch(url)
      .then((res) => res.json())
      .then(setStudents)
      .catch(() => setError("Could not load students"));
  };

  // Reload when the search text changes (waits 300ms after typing stops)
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
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this student?")) return;
    const res = await fetch(`${API}/students/${id}`, { method: "DELETE" });
    if (!res.ok) {
      setError("Could not delete student");
      return;
    }
    if (editingId === id) resetForm();
    loadStudents();
  };

  return (
    <div style={{ maxWidth: 800, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1>Student Management System</h1>

      <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input name="course" placeholder="Course" value={form.course} onChange={handleChange} />
        <input name="age" type="number" placeholder="Age" value={form.age} onChange={handleChange} />
        <button type="submit">{editingId ? "Update Student" : "Add Student"}</button>
        {editingId && (
          <button type="button" onClick={resetForm}>
            Cancel
          </button>
        )}
      </form>

      <input
        type="search"
        placeholder="Search by name or course..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ width: "100%", padding: 8, marginBottom: 16, boxSizing: "border-box" }}
      />

      {error && <p style={{ color: "red" }}>{error}</p>}

      <table border="1" cellPadding="8" style={{ width: "100%", borderCollapse: "collapse" }}>
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
          {students.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>
                No students found
              </td>
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
                  <button onClick={() => handleEdit(s)}>Edit</button>{" "}
                  <button onClick={() => handleDelete(s.id)}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
