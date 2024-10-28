const comicsList = document.getElementById("comics-list");
const addComicBtn = document.getElementById("add-comic-btn");
const comicModal = document.getElementById("comic-modal");
const closeComicModal = document.getElementById("close-comic-modal");
const comicForm = document.getElementById("comic-form");

let comicsCollection = JSON.parse(localStorage.getItem("comicsCollection")) || [];

// Abrir modal de añadir cómic
addComicBtn.addEventListener("click", () => {
  comicForm.reset();
  comicModal.style.display = "flex";
});

// Cerrar modal de añadir cómic
closeComicModal.addEventListener("click", () => {
  comicModal.style.display = "none";
});

// Guardar cómic
comicForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("comic-name").value.trim();
  const type = normalizeType(document.getElementById("comic-type").value.trim());
  const format = normalizeFormat(document.getElementById("comic-format").value.trim());
  const price = parseInt(document.getElementById("comic-price").value) || null;
  const note = parseInt(document.getElementById("comic-note").value) || null;

  if (!validateType(type) || !validateFormat(format)) {
    alert("Datos incorrectos. Por favor, verifica el tipo o formato.");
    return;
  }

  comicsCollection.push({
    name,
    type,
    format,
    price: format === "Tomo Único" ? price : null,
    note: format === "Tomo Único" ? note : null,
    state: format === "Serie" ? "En curso" : "",
    chapters: format === "Serie" ? [] : null
  });
  saveComics();
  renderComics();
  comicModal.style.display = "none";
});

// Normalizar valores de tipo y formato
function normalizeType(type) {
  return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
}

function normalizeFormat(format) {
  return format.toLowerCase().includes("tomo") ? "Tomo Único" : "Serie";
}

// Validar tipo y formato
function validateType(type) {
  return ["Cómic", "Manga"].includes(type);
}

function validateFormat(format) {
  return ["Serie", "Tomo Único"].includes(format);
}

// Guardar colección en localStorage
function saveComics() {
  localStorage.setItem("comicsCollection", JSON.stringify(comicsCollection));
}

// Renderizar cómics en la tabla
function renderComics() {
  comicsList.innerHTML = "";
  comicsCollection.forEach((comic, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${comic.name}</td>
      <td>${comic.type}</td>
      <td>${comic.format}</td>
      <td>${comic.price || "-"}</td>
      <td>${comic.note || "-"}</td>
      <td>${comic.format === "Serie" ? "<select><option>En curso</option><option>Finalizada</option></select>" : "-"}</td>
      <td><input type="checkbox" ${comic.format === "Tomo Único" ? "" : "disabled"}></td>
      <td>
        <button class="edit-btn" onclick="editComic(${index})">Editar</button>
        <button class="delete-btn" onclick="deleteComic(${index})">Eliminar</button>
      </td>
    `;
    comicsList.appendChild(row);
  });
}

// Eliminar cómic
function deleteComic(index) {
  comicsCollection.splice(index, 1);
  saveComics();
  renderComics();
}

// Editar cómic (Tomo Único)
function editComic(index) {
  const comic = comicsCollection[index];
  if (comic.format === "Tomo Único") {
    // Abre modal con datos del tomo único para edición
  } else {
    alert("No se puede editar una serie desde aquí.");
  }
}

// Inicialización
window.onload = renderComics;
