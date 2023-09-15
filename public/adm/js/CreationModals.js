export default class CreationModals {
// Retornar selects usando uma factory para usar em outros lugares

    //teacher select
    addClassSelect() {
        const row = document.getElementById('optionsCreateTeacher');
        const firstSelectElement = row.querySelector('select');
        const cloneDiv = firstSelectElement.parentNode.cloneNode(true);

        cloneDiv.querySelector('option').removeAttribute('selected');
        row.appendChild(cloneDiv);
    }

    removeClassSelect() {
        const row = document.getElementById('optionsCreateTeacher');
        if (row.children.length > 1) {
            row.lastChild.remove()
        }
    }

    getSelectedOptions() {
        const selectElements = document.querySelectorAll(`select.optionClass`);
        const selectedOptions = [];

        selectElements.forEach(select => {
            const selectedOption = select.options[select.selectedIndex];
            if (selectedOption.value !== '' && !selectedOptions.includes(parseInt(selectedOption.value))) {
                selectedOptions.push(parseInt(selectedOption.value));
            }
        });

        return selectedOptions;
    }
}