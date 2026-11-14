const API = '/students';

const form = document.getElementById('student-form');
const nameInput = document.getElementById('name');
const deptInput = document.getElementById('department');
const semInput = document.getElementById('semester');
const formTitle = document.getElementById('form-title');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');
const formError = document.getElementById('form-error');
const tbody = document.getElementById('student-body');
const countEl = document.getElementById('count');
const emptyEl = document.getElementById('empty');
const filterEl = document.getElementById('filter');
const toastEl = document.getElementById('toast');

let editingId = null;
let toastTimer;

function showToast(message, isError = false) {
  toastEl.textContent = message;
  toastEl.classList.toggle('error-toast', isError);
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2500);
}

// Turn an API error response into readable text
function errorText(data) {
  if (data && Array.isArray(data.errors)) return data.errors.join('\n');
  return (data && data.error) || 'Something went wrong';
}

async function request(url, options = {}) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  const data = await res.json();
  if (!res.ok) throw new Error(errorText(data));
  return data;
}

// Fill the department dropdown from all students, keeping the current selection
async function loadDepartments() {
  const { data } = await request(API);
  const current = filterEl.value;
  const departments = [...new Set(data.map((s) => s.department))].sort();

  filterEl.innerHTML = '';
  filterEl.add(new Option('All departments', ''));
  departments.forEach((d) => filterEl.add(new Option(d, d)));
  filterEl.value = departments.includes(current) ? current : '';
}

// Load students (uses ?department= when a filter is chosen)
async function loadStudents() {
  try {
    const dept = filterEl.value;
    const url = dept ? `${API}?department=${encodeURIComponent(dept)}` : API;
    const { data, count } = await request(url);
    renderTable(data, count);
  } catch (err) {
    showToast(err.message, true);
  }
}

function renderTable(students, count) {
  tbody.innerHTML = '';
  countEl.textContent = count;
  emptyEl.hidden = students.length > 0;

  students.forEach((s) => {
    const tr = document.createElement('tr');

    [s.id, s.name, s.department, s.semester].forEach((value) => {
      const td = document.createElement('td');
      td.textContent = value; // textContent prevents HTML injection
      tr.appendChild(td);
    });

    const actions = document.createElement('td');
    actions.className = 'row-actions';

    const editBtn = document.createElement('button');
    editBtn.className = 'btn small';
    editBtn.textContent = 'Edit';
    editBtn.addEventListener('click', () => startEdit(s));

    const delBtn = document.createElement('button');
    delBtn.className = 'btn small danger';
    delBtn.textContent = 'Delete';
    delBtn.addEventListener('click', () => deleteStudent(s));

    actions.append(editBtn, delBtn);
    tr.appendChild(actions);
    tbody.appendChild(tr);
  });
}

function startEdit(student) {
  editingId = student.id;
  nameInput.value = student.name;
  deptInput.value = student.department;
  semInput.value = student.semester;
  formTitle.textContent = `Edit Student #${student.id}`;
  submitBtn.textContent = 'Update Student';
  cancelBtn.hidden = false;
  formError.textContent = '';
  nameInput.focus();
}

function resetForm() {
  editingId = null;
  form.reset();
  formTitle.textContent = 'Add Student';
  submitBtn.textContent = 'Add Student';
  cancelBtn.hidden = true;
  formError.textContent = '';
}

async function deleteStudent(student) {
  if (!confirm(`Delete ${student.name}?`)) return;
  try {
    await request(`${API}/${student.id}`, { method: 'DELETE' });
    if (editingId === student.id) resetForm();
    showToast('Student deleted');
    await refresh();
  } catch (err) {
    showToast(err.message, true);
  }
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  formError.textContent = '';

  const body = {
    name: nameInput.value,
    department: deptInput.value,
    semester: semInput.value === '' ? null : Number(semInput.value)
  };

  try {
    if (editingId === null) {
      await request(API, { method: 'POST', body: JSON.stringify(body) });
      showToast('Student added');
    } else {
      await request(`${API}/${editingId}`, { method: 'PUT', body: JSON.stringify(body) });
      showToast('Student updated');
    }
    resetForm();
    await refresh();
  } catch (err) {
    formError.textContent = err.message; // server-side validation messages
  }
});

cancelBtn.addEventListener('click', resetForm);
filterEl.addEventListener('change', loadStudents);

async function refresh() {
  await loadDepartments();
  await loadStudents();
}

refresh().catch((err) => showToast(err.message, true));
