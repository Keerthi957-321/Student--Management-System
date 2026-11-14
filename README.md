# Student Management REST API

A simple REST API built with **Node.js** and **Express.js** to manage student records (ID, Name, Department, Semester). Data is stored in an in-memory array, so it resets whenever the server restarts.

## Features
- Full CRUD operations on students
- Express Router for modular routing
- JSON body parsing middleware
- Input validation (missing/invalid fields)
- Proper HTTP status codes (200, 201, 400, 404)
- Centralized error-handling middleware
- Search students by department

## Project Structure
```
student-management-api/
├── routes/
│   └── students.js
├── server.js
├── package.json
├── .gitignore
└── README.md
```

## Prerequisites
- [Node.js](https://nodejs.org/) v18 or later
- Postman or Thunder Client (VS Code extension) for testing

## How to Run
```bash
# 1. Clone the repository
git clone <your-repo-url>
cd student-management-api

# 2. Install dependencies
npm install

# 3. Start the server
npm start
```
The server runs at **http://localhost:3000** (set the `PORT` environment variable to change it).

## API Endpoints

| Method | Endpoint                       | Description                    | Success Code |
|--------|--------------------------------|--------------------------------|--------------|
| GET    | `/students`                    | Get all students               | 200          |
| GET    | `/students?department=CSE`     | Filter students by department  | 200          |
| GET    | `/students/:id`                | Get a student by ID            | 200          |
| POST   | `/students`                    | Add a new student              | 201          |
| PUT    | `/students/:id`                | Update a student               | 200          |
| DELETE | `/students/:id`                | Delete a student               | 200          |

Error codes: `400` for invalid input or ID, `404` for student/route not found, `500` for unexpected server errors.

### Request Body (POST and PUT)
```json
{
  "name": "Meera Kamath",
  "department": "Information Science",
  "semester": 4
}
```
Rules: `name` and `department` must be non-empty strings; `semester` must be an integer from 1 to 8. The `id` is generated automatically.

## Testing with Postman / Thunder Client

1. **Get all students** – `GET http://localhost:3000/students`
2. **Get one student** – `GET http://localhost:3000/students/1`
3. **Add a student** – `POST http://localhost:3000/students`
   Body → raw → JSON → paste the sample body above. Expect `201 Created`.
4. **Update a student** – `PUT http://localhost:3000/students/1` with a JSON body. Expect `200 OK`.
5. **Delete a student** – `DELETE http://localhost:3000/students/1`. Expect `200 OK`.
6. **Search by department** – `GET http://localhost:3000/students?department=Computer Science`

### Error cases to try
- `GET /students/999` → `404 Not Found`
- `GET /students/abc` → `400 Bad Request`
- `POST /students` with `{ "name": "" }` → `400` with a list of validation errors
- `POST /students` with `"semester": 12` → `400`
- `POST /students` with malformed JSON → `400 Invalid JSON`
- `GET /unknown` → `404 Route not found`

## Sample Response
```json
{
  "success": true,
  "message": "Student added successfully",
  "data": { "id": 4, "name": "Meera Kamath", "department": "Information Science", "semester": 4 }
}
```

## Author
Your Name – Week 07 Web Development Task
