// Definición de la colección, obteniéndola de localStorage si existe
let collection = JSON.parse(localStorage.getItem('collection')) || [];

// Función para guardar la colección en localStorage y actualizar totales
function saveCollection() {
    localStorage.setItem('collection', JSON.stringify(collection));
    updateTotalPrice();
    updateTotalComicCount();
}

// Función para actualizar el precio total de todos los cómics
function updateTotalPrice() {
    const total = collection.reduce((sum, item) => sum + item.price, 0);
    document.getElementById('totalPrice').textContent = `Total: ${total}€`;
}

// Función para actualizar el conteo total de cómics
function updateTotalComicCount() {
    let totalComics = 0;

    collection.forEach(item => {
        if (item.type === 'Serie') {
            totalComics += item.items.length;
        } else {
            totalComics += 1;
        }
    });

    document.getElementById('totalComicCount').textContent = `Total de cómics: ${totalComics}`;
}

// Función para calcular la calificación promedio de una serie
function calculateAverageRating(series) {
    if (series.items.length === 0) return 0;

    const totalRating = series.items.reduce((sum, item) => sum + (item.rating || 0), 0);
    return (totalRating / series.items.length).toFixed(1);
}

// Función para renderizar la colección en la tabla principal
function renderCollection() {
    const tbody = document.getElementById('collectionTable').querySelector('tbody');
    tbody.innerHTML = '';

    collection.forEach((item, index) => {
        const comicCount = item.items ? item.items.length : 0;
        const averageRating = item.type === 'Serie' || item.type === 'Saga' ? calculateAverageRating(item) : item.rating || "Sin nota";
        const status = item.type === 'Serie' || item.type === 'Saga' ? item.status || 'En curso' : '-';
        const isRead = item.type === 'Serie' || item.type === 'Saga' ? checkIfSeriesIsRead(item) : item.read || false;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.type === 'Serie' || item.type === 'Saga' ? `<a href="#" onclick="toggleSeriesView(${index})">${item.name}</a> (${comicCount} cómics)` : item.name}</td>
            <td>${item.type}</td>
            <td>${item.format}</td>
            <td>${item.price}€</td>
            <td>${averageRating}</td>
            <td>${item.type === 'Serie' || item.type === 'Saga' ? getSeriesStatusSelect(item, index) : '-'}</td>
            <td><input type="checkbox" class="checkbox-lectura" ${isRead ? "checked" : ""} onchange="toggleReadStatus(${index})" ${item.type === 'Serie' || item.type === 'Saga' ? "disabled" : ""}></td>
            <td>
                <button onclick="editComicPrice(${index})">Editar</button>
                <button onclick="editComicRating(${index})">Editar Nota</button>
                <button onclick="deleteComic(${index})">Eliminar</button>
            </td>
        `;
        tbody.appendChild(row);

        // Añadimos la vista de la serie debajo de la serie seleccionada
        const seriesView = document.createElement('tr');
        seriesView.id = `seriesView-${index}`;
        seriesView.classList.add('series-view');
        seriesView.style.display = 'none'; // Inicialmente oculto
        seriesView.innerHTML = `<td colspan="8" id="seriesContent-${index}"></td>`;
        tbody.appendChild(seriesView);
    });

    saveCollection();
}

// Función para alternar la visualización de la serie seleccionada
function toggleSeriesView(index) {
    const seriesRow = document.getElementById(`seriesView-${index}`);
    if (seriesRow.style.display === 'none') {
        seriesRow.style.display = 'table-row';
        renderSeriesContent(index);
    } else {
        seriesRow.style.display = 'none';
    }
}

// Función para renderizar el contenido de la serie seleccionada
function renderSeriesContent(index) {
    const series = collection[index];
    const seriesContent = document.getElementById(`seriesContent-${index}`);
    seriesContent.innerHTML = `
        <div class="header-gray">
            <h3>${series.name}</h3>
        </div>
        <table class="series-table">
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
            <tbody>
                ${series.items.map((comic, i) => `
                    <tr>
                        <td>${comic.number}</td>
                        <td>${comic.name}</td>
                        <td>${comic.price}€</td>
                        <td>${comic.rating || "Sin nota"}</td>
                        <td><input type="checkbox" ${comic.read ? "checked" : ""} onchange="toggleSeriesComicReadStatus(${index}, ${i})"></td>
                        <td>
                            <button onclick="editSeriesComicRating(${index}, ${i})">Editar Nota</button>
                            <button onclick="deleteSeriesComic(${index}, ${i})">Eliminar</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
        <button class="button add-number" onclick="addSeriesComic(${index})">Añadir Número</button>
        <div class="total">
            <div>Total: ${series.items.reduce((sum, comic) => sum + comic.price, 0)}€</div>
            <div>Número de cómics: ${series.items.length}</div>
        </div>
    `;
}

// Función para añadir un nuevo número en una serie
function addSeriesComic(index) {
    const number = prompt('Número del Cómic:');
    const name = prompt('Nombre del Cómic:');
    const price = parseFloat(prompt('Precio:'));
    const rating = parseInt(prompt('Nota (1-10):'));

    if (number && name && !isNaN(price) && rating >= 1 && rating <= 10) {
        const newComic = { number, name, price, rating, read: false };
        collection[index].items.push(newComic);
        renderSeriesContent(index);
        saveCollection();
    }
}

// Función para eliminar un cómic de una serie
function deleteSeriesComic(seriesIndex, comicIndex) {
    collection[seriesIndex].items.splice(comicIndex, 1);
    renderSeriesContent(seriesIndex);
    saveCollection();
}

// Función para editar la calificación de un cómic en una serie
function editSeriesComicRating(seriesIndex, comicIndex) {
    const newRating = parseInt(prompt('Nueva Nota (1-10):'));
    if (newRating >= 1 && newRating <= 10) {
        collection[seriesIndex].items[comicIndex].rating = newRating;
        renderSeriesContent(seriesIndex);
        saveCollection();
    }
}

// Función para alternar el estado de lectura de un cómic en una serie
function toggleSeriesComicReadStatus(seriesIndex, comicIndex) {
    const series = collection[seriesIndex];
    series.items[comicIndex].read = !series.items[comicIndex].read;
    series.read = checkIfSeriesIsRead(series);
    renderSeriesContent(seriesIndex);
    saveCollection();
}

// Función para verificar si todos los cómics de una serie están leídos
function checkIfSeriesIsRead(series) {
    return series.items.length > 0 && series.items.every(comic => comic.read);
}

// Función para manejar series y tomos en la colección general

// Añadir un nuevo cómic (serie, saga o tomo único) en la colección principal
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
        saveCollection();
    } else {
        alert('Por favor, completa todos los datos correctamente.');
    }
}

// Editar el precio de un cómic en la colección principal
function editComicPrice(index) {
    const newPrice = parseFloat(prompt('Nuevo precio:'));
    if (!isNaN(newPrice)) {
        collection[index].price = newPrice;
        renderCollection();
        saveCollection();
    }
}

// Editar la calificación de un cómic en la colección principal
function editComicRating(index) {
    const newRating = parseInt(prompt('Nueva Nota (1-10):'));
    if (newRating >= 1 && newRating <= 10) {
        collection[index].rating = newRating;
        renderCollection();
        saveCollection();
    }
}

// Eliminar un cómic de la colección principal
function deleteComic(index) {
    collection.splice(index, 1);
    renderCollection();
    saveCollection();
}

// Función para alternar el estado de lectura de un cómic en la colección principal
function toggleReadStatus(index) {
    const item = collection[index];
    if (item.type === 'Tomo Único') {
        item.read = !item.read;
    } else if (item.type === 'Serie') {
        item.read = checkIfSeriesIsRead(item);
    }
    saveCollection();
    renderCollection();
}

// Inicializar la colección en la página
renderCollection();

