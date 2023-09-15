export default class httpRequests {
    //adm requests
    async createUser(data, role) {
        try {
            const response = await fetch(`adm/create${role.charAt(0).toUpperCase() + role.slice(1)}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            })
            if (!response.ok) {
                return false;
            }
            return await response.json();
        } catch (error) {
            throw new Error(`Erro ao criar usuario: ${error.message}`)
        }
    }

    async deleteUser(userId, role) {
        try {
            const response = await fetch(`/adm/delete${role.charAt(0).toUpperCase() + role.slice(1)}/${userId}`, { method: 'DELETE' })
            return response.ok
        } catch (error) {
            console.error("Erro ao fazer a requisição:", error)
        }
    }

    //teacher requests
    async getClassData(classNumber) {
        try {
            const response = await fetch(`/teacher/getClassData/${classNumber}`)
            if (!response.ok) {
                return false;
            }
            return await response.json();
        } catch (error) {
            throw new Error(`Erro ao pegar dados da turma: ${error.message}`)
        }
    }

    async saveStudentGrade(data) {
        try {
            const response = await fetch('/teacher/setExamGradeToStudent', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ data })
            })
            return response.ok
        } catch (error) {
            throw new Error("Erro ao salvar nota: " + error.message)
        }
    }
}