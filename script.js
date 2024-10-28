// script.js

document.addEventListener("DOMContentLoaded", loadData);
document.querySelector("button").addEventListener("click", addRow);

function loadData() {
    const table = document.getElementById("dataTable").getElementsByTagName('tbody')[0];
    const data = JSON.parse(localStorage.getItem("tableData")) || [];

    data.forEach(rowData => {
        const newRow = table.insertRow();

        // Agregar datos para las primeras 5 columnas (Título, Tipo, Formato, Nota, Precio)
        rowData.slice(0, 5).forEach((cellData, index) => {
            const cell = newRow.insertCell();

            if (index === 1) { // Verificar que "Tipo" esté en formato correcto
                cell.innerText = formatTipo(cellData); // Aplicar formato a Tipo
            } else {
                cell.innerText = cellData;
            }
        });

        // Crear el desplegable para la columna "Estado"
        const estadoCell = newRow.insertCell();
        const selectEstado = document.createElement("select");
        selectEstado.innerHTML = `
            <option value="En curso">En curso</option>
            <option value="Finalizada">Finalizada</option>
        `;
        selectEstado.value = rowData[5] || "En curso"; // Establecer valor desde localStorage o "En curso"
        estadoCell.appendChild(selectEstado);

        // Guardar automáticamente el estado cuando cambie
        selectEstado.addEventListener("change", saveData);

        // Crear el checkbox para la columna "Lectura"
        const lecturaCell = newRow.insertCell();
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = rowData[6] === "true"; // Asegurar que el valor sea booleano al cargar
        lecturaCell.appendChild(checkbox);

        // Guardar automáticamente el estado del checkbox cuando cambie
        checkbox.addEventListener("change", saveData);
    });
}

function addRow() {
    const titulo = prompt("Introduce el Título:");
    let tipo = prompt("Introduce el Tipo (Cómic o Manga):");
    const formato = prompt("Introduce el Formato:");
    const nota = prompt("Introduce la Nota:");
    const precio = prompt("Introduce el Precio:");

    tipo = formatTipo(tipo); // Formatear el tipo

    if (titulo && tipo && formato && nota && precio) { // Verificar que los datos no estén vacíos
        const table = document.getElementById("dataTable").getElementsByTagName('tbody')[0];
        const newRow = table.insertRow();

        newRow.insertCell(0).innerText = titulo;
        newRow.insertCell(1).innerText = tipo; // Insertar el tipo formateado
        newRow.insertCell(2).innerText = formato;
        newRow.insertCell(3).innerText = nota;
        newRow.insertCell(4).innerText = precio; // Nueva columna "Precio"

        // Crear el desplegable para la columna "Estado"
        const estadoCell = newRow.insertCell();
        const selectEstado = document.createElement("select");
        selectEstado.innerHTML = `
            <option value="En curso">En curso</option>
            <option value="Finalizada">Finalizada</option>
        `;
        selectEstado.value = "En curso"; // Valor inicial
        estadoCell.appendChild(selectEstado);

        // Guardar automáticamente el estado cuando cambie
        selectEstado.addEventListener("change", saveData);

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
        for (let j = 0; j < 5; j++) { // Almacenar las primeras 5 columnas (Título, Tipo, Formato, Nota, Precio)
            let cellData = row.cells[j].innerText;
            if (j === 1) { // Verificar que "Tipo" esté en formato correcto
                cellData = formatTipo(cellData); // Formatear el tipo
            }
            rowData.push(cellData);
        }
        // Agregar el valor seleccionado del desplegable "Estado"
        const estado = row.cells[5].querySelector("select").value;
        rowData.push(estado);

        // Agregar el estado del checkbox "Lectura" como cadena "true" o "false"
        const lectura = row.cells[6].querySelector("input[type='checkbox']").checked;
        rowData.push(lectura.toString()); // Convertir a cadena para almacenar en localStorage

        data.push(rowData);
    }

    localStorage.setItem("tableData", JSON.stringify(data));
}

function formatTipo(input) {
    const lowerInput = input.toLowerCase();
    if (["cómic", "comic"].includes(lowerInput)) {
        return "Cómic";
    } else if (["manga"].includes(lowerInput)) {
        return "Manga";
    } else {
        alert("Tipo inválido. Solo se acepta 'Cómic' o 'Manga'.");
        return ""; // Retorna cadena vacía si el tipo es inválido
    }
}
