// Inicialización de la colección desde localStorage
const collection = JSON.parse(localStorage.getItem('collection')) || {
    comics: [],
    books: [],
    shows: []
};

// Guardar colección en localStorage
function saveCollection() {
    localStorage.setItem('collection', JSON.stringify(collection));
}

// Renderizar la tabla correspondiente según el tipo (comics, books, shows)
function renderTable(type) {
    const tbody = document.getElementById(`${type}Body`);
    tbody.innerHTML = '';

    collection[type].forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.type}</td>
            <td>${item.formatOrGenre}</td>
            <td>${item.price}€</td>
            <td>${item.rating}</td>
            <td>${item.status || '-'}</td>
            <td><input type="checkbox" ${item.read ? "checked" : ""} onchange="toggleReadStatus('${type}', ${index})"></td>
            <td>
                <button onclick="editItem('${type}', ${index})">Editar</button>
                <button onclick="deleteItem('${type}', ${index})">Eliminar</button>
            </td>
        `;
        tbody.appendChild(row);
    });

    // Actualizar progreso de lectura en la página principal
    updateProgressBars();
}

// Agregar un nuevo elemento a la colección
function addItem(type) {
    const name = prompt(`Nombre del ${type === 'comics' ? 'Cómic/Manga' : type === 'books' ? 'Libro' : 'Serie/Anime/Película'}`);
    const typeSpecific = prompt('Tipo (Serie, Saga, Tomo Único, etc.):');
    const formatOrGenre = prompt(`${type === 'comics' ? 'Formato' : 'Género'} (e.g., Manga, Ficción, Acción):`);
    const price = parseFloat(prompt('Precio:'));
    const rating = parseInt(prompt('Nota (1-10):'));
    const status = (type === 'comics' || type === 'shows') ? prompt('Estado (En curso, Finalizada):') : '';
    const read = confirm('¿Leído/Visto?');
    const newEntry = { name, type: typeSpecific, formatOrGenre, price, rating, status, read };

    // Validación básica de entrada de datos
    if (name && !isNaN(price) && rating >= 1 && rating <= 10) {
        collection[type].push(newEntry);
        saveCollection();
        renderTable(type);
    } else {
        alert("Datos incorrectos. Asegúrate de introducir todos los campos correctamente.");
    }
}

// Editar un elemento existente en la colección
function editItem(type, index) {
    const item = collection[type][index];
    item.name = prompt('Nuevo Nombre:', item.name);
    item.type = prompt('Nuevo Tipo:', item.type);
    item.formatOrGenre = prompt('Nuevo Formato/Género:', item.formatOrGenre);
    item.price = parseFloat(prompt('Nuevo Precio:', item.price));
    item.rating = parseInt(prompt('Nueva Nota (1-10):', item.rating));
    item.status = type === 'comics' || type === 'shows' ? prompt('Nuevo Estado:', item.status) : item.status;
    item.read = confirm('¿Leído/Visto?');

    // Guardar y renderizar de nuevo
    saveCollection();
    renderTable(type);
}

// Eliminar un elemento de la colección
function deleteItem(type, index) {
    collection[type].splice(index, 1);
    saveCollection();
    renderTable(type);
}

// Cambiar el estado de lectura de un elemento
function toggleReadStatus(type, index) {
    collection[type][index].read = !collection[type][index].read;
    saveCollection();
    renderTable(type);
}

// Actualizar las barras de progreso en la página principal
function updateProgressBars() {
    const progressBars = {
        comics: document.getElementById('comicsProgress'),
        books: document.getElementById('booksProgress'),
        shows: document.getElementById('showsProgress')
    };

    Object.keys(progressBars).forEach(type => {
        const totalItems = collection[type].length;
        const readItems = collection[type].filter(item => item.read).length;
        const percentage = totalItems ? (readItems / totalItems) * 100 : 0;

        // Actualizar el porcentaje de texto y el ancho de la barra
        progressBars[type].innerText = `${percentage.toFixed(0)}%`;
        document.getElementById(`${type}ProgressBar`).style.width = `${percentage}%`;
    });
}

// Inicializar las tablas y barras de progreso cuando se carga cada página
function initializeTables() {
    // Verificar en qué página estamos y cargar la tabla adecuada
    if (document.getElementById('comicsBody')) {
        renderTable('comics');
    }
    if (document.getElementById('booksBody')) {
        renderTable('books');
    }
    if (document.getElementById('showsBody')) {
        renderTable('shows');
    }

    // Actualizar las barras de progreso en la página principal
    updateProgressBars();
}

// Llamar a la función de inicialización al cargar el script
initializeTables();
