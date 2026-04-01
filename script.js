const socket = io("https://mon-api-mmlc.onrender.com", { transports: ["websocket"] });

const text = document.getElementById("text");
const card = document.getElementById("card");
const screensContainer = document.getElementById("screens-container");
const toggleControls = document.getElementById("toggle-controls");
const mouseControls = document.getElementById("mouse-controls");

// Afficher/cacher les contrôles de souris
toggleControls.addEventListener("click", () => {
    mouseControls.classList.toggle("hidden");
});

socket.on("update", (data) => {
    if (data.connected) {
        text.innerText = "Appareil connecté";
        card.className = "card green";
    } else {
        text.innerText = "Aucun appareil connecté";
        card.className = "card red";
        screensContainer.innerHTML = ""; // nettoyer les écrans
    }
});

socket.on("frames", (data) => {
    // data doit être un objet avec plusieurs écrans, par ex : { "0": "base64...", "1": "base64..." }
    screensContainer.innerHTML = ""; 
    for (let i in data) {
        const img = document.createElement("img");
        img.src = "data:image/jpeg;base64," + data[i];
        img.className = "screen";
        screensContainer.appendChild(img);
    }
});
