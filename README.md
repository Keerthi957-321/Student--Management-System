# Student Management System (REST API + Frontend)

A Student Management app built with **Node.js and Express.js** (REST API) and a plain **HTML/CSS/JavaScript** frontend. Student data (ID, Name, Department, Semester) is stored in an array.

**Live demo (GitHub Pages):** https://keerthi957-321.github.io/Student--Management-System/

## Features
- Full CRUD REST API with Express Router
- JSON body parsing middleware
- Input validation, proper status codes (200, 201, 400, 404) and error-handling middleware
- Search/filter students by department (`GET /students?department=...`)
- Interactive frontend: view, add, edit, delete and filter students

## Two ways the frontend runs
| Where | Backend used | Data |
|-------|--------------|------|
| `npm start` → http://localhost:3000 | Express API | In-memory array on the server |
| GitHub Pages (static hosting) | Built-in browser version of the same API (`docs/local-api.js`) | Saved in your browser (localStorage) |

GitHub Pages can only host static files, so it cannot run the Node server. The frontend detects this automatically and switches to demo mode. A badge at the top shows which mode is active. To use a real hosted backend instead, deploy the Express server (e.g. on Render) and set its URL in `docs/config.js`.

## Project Structure
```
student-management-api/
├── docs/                 # Frontend (also served by GitHub Pages)
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   ├── local-api.js
│   └── config.js
├── routes/
│   └── students.js
├── server.js
├── package.json
├── .gitignore
└── README.md
```

## How to Run Locally
Requires [Node.js](https://nodejs.org/) v18 or later.
```bash
git clone https://github.com/Keerthi957-321/Student--Management-System.git
cd Student--Management-System
npm install
npm start
```
Open **http://localhost:3000** for the frontend, or call the API directly at `http://localhost:3000/students`. Set the `PORT` environment variable to change the port.

## Publish on GitHub Pages
1. Push the project to GitHub.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, select branch **main** and folder **/docs**, then click **Save**.
4. After a minute, the site is live at `https://<your-username>.github.io/<repo-name>/`.

## API Endpoints

| Method | Endpoint                          | Description                    | Success Code |
|--------|-----------------------------------|--------------------------------|--------------|
| GET    | `/students`                       | Get all students               | 200          |
| GET    | `/students?department=Electronics`| Filter by department           | 200          |
| GET    | `/students/:id`                   | Get a student by ID            | 200          |
| POST   | `/students`                       | Add a new student              | 201          |
| PUT    | `/students/:id`                   | Update a student               | 200          |
| DELETE | `/students/:id`                   | Delete a student               | 200          |

Error codes: `400` invalid input or ID, `404` student/route not found, `500` server error.

### Request body (POST and PUT)
```json
{ "name": "Meera Kamath", "department": "Information Science", "semester": 4 }
```
`name` and `department` must be non-empty strings; `semester` must be an integer from 1 to 8. The `id` is generated automatically.

## Testing with Postman / Thunder Client
Start the server with `npm start`, then:
1. `GET http://localhost:3000/students` → all students (200)
2. `GET http://localhost:3000/students/1` → one student (200)
3. `POST http://localhost:3000/students` with the JSON body above → 201
4. `PUT http://localhost:3000/students/1` with a JSON body → 200
5. `DELETE http://localhost:3000/students/1` → 200
6. `GET http://localhost:3000/students?department=Computer Science` → filtered list

Error cases: `GET /students/999` → 404, `GET /students/abc` → 400, `POST` with `{ "name": "" }` → 400, `"semester": 12` → 400, malformed JSON → 400.

## Author
Keerthi – Week 07 Web Development Task
