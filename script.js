document.addEventListener("DOMContentLoaded", function() {
  loadComics();
});

const comicsList = JSON.parse(localStorage.getItem("comicsCollection")) || [];

function openAddComicModal() {
  document.getElementById("addComicModal").style.display = "block";
}

function closeAddComicModal() {
  document.getElementById("addComicModal").style.display = "none";
}

function addComic() {
  const series = document.getElementById("comicSeries").value.trim();
  const number = document.getElementById("comicNumber").value;
  const price = parseFloat(document.getElementById("comicPrice").value);

  if (series && number && !isNaN(price)) {
    comicsList.push({ series, number: parseInt(number), price });
    comicsList.sort((a, b) => a.series.localeCompare(b.series));
    localStorage.setItem("comicsCollection", JSON.stringify(comicsList));
    loadComics();
    closeAddComicModal();
  } else {
    alert("Por favor, completa todos los campos correctamente.");
  }
}

function loadComics() {
  const comicsListElem = document.getElementById("comicsList");
  comicsListElem.innerHTML = "";

  comicsList.forEach((comic, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td onclick="viewSeries('${comic.series}')">${comic.series}</td>
      <td>${comic.number}</td>
      <td>${comic.price.toFixed(2)}
          <button onclick="confirmDelete(${index})" class="delete-btn">X</button>
      </td>
    `;
    comicsListElem.appendChild(row);
  });
}

// Función para confirmar y eliminar un cómic
function confirmDelete(index) {
  const confirmation = confirm("¿Estás seguro de que quieres borrar este cómic?");
  if (confirmation) {
    deleteComic(index);
  }
}

function deleteComic(index) {
  comicsList.splice(index, 1); // Elimina el cómic del array
  localStorage.setItem("comicsCollection", JSON.stringify(comicsList)); // Actualiza el almacenamiento local
  loadComics(); // Recarga la lista
}

function viewSeries(series) {
  const seriesComics = comicsList.filter((comic) => comic.series === series);
  let total = seriesComics.reduce((sum, comic) => sum + comic.price, 0).toFixed(2);
  alert(`Serie: ${series}\nNúmeros: ${seriesComics.map(c => c.number).join(', ')}\nTotal: €${total}`);
}

function filterComics() {
  const filter = document.getElementById("search").value.toLowerCase();
  const rows = document.querySelectorAll("#comicsList tr");

  rows.forEach(row => {
    const series = row.cells[0].textContent.toLowerCase();
    row.style.display = series.includes(filter) ? "" : "none";
  });
}
