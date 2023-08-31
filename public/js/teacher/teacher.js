//load initial data
(async () => {
    const id = window.location.href.split('/').pop(),
        response = await fetch(`/teacher/getData/${id}`),
        teacher = await response.json();
        console.log(teacher)

    document.getElementById('name').textContent = teacher.name;

    //load class buttons
    teacher.classes.forEach(classe => {
        createClassButton(classe.number)
    });

})()

const studentTable = new Table('studentTable')
const examTable = new Table('examsTable')
document.getElementById('studentTableDiv').appendChild(studentTable.table)
document.getElementById('examsTableDiv').appendChild(examTable.table)

async function getClassData(classNumber) {
    const response = await fetch(`/teacher/getClassData/${classNumber}`),
        data = await response.json();
        console.log(data)
    localStorage.setItem('classSelected', JSON.stringify(data))
    return data
}

function createClassButton(classNumber) {
    const classButtons = document.getElementById('classButtons');
    const button = document.createElement('button');
    button.id = classNumber;
    button.classList.add('classButton', 'btn-sm', 'btn', 'btn-outline-primary', 'mx-1');
    button.textContent = classNumber;
    classButtons.appendChild(button);
    button.addEventListener('click', () => {
        selectClass(classNumber)
    });
}

function updateClassButtons(classNumber) {
    const classButtons = document.querySelectorAll('.classButton');
    classButtons.forEach(button => {
        button.classList.toggle('btn-primary', button.id == classNumber);
        button.classList.toggle('btn-outline-primary', button.id != classNumber);
    });
}

async function selectClass(classNumber) {
    studentTable.clear()
    examTable.clear()
    studentTable.setHeader('Nome', 'Faltas', 'Nota')
    examTable.setHeader('Titulo', 'Valor', 'Atribuir valor')

    const classSelected = await getClassData(classNumber)
    updateClassButtons(classNumber)
    document.getElementById('createExam').dataset.classNumber = classNumber

    classSelected.students.forEach(student => {
        studentTable.addRow({ text: student.user.name, class: 'studentName' }, student.absences, student.grade)
    });

    classSelected.exams.forEach(exam => {
        examTable.addRow(
            exam.title,
            exam.grade,
            `<button class="btn btn-warning" onclick="updateStudentTable('${exam.id}', '${exam.title}', ${exam.grade})">+</button>`
        )
    })
}

function updateStudentTable(id, title, grade) {
    studentTable.clear()
    const data = JSON.parse(localStorage.getItem('classSelected')),
        students = data.students

    studentTable.setHeader(`Nome`, `Atribuir nota para ${title}`)
    for (const student of students) {
        const exam = student.student_exams.find(obj => obj.examId == id)
        studentTable.addRow(
            student.name,
            createInput(grade, exam).outerHTML
        )
    }
    studentTable.setFoot(
        `<button class="btn btn-danger w-100" onclick="selectClass(${data.number})">Cancelar</button>`,
        `<button id="saveGradeBtn" class="btn btn-success w-100">Salvar</button>`
    )

    document.getElementById('saveGradeBtn').addEventListener('click', async () => { await saveStudentGrade(data.number) })
}

function createInput(grade, exam) {
    const input = document.createElement('input');
    input.type = 'number';
    input.classList.add('form-control');
    input.min = 0;
    input.max = grade;
    input.setAttribute('value', exam.studentGrade)
    input.dataset.studentId = exam.studentId;
    input.dataset.examId = exam.examId;
    return input;
}

async function createExam() {
    try {
        const title = document.getElementById('newExamName').value
        const grade = document.getElementById('newExamGrade').value
        const classNumber = document.getElementById('createExam').dataset.classNumber
        await fetch('/teacher/createExam', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ title, grade, classNumber })
        })
    } catch (error) {
        console.log(error)
    }
}

async function saveStudentGrade(classNumber) {
    try {
        const inputs = studentTable.body.querySelectorAll('input'),
            data = []

        inputs.forEach(input => {
            data.push({ studentId: input.dataset.studentId, examId: input.dataset.examId, grade: input.value })
        })
        const request = await fetch('/teacher/setExameGradeToStudent', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ data })
        })
        if (request) {
            setTimeout(() => {
                selectClass(classNumber)
            }, 100)
        } else {
            console.log('não funcionou')
        }
    } catch (error) {
        console.error(error)
    }
}