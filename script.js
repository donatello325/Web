let collection = JSON.parse(localStorage.getItem('collection')) || [];

// Guardar colección en localStorage y actualizar totales
function saveCollection() {
    localStorage.setItem('collection', JSON.stringify(collection));
    updateTotalPrice();
    updateTotalComicCount();
}

// Calcular y actualizar el precio total
function updateTotalPrice() {
    const total = collection.reduce((sum, item) => sum + (item.price || 0), 0);
    document.getElementById('totalPrice').innerText = `Total: ${total.toFixed(2)}€`;
}

// Contar y mostrar el total de ítems
function updateTotalComicCount() {
    let totalComics = 0;
    collection.forEach(item => {
        totalComics += item.type === 'Serie' ? item.items.length : 1;
    });
    document.getElementById('totalComicCount').innerText = `Total de cómics: ${totalComics}`;
}

// Calcular el precio total y el conteo de cómics en series
function updateSeriesTotalPrice(series) {
    const total = series.items.reduce((sum, item) => sum + (item.price || 0), 0);
    series.price = total;
    document.getElementById('seriesTotalPrice').innerText = `Total: ${total.toFixed(2)}€`;
    document.getElementById('seriesComicCount').innerText = `Número de cómics: ${series.items.length}`;
    renderCollection();
    updateTotalComicCount();
}

// Calcular promedio de calificación de una serie
function calculateAverageRating(series) {
    if (series.items.length === 0) return 0;
    const totalRating = series.items.reduce((sum, item) => sum + (item.rating || 0), 0);
    return (totalRating / series.items.length).toFixed(1);
}

// Renderizar la colección principal
function renderCollection() {
    const tbody = document.getElementById('collectionTable').querySelector('tbody');
    tbody.innerHTML = '';

    collection.forEach((item, index) => {
        const comicCount = item.items ? item.items.length : 0;
        const averageRating = (item.type === 'Serie' || item.type === 'Saga') ? calculateAverageRating(item) : item.rating || "Sin nota";
        const status = (item.type === 'Serie' || item.type === 'Saga') ? item.status || 'En curso' : '-';
        const isRead = (item.type === 'Serie' || item.type === 'Saga') ? checkIfSeriesIsRead(item) : item.read || false;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.type === 'Serie' || item.type === 'Saga' ? `<a href="#" onclick="openSeries(${index})">${item.name}</a> (${comicCount} cómics)` : item.name}</td>
            <td>${item.type}</td>
            <td>${item.format}</td>
            <td>${item.price ? `${item.price.toFixed(2)}€` : '-'}</td>
            <td>${averageRating}</td>
            <td>${status}</td>
            <td><input type="checkbox" class="checkbox-lectura" ${isRead ? "checked" : ""} onchange="toggleReadStatus(${index})" ${item.type === 'Serie' || item.type === 'Saga' ? "disabled" : ""}></td>
            <td>
                <button onclick="editComicPrice(${index})">Editar Precio</button>
                <button onclick="editComicRating(${index})">Editar Nota</button>
                <button onclick="deleteComic(${index})">Eliminar</button>
            </td>
        `;
        tbody.appendChild(row);
    });

    saveCollection();
}

// Agregar un nuevo cómic o serie a la colección
function addComic() {
    const name = prompt('Nombre de la Serie/Saga/Tomo Único:');
    const type = prompt('Tipo (Serie/Saga/Tomo Único):');
    const format = prompt('Formato (Cómic/Manga/Libro):');
    const price = parseFloat(prompt('Precio:'));
    const rating = type === 'Tomo Único' ? parseInt(prompt('Nota (1-10):')) : null;

    if (name && type && format && !isNaN(price) && (rating === null || (rating >= 1 && rating <= 10))) {
        const newComic = {
            name,
            type,
            format,
            price,
            items: type === 'Serie' || type === 'Saga' ? [] : null,
            rating: type === 'Tomo Único' ? rating : null,
            read: type === 'Tomo Único' ? false : null
        };
        collection.push(newComic);
        renderCollection();
    }
}

// Editar precio de un cómic
function editComicPrice(index) {
    const newPrice = parseFloat(prompt('Nuevo precio:'));
    if (!isNaN(newPrice)) {
        collection[index].price = newPrice;
        renderCollection();
    }
}

// Editar calificación de un cómic
function editComicRating(index) {
    const newRating = parseInt(prompt('Nueva Nota (1-10):'));
    if (newRating >= 1 && newRating <= 10) {
        collection[index].rating = newRating;
        renderCollection();
    }
}

// Eliminar un cómic o serie
function deleteComic(index) {
    collection.splice(index, 1);
    renderCollection();
}

// Abrir modal de una serie y renderizar su tabla de cómics
function openSeries(index) {
    const series = collection[index];
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
            <td><input type="checkbox" ${comic.read ? "checked" : ""} onchange="toggleSeriesComicReadStatus(${index}, ${i})"></td>
            <td>
                <button onclick="editSeriesComicRating(${index}, ${i})">Editar Nota</button>
                <button onclick="deleteSeriesComic(${index}, ${i})">Eliminar</button>
            </td>
        `;
        tbody.appendChild(row);
    });

    updateSeriesTotalPrice(series);
    document.getElementById('seriesModal').style.display = 'block';
}

// Cambiar estado de lectura en un cómic de una serie
function toggleSeriesComicReadStatus(seriesIndex, comicIndex) {
    const series = collection[seriesIndex];
    series.items[comicIndex].read = !series.items[comicIndex].read;
    series.read = checkIfSeriesIsRead(series);
    openSeries(seriesIndex);
    renderCollection();
    saveCollection();
}

// Cambiar estado de lectura en la colección principal
function toggleReadStatus(index) {
    const item = collection[index];
    item.read = item.type === 'Tomo Único' ? !item.read : checkIfSeriesIsRead(item);
    saveCollection();
    renderCollection();
}

// Comprobar si toda una serie ha sido leída
function checkIfSeriesIsRead(series) {
    return series.items.length > 0 && series.items.every(comic => comic.read);
}

// Seleccionar estado de la serie
function getSeriesStatusSelect(item, index) {
    return `<select onchange="updateSeriesStatus(${index}, this.value)">
                <option value="En curso" ${item.status === 'En curso' ? 'selected' : ''}>En curso</option>
                <option value="Finalizada" ${item.status === 'Finalizada' ? 'selected' : ''}>Finalizada</option>
            </select>`;
}

// Cambiar estado de la serie
function updateSeriesStatus(index, newStatus) {
    if (collection[index].type === 'Serie') {
        collection[index].status = newStatus;
        saveCollection();
        renderCollection();
    }
}

// Agregar cómic a una serie
function addSeriesComic() {
    const index = collection.findIndex(item => item.name === document.getElementById('seriesTitle').innerText);
    if (index === -1) return;

    const number = prompt('Número del Cómic:');
    const name = prompt('Nombre del Cómic:');
    const price = parseFloat(prompt('Precio:'));
    const rating = parseInt(prompt('Nota (1-10):'));

    if (number && name && !isNaN(price) && rating >= 1 && rating <= 10) {
        const newComic = { number, name, price, rating, read: false };
        collection[index].items.push(newComic);
        openSeries(index);
        saveCollection();
    }
}

// Eliminar cómic de una serie
function deleteSeriesComic(seriesIndex, comicIndex) {
    collection[seriesIndex].items.splice(comicIndex, 1);
    openSeries(seriesIndex);
    saveCollection();
}

// Editar calificación de un cómic en una serie
function editSeriesComicRating(seriesIndex, comicIndex) {
    const newRating = parseInt(prompt('Nueva Nota (1-10):'));
    if (newRating >= 1 && newRating <= 10) {
        collection[seriesIndex].items[comicIndex].rating = newRating;
        openSeries(seriesIndex);
        saveCollection();
    }
}

// Renderizar la colección al cargar
renderCollection();
