class FilterModal {
    constructor(parentElementId, inputId) {
        this.parentElement = document.getElementById(`${parentElementId}`)
        this.elements = this.parentElement.children
        this.input = document.getElementById(`${inputId}`)
        this.input.addEventListener('keyup', () => this.find())
    }

    loadContent(content) {
        this.clear()
        for (const text of content) {
            this.addRow(text)
        }
    }

    addRow(text) {
        const div = document.createElement('div')
        div.className = 'filter-item'
        div.textContent = text
        this.parentElement.appendChild(div)
    }

    find() {
        for (const element of this.elements) {
            const match = element.textContent
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, "")
            .includes(this.input.value)
            console.log(match)
            element.style.display = match ? '' : 'none'
        }
    }

    clear() {
        this.parentElement.innerHTML = ''
    }
}

export default FilterModal