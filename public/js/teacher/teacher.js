load()

async function load() {
    const id = window.location.href.split('/').pop()
    const response = await fetch(`/teacher/getData/${id}`);
    const teacher = await response.json();

    document.getElementById('name').textContent = teacher.name;

    console.log(teacher)

    //load class buttons
    teacher.classes.forEach(classe => {
        createClassButton(classe.number)
    });

    localStorage.setItem('teacherData', JSON.stringify(teacher))
};

function createClassButton(classNumber) {
    const classButtons = document.getElementById('classButtons');
    const button = document.createElement('button');
    button.id = classNumber;
    button.classList.add('classButton', 'btn-sm', 'btn', 'btn-outline-primary', 'mx-1');
    button.textContent = classNumber;
    classButtons.appendChild(button);
    button.addEventListener('click', () => {
        loadTables(classNumber)
    });
}

function updateClassButtons(classNumber) {
    const classButtons = document.querySelectorAll('.classButton');
    classButtons.forEach(button => {
        button.classList.toggle('btn-primary', button.id == classNumber);
        button.classList.toggle('btn-outline-primary', button.id != classNumber);
    });
}

function loadTables(classNumber) {
    const teacher = JSON.parse(localStorage.getItem('teacherData'))
    clearStudentTable()
    clearExamsTable()
    const classSelected = teacher.classes.find(obj => obj.number == classNumber)
    localStorage.setItem('classSelected', JSON.stringify(classSelected))
    updateClassButtons(classSelected.number)
    document.getElementById('createExam').dataset.classNumber = classSelected.number
    classSelected.students.forEach(student => {
        addRowInStudentTable(student.name, student.absences, student.grade)
    });
    classSelected.exams.forEach(exam => {
        addRowInExamsTable(exam.id, exam.title, exam.grade)
    })
};

function createExam() {
    const title = document.getElementById('newExamName').value
    const grade = document.getElementById('newExamGrade').value
    const classNumber = document.getElementById('createExam').dataset.classNumber
    fetch('/teacher/createExam', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ title, grade, classNumber })
    })
}
