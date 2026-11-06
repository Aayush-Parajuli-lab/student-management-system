# Project Progress

Backend commands assume the server is running: `cd backend && source venv/bin/activate && uvicorn main:app --reload`
Run the test commands in a second terminal (use Git Bash on Windows).

## Backend (Python + FastAPI)

- [x] **Module 1: Setup** (venv, FastAPI installed, requirements.txt)
  - Test: `curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8000/docs`
  - Pass: prints `200`

- [x] **Module 2: Database and model** (students table, StudentIn model)
  - Test: `ls backend/students.db`
  - Pass: the file exists after starting the server

- [x] **Module 3: Add and list students**
  - Test:
    ```
    curl -X POST http://localhost:8000/students -H "Content-Type: application/json" -d '{"name":"Ram","email":"ram@test.com","course":"BCA","age":21}'
    curl http://localhost:8000/students
    ```
  - Pass: Ram appears in the list

- [x] **Module 4: Update and delete**
  - Test:
    ```
    curl -X PUT http://localhost:8000/students/1 -H "Content-Type: application/json" -d '{"name":"Ram K","email":"ram@test.com","course":"BCA","age":22}'
    curl -X DELETE http://localhost:8000/students/1
    curl -X DELETE http://localhost:8000/students/999
    ```
  - Pass: update shows the new name, delete returns `{"deleted":1}`, id 999 returns "Student not found"

- [x] **Module 5: Search and validation**
  - Test:
    ```
    curl "http://localhost:8000/students?q=BCA"
    curl -X POST http://localhost:8000/students -H "Content-Type: application/json" -d '{"name":"A","email":"dup@test.com"}'
    curl -X POST http://localhost:8000/students -H "Content-Type: application/json" -d '{"name":"B","email":"dup@test.com"}'
    ```
  - Pass: search returns matching rows, second POST returns "Email already exists"

## Frontend (React + Vite)

- [x] **Module 6: Frontend setup**
  - Test: `cd frontend && npm install && npm run dev`
  - Pass: http://localhost:5173 opens the Vite page

- [ ] **Module 7: Student list table**
  - Test: `cd frontend && npm run build`
  - Pass: build succeeds, and the browser shows students from the backend

- [ ] **Module 8: Add student form**
  - Test: add a student in the browser form
  - Pass: it appears in the table without a page reload

- [ ] **Module 9: Edit and delete buttons**
  - Test: `curl http://localhost:8000/students` after editing/deleting in the browser
  - Pass: the API data matches what the table shows

- [ ] **Module 10: Search box**
  - Test: type a name or course in the search box
  - Pass: the table filters as you type

- [ ] **Module 11: Polish** (loading, error messages, styling, confirm before delete)
  - Test: `cd frontend && npm run build`
  - Pass: build succeeds, and the page looks good on a phone-size window

## Finish

- [ ] **Module 12: README and screenshots**
  - Test: `ls README.md && grep -c "http" README.md`
  - Pass: README exists, with run instructions and 2-3 screenshots

- [ ] **Module 13: Deploy** (optional)
  - Test: `curl -s -o /dev/null -w "%{http_code}\n" YOUR_LIVE_URL`
  - Pass: prints `200`

- [ ] **Module 14: Update CV**
  - Pass: the project and GitHub link are on your CV
