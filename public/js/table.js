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
        this.rows = []
    }

    setHeader(...cells) {
        let html = '';
        cells.forEach(cell => {
            html += `<th>${cell}</th>`
        });
        this.head.innerHTML = html;
    }

    addRow(...cells) {
        const tr = document.createElement('tr');
        tr.dataset.row = this.rows.length;
        for (const cell of cells) {
            const td = document.createElement('td');
            if (typeof cell === 'object') {
                td.className = cell.class;
                td.innerHTML = cell.text;
            } else {
                td.innerHTML = cell;
            }
            tr.appendChild(td);
        }
        this.body.appendChild(tr);
        this.rows.push(tr)
    }

    setFoot(...cells) {
        let html = '';
        cells.forEach(cell => {
            html += `<th>${cell}</th>`
        });
        this.foot.innerHTML = html;
    }
    
    removeRow(rowNumber) {
        this.rows[rowNumber].remove()
    }
    
    clear() {
        this.head.innerHTML = '';
        this.body.innerHTML = '';
        this.foot.innerHTML = '';
    }
}