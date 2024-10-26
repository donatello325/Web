const collection = JSON.parse(localStorage.getItem('collection')) || {
    comics: [],
    books: [],
    shows: []
};

function saveCollection() {
    localStorage.setItem('collection', JSON.stringify(collection));
}

function showTable(type) {
    document.querySelectorAll('.collection-table').forEach(table => {
        table.style.display = 'none';
    });
    document.getElementById(`${type}Table`).style.display = 'block';
}

function addItem(type) {
    const name = prompt(`Nombre del ${type === 'comics' ? 'Cómic/Manga' : type === 'books' ? 'Libro' : 'Serie/Anime/Película'}`);
    const typeSpecific = prompt('Tipo (Serie, Saga, Tomo Único, etc.):');
    const formatOrGenre = prompt(`${type === 'comics' ? 'Formato' : 'Género'} (e.g., Manga, Ficción, Acción):`);
    const price = parseFloat(prompt('Precio:'));
    const rating = parseInt(prompt('Nota (1-10):'));
    const status = type === 'comics' || type === 'shows' ? prompt('Estado (En curso, Finalizada):') : '';
    const read = confirm('¿Leído/Visto?');
    const newEntry = { name, type: typeSpecific, formatOrGenre, price, rating, status, read };

    if (name && !isNaN(price) && rating >= 1 && rating <= 10) {
        collection[type].push(newEntry);
        saveCollection();
        renderTable(type);
    }
}

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

    updateProgressBars();
}

function toggleReadStatus(type, index) {
    collection[type][index].read = !collection[type][index].read;
    saveCollection();
    renderTable(type);
    updateProgressBars();
}

function editItem(type, index) {
    const item = collection[type][index];
    item.name = prompt('Nuevo Nombre:', item.name);
    item.price = parseFloat(prompt('Nuevo Precio:', item.price));
    item.rating = parseInt(prompt('Nueva Nota (1-10):', item.rating));
    item.read = confirm('¿Leído/Visto?');
    saveCollection();
    renderTable(type);
}

function deleteItem(type, index) {
    collection[type].splice(index, 1);
    saveCollection();
    renderTable(type);
}

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
        progressBars[type].innerText = `${percentage.toFixed(0)}%`;
        document.getElementById(`${type}ProgressBar`).style.width = `${percentage}%`;
    });
}

function initializeTables() {
    renderTable('comics');
    renderTable('books');
    renderTable('shows');
    updateProgressBars();
}

initializeTables();
