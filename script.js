// script.js

document.addEventListener("DOMContentLoaded", loadData);
document.querySelector("button").addEventListener("click", addRow);

function loadData() {
    const table = document.getElementById("dataTable").getElementsByTagName('tbody')[0];
    const data = JSON.parse(localStorage.getItem("tableData")) || [];

    data.forEach(rowData => {
        const newRow = table.insertRow();
        rowData.forEach(cellData => {
            newRow.insertCell().innerText = cellData;
        });
    });
}

function addRow() {
    const col1 = prompt("Introduce el dato para la Columna 1:");
    const col2 = prompt("Introduce el dato para la Columna 2:");
    const col3 = prompt("Introduce el dato para la Columna 3:");
    const col4 = prompt("Introduce el dato para la Columna 4:");

    const table = document.getElementById("dataTable").getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();

    newRow.insertCell(0).innerText = col1;
    newRow.insertCell(1).innerText = col2;
    newRow.insertCell(2).innerText = col3;
    newRow.insertCell(3).innerText = col4;

    saveData();
}

function saveData() {
    const table = document.getElementById("dataTable").getElementsByTagName('tbody')[0];
    const data = [];

    for (let i = 0; i < table.rows.length; i++) {
        const row = table.rows[i];
        const rowData = [];
        for (let j = 0; j < row.cells.length; j++) {
            rowData.push(row.cells[j].innerText);
        }
        data.push(rowData);
    }

    localStorage.setItem("tableData", JSON.stringify(data));
}

