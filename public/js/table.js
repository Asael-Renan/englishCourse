class Table {
    constructor(id = null) {
        this.table = document.createElement('table');
        if (id) this.table.id = id;
        this.table.classList.add('table-responsive', 'table');
        this.head = document.createElement('thead');
        this.body = document.createElement('tbody');
        this.foot = document.createElement('tfoot');
        this.table.appendChild(this.head);
        this.table.appendChild(this.body);
        this.table.appendChild(this.foot);
        this.rows = [];
    }

    setHeader(...cells) {
        this.head.innerHTML = cells.map(cell => {
            if (typeof cell === 'object') {
                return `<th class="${cell.class}">${cell.text}</th>`
            } else {
                return `<th>${cell}</th>`
            }
        }).join('');
    }

    addRow(...cells) {
        const tr = document.createElement('tr');
        tr.dataset.row = this.rows.length;

        for (const cellData of cells) {
            const td = document.createElement('td');

            if (typeof cellData === 'object') {
                const { text, classList, attributes, clickable } = cellData;

                if (classList && Array.isArray(classList)) {
                    td.classList.add(...classList);
                }

                if (attributes && typeof attributes === 'object') {
                    for (const attr in attributes) {
                        td.setAttribute(attr, attributes[attr]);
                    }
                }

                if (clickable) {
                    td.addEventListener('click', () => {
                        window.location.href = window.location.origin + clickable;
                    });
                }
                td.innerHTML = text || '';

            } else {
                td.innerHTML = cellData;
            }

            tr.appendChild(td);
        }

        this.body.appendChild(tr);
        this.rows.push(tr);
    }


    getCell(rowIndex, columnIndex) {
        if (rowIndex >= 0 && rowIndex < this.rows.length) {
            const row = this.rows[rowIndex];
            if (columnIndex >= 0 && columnIndex < row.children.length) {
                return row.children[columnIndex];
            }
        }
        return null;
    }


    setFoot(...cells) {
        this.foot.innerHTML = cells.map(cell => `<th>${cell}</th>`).join('');
    }

    removeRow(rowNumber) {
        this.rows[rowNumber].remove();
        this.rows.splice(rowNumber, 1);
        this.updateRowNumbers();
    }

    clear() {
        this.head.innerHTML = '';
        this.body.innerHTML = '';
        this.foot.innerHTML = '';
        this.rows = [];
    }

    addClass(className) {
        this.table.classList.add(className);
    }

    removeClass(className) {
        this.table.classList.remove(className);
    }

    updateRowNumbers() {
        this.rows.forEach((row, index) => row.dataset.row = index);
    }

    getRowCount() {
        return this.rows.length;
    }
}
