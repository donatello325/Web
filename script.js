let collection = JSON.parse(localStorage.getItem('collection')) || [];

// Grupos de imágenes (4 combinaciones de 2 imágenes)
const imageGroups = [
    { left: 'https://e0.pxfuel.com/wallpapers/192/803/desktop-wallpaper-data-src-vertical-cool-batman-phone-new-52-batman-rebirth-really-cool-batman.jpg', right: 'https://i.pinimg.com/originals/1d/dc/38/1ddc3861da2f483500833aecd8005363.jpg' },
    { left: 'img2_left.jpg', right: 'img2_right.jpg' },
    { left: 'img3_left.jpg', right: 'img3_right.jpg' },
    { left: 'img4_left.jpg', right: 'img4_right.jpg' }
];

// Función para elegir un grupo de imágenes aleatoriamente
function setRandomImages() {
    const randomGroup = imageGroups[Math.floor(Math.random() * imageGroups.length)];
    
    // Establecer la imagen izquierda
    document.querySelector('.left-image img').src = randomGroup.left;
    
    // Establecer la imagen derecha
    document.querySelector('.right-image img').src = randomGroup.right;
}

// Llama a la función cuando se carga la página
window.onload = function() {
    setRandomImages();
    renderCollection(); // Llama también a renderCollection al cargar la página
};

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

function calculateAverageRating(series) {
    if (series.items.length === 0) return 0;

    const totalRating = series.items.reduce((sum, item) => sum + (item.rating || 0), 0);
    return (totalRating / series.items.length).toFixed(1);
}

function renderCollection() {
    const tbody = document.getElementById('collectionTable').querySelector('tbody');
    tbody.innerHTML = '';

    collection.forEach((item, index) => {
        const comicCount = item.items ? item.items.length : 0;
        const averageRating = item.type === 'Serie' ? calculateAverageRating(item) : item.rating || "Sin nota";
        const status = item.type === 'Serie' ? item.status || 'En curso' : '-';
        const isRead = item.type === 'Serie' ? checkIfSeriesIsRead(item) : item.read || false;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.type === 'Serie' ? `<a href="#" onclick="openSeries(${index})">${item.name}</a> (${comicCount} cómics)` : item.name}</td>
            <td>${item.type}</td>
            <td>${item.price}€</td>
            <td>${averageRating}</td>
            <td>${item.type === 'Serie' ? getSeriesStatusSelect(item, index) : '-'}</td>
            <td><input type="checkbox" class="checkbox-lectura" ${isRead ? "checked" : ""} onchange="toggleReadStatus(${index})" ${item.type === 'Serie' ? "disabled" : ""}></td>
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
        const newComic = { name, type, price, items: type === 'Serie' ? [] : null, rating: type === 'Tomo Único' ? rating : null, read: type === 'Tomo Único' ? false : null };
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

function toggleSeriesComicReadStatus(seriesIndex, comicIndex) {
    const series = collection[seriesIndex];
    series.items[comicIndex].read = !series.items[comicIndex].read;

    series.read = checkIfSeriesIsRead(series);
    openSeries(seriesIndex);
    renderCollection();
    saveCollection();
}

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

function checkIfSeriesIsRead(series) {
    return series.items.length > 0 && series.items.every(comic => comic.read);
}

function getSeriesStatusSelect(item, index) {
    return `<select onchange="updateSeriesStatus(${index}, this.value)">
                <option value="En curso" ${item.status === 'En curso' ? 'selected' : ''}>En curso</option>
                <option value="Finalizada" ${item.status === 'Finalizada' ? 'selected' : ''}>Finalizada</option>
            </select>`;
}

function updateSeriesStatus(index, newStatus) {
    if (collection[index].type === 'Serie') {
        collection[index].status = newStatus;
        saveCollection();
        renderCollection();
    }
}

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

function deleteSeriesComic(seriesIndex, comicIndex) {
    collection[seriesIndex].items.splice(comicIndex, 1);
    openSeries(seriesIndex);
    saveCollection();
}

function editSeriesComicRating(seriesIndex, comicIndex) {
    const newRating = parseInt(prompt('Nueva Nota (1-10):'));
    if (newRating >= 1 && newRating <= 10) {
        collection[seriesIndex].items[comicIndex].rating = newRating;
        openSeries(seriesIndex);
        saveCollection();
    }
}

renderCollection();
