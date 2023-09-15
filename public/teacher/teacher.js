import Table from "../js/table.js";
import httpRequests from "../js/httpRequests.js";

//load initial data
(async () => {
    const id = window.location.href.split('/').pop(),
        response = await fetch(`/teacher/getData/${id}`),
        teacher = await response.json();

    document.getElementById('name').textContent = teacher.name;

    //load class buttons
    teacher.classes.forEach(classe => {
        createClassButton(classe.number)
    });

})()

const http = new httpRequests()
const studentTable = new Table('studentTable')
const examTable = new Table('examsTable')
document.getElementById('studentTableDiv').appendChild(studentTable.table)
document.getElementById('examsTableDiv').appendChild(examTable.table)

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
    document.getElementById('createExamForm').style.display = 'flex'
    studentTable.clear()
    examTable.clear()
    studentTable.setHeader('Nome', 'Faltas', 'Nota')
    examTable.setHeader('Titulo', 'Valor', 'Atribuir valor')

    const classSelected = await http.getClassData(classNumber)
    updateClassButtons(classNumber)
    document.getElementById('createExam').dataset.classNumber = classNumber

    classSelected.students.forEach(student => {
        studentTable.addRow({ text: student.user.name, class: 'studentName' },
            `<button id="removAbsence" class="btn btn-danger btn-sm me-1">-</button>${student.absences}<button id="addAbsence" class="btn btn-success btn-sm ms-1">+</button>`,
            student.grade)
    });

    classSelected.exams.forEach(exam => {
        const button = document.createElement("button");
        button.classList.add("btn", "btn-warning");
        button.textContent = "+";
        button.id = "updateButton";

        const buttonElement = {
            text: button.outerHTML,
            clickable: { func: updateStudentTable, params: { id: exam.id, title: exam.title, grade: exam.grade } }
        };

        examTable.addRow(
            exam.title,
            exam.grade,
            buttonElement
        );
    });
}

function updateStudentTable({ id, title, grade }) {
    studentTable.clear()
    const data = JSON.parse(localStorage.getItem('classSelected')),
        students = data.students

    studentTable.setHeader(`Nome`, `Atribuir nota para ${title}`)
    for (const student of students) {
        const exam = student.student_exams.find(obj => obj.examId == id)
        studentTable.addRow(
            student.user.name,
            createInput(grade, exam).outerHTML
        )
    }
    studentTable.setFoot(
        `<button id="cancelSaveGrade" class="btn btn-danger w-100">Cancelar</button>`,
        `<button id="saveGradeBtn" class="btn btn-success w-100">Salvar</button>`
    )

    document.getElementById('saveGradeBtn').addEventListener('click', async () => {
        await saveStudentGrade(data.number)
    })

    document.getElementById('cancelSaveGrade').addEventListener('click', async () => {
        selectClass(data.number)
    })
}

function createInput(grade, exam) {
    const input = document.createElement('input');
    input.type = 'number';
    input.classList.add('form-control');
    input.min = 0;
    input.max = grade;
    input.setAttribute('value', exam.studentGrade || 0)
    input.dataset.studentId = exam.studentId;
    input.dataset.examId = exam.examId;
    return input;
}

document.getElementById('createExam').addEventListener('click', createExam)

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
        console.error(error)
    }
}

async function saveStudentGrade(classNumber) {
    const inputs = studentTable.body.querySelectorAll('input'),
        data = []

    inputs.forEach(input => {
        const { studentId, examId } = input.dataset
        data.push({ studentId, examId, grade: input.value })
    })

    const ok = await http.saveStudentGrade(data)
    if (ok) {
        await selectClass(classNumber)
        console.log("Nota atualizada com sucesso!")
    } else {
        console.log("Erro ao atualizar nota.")
    }
}