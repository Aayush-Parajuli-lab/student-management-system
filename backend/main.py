import sqlite3
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

DB = "students.db"
app = FastAPI(title="Student Management System")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    conn = sqlite3.connect(DB)
    conn.row_factory = sqlite3.Row
    return conn


@app.on_event("startup")
def init_db():
    with get_db() as conn:
        conn.execute(
            """CREATE TABLE IF NOT EXISTS students (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                course TEXT,
                age INTEGER
            )"""
        )


class StudentIn(BaseModel):
    name: str = Field(min_length=1)
    email: str
    course: str | None = None
    age: int | None = None


@app.get("/students")
def list_students(q: str | None = None):
    with get_db() as conn:
        if q:
            rows = conn.execute(
                "SELECT * FROM students WHERE name LIKE ? OR course LIKE ?",
                (f"%{q}%", f"%{q}%"),
            ).fetchall()
        else:
            rows = conn.execute("SELECT * FROM students").fetchall()
    return [dict(r) for r in rows]


@app.post("/students", status_code=201)
def add_student(s: StudentIn):
    try:
        with get_db() as conn:
            cur = conn.execute(
                "INSERT INTO students (name, email, course, age) VALUES (?, ?, ?, ?)",
                (s.name, s.email, s.course, s.age),
            )
        return {"id": cur.lastrowid, **s.model_dump()}
    except sqlite3.IntegrityError:
        raise HTTPException(status_code=400, detail="Email already exists")


@app.put("/students/{student_id}")
def update_student(student_id: int, s: StudentIn):
    with get_db() as conn:
        cur = conn.execute(
            "UPDATE students SET name=?, email=?, course=?, age=? WHERE id=?",
            (s.name, s.email, s.course, s.age, student_id),
        )
    if cur.rowcount == 0:
        raise HTTPException(status_code=404, detail="Student not found")
    return {"id": student_id, **s.model_dump()}


@app.delete("/students/{student_id}")
def delete_student(student_id: int):
    with get_db() as conn:
        cur = conn.execute("DELETE FROM students WHERE id=?", (student_id,))
    if cur.rowcount == 0:
        raise HTTPException(status_code=404, detail="Student not found")
    return {"deleted": student_id}
