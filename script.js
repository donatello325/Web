let collection = JSON.parse(localStorage.getItem('collection')) || [];

function saveCollection() {
    localStorage.setItem('collection', JSON.stringify(collection));
    updateTotalPrice();
    updateTotalComicCount();
}

function updateTotalPrice() {
    const total = collection.reduce((sum, item) => sum + item.price, 0);
    document.getElementById('totalPrice').innerText = `Total: ${total}€`;
}

function updateTotalComicCount() {
    let totalComics = 0;

    collection.forEach(item => {
        if (item.type === 'Serie') {
            totalComics += item.items.length;
        } else {
            totalComics += 1;
        }
    });

    document.getElementById('totalComicCount').innerText = `Total de cómics: ${totalComics}`;
}

function updateSeriesTotalPrice(series) {
    const total = series.items.reduce((sum, item) => sum + item.price, 0);
    series.price = total;
    document.getElementById('seriesTotalPrice').innerText = `Total: ${total}€`;

    const comicCount = series.items.length;
    document.getElementById('seriesComicCount').innerText = `Número de cómics: ${comicCount}`;

    renderCollection();
    updateTotalComicCount();
}

// Nueva función para calcular la nota media de una serie
function calculateAverageRating(series) {
    if (series.items.length === 0) return 0;

    const totalRating = series.items.reduce((sum, item) => sum + (item.rating || 0), 0);
    return (totalRating / series.items.length).toFixed(1); // Nota media con 1 decimal
}

function renderCollection() {
    const tbody = document.getElementById('collectionTable').querySelector('tbody');
    tbody.innerHTML = '';

    collection.forEach((item, index) => {
        const comicCount = item.items ? item.items.length : 0;
        const averageRating = item.type === 'Serie' ? calculateAverageRating(item) : item.rating || "Sin nota";

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                ${item.type === 'Serie' ? `<a href="#" onclick="openSeries(${index})">${item.name}</a> (${comicCount} cómics)` : item.name}
            </td>
            <td>${item.type}</td>
            <td>${item.price}€</td>
            <td>${averageRating}</td>
            <td>
                <button onclick="editComicPrice(${index})">Editar</button>
                <button onclick="editComicRating(${index})">Editar Nota</button>
                <button onclick="deleteComic(${index})">Eliminar</button>
            </td>
        `;
        tbody.appendChild(row);
    });

    saveCollection();
}

function addComic() {
    const name = prompt('Nombre de la Serie/Tomo Único:');
    const type = prompt('Tipo (Serie/Tomo Único):');
    const price = parseFloat(prompt('Precio:'));
    const rating = type === 'Tomo Único' ? parseInt(prompt('Nota (1-10):')) : null;

    if (name && type && !isNaN(price) && (rating === null || (rating >= 1 && rating <= 10))) {
        const newComic = { name, type, price, items: type === 'Serie' ? [] : null, rating: type === 'Tomo Único' ? rating : null };
        collection.push(newComic);
        renderCollection();
    }
}

function editComicPrice(index) {
    const newPrice = parseFloat(prompt('Nuevo precio:'));
    if (!isNaN(newPrice)) {
        collection[index].price = newPrice;
        renderCollection();
    }
}

// Nueva función para editar la nota de un tomo único
function editComicRating(index) {
    const newRating = parseInt(prompt('Nueva Nota (1-10):'));
    if (newRating >= 1 && newRating <= 10) {
        collection[index].rating = newRating;
        renderCollection();
    }
}

function deleteComic(index) {
    collection.splice(index, 1);
    renderCollection();
}

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
            <td>${comic.price}€</td>
            <td>${comic.rating || "Sin nota"}</td>
            <td><button onclick="editSeriesComicRating(${index}, ${i})">Editar Nota</button>
                <button onclick="deleteSeriesComic(${index}, ${i})">Eliminar</button></td>
        `;
        tbody.appendChild(row);
    });

    updateSeriesTotalPrice(series);
    document.getElementById('seriesModal').style.display = 'block';
}

// Nueva función para añadir una nota a un número de la serie
function editSeriesComicRating(seriesIndex, comicIndex) {
    const newRating = parseInt(prompt('Nueva Nota (1-10):'));
    if (newRating >= 1 && newRating <= 10) {
        collection[seriesIndex].items[comicIndex].rating = newRating;
        openSeries(seriesIndex); // Refresca la vista de la serie abierta
        saveCollection();
    }
}

function closeModal() {
    document.getElementById('seriesModal').style.display = 'none';
}

function addSeriesComic() {
    const index = collection.findIndex(item => item.name === document.getElementById('seriesTitle').innerText);
    if (index === -1) return;

    const number = prompt('Número del Cómic:');
    const name = prompt('Nombre del Cómic:');
    const price = parseFloat(prompt('Precio:'));
    const rating = parseInt(prompt('Nota (1-10):'));

    if (number && name && !isNaN(price) && rating >= 1 && rating <= 10) {
        const newComic = { number, name, price, rating };
        collection[index].items.push(newComic);
        openSeries(index); // Refresca la vista de la serie abierta
        saveCollection();
    }
}

function deleteSeriesComic(seriesIndex, comicIndex) {
    collection[seriesIndex].items.splice(comicIndex, 1);
    openSeries(seriesIndex);
    saveCollection();
}

renderCollection();
