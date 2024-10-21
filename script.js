document.addEventListener("DOMContentLoaded", function() {
    // Selección de enlaces del menú de navegación
    const links = document.querySelectorAll("nav ul li a");
    const sections = document.querySelectorAll("section");

    // Añadir comportamiento de desplazamiento suave al hacer clic en el menú de navegación
    links.forEach(link => {
        link.addEventListener("click", function(e) {
            e.preventDefault();
            const targetSection = document.querySelector(this.getAttribute("href"));
            targetSection.scrollIntoView({ behavior: "smooth" });
        });
    });

    // Deslizador de imágenes (catálogo)
    let currentSlide = 0;
    const slides = document.querySelectorAll(".slide");
    const totalSlides = slides.length;

    // Función para avanzar a la siguiente diapositiva
    function nextSlide() {
        slides[currentSlide].style.display = "none";
        currentSlide = (currentSlide + 1) % totalSlides;
        slides[currentSlide].style.display = "block";
    }

    // Establecer un intervalo para cambiar de diapositiva cada 5 segundos
    setInterval(nextSlide, 5000);

    // Funcionalidad del buscador
    const searchForm = document.getElementById("search-form");
    const searchInput = document.getElementById("search-input");

    // Al enviar el formulario de búsqueda
    searchForm.addEventListener("submit", function(e) {
        e.preventDefault();
        const query = searchInput.value.toLowerCase().trim();

        // Verificar si coincide con "El Padrino" para redirigir a la ficha
        if (query === 'el padrino') {
            window.location.href = 'fichas/el_padrino.html'; // Cambia a la URL de la ficha
        } else {
            let found = false;
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
        }
    });
});
