// script.js

document.addEventListener("DOMContentLoaded", loadData);
document.querySelector("button").addEventListener("click", addRow);

function loadData() {
    const table = document.getElementById("dataTable").getElementsByTagName('tbody')[0];
    const data = JSON.parse(localStorage.getItem("tableData")) || [];

    data.forEach(rowData => {
        const newRow = table.insertRow();

        // Agregar datos para las primeras 5 columnas (Título, Tipo, Formato, Nota, Precio)
        rowData.slice(0, 5).forEach(cellData => {
            newRow.insertCell().innerText = cellData;
        });

        // Crear el desplegable para la columna "Estado"
        const estadoCell = newRow.insertCell();
        const selectEstado = document.createElement("select");
        selectEstado.innerHTML = `
            <option value="En curso">En curso</option>
            <option value="Finalizada">Finalizada</option>
        `;
        selectEstado.value = rowData[5] || "En curso";
        estadoCell.appendChild(selectEstado);

        selectEstado.addEventListener("change", saveData);

        // Crear el checkbox para la columna "Lectura"
        const lecturaCell = newRow.insertCell();
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = rowData[6] === "true";
        lecturaCell.appendChild(checkbox);

        checkbox.addEventListener("change", saveData);

        // Crear la columna de "Acciones" con los botones
        const accionesCell = newRow.insertCell();
        createActionButton(accionesCell, "Editar Nota", () => editCell(newRow, 3));
        createActionButton(accionesCell, "Editar Precio", () => editCell(newRow, 4));
        createActionButton(accionesCell, "Eliminar", () => deleteRow(newRow));
    });
}

function addRow() {
    const titulo = prompt("Introduce el Título:");
    const tipo = prompt("Introduce el Tipo:");
    const formato = prompt("Introduce el Formato:");
    const nota = prompt("Introduce la Nota:");
    const precio = prompt("Introduce el Precio:");

    if (titulo && tipo && formato && nota && precio) {
        const table = document.getElementById("dataTable").getElementsByTagName('tbody')[0];
        const newRow = table.insertRow();

        newRow.insertCell(0).innerText = titulo;
        newRow.insertCell(1).innerText = tipo;
        newRow.insertCell(2).innerText = formato;
        newRow.insertCell(3).innerText = nota;
        newRow.insertCell(4).innerText = precio;

        // Crear el desplegable para la columna "Estado"
        const estadoCell = newRow.insertCell();
        const selectEstado = document.createElement("select");
        selectEstado.innerHTML = `
            <option value="En curso">En curso</option>
            <option value="Finalizada">Finalizada</option>
        `;
        selectEstado.value = "En curso";
        estadoCell.appendChild(selectEstado);

        selectEstado.addEventListener("change", saveData);

        // Crear el checkbox para la columna "Lectura"
        const lecturaCell = newRow.insertCell();
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = false;
        lecturaCell.appendChild(checkbox);

        checkbox.addEventListener("change", saveData);

        // Crear la columna de "Acciones" con los botones
        const accionesCell = newRow.insertCell();
        createActionButton(accionesCell, "Editar Nota", () => editCell(newRow, 3));
        createActionButton(accionesCell, "Editar Precio", () => editCell(newRow, 4));
        createActionButton(accionesCell, "Eliminar", () => deleteRow(newRow));

        saveData();
    } else {
        alert("Por favor, introduce todos los datos.");
    }
}

function createActionButton(cell, text, action) {
    const button = document.createElement("button");
    button.innerText = text;
    button.addEventListener("click", action);
    cell.appendChild(button);
}

function editCell(row, cellIndex) {
    const newValue = prompt("Introduce el nuevo valor:");
    if (newValue !== null) {
        row.cells[cellIndex].innerText = newValue;
        saveData();
    }
}

function deleteRow(row) {
    const confirmDelete = confirm("¿Estás seguro de que deseas eliminar esta fila?");
    if (confirmDelete) {
        row.remove();
        saveData();
    }
}

function saveData() {
    const table = document.getElementById("dataTable").getElementsByTagName('tbody')[0];
    const data = [];

    for (let i = 0; i < table.rows.length; i++) {
        const row = table.rows[i];
        const rowData = [];
        for (let j = 0; j < 5; j++) {
            rowData.push(row.cells[j].innerText);
        }
        const estado = row.cells[5].querySelector("select").value;
        rowData.push(estado);

        const lectura = row.cells[6].querySelector("input[type='checkbox']").checked;
        rowData.push(lectura.toString());

        data.push(rowData);
    }

    localStorage.setItem("tableData", JSON.stringify(data));
}
