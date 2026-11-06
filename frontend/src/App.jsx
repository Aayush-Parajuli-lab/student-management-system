import { useEffect, useState } from "react";

const API = "http://localhost:8000";
const emptyForm = { name: "", email: "", course: "", age: "" };

export default function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const loadStudents = () => {
    fetch(`${API}/students`)
      .then((res) => res.json())
      .then(setStudents)
      .catch(() => setError("Could not load students"));
  };

  useEffect(loadStudents, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const res = await fetch(`${API}/students`, {
      method: "POST",
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

    setForm(emptyForm);
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
        <button type="submit">Add Student</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <table border="1" cellPadding="8" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Course</th>
            <th>Age</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s.id}>
              <td>{s.id}</td>
              <td>{s.name}</td>
              <td>{s.email}</td>
              <td>{s.course}</td>
              <td>{s.age}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
