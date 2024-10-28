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

let comicsCollection = JSON.parse(localStorage.getItem("comicsCollection")) || [];

addComicBtn.addEventListener("click", () => {
  comicForm.reset();
  document.getElementById("modal-title").textContent = "Añadir Cómic";
  modal.style.display = "flex";
});

closeModal.addEventListener("click", () => {
  modal.style.display = "none";
});

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
    price: comicPrice,
    note: comicNote,
    state: "En curso",
    read: false
  };

  comicsCollection.push(formattedComic);
  localStorage.setItem("comicsCollection", JSON.stringify(comicsCollection));
  displayComic(formattedComic);
  modal.style.display = "none";
  updateTotals();
});

function displayComic(comic) {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${comic.name}</td>
    <td>${comic.type}</td>
    <td>${comic.format}</td>
    <td>${comic.price || "-"}</td>
    <td>${comic.note || "-"}</td>
    <td><select><option ${comic.state === "En curso" ? "selected" : ""}>En curso</option><option ${comic.state === "Finalizada" ? "selected" : ""}>Finalizada</option></select></td>
    <td><input type="checkbox" ${comic.read ? "checked" : ""}></td>
    <td><button class="edit-btn">Editar</button></td>
  `;
  comicsList.appendChild(row);
}

function loadComics() {
  comicsCollection.forEach(comic => displayComic(comic));
  updateTotals();
}

function updateTotals() {
  const totalCount = comicsCollection.length;
  const totalPrice = comicsCollection.reduce((acc, comic) => acc + (comic.price || 0), 0);
  totalComicsCount.textContent = `Total de Cómics: ${totalCount}`;
  totalComicsPrice.textContent = `Total en Euros: €${totalPrice}`;
}

window.onload = loadComics;
window.onclick = function(event) {
  if (event.target === modal) {
    modal.style.display = "none";
  }
};
