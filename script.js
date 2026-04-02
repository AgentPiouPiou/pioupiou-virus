document.addEventListener("DOMContentLoaded", () => {

const socket = io("https://mon-api-mmlc.onrender.com", { transports: ["websocket"] });

const text = document.getElementById("text");
const card = document.getElementById("card");
const screensContainer = document.getElementById("screens-container");
const toggleBtn = document.getElementById("toggle-btn");
const controls = document.getElementById("controls");

let images = {};
let visible = false;

// ------------------ BOUTON ------------------

toggleBtn.onclick = () => {
    visible = !visible;

    screensContainer.style.display = visible ? "grid" : "none";
    controls.style.display = visible ? "flex" : "none";

    toggleBtn.innerText = visible ? "Masquer écrans" : "Afficher écrans";
};

// ------------------ STATUS ------------------

socket.on("update", (data) => {
    if (data.connected) {
        text.innerText = "Appareil connecté";
        card.className = "card green";
    } else {
        text.innerText = "Aucun appareil connecté";
        card.className = "card red";
        screensContainer.innerHTML = "";
        images = {};
    }
});

// ------------------ VIDEO ------------------

socket.on("frames", (data) => {
    if (!visible) return;

    for (let key in data) {

        if (!images[key]) {
            const img = document.createElement("img");
            img.className = "screen";
            screensContainer.appendChild(img);
            images[key] = img;
        }

        images[key].src = "data:image/jpeg;base64," + data[key];
    }
});

});
