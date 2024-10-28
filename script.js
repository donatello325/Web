// script.js

document.addEventListener("DOMContentLoaded", loadData);
document.querySelector("button").addEventListener("click", addRow);

function loadData() {
    const table = document.getElementById("dataTable").getElementsByTagName('tbody')[0];
    const data = JSON.parse(localStorage.getItem("tableData")) || [];

    data.forEach(rowData => {
        const newRow = table.insertRow();

        // Agregar datos para las primeras 4 columnas
        rowData.slice(0, 4).forEach(cellData => {
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

        // Crear el checkbox para la columna "Lectura"
        const lecturaCell = newRow.insertCell();
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = rowData[5] === "true"; // Comparar explícitamente con "true" (cadena)
        lecturaCell.appendChild(checkbox);

        // Guardar automáticamente el estado del checkbox cuando cambie
        checkbox.addEventListener("change", saveData);
    });
}

function addRow() {
    const col1 = prompt("Introduce el dato para la Columna 1:");
    const col2 = prompt("Introduce el dato para la Columna 2:");
    const col3 = prompt("Introduce el dato para la Columna 3:");
    const col4 = prompt("Introduce el dato para la Columna 4:");

    if (col1 && col2 && col3 && col4) { // Verificar que los datos no estén vacíos
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

        // Crear el checkbox para la columna "Lectura"
        const lecturaCell = newRow.insertCell();
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = false; // Valor inicial no seleccionado
        lecturaCell.appendChild(checkbox);

        // Guardar automáticamente el estado del checkbox cuando cambie
        checkbox.addEventListener("change", saveData);

        saveData(); // Guardar inmediatamente la nueva fila en localStorage
    } else {
        alert("Por favor, introduce todos los datos.");
    }
}

function saveData() {
    const table = document.getElementById("dataTable").getElementsByTagName('tbody')[0];
    const data = [];

    for (let i = 0; i < table.rows.length; i++) {
        const row = table.rows[i];
        const rowData = [];
        for (let j = 0; j < 4; j++) {
            rowData.push(row.cells[j].innerText);
        }
        // Agregar el valor seleccionado del desplegable "Estado"
        const estado = row.cells[4].querySelector("select").value;
        rowData.push(estado);

        // Agregar el estado del checkbox "Lectura" como cadena "true" o "false"
        const lectura = row.cells[5].querySelector("input[type='checkbox']").checked;
        rowData.push(lectura.toString()); // Convertir a cadena para almacenar en localStorage

        data.push(rowData);
    }

    localStorage.setItem("tableData", JSON.stringify(data));
}
