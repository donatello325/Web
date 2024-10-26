let collection = {
    comics: JSON.parse(localStorage.getItem('comics')) || [],
    books: JSON.parse(localStorage.getItem('books')) || [],
    shows: JSON.parse(localStorage.getItem('shows')) || []
};

// Guardar colección en localStorage por categoría
function saveCollection() {
    localStorage.setItem('comics', JSON.stringify(collection.comics));
    localStorage.setItem('books', JSON.stringify(collection.books));
    localStorage.setItem('shows', JSON.stringify(collection.shows));
    updateTotals();
}

// Actualizar los totales de precio y conteo de cada categoría y general
function updateTotals() {
    const comicsTotal = collection.comics.reduce((sum, item) => sum + (item.price || 0), 0);
    const booksTotal = collection.books.reduce((sum, item) => sum + (item.price || 0), 0);
    const showsTotal = collection.shows.reduce((sum, item) => sum + (item.price || 0), 0);

    document.getElementById('comicsTotalPrice').innerText = `Total Cómics: ${comicsTotal.toFixed(2)}€`;
    document.getElementById('booksTotalPrice').innerText = `Total Libros: ${booksTotal.toFixed(2)}€`;
    document.getElementById('showsTotalPrice').innerText = `Total Películas/Series: ${showsTotal.toFixed(2)}€`;

    const generalTotal = comicsTotal + booksTotal + showsTotal;
    document.getElementById('generalTotalPrice').innerText = `Total General: ${generalTotal.toFixed(2)}€`;
}

// Mostrar la tabla correspondiente y ocultar las demás
function showTable(type) {
    document.querySelectorAll('.collection-table').forEach(table => {
        table.style.display = 'none';
    });
    document.getElementById(`${type}Table`).style.display = 'block';
    renderTable(type); // Renderizar la tabla seleccionada
}

// Renderizar la tabla específica dependiendo del tipo (comics, books, shows)
function renderTable(type) {
    const tbody = document.getElementById(`${type}Body`);
    tbody.innerHTML = '';
    collection[type].forEach((item, index) => {
        const comicCount = item.items ? item.items.length : 0;
        const averageRating = item.type === 'Serie' ? calculateAverageRating(item) : item.rating || "Sin nota";
        const status = item.type === 'Serie' ? item.status || 'En curso' : '-';
        const isRead = item.type === 'Serie' ? checkIfSeriesIsRead(item) : item.read || false;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.type === 'Serie' ? `<a href="#" onclick="openSeries('${type}', ${index})">${item.name}</a> (${comicCount} cómics)` : item.name}</td>
            <td>${item.type}</td>
            <td>${item.format}</td>
            <td>${item.price ? `${item.price.toFixed(2)}€` : '-'}</td>
            <td>${averageRating}</td>
            <td>${status}</td>
            <td><input type="checkbox" class="checkbox-lectura" ${isRead ? "checked" : ""} onchange="toggleReadStatus('${type}', ${index})" ${item.type === 'Serie' ? "disabled" : ""}></td>
            <td>
                <button onclick="editItemPrice('${type}', ${index})">Editar Precio</button>
                <button onclick="editItemRating('${type}', ${index})">Editar Nota</button>
                <button onclick="deleteItem('${type}', ${index})">Eliminar</button>
            </td>
        `;
        tbody.appendChild(row);
    });

    saveCollection();
}

// Función de normalización para el tipo y formato
function normalizeTypeFormat(value, type) {
    value = value.toLowerCase();
    if (type === "type") {
        return value === "comic" || value === "cómic" || value === "cómic" ? "Cómic" : "Manga";
    } else if (type === "format") {
        return value === "serie" ? "Serie" : "Tomo Único";
    }
}

// Agregar un nuevo elemento a la colección específica de Cómics y Manga
function addComicItem() {
    const name = prompt('Nombre:');
    let type = prompt('Tipo (Cómic o Manga):');
    type = normalizeTypeFormat(type, "type"); // Normalizar el tipo

    let format = prompt('Formato (Serie o Tomo Único):');
    format = normalizeTypeFormat(format, "format"); // Normalizar el formato

    let price = 0;
    let rating = null;

    if (format === "Tomo Único") {
        price = parseFloat(prompt('Precio:'));
        rating = parseInt(prompt('Nota (1-10):'));
    }

    const status = format === "Serie" ? 'En curso' : '-';
    const read = format === "Tomo Único" ? false : null;

    if (name && type && format && !isNaN(price) && (rating === null || (rating >= 1 && rating <= 10))) {
        const newItem = {
            name,
            type,
            format,
            price,
            items: format === 'Serie' ? [] : null,
            rating,
            status,
            read
        };
        collection.comics.push(newItem);
        saveCollection();
        renderTable('comics');
    }
}

// Editar precio de un elemento
function editItemPrice(type, index) {
    const newPrice = parseFloat(prompt('Nuevo precio:'));
    if (!isNaN(newPrice)) {
        collection[type][index].price = newPrice;
        renderTable(type);
    }
}

// Editar calificación de un elemento
function editItemRating(type, index) {
    const newRating = parseInt(prompt('Nueva Nota (1-10):'));
    if (newRating >= 1 && newRating <= 10) {
        collection[type][index].rating = newRating;
        renderTable(type);
    }
}

// Eliminar un elemento
function deleteItem(type, index) {
    collection[type].splice(index, 1);
    renderTable(type);
}

// Abrir modal de una serie y renderizar su tabla de cómics
function openSeries(type, index) {
    const series = collection[type][index];
    const tbody = document.getElementById('seriesTable').querySelector('tbody');
    document.getElementById('seriesTitle').innerText = series.name;
    tbody.innerHTML = '';

    series.items.forEach((comic, i) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${comic.number}</td>
            <td>${comic.name}</td>
            <td>${comic.price ? `${comic.price.toFixed(2)}€` : '-'}</td>
            <td>${comic.rating || "Sin nota"}</td>
            <td><input type="checkbox" ${comic.read ? "checked" : ""} onchange="toggleSeriesComicReadStatus('${type}', ${index}, ${i})"></td>
            <td>
                <button onclick="editSeriesComicRating('${type}', ${index}, ${i})">Editar Nota</button>
                <button onclick="deleteSeriesComic('${type}', ${index}, ${i})">Eliminar</button>
            </td>
        `;
        tbody.appendChild(row);
    });

    updateSeriesTotalPrice(series);
    document.getElementById('seriesModal').style.display = 'block';
}

// Agregar cómic a una serie
function addSeriesComic() {
    const index = collection.comics.findIndex(item => item.name === document.getElementById('seriesTitle').innerText);
    if (index === -1) return;

    const number = prompt('Número del Cómic:');
    const name = prompt('Nombre del Cómic:');
    const price = parseFloat(prompt('Precio:'));
    const rating = parseInt(prompt('Nota (1-10):'));

    if (number && name && !isNaN(price) && rating >= 1 && rating <= 10) {
        const newComic = { number, name, price, rating, read: false };
        collection.comics[index].items.push(newComic);
        openSeries('comics', index);
        saveCollection();
    }
}

// Inicializar tablas y mostrar la de Cómics por defecto
function initializeTables() {
    showTable('comics');  // Mostrar la tabla de Cómics por defecto
    updateTotals(); // Actualizar los totales al inicio
}

initializeTables();
