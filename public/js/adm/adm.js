(async () => {
    const response = await fetch('adm/getData');
    const data = await response.json();

    console.log(data)

    //load tables
    data.adm.forEach(value => {
        addRowInAdmTable(value.adm.id, value.name, document.getElementById('adm'))
    })
    data.teacher.forEach(value => {
        addRowInTeacherTable(value.teacher.id, value.name, document.getElementById('teacher'))
    })
    console.log
    data.student.forEach(value => {
        addRowInStudentTable(value.student.id, value.name, value.student.grade, value.student.absences, value.student.classNumber, document.getElementById('student'))
    })

    //loadClasses
    const { classes } = data
    if (classes.length > 0) {
        data.classes.forEach(element => {
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
})()

//tables
const tables = {
    adm: document.getElementById('adm'),
    teacher: document.getElementById('teacher'),
    student: document.getElementById('student')
}

function addRowInAdmTable(id, name, table) {
    table.innerHTML += `<tr id="row${id}">
    <td class="id">${id}</td>
    <td class="name">${name}</td>
    <th class="text-end">
        <button class="btn btn-danger ms-2" onclick="openDeleteModal(${id}, 'adm')">Deletar</button>
    </th>
    </tr>`
}
function addRowInTeacherTable(id, name, table) {
    table.innerHTML += `<tr id="row${id}">
    <td class="id">${id}</td>
    <td class="name">${name}</td>
    <th class="d-flex justify-content-end">
        <a href="/adm/teacher/${id}" class="btn btn-warning">Editar</a>
        <button class="btn btn-danger ms-2" onclick="openDeleteModal(${id}, 'teacher')">Deletar</button>
    </th>
    </tr>`
}
function addRowInStudentTable(id, name, grade, absences, classNumber, table) {
    table.innerHTML += `<tr id="row${id}">
    <td class="id">${id}</td>
    <td class="name">${name}</td>
    <td class="grade">${grade}</td>
    <td class="absences">${absences}</td>
    <td class="classNumber">${classNumber}</td>
    <th class="d-flex justify-content-end">
        <a href="/adm/student/${id}" class="btn btn-warning">Editar</a>
        <button class="btn btn-danger ms-2" onclick="openDeleteModal(${id}, 'student')">Deletar</button>
    </th>
    </tr>`
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

async function createUsers(data, role) {
    try {
        await fetch(`adm/create${role.charAt(0).toUpperCase() + role.slice(1)}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}

//delete users
function openDeleteModal(userId, role) {
    document.getElementById('confirmDeleteModal').dataset.userId = userId;
    document.getElementById('confirmDeleteModal').dataset.role = role;
    const deleteModal = new bootstrap.Modal(document.getElementById('confirmDeleteModal'))
    deleteModal.show()
}

function deleteUser() {
    const userId = document.getElementById('confirmDeleteModal').dataset.userId;
    const role = document.getElementById('confirmDeleteModal').dataset.role;
    fetch(`adm/delete${role.charAt(0).toUpperCase() + role.slice(1)}/${userId}`, { method: 'DELETE' })
        .then(response => {
            if (response.ok) {
                const row = document.getElementById(`row${userId}`)
                row.parentNode.removeChild(row)
                const deleteModal = bootstrap.Modal.getInstance(document.getElementById('confirmDeleteModal'))
                deleteModal.hide()

            } else {
                console.error("Erro ao deletar usuário.")
            }
        })
        .catch(error => {
            console.error("Erro ao fazer a requisição:", error)
        })
}
