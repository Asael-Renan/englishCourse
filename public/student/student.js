import { Table } from "../table.js";
const table = new Table()
document.getElementById('examsTable').appendChild(table.table)
class Student {
    constructor(user) {
        this.student = user;
        this.initialize();
    }

    initialize() {
        console.log(this.student);
        document.getElementById('name').textContent = this.student.name;
        document.getElementById('class').textContent = this.student.classNumber;
    }

    loadTable() {
        table.setHeader("Atividades", "Notas")
    }
}

(async () => {
    try {
        const id = window.location.href.split('/').pop();
        const response = await fetch(`/getStudent/${id}`);
        const userData = await response.json();

        const student = new Student(userData);
        student.loadTable()
    } catch (error) {
        console.error("Error:", error);
    }
})();
