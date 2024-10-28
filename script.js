// script.js

document.addEventListener("DOMContentLoaded", loadData);
document.querySelector("button").addEventListener("click", addRow);

function loadData() {
    const table = document.getElementById("dataTable").getElementsByTagName('tbody')[0];
    const data = JSON.parse(localStorage.getItem("tableData")) || [];

    data.forEach(rowData => {
        const newRow = table.insertRow();
        rowData.forEach(cellData => { // Insertar datos para las primeras 4 columna
            newRow.insertCell().innerText = cellData;
        });
        
    // Crear el desplegable para la columna "Estado"
        const estadoCell = newRow.insertCell();
        const select = document.createElement("select");
        select.innerHTML = `
            <option value="En curso">En curso</option>
            <option value="Finalizada">Finalizada</option>
        `;
        select.value = rowData[4] || "En curso"; // Establecer valor desde localStorage o "En curso"
        estadoCell.appendChild(select);

        // Guardar automáticamente el estado cuando cambie
        select.addEventListener("change", saveData);
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

    // Crear el desplegable para la columna "Estado"
    const estadoCell = newRow.insertCell();
    const select = document.createElement("select");
    select.innerHTML = `
        <option value="En curso">En curso</option>
        <option value="Finalizada">Finalizada</option>
    `;
    select.value = "En curso"; // Valor inicial
    estadoCell.appendChild(select);

    // Guardar automáticamente el estado cuando cambie
    select.addEventListener("change", saveData);

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
        // Agregar el valor seleccionado del desplegable "Estado"
        const estado = row.cells[4].querySelector("select").value;
        rowData.push(estado);
        
        data.push(rowData);
    }

    localStorage.setItem("tableData", JSON.stringify(data));
}

