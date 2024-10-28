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
      <td onclick="toggleSeriesDetails(${index})">${comic.name}</td>
      <td>${comic.type}</td>
      <td>${comic.price || "-"}</td>
      <td>${comic.note || "-"}</td>
      <td>${comic.format === "Serie" ? `<select><option>En curso</option><option>Finalizada</option></select>` : "-"}</td>
      <td><input type="checkbox" ${comic.read ? "checked" : ""}></td>
      <td><button class="edit-btn" onclick="editComic(${index})">Editar</button> <button class="delete-btn" onclick="deleteComic(${index})">Eliminar</button></td>
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
      <td colspan="7">
        <div class="series-table-container">
          <h3>${series.name}</h3>
          <table class="series-subtable">
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
            <tbody id="series-tomes-${index}">
            </tbody>
          </table>
          <button onclick="addTome(${index})">Añadir Tomo</button>
          <div id="series-total-${index}">
            <p>Total de la serie: €0</p>
            <p>Número de tomos: 0</p>
          </div>
        </div>
      </td>
    `;
    comicsList.insertBefore(row, document.getElementById(`comic-row-${index}`).nextSibling);
    renderSeriesTomes(index);
  }
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
      <td><input type="checkbox" ${tome.read ? "checked" : ""} onclick="toggleTomeRead(${seriesIndex}, ${tomeIndex})"></td>
      <td>
        <button onclick="editTome(${seriesIndex}, ${tomeIndex})">Editar</button>
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
    <p>Número de tomos: ${series.chapters.length}</p>
  `;
  localStorage.setItem("comicsCollection", JSON.stringify(comicsCollection));
  renderComics();
}

// Marcar un tomo como leído y actualizar el estado de lectura de la serie
function toggleTomeRead(seriesIndex, tomeIndex) {
  const series = comicsCollection[seriesIndex];
  series.chapters[tomeIndex].read = !series.chapters[tomeIndex].read;
  checkSeriesReadStatus(seriesIndex);
}

// Comprobar si todos los tomos de una serie están leídos y actualizar el estado
function checkSeriesReadStatus(seriesIndex) {
  const series = comicsCollection[seriesIndex];
  const allRead = series.chapters.every(tome => tome.read);
  series.read = allRead;
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

// Actualizar totales generales
function updateTotals() {
  const totalCount = comicsCollection.length;
  const totalPrice = comicsCollection.reduce((acc, comic) => acc + (comic.price || 0), 0);
  totalComicsCount.textContent = `Total de cómics: ${totalCount}`;
  totalComicsPrice.textContent = `Total: €${totalPrice}`;
}

// Cargar los datos iniciales
window.onload = () => {
  renderComics();
  updateTotals();
};
