let collection = JSON.parse(localStorage.getItem('collection')) || [];

function saveCollection() {
    localStorage.setItem('collection', JSON.stringify(collection));
    updateTotalPrice();
    updateTotalComicCount();  // Aseguramos que se actualiza el número total de cómics
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

function renderCollection() {
    const tbody = document.getElementById('collectionTable').querySelector('tbody');
    tbody.innerHTML = '';
    collection.forEach((item, index) => {
        const comicCount = item.items ? item.items.length : 0;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                ${item.type === 'Serie' ? `<a href="#" onclick="openSeries(${index})">${item.name}</a> (${comicCount} cómics)` : item.name}
            </td>
            <td>${item.type}</td>
            <td>${item.price}€</td>
            <td>
                <button onclick="editComicPrice(${index})">Editar</button>
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

    if (name && type && !isNaN(price)) {
        const newComic = { name, type, price, items: type === 'Serie' ? [] : null };
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
            <td><button onclick="deleteSeriesComic(${index}, ${i})">Eliminar</button></td>
        `;
        tbody.appendChild(row);
    });

    updateSeriesTotalPrice(series);
    document.getElementById('seriesModal').style.display = 'block';
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

    if (number && name && !isNaN(price)) {
        const newComic = { number, name, price };
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

renderCollection();
