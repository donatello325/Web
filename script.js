document.addEventListener("DOMContentLoaded", () => {
    loadData();

    // Elementos para el modal de datos
    const dataModal = document.getElementById("dataModal");
    const modalLabel = document.getElementById("modalLabel");
    const modalInput = document.getElementById("modalInput");
    const closeModalBtn = document.getElementById("closeModalBtn");

    // Función para cambiar el tema
    function changeTheme(theme) {
        document.body.classList.remove('theme-2', 'theme-3', 'theme-4');
        
        // Añade el nuevo tema si es diferente al original
        if (theme) {
            document.body.classList.add(theme);
        }
    }

    // Vincula la función de cambio de tema a los botones
    document.querySelectorAll(".theme-buttons button").forEach(button => {
        button.addEventListener("click", () => {
            const themeClass = button.getAttribute("onclick").replace("changeTheme('", "").replace("')", "");
            changeTheme(themeClass);
        });
    });

    // Datos que se irán completando
    const fields = [
        { label: "Título", value: "", validator: (input) => input },
        { label: "Tipo", value: "", validator: validateType },
        { label: "Formato", value: "", validator: validateFormat },
        { label: "Nota", value: "", validator: (input) => validateNumber(input, 0, 10) },
        { label: "Precio", value: "", validator: (input) => validateNumber(input, 0, 1000) }
    ];
    let currentFieldIndex = 0;

    // Función para abrir el modal y empezar en el primer campo
    function openModal() {
        currentFieldIndex = 0;
        modalInput.value = ""; // Limpiar el campo de entrada
        updateModalMessage();  // Actualiza el mensaje inicial del modal
        dataModal.style.display = "flex";
        modalInput.focus(); // Enfocar el campo de entrada
    }

    // Función para actualizar el mensaje del modal con el campo solicitado
    function updateModalMessage() {
        const currentField = fields[currentFieldIndex];
        modalLabel.innerText = `Introduce el ${currentField.label}:`;
        modalInput.placeholder = `Escribe ${currentField.label.toLowerCase()} aquí...`;
    }

    // Función para cerrar el modal
    function closeModal() {
        dataModal.style.display = "none";
        clearModalFields();
    }

    // Limpiar los datos del modal
    function clearModalFields() {
        fields.forEach(field => field.value = "");
        modalInput.value = "";
    }

    // Función para avanzar al siguiente campo al presionar "Enter"
    function handleEnter(event) {
        if (event.key === "Enter") {
            const currentValue = modalInput.value.trim();
            if (currentValue === "") {
                alert("Por favor, introduce un valor.");
                return;
            }

            try {
                fields[currentFieldIndex].value = fields[currentFieldIndex].validator(currentValue);
            } catch (error) {
                alert(error.message);
                return;
            }

            modalInput.value = ""; // Limpiar el campo de entrada

            // Pasar al siguiente campo
            currentFieldIndex++;

            if (currentFieldIndex < fields.length) {
                // Actualiza el mensaje para el siguiente campo
                updateModalMessage();
                modalInput.focus(); // Enfocar el campo de entrada
            } else {
                // Agregar los datos a la tabla
                addData();
                closeModal();
            }
        }
    }

    // Función para añadir los datos a la tabla y ordenar
    function addData() {
        const [titulo, tipo, formato, nota, precio] = fields.map(field => field.value);
        addRowToTable(titulo, tipo, formato, nota, precio);
        saveData();
        sortTableByTitle(); // Ordenar después de agregar
    }

    // Función para añadir una fila a la tabla con los datos
    function addRowToTable(titulo, tipo, formato, nota, precio, estado = "En curso", lectura = false) {
        const table = document.getElementById("dataTable").getElementsByTagName("tbody")[0];
        const newRow = table.insertRow();

        newRow.insertCell(0).innerText = titulo;
        newRow.insertCell(1).innerText = tipo;
        newRow.insertCell(2).innerText = formato;
        newRow.insertCell(3).innerText = nota;
        newRow.insertCell(4).innerText = precio;

        // Estado (desplegable)
        const estadoCell = newRow.insertCell(5);
        const selectEstado = document.createElement("select");
        selectEstado.innerHTML = `
            <option value="En curso">En curso</option>
            <option value="Finalizada">Finalizada</option>
        `;
        selectEstado.value = estado; // Set initial value from stored data
        estadoCell.appendChild(selectEstado);
        selectEstado.addEventListener("change", saveData);

        // Lectura (checkbox)
        const lecturaCell = newRow.insertCell(6);
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = lectura; // Set initial checked state from stored data
        lecturaCell.appendChild(checkbox);
        checkbox.addEventListener("change", saveData);

        // Acciones
        const accionesCell = newRow.insertCell(7);
        const actionsContainer = document.createElement("div");
        actionsContainer.classList.add("acciones");

        createActionButton(actionsContainer, "Editar Nota", () => editCell(newRow, 3));
        createActionButton(actionsContainer, "Editar Precio", () => editCell(newRow, 4));
        createActionButton(actionsContainer, "Eliminar", () => deleteRow(newRow));

        accionesCell.appendChild(actionsContainer);
    }

    // Función para validar el tipo ("Cómic" o "Manga")
    function validateType(input) {
        const formatted = input.toLowerCase();
        if (formatted === "comic" || formatted === "cómic") return "Cómic";
        if (formatted === "manga") return "Manga";
        throw new Error("Tipo debe ser 'Cómic' o 'Manga'.");
    }

    // Función para validar el formato ("Serie" o "Tomo Único")
    function validateFormat(input) {
        const formatted = input.toLowerCase();
        if (formatted === "serie") return "Serie";
        if (formatted === "tomo" || formatted === "tomo único") return "Tomo Único";
        throw new Error("Formato debe ser 'Serie' o 'Tomo Único'.");
    }

    // Función para validar números en un rango
    function validateNumber(value, min, max) {
        const num = parseFloat(value);
        if (isNaN(num) || num < min || num > max) {
            throw new Error(`Número debe estar entre ${min} y ${max}.`);
        }
        return num;
    }

    // Crear botón de acción
    function createActionButton(container, text, action) {
        const button = document.createElement("button");
        button.innerText = text;
        button.addEventListener("click", action);
        container.appendChild(button);
    }

    // Guardar datos en localStorage
    function saveData() {
        const table = document.getElementById("dataTable").getElementsByTagName("tbody")[0];
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

    // Cargar datos de localStorage y ordenar
    function loadData() {
        const table = document.getElementById("dataTable").getElementsByTagName("tbody")[0];
        const data = JSON.parse(localStorage.getItem("tableData")) || [];

        data.forEach(rowData => {
            addRowToTable(rowData[0], rowData[1], rowData[2], rowData[3], rowData[4]);
            const lastRow = table.rows[table.rows.length - 1];

            lastRow.cells[5].querySelector("select").value = rowData[5];
            lastRow.cells[6].querySelector("input[type='checkbox']").checked = rowData[6] === "true";
        });

        sortTableByTitle(); // Ordenar después de cargar datos
    }

    // Ordenar filas alfabéticamente por título
    function sortTableByTitle() {
        const tableBody = document.getElementById("dataTable").getElementsByTagName("tbody")[0];
        const rowsArray = Array.from(tableBody.rows);

        rowsArray.sort((a, b) => {
            const titleA = a.cells[0].innerText.toLowerCase();
            const titleB = b.cells[0].innerText.toLowerCase();
            return titleA.localeCompare(titleB);
        });

        rowsArray.forEach(row => tableBody.appendChild(row));
    }

    // Búsqueda por título
    document.getElementById("searchInput").addEventListener("input", (e) => {
        const searchText = e.target.value.toLowerCase();
        const rows = document.querySelectorAll("#dataTable tbody tr");
        rows.forEach(row => {
            const title = row.cells[0].innerText.toLowerCase();
            row.style.display = title.includes(searchText) ? "" : "none";
        });
    });

    // Editar celda
    function editCell(row, cellIndex) {
        const newValue = prompt("Introduce el nuevo valor:");
        try {
            const validatedValue = fields[cellIndex].validator(newValue);
            row.cells[cellIndex].innerText = validatedValue;
            saveData();
            sortTableByTitle();
        } catch (error) {
            alert(error.message);
        }
    }

    // Eliminar fila
    function deleteRow(row) {
        if (confirm("¿Estás seguro de que deseas eliminar esta fila?")) {
            row.remove();
            saveData();
        }
    }

    // Eventos de los botones y entradas
    document.querySelector("button[aria-label='Añadir datos a la tabla']").addEventListener("click", openModal);
    modalInput.addEventListener("keydown", handleEnter); 
    closeModalBtn.addEventListener("click", closeModal);

    // Cerrar el modal si se hace clic fuera del contenido
    window.addEventListener("click", (event) => {
        if (event.target === dataModal) {
            closeModal();
        }
    });

    // --- Implementación de Cambios de Tema ---
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
        changeTheme(savedTheme);
    }
});
