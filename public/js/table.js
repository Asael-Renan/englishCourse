export default class Table {
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
        this.head.innerHTML = cells.map(this.createHeaderCell).join('');
    }

    createHeaderCell(cell) {
        if (typeof cell === 'object') {
            const { class: cellClass, text } = cell;
            return `<th class="${cellClass}">${text}</th>`;
        } else {
            return `<th>${cell}</th>`;
        }
    }

    addRow(...cells) {
        const tr = document.createElement('tr');
        tr.dataset.row = this.rows.length;

        for (const cellData of cells) {
            const td = this.createTableCell(cellData);
            tr.appendChild(td);
        }

        this.body.appendChild(tr);
        this.rows.push(tr);
        return tr
    }

    createTableCell(cellData) {
        const td = document.createElement('td');

        if (typeof cellData === 'object') {
            let { text, classList, attributes, clickable, DOMElement } = cellData;

            if (Array.isArray(classList)) {
                td.classList.add(...classList);
            }

            if (typeof attributes === 'object') {
                for (const attr in attributes) {
                    td.setAttribute(attr, attributes[attr]);
                }
            }

            if (clickable) {
                td.addEventListener('click', () => {
                    clickable.func(clickable.params);
                });
            }

            if (text) td.innerHTML = `${text}`;

            if (DOMElement) {
                if (!Array.isArray(DOMElement)) DOMElement = [DOMElement];

                DOMElement.forEach(element => {
                    if (element instanceof HTMLElement) {
                        td.appendChild(element);
                    }
                });
            }

        } else {
            td.innerHTML = `${cellData}`;
        }

        return td;
    }

    getCell(rowIndex, columnIndex) {
        const row = this.rows[rowIndex];
        if (row && columnIndex >= 0 && columnIndex < row.children.length) {
            return row.children[columnIndex];
        }
        return null;
    }

    setFoot(...cells) {
        this.foot.innerHTML = cells.map(cell => `<th>${cell}</th>`).join('');
    }

    removeRow(rowNumber) {
        const row = this.rows[rowNumber];
        if (row) {
            row.remove();
            this.rows.splice(rowNumber, 1);
            this.updateRowNumbers();
        }
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
        this.rows.forEach((row, index) => {
            row.dataset.row = index;
        });
    }

    getRowCount() {
        return this.rows.length;
    }
}
