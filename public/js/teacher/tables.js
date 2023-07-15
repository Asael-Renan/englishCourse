const studentTable = document.getElementById('studentTable'),
    studentTableHead = studentTable.querySelector('thead'),
    studentTableBody = studentTable.querySelector('tbody'),
    studentTableFoot = studentTable.querySelector('tfoot');

const examsTable = document.getElementById('examsTable'),
    examsTableHead = examsTable.querySelector('thead'),
    examsTableBody = examsTable.querySelector('tbody'),
    examsTableFoot = examsTable.querySelector('tfoot');


function clearStudentTable() {
    // studentTableHead.innerHTML = '';
    studentTableBody.innerHTML = '';
    studentTableFoot.innerHTML = '';
}
function clearExamsTable() {
    // examsTableHead.innerHTML = '';
    examsTableBody.innerHTML = '';
    examsTableFoot.innerHTML = '';
}

function addRowInExamsTable(id, title, grade) {
    const tr = document.createElement('tr');
    const tdTitle = document.createElement('td');
    const tdGrade = document.createElement('td');
    const tdButton = document.createElement('td');
    const button = document.createElement('button');

    tdTitle.textContent = title;
    tdGrade.textContent = grade;
    button.textContent = '+';
    button.classList.add('btn-sm', 'btn', 'btn-warning');
    button.addEventListener('click', () => { addRowInStudentTableForExam(id, title, grade) });

    tr.appendChild(tdTitle);
    tr.appendChild(tdGrade);
    tdButton.appendChild(button);
    tr.appendChild(tdButton);

    examsTableBody.appendChild(tr);
}

function addRowInStudentTable(name, absences, grade) {
    const tr = document.createElement('tr');
    const tdName = document.createElement('td');
    const tdAbsences = document.createElement('td');
    const tdGrade = document.createElement('td');

    tdName.textContent = name;
    tdName.className = 'studentName'
    tdAbsences.textContent = absences;
    tdGrade.textContent = grade;

    tr.appendChild(tdName);
    tr.appendChild(tdAbsences);
    tr.appendChild(tdGrade);

    studentTableBody.appendChild(tr);
}

function addRowInStudentTableForExam(id, title, grade) {
    clearStudentTable()
    updateStudentTableHeader(title);
    updateStudentTableBody(id, grade);
    updateStudentTableFoot();
}

function updateStudentTableHeader(title) {
    studentTableHead.innerHTML = `<th>nome</th><th class="w-50">nota para ${title}</th>`;
}

function updateStudentTableBody(examId, grade) {
    const classData = JSON.parse(localStorage.getItem('classSelected')),
        students = classData.students

    students.forEach(student => {
        const tr = document.createElement('tr'),
            tdName = document.createElement('td'),
            tdInput = document.createElement('td'),
            input = document.createElement('input');

        tdName.textContent = student.name;
        input.type = 'number';
        input.classList.add('form-control');
        input.dataset.studentId = student.id
        input.dataset.examId = examId
        input.value = 0
        input.min = 0
        input.max = grade
        tdInput.appendChild(input);
        tr.appendChild(tdName);
        tr.appendChild(tdInput);
        studentTableBody.appendChild(tr);
    });
}

function updateStudentTableFoot() {
    const classNumber = JSON.parse(localStorage.getItem('classSelected')).number
    const tr = document.createElement('tr'),
        tdCancel = document.createElement('td'),
        tdSave = document.createElement('td'),
        buttonCancel = document.createElement('button'),
        buttonSave = document.createElement('button');

    buttonCancel.classList.add('btn', 'btn-danger', 'w-100')
    buttonSave.classList.add('btn', 'btn-success', 'w-100')
    buttonCancel.textContent = 'Cancelar'
    buttonCancel.addEventListener('click', () => loadTables(classNumber))
    buttonSave.textContent = 'Salvar'
    buttonSave.addEventListener('click', saveStudentGrade)
    tdCancel.appendChild(buttonCancel)
    tdSave.appendChild(buttonSave)
    tr.appendChild(tdCancel)
    tr.appendChild(tdSave)

    studentTableFoot.appendChild(tr)
}

async function saveStudentGrade() {
    const inputs = studentTableBody.querySelectorAll('input'),
        data = []

    inputs.forEach(input => {
        data.push({ studentId: input.dataset.studentId, examId: input.dataset.examId, grade: input.value })
    })
        fetch('/teacher/setExameGradeToStudent', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({data})
        })
    console.log(data)
}