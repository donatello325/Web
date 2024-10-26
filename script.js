function updateProgressBars() {
    const comicsRead = calculateReadPercentage('comics');
    const booksRead = calculateReadPercentage('books');
    const showsRead = calculateReadPercentage('shows');

    document.getElementById('comicsProgress').innerText = `${comicsRead}%`;
    document.getElementById('booksProgress').innerText = `${booksRead}%`;
    document.getElementById('showsProgress').innerText = `${showsRead}%`;

    document.getElementById('comicsProgressBar').style.width = `${comicsRead}%`;
    document.getElementById('booksProgressBar').style.width = `${booksRead}%`;
    document.getElementById('showsProgressBar').style.width = `${showsRead}%`;
}

function calculateReadPercentage(type) {
    let totalItems = collection.filter(item => item.category === type).length;
    let readItems = collection.filter(item => item.category === type && item.read).length;

    return totalItems > 0 ? ((readItems / totalItems) * 100).toFixed(0) : 0;
}
