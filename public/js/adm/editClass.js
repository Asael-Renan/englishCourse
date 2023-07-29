(async () => {
    const data = await getData(),
        students = data.students,
        teachers = data.teachers,
        exams = data.exams;

    document.getElementById('classNumber').textContent = data.number

    //teacher table
    const teacherTable = new Table('teacherTable')
    document.getElementById('teacher').appendChild(teacherTable.table)
    teacherTable.setHeader('Nome', { text: '', class: 'removeBtn' })

    for (const teacher of teachers) {
        teacherTable.addRow({ text: teacher.name, clickable: `/adm/teacher/${teacher.id}` }, openRemoveModalButton('teacher', teacher.id))
    }
    //student table
    const studentTable = new Table('studentTable')
    document.getElementById('student').appendChild(studentTable.table)
    studentTable.setHeader('nome', 'faltas', 'nota total', { text: '', class: 'removeBtn' })

    for (const student of students) {
        studentTable.addRow({ class: 'studentName', text: student.name }, student.absences, student.grade, openRemoveModalButton('student', student.id))
    }

    //exam table
    const examTable = new Table('examTable')
    document.getElementById('exam').appendChild(examTable.table)
    examTable.setHeader('titulo', 'nota', { text: '', class: 'removeBtn' })

    for (const exam of exams) {
        examTable.addRow(exam.title, exam.grade, openRemoveModalButton('exam', exam.id))
    }
    console.log(data)
})();

function openRemoveModalButton(role, id) {
    const button = `<button class="btn btn-lg btn-danger" onclick="removeUserFromClass('${role}', ${id})">-</button>`
    return button
}

async function removeUserFromClass(role, id) {
    switch (role) {
        case 'teacher':
            fetch(`/adm/class/removeTeacher/${id}`, {
                method: 'DELETE'
            })
            break;
        case 'student':
            fetch(`/adm/class/removeStudent/${id}`, {
                method: 'DELETE'
            })
            break;
        case 'exam':
            fetch(`/adm/class/removeExam/${id}`, {
                method: 'DELETE'
            })
            break;
        default:
            break
    }
}

async function getData() {
    const number = window.location.href.split('/').pop()
    const response = await fetch(`/adm/class/data/${number}`)
    return await response.json()
}

async function getTeachers() {
    const response = await fetch(`/adm/teachers`)
    return await response.json()
}
async function getStudents() {
    const response = await fetch(`/adm/students`)
    return await response.json()
}