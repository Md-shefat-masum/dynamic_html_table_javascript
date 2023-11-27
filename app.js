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
        row: 20,
        col: 20,
        selected: {},
        table_manipulating: false,
        col_data: {
            colspan: 1,
            rowspan: 1,
            row_no: 0,
            col_no: 0,
            ishide: 0,
            value: '',
            isheading: 0,
            isselected: false,
            background_color: '#ffffff',
            border: '#000000',
            text_rotate: 0,
            rotate: 0,
            width: 50,
            height: 24,
            top: 0,
            left: 0,
            font_size: 14,
        },
    }),
    created: function () {
        let data = localStorage.getItem('table');
        if (data) {
            this.matrix = JSON.parse(data);
        } else {
            this.make_table();
        }
        this.set_cols();
    },
    watch: {
        "matrix": {
            handler: function (v) {
                // if (!this.table_manipulating) {
                //     this.update_store();
                // }
                let that = this;
                setTimeout(function() {
                    
                }, 300);
            },
            deep: true,
        },
    },
    methods: {
        update_store: function (matrix = this.matrix) {
            localStorage.setItem('table', JSON.stringify(matrix));
        },
        make_table: function () {
            for (let row = 0; row < this.row; row++) {
                let row_data = []
                for (let col = 0; col < this.col; col++) {
                    let col_data = this.col_data;
                    col_data.row_no = row;
                    col_data.col_no = col;
                    row_data.push({ ...col_data })
                }
                this.matrix.push(Array.from(row_data));
            }
            this.update_store();
        },
        reset: function () {
            this.matrix = [];
            this.make_table();
        },
        select: function (item) {
            this.selected.isselected = false;
            [...document.querySelectorAll('td.active')].forEach(e => e.classList.remove('active'))
            event.currentTarget.classList.add('active');
            item.isselected = true;
            this.selected = item;
            document.getElementById('cell_value').focus();
            this.update_store();
        },
        row_span: function () {
            this.update_store();
            this.set_cols();
        },
        col_span: function () {
            this.update_store();
            this.set_cols();
        },
        unhide: function (row, col) {
            this.matrix[row][col].ishide = false;
            this.matrix[row][col].value = "";
            this.update_store();
            this.set_cols();
        },
        add_row: function () {
            let row_data = []
            for (let col = 0; col < this.matrix[0].length; col++) {
                let col_data = this.col_data;
                row_data.push({ ...col_data });
            }
            this.matrix.push(Array.from(row_data));
            this.row++;
            this.update_store();
            this.set_cols();
        },
        add_cols: function () {
            this.table_manipulating = true;
            let col_data = this.col_data;
            for (let i = 0; i < this.matrix.length; i++) {
                this.matrix[i]?.push({ ...col_data })
            }
            this.table_manipulating = false;
            this.col++;
            this.update_store();
            this.set_cols();
        },
        set_cols: function () {
            // let matrix = JSON.parse(JSON.stringify(this.matrix));
            let matrix = this.matrix;
            const table = document.createElement('table');
            let rows = this.row;
            let columns = this.col;

            for (let i = 0; i < rows; i++) {
                for (let j = 0; j < columns; j++) {
                    const col = matrix[i][j];
                    col.ishide = false;
                }
            }

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

                    if (isselected) {
                        this.selected = col;
                    }

                    if (!ishide) {
                        const cell = row.insertCell();
                        cell.textContent = textContent || "-";

                        if (colspan > 1 && rowspan == 1) {
                            cell.colSpan = colspan;
                            // hide next cols
                            for (let hide_col = 1; hide_col <= colspan - 1; hide_col++) {
                                if (matrix[i][j + hide_col]) {
                                    matrix[i][j + hide_col].ishide = true;
                                    console.log(`hiding col: ${i} ${j + hide_col + 1}`);
                                    // matrix[i][j + hide_col].value = value;
                                    // matrix[i][j + hide_col].background_color = background_color;
                                }
                            }
                        }

                        if (rowspan > 1) {
                            cell.rowSpan = rowspan;
                            cell.style.writingMode = 'tb-rl';
                            cell.style.transform = "rotate(180deg)";

                            for (let hide_row = 1; hide_row <= rowspan - 1; hide_row++) {
                                matrix[i + hide_row][j].ishide = true;
                                // matrix[i + hide_row][j].value = value;
                                // matrix[i + hide_row][j].background_color = background_color;

                                if (colspan > 1) {
                                    for (let hide_row_cols = 1; hide_row_cols <= colspan - 1; hide_row_cols++) {
                                        matrix[i][j + hide_row_cols].ishide = true;
                                    }
                                    for (let hide_row_cols = 0; hide_row_cols <= colspan - 1; hide_row_cols++) {
                                        matrix[i + hide_row][j + hide_row_cols].ishide = true;
                                        // matrix[i + hide_row][j + hide_row_cols].value = value;
                                        // matrix[i + hide_row][j + hide_row_cols].background_color = background_color;
                                    }
                                }
                            }
                            cell.colSpan = colspan;
                        }
                    }
                }
            }

            this.matrix = matrix;
            this.update_store();
            document.getElementById('matrix').innerHTML = '';
            document.getElementById('matrix').appendChild(table);
        },

    }
})