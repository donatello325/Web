document.addEventListener("DOMContentLoaded", function() {
    // Selección de enlaces del menú de navegación
    const links = document.querySelectorAll("nav ul li a");
    const sections = document.querySelectorAll("section");

    links.forEach(link => {
        link.addEventListener("click", function(e) {
            e.preventDefault();
            const targetSection = document.querySelector(this.getAttribute("href"));
            targetSection.scrollIntoView({ behavior: "smooth" });
        });
    });

    // Deslizador de imágenes (catalogo)
    let currentSlide = 0;
    const slides = document.querySelectorAll(".slide");
    const totalSlides = slides.length;

    function nextSlide() {
        slides[currentSlide].style.display = "none";
        currentSlide = (currentSlide + 1) % totalSlides;
        slides[currentSlide].style.display = "block";
    }

    setInterval(nextSlide, 5000);

    // Funcionalidad del buscador
    const searchForm = document.getElementById("search-form");
    const searchInput = document.getElementById("search-input");

    searchForm.addEventListener("submit", function(e) {
        e.preventDefault();
        const query = searchInput.value.toLowerCase();

        // Filtrar secciones según el texto ingresado en el campo de búsqueda
        let found = false;  // Para detectar si encontramos coincidencias
        sections.forEach(section => {
            const sectionTitle = section.querySelector("h2").textContent.toLowerCase();
            if (sectionTitle.includes(query)) {
                section.scrollIntoView({ behavior: "smooth" });
                found = true;
            }
        });

        if (!found) {
            alert("No se encontraron coincidencias.");
        }
    });
});
