// // Define matrix dimensions
// const rows = 6;
// const columns = 6;

// // Initialize a 6x6 matrix
// const matrix = [
//     [{ colspan: 2, value: 1 }, { ishide: true }, 0, { colspan: 2, value: 2 }, 0, 0],
//     [0, 0, 0, 0, { rowspan: 2, value: `rospan 2` }, 0],
//     [{ rowspan: 3, value: `rospan 2` }, 3, 0, 2, 0, 0],
//     [0, 0, 0, 0, 0, 0],
//     [0, 0, 0, { colspan: 3, value: 3 }, 2, 0],
//     [0, 0, 4, 0, 0, 0]
// ];

// // Create HTML table
// const table = document.createElement('table');

// // Add rows and cells to the table
// for (let i = 0; i < rows; i++) {
//     const row = table.insertRow();
//     for (let j = 0; j < columns; j++) {
//         const col = matrix[i][j];
//         const textContent = col.value;
//         let colspan = col.colspan;
//         let rowspan = col.rowspan;
//         let ishide = col.ishide;

//         if (!ishide) {
//             const cell = row.insertCell();
//             cell.textContent = textContent || 0;

//             if (colspan > 1) {
//                 cell.colSpan = colspan;
//                 // hide next cols
//                 for (let hide_col = 1; hide_col <= colspan - 1; hide_col++) {
//                     matrix[i][j + hide_col] = { ishide: true };
//                     // console.log(colspan, j);
//                 }
//             }

//             if (rowspan > 1) {
//                 cell.rowSpan = rowspan;
//                 cell.style.writingMode = 'tb-rl';
//                 cell.style.transform = "rotate(180deg)";

//                 for (let hide_row = 1; hide_row <= rowspan - 1; hide_row++) {
//                     matrix[i + hide_row][j] = { ishide: true };
//                     console.log(hide_row);
//                 }
//             }
//         }
//     }
// }

// console.log(matrix);

// // Append the table to the body
// document.getElementById('matrix').appendChild(table);

new Vue({
    el: "#dtable",
    data: () => ({
        matrix: [],
        row: 10,
        col: 10,
        selected: {},
        table_manipulating: false,
        col_data: {
            colspan: 1,
            rowspan: 1,
            ishide: 0,
            value: '',
            isselected: false,
            isheading: 0,
            width: 100,
            background_color: '',
            border: '',
            text_rotate: 0,
        },
    }),
    created: function () {
        let data = localStorage.getItem('table');
        if (data) {
            this.matrix = JSON.parse(data);
        } else {
            this.make_table();
        }
    },
    watch: {
        matrix: {
            handler: function (v) {
                if (!this.table_manipulating) {
                    localStorage.setItem('table', JSON.stringify(v));
                    this.set_cols();
                }
            },
            deep: true,
        }
    },
    methods: {
        make_table: function () {
            for (let row = 0; row < this.row; row++) {
                let row_data = []
                for (let col = 0; col < this.col; col++) {
                    let col_data = this.col_data;
                    row_data.push({ ...col_data })
                }
                this.matrix.push(Array.from(row_data));
            }
        },
        select: function (item) {
            this.selected.isselected = false;
            [...document.querySelectorAll('.table_cell')].forEach(e=>e.classList.remove('active'))
            event.target.classList.add('active')
            item.isselected = true;
            this.selected = item;
            document.getElementById('cell_value').focus();
        },
        unhide: function (row, col) {
            this.matrix[row][col].ishide = false;
            this.matrix[row][col].value = "";
        },
        add_row: function () {
            let row_data = []
            for (let col = 0; col < this.matrix[0].length; col++) {
                let col_data = this.col_data;
                row_data.push({ ...col_data });
            }
            this.matrix.push(Array.from(row_data));
        },
        add_cols: function () {
            this.table_manipulating = true;
            let col_data = this.col_data;
            for (let i = 0; i < this.matrix.length; i++) {
                this.matrix[i]?.push({ ...col_data })
            }
            this.table_manipulating = false;
        },
        set_cols: function () {
            let matrix = this.matrix;
            const table = document.createElement('table');
            let rows = this.row;
            let columns = this.col;
            for (let i = 0; i < rows; i++) {
                const row = table.insertRow();
                for (let j = 0; j < columns; j++) {
                    const col = matrix[i][j];
                    const textContent = col.value;
                    let colspan = col.colspan;
                    let rowspan = col.rowspan;
                    let ishide = col.ishide;
                    let value = col.value;
                    let isselected = col.isselected;
                    let background_color = col.background_color;

                    if(isselected){
                        this.selected = col;
                    }

                    if (!ishide) {
                        const cell = row.insertCell();
                        cell.textContent = textContent || 0;

                        if (colspan > 1 && rowspan == 1) {
                            cell.colSpan = colspan;
                            // hide next cols
                            for (let hide_col = 1; hide_col <= colspan - 1; hide_col++) {
                                if (matrix[i][j + hide_col]) {
                                    matrix[i][j + hide_col].ishide = true;
                                    matrix[i][j + hide_col].value = value;
                                    matrix[i][j + hide_col].background_color = background_color;
                                }
                            }
                        }

                        if (rowspan > 1) {
                            cell.rowSpan = rowspan;
                            cell.style.writingMode = 'tb-rl';
                            cell.style.transform = "rotate(180deg)";

                            for (let hide_row = 1; hide_row <= rowspan - 1; hide_row++) {
                                matrix[i + hide_row][j].ishide = true;
                                matrix[i + hide_row][j].value = value;
                                matrix[i + hide_row][j].background_color = background_color;

                                if (colspan > 1) {
                                    console.log('in');
                                    for (let hide_row_cols = 1; hide_row_cols <= colspan-1; hide_row_cols++) {                                        
                                        matrix[i + hide_row][j + hide_row_cols].ishide = true;
                                        matrix[i + hide_row][j + hide_row_cols].value = value;
                                        matrix[i + hide_row][j + hide_row_cols].background_color = background_color;
                                    }
                                }
                            }
                            cell.colSpan = colspan;
                        }
                    }
                }
            }
            document.getElementById('matrix').innerHTML = '';
            document.getElementById('matrix').appendChild(table);
        }
    }
})