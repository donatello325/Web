let collection = JSON.parse(localStorage.getItem('collection')) || [];
let secondCollection = JSON.parse(localStorage.getItem('secondCollection')) || [];
let isMainTableVisible = true;

function saveCollection() {
    localStorage.setItem('collection', JSON.stringify(collection));
    updateTotalPrice();
    updateTotalComicCount();
}

function saveSecondCollection() {
    localStorage.setItem('secondCollection', JSON.stringify(secondCollection));
    updateTotalPriceSecond();
    updateTotalComicCountSecond();
}

function updateTotalPrice() {
    const total = collection.reduce((sum, item) => sum + item.price, 0);
    document.getElementById('totalPrice').innerText = `Total: ${total}€`;
}

function updateTotalComicCount() {
    let totalComics = 0;
    collection.forEach(item => {
        if (item.type === 'Serie' || item.type === 'Saga') {
            totalComics += item.items.length;
        } else {
            totalComics += 1;
        }
    });
    document.getElementById('totalComicCount').innerText = `Total de cómics: ${totalComics}`;
}

function updateTotalPriceSecond() {
    const total = secondCollection.reduce((sum, item) => sum + item.price, 0);
    document.getElementById('totalPriceSecond').innerText = `Total: ${total}€`;
}

function updateTotalComicCountSecond() {
    let totalComics = 0;
    secondCollection.forEach(item => {
        if (item.type === 'Serie' || item.type === 'Saga') {
            totalComics += item.items.length;
        } else {
            totalComics += 1;
        }
    });
    document.getElementById('totalComicCountSecond').innerText = `Total de cómics: ${totalComics}`;
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
        const averageRating = item.type === 'Serie' || item.type === 'Saga' ? calculateAverageRating(item) : item.rating || "Sin nota";
        const status = item.type === 'Serie' || item.type === 'Saga' ? item.status || 'En curso' : '-';
        const isRead = item.type === 'Serie' || item.type === 'Saga' ? checkIfSeriesIsRead(item) : item.read || false;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.type === 'Serie' || item.type === 'Saga' ? `<a href="#" onclick="openSeries(${index})">${item.name}</a> (${comicCount} cómics)` : item.name}</td>
            <td>${item.type}</td>
            <td>${item.format}</td>
            <td>${item.price}€</td>
            <td>${averageRating}</td>
            <td>${status}</td>
            <td><input type="checkbox" class="checkbox-lectura" ${isRead ? "checked" : ""} onchange="toggleReadStatus(${index})" ${item.type === 'Serie' || item.type === 'Saga' ? "disabled" : ""}></td>
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

function renderSecondCollection() {
    const tbody = document.getElementById('secondCollectionTable').querySelector('tbody');
    tbody.innerHTML = '';
    secondCollection.forEach((item, index) => {
        const comicCount = item.items ? item.items.length : 0;
        const averageRating = item.type === 'Serie' || item.type === 'Saga' ? calculateAverageRating(item) : item.rating || "Sin nota";
        const status = item.type === 'Serie' || item.type === 'Saga' ? item.status || 'En curso' : '-';
        const isRead = item.type === 'Serie' || item.type === 'Saga' ? checkIfSeriesIsRead(item) : item.read || false;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.type === 'Serie' || item.type === 'Saga' ? `<a href="#" onclick="openSeries(${index})">${item.name}</a> (${comicCount} cómics)` : item.name}</td>
            <td>${item.type}</td>
            <td>${item.format}</td>
            <td>${item.price}€</td>
            <td>${averageRating}</td>
            <td>${status}</td>
            <td><input type="checkbox" class="checkbox-lectura" ${isRead ? "checked" : ""} onchange="toggleReadStatus(${index})" ${item.type === 'Serie' || item.type === 'Saga' ? "disabled" : ""}></td>
            <td>
                <button onclick="editComicPrice(${index})">Editar</button>
                <button onclick="editComicRating(${index})">Editar Nota</button>
                <button onclick="deleteComic(${index}, 'second')">Eliminar</button>
            </td>
        `;
        tbody.appendChild(row);
    });
    saveSecondCollection();
}

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

function addComicToSecondTable() {
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
        secondCollection.push(newComic);
        renderSecondCollection();
    }
}

function toggleTable() {
    document.getElementById('mainTableContainer').classList.toggle('hidden');
    document.getElementById('secondTableContainer').classList.toggle('hidden');
    isMainTableVisible = !isMainTableVisible;
}

renderCollection();
renderSecondCollection();
