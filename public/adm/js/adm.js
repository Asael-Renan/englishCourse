import Table from "../../js/table.js";
import httpRequests from "../../js/httpRequests.js";

const http = new httpRequests()
const admTable = new Table('admTable')
const teacherTable = new Table('teacherTable')
const studentTable = new Table('studentTable')

document.getElementById('admTableDiv').appendChild(admTable.table)
document.getElementById('teacherTableDiv').appendChild(teacherTable.table)
document.getElementById('studentTableDiv').appendChild(studentTable.table)

async function loadData() {
    const response = await fetch('/adm/getData');
    const data = await response.json();

    console.log(data)

    //load tables
    loadAdmTable(data.adm)
    loadTeacherTable(data.teacher)
    loadStudentTable(data.student)

    //loadClasses
    const { classes } = data
    if (classes.length > 0) {
        classes.forEach(element => {
            const classNumber = element.number
            addClassElement(classNumber)
            const optionsClass = document.getElementsByClassName('optionClass')
            for (let i = 0; i < optionsClass.length; i++) {
                optionsClass[i].innerHTML += `<option value="${classNumber}">${classNumber}</option>`
            }
        })
    } else {
        document.getElementById('classes').innerHTML = '<h1 class="mt-5">Nenhuma turma foi criada ainda</h1>'
    }
}

function loadAdmTable(data) {
    admTable.setHeader('#', 'Nome', { class: 'text-end', text: 'Deletar' })
    admTable.head.className = 'table-light'

    data.forEach(value => {
        const button = document.createElement("button");
        button.className = "btn btn-danger ms-2";
        button.textContent = "Deletar";
        button.onclick = () => openDeleteModal(value.id, 'adm');

        admTable.addRow({ text: value.id, classList: ['id'] },
            { text: value.name, classList: ['name'] },
            {
                DOMElement: button,
                classList: ['text-end']
            })
    })
}

function loadTeacherTable(data) {
    teacherTable.setHeader('#', 'Nome', { class: 'text-end', text: 'Editar / Deletar' })
    teacherTable.head.className = 'table-light'

    data.forEach(value => {
        const editButton = document.createElement('a');
        editButton.href = `/adm/teacher/${value.id}`;
        editButton.className = 'btn btn-warning';
        editButton.textContent = 'Editar';

        const deleteButton = document.createElement("button");
        deleteButton.className = "btn btn-danger ms-2";
        deleteButton.textContent = "Deletar";
        deleteButton.onclick = () => openDeleteModal(value.id, 'teacher');

        teacherTable.addRow({ text: value.id, classList: ['id'] },
            { text: value.name, classList: ['name'] },
            {
                DOMElement: [editButton, deleteButton],
                classList: ['text-end']
            })
    })
}

function loadStudentTable(data) {
    studentTable.setHeader('#', 'Nome', 'Nota total', 'faltas', 'turma', { class: 'text-end', text: 'Editar / Deletar' })
    studentTable.head.className = 'table-light'

    data.forEach((value, i) => {
        const editButton = document.createElement('a');
        editButton.href = `/adm/student/${value.id}`;
        editButton.className = 'btn btn-warning';
        editButton.textContent = 'Editar';

        const deleteButton = document.createElement("button");
        deleteButton.className = "btn btn-danger ms-2";
        deleteButton.textContent = "Deletar";
        deleteButton.onclick = () => openDeleteModal(value.id, 'student', i);

        const row = studentTable.addRow({ text: value.id, classList: ['id'] },
            { text: value.name, classList: ['name'] },
            { text: value.grade.toString(), classList: ['grade'] },
            { text: value.absences.toString(), classList: ['absences'] },
            { text: value.classNumber.toString(), classList: ['classNumber'] },
            {
                DOMElement: [editButton, deleteButton],
                classList: ['text-end']
            })
    })
}


function addClassElement(number) {
    document.getElementById('classes').innerHTML +=
        `<a href="/adm/class/${number}" class="class-container text-secondary border col-md-2 my-4 mx-md-5 rounded-3">
            <div class="">
                <h1 class="d-inline">${number}</h1>
            </div>
        </a>`
}

//create
function createAdm() {
    const name = document.getElementById("nameAdm")
    const email = document.getElementById("emailAdm")
    const password = document.getElementById("passwordAdm")

    if (!name.checkValidity() || !password.checkValidity()) {
        return
    }

    const data = {
        name: name.value,
        email: email.value,
        password: password.value,
    }

    if (createUsers(data, 'adm')) {
        const table = tables.adm
        addRowInAdmTable(tables.adm.children.length + 1, data.name, table)
        bootstrap.Modal.getInstance(document.getElementById(`createAdm`)).hide()
    }

    name.value = ''
    password.value = ''
}

function createTeacher() {
    const name = document.getElementById("nameTeacher")
    const email = document.getElementById("emailTeacher")
    const password = document.getElementById("passwordTeacher")
    const selectOptions = getSelectedOptions()
    console.log(selectOptions)

    if (!name.checkValidity() || !password.checkValidity()) {
        return
    }

    const data = {
        name: name.value,
        email: email.value,
        password: password.value,
        classesId: selectOptions
    }

    if (createUsers(data, 'teacher')) {
        const table = tables.teacher
        console.log(table)
        addRowInTeacherTable(tables.adm.children.length + 1, data.name, table)
        const myModal = bootstrap.Modal.getInstance(document.getElementById(`createTeacher`))
        myModal.hide()
    }

    name.value = ''
    password.value = ''
}

function createStudent() {
    const name = document.getElementById("nameStudent")
    const email = document.getElementById("emailStudent")
    const password = document.getElementById("passwordStudent")
    const classNumberOptions = document.getElementById("classSelectStudent");
    const classNumber = classNumberOptions.value;

    if (!name.checkValidity() || !password.checkValidity() || classNumber === '') {
        return
    }

    const data = {
        name: name.value,
        email: email.value,
        password: password.value,
        grade: 0,
        absences: 0,
        classNumber: parseInt(classNumber)
    }

    if (createUsers(data, 'student')) {
        const table = tables.student
        addRowInStudentTable(tables.student.children.length + 1, data.name, data.grade, data.absences, data.classNumber, table)
        const myModal = bootstrap.Modal.getInstance(document.getElementById(`createStudent`))
        myModal.hide()
    }

    name.value = ''
    password.value = ''
}

//delete users
function openDeleteModal(userId, role, i) {
    document.getElementById('confirmDeleteModal').dataset.userId = userId;
    document.getElementById('confirmDeleteModal').dataset.role = role;
    document.getElementById('confirmDeleteModal').dataset.index = i;
    const deleteModal = new bootstrap.Modal(document.getElementById('confirmDeleteModal'))
    deleteModal.show()
}

async function deleteUser() {
    const userId = document.getElementById('confirmDeleteModal').dataset.userId,
        rowNumber = document.getElementById('confirmDeleteModal').dataset.index,
        role = document.getElementById('confirmDeleteModal').dataset.role;

    const response = await http.deleteUser(userId, role)

    if (response) {
        const tableMap = {
            'adm': admTable,
            'teacher': teacherTable,
            'student': studentTable
        };

        if (tableMap.hasOwnProperty(role)) {
            tableMap[role].removeRow(rowNumber);
            const deleteModal = bootstrap.Modal.getInstance(document.getElementById('confirmDeleteModal'))
            deleteModal.hide()
        }

    } else {
        console.error("Erro ao deletar usuário.")
    }

}
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById('deleteUserBtn').onclick = deleteUser;
});


async function createClass() {
    try {

        const number = document.getElementById("numberClass")
        const level = document.getElementById("classLevel")

        if (!number.checkValidity() || !level.checkValidity() && isNaN(number)) {
            return
        }

        const data = {
            number: number.value,
            level: level.value,
        }

        const newClass = await fetch(`adm/createClass`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })

        if (newClass) {
            const myModal = bootstrap.Modal.getInstance(document.getElementById(`createClass`))
            myModal.hide()
            addClassElement(number.value)
        } else {
            console.error("Erro ao criar a classe:")
        }

        number.value = ''
    } catch (error) {
        console.error(`Erro ao criar `)
    }
}

loadData()