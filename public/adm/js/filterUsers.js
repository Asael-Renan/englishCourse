function filterUsers() {
    const filterValue = document.getElementById('filter').value.toLowerCase();
    const tables = document.getElementsByTagName('tbody')
    const selectedOption =  document.getElementById('filterOptions').value
    
    const options = {
        id: (cell) => {return cell.className == 'id'},
        name: (cell) => {return cell.className == 'name'},
        all: () => {return true}
    }

    for (let tableIndex = 0; tableIndex < tables.length; tableIndex++) {
        const table = tables[tableIndex]
        const rows = table.getElementsByTagName('tr')
        for (let i = 0; i < rows.length; i++) {
            const cells = rows[i].getElementsByTagName('td');
            let match = false;
            
            for (let j = 0; j < cells.length; j++) {
                const cell = cells[j];
                if (options[selectedOption](cell)) {
                    if (cell.innerText.toLowerCase().indexOf(filterValue) > -1) {
                        match = true;
                        break;
                    }
                }
            }

            rows[i].style.display = match ? '' : 'none'
        }
    }
}