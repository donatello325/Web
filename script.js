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
            <td>${item.type === 'Serie' ? `<a href="#" onclick="toggleSeriesTable(${index})">${item.name}</a> (${comicCount} cómics)` : item.name}</td>
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

        // Añadir una fila adicional para la tabla de la serie (inicialmente oculta)
        const seriesRow = document.createElement('tr');
        seriesRow.id = `seriesTableRow-${index}`;
        seriesRow.style.display = 'none';
        seriesRow.innerHTML = `
            <td colspan="8">
                <div>
                    <h3>${item.name} - Números</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Número</th>
                                <th>Nombre</th>
                                <th>Precio</th>
                                <th>Nota</th>
                                <th>Lectura</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody id="seriesTableBody-${index}"></tbody>
                    </table>
                    <button onclick="addSeriesComic(${index})">Añadir Número</button>
                </div>
            </td>
        `;
        tbody.appendChild(seriesRow);
    });

    saveCollection();
}

// Alternar la visualización de la tabla de una serie específica
function toggleSeriesTable(index) {
    const seriesRow = document.getElementById(`seriesTableRow-${index}`);
    seriesRow.style.display = seriesRow.style.display === 'none' ? 'table-row' : 'none';
    renderSeriesTable(index);
}

// Renderizar la tabla interna de una serie
function renderSeriesTable(index) {
    const series = collection.comics[index];
    const tbody = document.getElementById(`seriesTableBody-${index}`);
    tbody.innerHTML = '';

    series.items.forEach((comic, i) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${comic.number}</td>
            <td>${comic.name}</td>
            <td>${comic.price ? `${comic.price.toFixed(2)}€` : '-'}</td>
            <td>${comic.rating || "Sin nota"}</td>
            <td><input type="checkbox" ${comic.read ? "checked" : ""} onchange="toggleSeriesComicReadStatus(${index}, ${i})"></td>
            <td>
                <button onclick="editSeriesComicRating(${index}, ${i})">Editar Nota</button>
                <button onclick="deleteSeriesComic(${index}, ${i})">Eliminar</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Agregar un nuevo número a una serie
function addSeriesComic(index) {
    const number = prompt('Número del Cómic:');
    const name = prompt('Nombre del Cómic:');
    const price = parseFloat(prompt('Precio:'));
    const rating = parseInt(prompt('Nota (1-10):'));

    if (number && name && !isNaN(price) && rating >= 1 && rating <= 10) {
        const newComic = { number, name, price, rating, read: false };
        collection.comics[index].items.push(newComic);
        saveCollection();
        renderSeriesTable(index);
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

// Actualizar el estado de lectura de un número de serie
function toggleSeriesComicReadStatus(seriesIndex, comicIndex) {
    const series = collection.comics[seriesIndex];
    series.items[comicIndex].read = !series.items[comicIndex].read;
    renderSeriesTable(seriesIndex);
    saveCollection();
}

// Inicializar tablas y mostrar la de Cómics por defecto
function initializeTables() {
    showTable('comics');  // Mostrar la tabla de Cómics por defecto
    updateTotals(); // Actualizar los totales al inicio
}

initializeTables();

