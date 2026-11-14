const express = require('express');
const router = express.Router();

// In-memory storage
let students = [
  { id: 1, name: 'Aarav Shetty', department: 'Computer Science', semester: 3 },
  { id: 2, name: 'Diya Rao', department: 'Electronics', semester: 5 },
  { id: 3, name: 'Karthik Nayak', department: 'Computer Science', semester: 1 }
];
let nextId = 4;

// Validate student body. Returns an array of error messages (empty if valid).
function validateStudent(body) {
  const errors = [];
  if (!body || typeof body !== 'object') return ['Request body is required'];

  const { name, department, semester } = body;

  if (typeof name !== 'string' || name.trim() === '') {
    errors.push('name is required and must be a non-empty string');
  }
  if (typeof department !== 'string' || department.trim() === '') {
    errors.push('department is required and must be a non-empty string');
  }
  if (!Number.isInteger(semester) || semester < 1 || semester > 8) {
    errors.push('semester is required and must be an integer between 1 and 8');
  }
  return errors;
}

// Validate :id param -> returns integer or null
function parseId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

// GET /students  (optional: ?department=Computer Science)
router.get('/', (req, res) => {
  const { department } = req.query;
  let result = students;

  if (department) {
    result = students.filter(
      (s) => s.department.toLowerCase() === String(department).trim().toLowerCase()
    );
  }
  res.status(200).json({ success: true, count: result.length, data: result });
});

// GET /students/:id
router.get('/:id', (req, res) => {
  const id = parseId(req.params.id);
  if (id === null) return res.status(400).json({ success: false, error: 'ID must be a positive integer' });

  const student = students.find((s) => s.id === id);
  if (!student) return res.status(404).json({ success: false, error: `Student with id ${id} not found` });

  res.status(200).json({ success: true, data: student });
});

// POST /students
router.post('/', (req, res) => {
  const errors = validateStudent(req.body);
  if (errors.length) return res.status(400).json({ success: false, errors });

  const { name, department, semester } = req.body;
  const student = { id: nextId++, name: name.trim(), department: department.trim(), semester };
  students.push(student);

  res.status(201).json({ success: true, message: 'Student added successfully', data: student });
});

// PUT /students/:id
router.put('/:id', (req, res) => {
  const id = parseId(req.params.id);
  if (id === null) return res.status(400).json({ success: false, error: 'ID must be a positive integer' });

  const student = students.find((s) => s.id === id);
  if (!student) return res.status(404).json({ success: false, error: `Student with id ${id} not found` });

  const errors = validateStudent(req.body);
  if (errors.length) return res.status(400).json({ success: false, errors });

  const { name, department, semester } = req.body;
  student.name = name.trim();
  student.department = department.trim();
  student.semester = semester;

  res.status(200).json({ success: true, message: 'Student updated successfully', data: student });
});

// DELETE /students/:id
router.delete('/:id', (req, res) => {
  const id = parseId(req.params.id);
  if (id === null) return res.status(400).json({ success: false, error: 'ID must be a positive integer' });

  const index = students.findIndex((s) => s.id === id);
  if (index === -1) return res.status(404).json({ success: false, error: `Student with id ${id} not found` });

  const [deleted] = students.splice(index, 1);
  res.status(200).json({ success: true, message: 'Student deleted successfully', data: deleted });
});

module.exports = router;
