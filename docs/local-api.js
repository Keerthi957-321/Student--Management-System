// In-browser version of the Student API. It mirrors the Express routes
// (same validation, IDs and error messages) and stores data in localStorage.
// Used automatically when the Express server is not reachable (e.g. GitHub Pages).
(function (root) {
  const KEY = 'student-mgmt-demo-v1';
  let state = null;

  const seed = () => ({
    nextId: 4,
    students: [
      { id: 1, name: 'Aarav Shetty', department: 'Computer Science', semester: 3 },
      { id: 2, name: 'Diya Rao', department: 'Electronics', semester: 5 },
      { id: 3, name: 'Karthik Nayak', department: 'Computer Science', semester: 1 }
    ]
  });

  function storage() {
    try { return typeof localStorage !== 'undefined' ? localStorage : null; } catch (e) { return null; }
  }

  function load() {
    if (state) return state;
    const store = storage();
    if (store) {
      try {
        const raw = store.getItem(KEY);
        if (raw) { state = JSON.parse(raw); return state; }
      } catch (e) { /* fall through to seed data */ }
    }
    state = seed();
    return state;
  }

  function save() {
    const store = storage();
    if (store) {
      try { store.setItem(KEY, JSON.stringify(state)); } catch (e) { /* storage blocked */ }
    }
  }

  function reset() {
    state = seed();
    save();
  }

  function validate(body) {
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

  function parseId(value) {
    const id = Number(value);
    return Number.isInteger(id) && id > 0 ? id : null;
  }

  // request('/students?department=X', { method, body }) -> response object, or throws Error(message)
  function request(path, options) {
    options = options || {};
    const method = (options.method || 'GET').toUpperCase();
    const [pathname, query = ''] = path.split('?');
    const parts = pathname.split('/').filter(Boolean);
    const params = new URLSearchParams(query);

    let body;
    if (options.body) {
      try { body = JSON.parse(options.body); } catch (e) { throw new Error('Invalid JSON in request body'); }
    }

    if (parts[0] !== 'students' || parts.length > 2) throw new Error('Route not found');
    const st = load();

    // /students
    if (parts.length === 1) {
      if (method === 'GET') {
        const dept = params.get('department');
        let result = st.students;
        if (dept) result = result.filter((s) => s.department.toLowerCase() === dept.trim().toLowerCase());
        return { success: true, count: result.length, data: result.map((s) => ({ ...s })) };
      }
      if (method === 'POST') {
        const errors = validate(body);
        if (errors.length) throw new Error(errors.join('\n'));
        const student = {
          id: st.nextId++,
          name: body.name.trim(),
          department: body.department.trim(),
          semester: body.semester
        };
        st.students.push(student);
        save();
        return { success: true, message: 'Student added successfully', data: { ...student } };
      }
      throw new Error('Route not found');
    }

    // /students/:id
    const id = parseId(parts[1]);
    if (id === null) throw new Error('ID must be a positive integer');
    const index = st.students.findIndex((s) => s.id === id);
    if (index === -1) throw new Error(`Student with id ${id} not found`);

    if (method === 'GET') return { success: true, data: { ...st.students[index] } };

    if (method === 'PUT') {
      const errors = validate(body);
      if (errors.length) throw new Error(errors.join('\n'));
      const s = st.students[index];
      s.name = body.name.trim();
      s.department = body.department.trim();
      s.semester = body.semester;
      save();
      return { success: true, message: 'Student updated successfully', data: { ...s } };
    }

    if (method === 'DELETE') {
      const [deleted] = st.students.splice(index, 1);
      save();
      return { success: true, message: 'Student deleted successfully', data: deleted };
    }

    throw new Error('Route not found');
  }

  const api = { request, reset };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.LocalAPI = api;
})(typeof window !== 'undefined' ? window : globalThis);
