function addClassElement(number) {
    document.getElementById('classes').innerHTML +=
        `<a href="/adm/class/${number}" class="class-container text-secondary border col-md-2 my-4 mx-md-5 rounded-3">
            <div class="">
                <h1 class="d-inline">${number}</h1>
            </div>
        </a>`
}

async function createClass() {
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
}

//teacher select
function addClassSelect() {
    const row = document.getElementById('optionsCreateTeacher');
    const firstSelectElement = row.querySelector('select');
    const cloneDiv = firstSelectElement.parentNode.cloneNode(true);

    cloneDiv.querySelector('option').removeAttribute('selected');
    row.appendChild(cloneDiv);
}

function removeClassSelect() {
    const row = document.getElementById('optionsCreateTeacher');
    if (row.children.length > 1) {
        row.lastChild.remove()
    }
}

function getSelectedOptions() {
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

function validateForm() {
    const nameInPOST = document.getElementById('nameTeacher');
    const passwordInPOST = document.getElementById('passwordTeacher');
    const selectElements = document.querySelectorAll('.optionClass');

    let isValid = true;

    if (nameInPOST.value.trim() === '') {
        nameInPOST.classList.add('is-invalid');
        isValid = false;
    } else {
        nameInPOST.classList.remove('is-invalid');
    }

    if (passwordInPOST.value.trim() === '') {
        passwordInPOST.classList.add('is-invalid');
        isValid = false;
    } else {
        passwordInPOST.classList.remove('is-invalid');
    }

    selectElements.forEach(select => {
        if (select.value === '') {
            select.classList.add('is-invalid');
            isValid = false;
        } else {
            select.classList.remove('is-invalid');
        }
    });

    return isValid;
}
