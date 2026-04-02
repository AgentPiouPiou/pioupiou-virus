const socket = io("https://mon-api-mmlc.onrender.com", { transports: ["websocket"] });

const text = document.getElementById("text");
const card = document.getElementById("card");
const screensContainer = document.getElementById("screens-container");
const toggleBtn = document.getElementById("toggle-btn");
const controls = document.getElementById("controls");

let images = {};
let visible = false;

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

// ------------------ TOGGLE ECRANS ------------------

toggleBtn.onclick = () => {
    visible = !visible;

    screensContainer.style.display = visible ? "flex" : "none";
    controls.style.display = visible ? "flex" : "none";

    toggleBtn.innerText = visible ? "Masquer écrans" : "Afficher écrans";
};

// ------------------ VIDEO ------------------

socket.on("frames", (data) => {

    if (!visible) return; // 🚀 ne rien afficher si caché

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

// ------------------ JOYSTICK ------------------

const speed = 20;

document.querySelectorAll(".dpad button").forEach(btn => {
    btn.addEventListener("click", () => {
        const dir = btn.dataset.dir;

        let dx = 0;
        let dy = 0;

        if (dir === "up") dy = -speed;
        if (dir === "down") dy = speed;
        if (dir === "left") dx = -speed;
        if (dir === "right") dx = speed;

        socket.emit("move_mouse", { dx, dy });
    });
});
