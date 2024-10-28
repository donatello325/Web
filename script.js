const comicsList = document.getElementById("comics-list");
const addComicBtn = document.getElementById("add-comic-btn");
const modal = document.getElementById("modal");
const closeModal = document.getElementById("close-modal");
const comicForm = document.getElementById("comic-form");
const comicNameInput = document.getElementById("comic-name");
const comicTypeInput = document.getElementById("comic-type");
const comicFormatInput = document.getElementById("comic-format");
const comicPriceInput = document.getElementById("comic-price");
const comicNoteInput = document.getElementById("comic-note");
const totalComicsCount = document.getElementById("total-count");
const totalComicsPrice = document.getElementById("total-price");

const tomoModal = document.getElementById("tomo-modal");
const closeTomoModal = document.getElementById("close-tomo-modal");
const tomoForm = document.getElementById("tomo-form");
const tomoNameInput = document.getElementById("tomo-name");
const tomoPriceInput = document.getElementById("tomo-price");
const tomoNoteInput = document.getElementById("tomo-note");

let comicsCollection = JSON.parse(localStorage.getItem("comicsCollection")) || [];
let currentSeriesIndex = null;
let editingTomeIndex = null;

// Cambiar color de fondo del encabezado de la tabla principal
function changeMainTableColor() {
  const color = document.getElementById("main-bg-color").value;
  document.getElementById("comics-table").style.backgroundColor = color;
}

// Mostrar modal de añadir cómic
addComicBtn.addEventListener("click", () => {
  comicForm.reset();
  document.getElementById("modal-title").textContent = "Añadir Serie/Tomo Único";
  modal.style.display = "flex";
});

// Cerrar modal de cómic
closeModal.addEventListener("click", () => {
  modal.style.display = "none";
});

// Guardar datos del cómic en el almacenamiento local
comicForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const comicName = comicNameInput.value.trim();
  const comicType = comicTypeInput.value.trim().toLowerCase();
  const comicFormat = comicFormatInput.value.trim().toLowerCase();
  const comicPrice = parseInt(comicPriceInput.value) || 0;
  const comicNote = parseInt(comicNoteInput.value) || 0;

  if (!["cómic", "manga"].includes(comicType)) {
    alert("Tipo inválido. Acepta: Cómic o Manga");
    return;
  }

  if (!["serie", "tomo único"].includes(comicFormat)) {
    alert("Formato inválido. Acepta: Serie o Tomo Único");
    return;
  }

  const formattedComic = {
    name: comicName,
    type: comicType.charAt(0).toUpperCase() + comicType.slice(1),
    format: comicFormat.charAt(0).toUpperCase() + comicFormat.slice(1),
    price: comicFormat === "tomo único" ? comicPrice : 0,
    note: comicFormat === "tomo único" ? comicNote : null,
    state: comicFormat === "serie" ? "En curso" : null,
    read: false,
    chapters: []
  };

  comicsCollection.push(formattedComic);
  localStorage.setItem("comicsCollection", JSON.stringify(comicsCollection));
  renderComics();
  modal.style.display = "none";
  updateTotals();
});

// Renderizar la lista de cómics
function renderComics() {
  comicsList.innerHTML = "";
  comicsCollection.forEach((comic, index) => {
    const row = document.createElement("tr");
    row.id = `comic-row-${index}`;
    row.innerHTML = `
      <td onclick="toggleSeriesDetails(${index})">${comic.name} (${comic.chapters.length} cómics)</td>
      <td>${comic.type}</td>
      <td>${comic.price || "-"}</td>
      <td>${comic.note || "-"}</td>
      <td>
        <button class="edit-btn" onclick="editComic(${index})">Editar</button>
        <button class="delete-btn" onclick="deleteComic(${index})">Eliminar</button>
      </td>
    `;
    comicsList.appendChild(row);
  });
}

// Función para alternar la vista de tomos de una serie
function toggleSeriesDetails(index) {
  const series = comicsCollection[index];
  const seriesRow = document.getElementById(`series-row-${index}`);
  
  if (seriesRow) {
    seriesRow.remove();
  } else {
    const row = document.createElement("tr");
    row.id = `series-row-${index}`;
    row.innerHTML = `
      <td colspan="5">
        <div class="series-table-container">
          <h3>${series.name}</h3>
          <label for="series-bg-color-${index}">Cambiar color de fondo del encabezado de la serie:</label>
          <select id="series-bg-color-${index}" onchange="changeSeriesTableColor(${index})">
            <option value="white">Blanco</option>
            <option value="lightgrey">Gris Claro</option>
          </select>
          <table class="series-subtable" id="series-table-${index}">
            <thead>
              <tr>
                <th>Número</th>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Nota</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody id="series-tomes-${index}">
            </tbody>
          </table>
          <button onclick="addTome(${index})">Añadir Número</button>
          <button onclick="toggleSeriesDetails(${index})">Cerrar</button>
          <div id="series-total-${index}">
            <p>Total de la serie: €${series.price}</p>
            <p>Número de cómics: ${series.chapters.length}</p>
          </div>
        </div>
      </td>
    `;
    comicsList.insertBefore(row, document.getElementById(`comic-row-${index}`).nextSibling);
    renderSeriesTomes(index);
  }
}

// Cambiar color de fondo del encabezado de la serie
function changeSeriesTableColor(seriesIndex) {
  const color = document.getElementById(`series-bg-color-${seriesIndex}`).value;
  document.getElementById(`series-table-${seriesIndex}`).style.backgroundColor = color;
}

// Renderizar tomos de una serie específica
function renderSeriesTomes(seriesIndex) {
  const series = comicsCollection[seriesIndex];
  const seriesTomesList = document.getElementById(`series-tomes-${seriesIndex}`);
  seriesTomesList.innerHTML = "";

  series.chapters.forEach((tome, tomeIndex) => {
    const tomeRow = document.createElement("tr");
    tomeRow.innerHTML = `
      <td>${tomeIndex + 1}</td>
      <td>${tome.name}</td>
      <td>${tome.price}€</td>
      <td>${tome.note}</td>
      <td>
        <button onclick="editTome(${seriesIndex}, ${tomeIndex})">Editar Nota</button>
        <button onclick="deleteTome(${seriesIndex}, ${tomeIndex})">Eliminar</button>
      </td>
    `;
    seriesTomesList.appendChild(tomeRow);
  });
  updateSeriesTotals(seriesIndex);
}

// Función para abrir el modal de añadir tomo
function addTome(seriesIndex) {
  currentSeriesIndex = seriesIndex;
  editingTomeIndex = null;
  tomoForm.reset();
  tomoModal.style.display = "flex";
}

// Función para abrir el modal de editar tomo
function editTome(seriesIndex, tomeIndex) {
  currentSeriesIndex = seriesIndex;
  editingTomeIndex = tomeIndex;
  const tome = comicsCollection[seriesIndex].chapters[tomeIndex];
  tomoNameInput.value = tome.name;
  tomoPriceInput.value = tome.price;
  tomoNoteInput.value = tome.note;
  tomoModal.style.display = "flex";
}

// Cerrar modal de tomo
closeTomoModal.addEventListener("click", () => {
  tomoModal.style.display = "none";
});

// Guardar o editar tomo en la serie
tomoForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const name = tomoNameInput.value.trim();
  const price = parseInt(tomoPriceInput.value);
  const note = parseInt(tomoNoteInput.value);

  const newTome = { name, price, note, read: false };

  if (editingTomeIndex !== null) {
    comicsCollection[currentSeriesIndex].chapters[editingTomeIndex] = newTome;
  } else {
    comicsCollection[currentSeriesIndex].chapters.push(newTome);
  }

  localStorage.setItem("comicsCollection", JSON.stringify(comicsCollection));
  renderSeriesTomes(currentSeriesIndex);
  updateSeriesTotals(currentSeriesIndex);
  tomoModal.style.display = "none";
});

// Cálculo de precio y nota de la serie
function updateSeriesTotals(seriesIndex) {
  const series = comicsCollection[seriesIndex];
  const total = series.chapters.reduce((acc, tome) => acc + tome.price, 0);
  const averageNote = series.chapters.reduce((acc, tome) => acc + tome.note, 0) / series.chapters.length || 0;

  series.price = total;
  series.note = averageNote.toFixed(1);
  document.getElementById(`series-total-${seriesIndex}`).innerHTML = `
    <p>Total de la serie: €${total}</p>
    <p>Número de cómics: ${series.chapters.length}</p>
  `;
  localStorage.setItem("comicsCollection", JSON.stringify(comicsCollection));
  renderComics();
}

// Eliminar un cómic o serie
function deleteComic(index) {
  comicsCollection.splice(index, 1);
  localStorage.setItem("comicsCollection", JSON.stringify(comicsCollection));
  renderComics();
  updateTotals();
}

// Eliminar un tomo de una serie
function deleteTome(seriesIndex, tomeIndex) {
  comicsCollection[seriesIndex].chapters.splice(tomeIndex, 1);
  localStorage.setItem("comicsCollection", JSON.stringify(comicsCollection));
  renderSeriesTomes(seriesIndex);
  updateSeriesTotals(seriesIndex);
}

// Actualizar totales generales
function updateTotals() {
  const totalCount = comicsCollection.reduce((acc, comic) => acc + (comic.format === "Serie" ? comic.chapters.length : 1), 0);
  const totalPrice = comicsCollection.reduce((acc, comic) => acc + (comic.price || 0), 0);
  totalComicsCount.textContent = `Total de cómics: ${totalCount}`;
  totalComicsPrice.textContent = `Total: €${totalPrice}`;
}

// Cargar los datos iniciales
window.onload = () => {
  renderComics();
  updateTotals();
};
