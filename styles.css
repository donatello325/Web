let collection = JSON.parse(localStorage.getItem('collection')) || [];

function saveCollection() {
    localStorage.setItem('collection', JSON.stringify(collection));
    updateTotalInfo();
}

function updateTotalInfo() {
    const totalPrice = collection.reduce((sum, item) => sum + item.price, 0);
    let totalComics = 0;
    collection.forEach(item => {
        if (item.type === 'Serie') {
            totalComics += item.items.length;
        } else {
            totalComics += 1;
        }
    });
    document.getElementById('totalPrice').textContent = `Total: ${totalPrice}€`;
    document.getElementById('totalComicCount').textContent = `Total de cómics: ${totalComics}`;
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
            <td>${item.type === 'Serie' || item.type === 'Saga' ? getSeriesStatusSelect(item, index) : '-'}</td>
            <td><input type="checkbox" class="checkbox-lectura" ${isRead ? "checked" : ""} onchange="toggleReadStatus(${index})" ${item.type === 'Serie' || item.type === 'Saga' ? "disabled" : ""}></td>
            <td>
                <button onclick="editComicPrice(${index})">Editar</button>
                <button onclick="editComicRating(${index})">Editar Nota</button>
                <button onclick="deleteComic(${index})">Eliminar</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function addComic() {
    const name = prompt('Nombre de la Serie/Saga/Tomo Único:');
    const type = prompt('Tipo (Serie/Saga/Tomo Único):');
    const format = prompt('Formato (Cómic/Manga/Libro):');
    const price = parseFloat(prompt('Precio:'));
    const rating = type === 'Tomo Único' ? parseInt(prompt('Nota (1-10):')) : null;

    if (!name || !type || !format || isNaN(price) || (rating && (rating < 1 || rating > 10))) {
        alert('Por favor, ingrese todos los valores correctamente.');
        return;
    }

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

renderCollection();
updateTotalInfo();
