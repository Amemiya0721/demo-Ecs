document.addEventListener("DOMContentLoaded", async () => {

    const navbar = document.getElementById("navbar-container");

    if (navbar) {
        const response = await fetch("components/nav.html");
        navbar.innerHTML = await response.text();
    }

});