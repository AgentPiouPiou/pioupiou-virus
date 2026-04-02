document.addEventListener("DOMContentLoaded", () => {

const socket = io("https://mon-api-mmlc.onrender.com", { transports: ["websocket"] });

const text = document.getElementById("text");
const card = document.getElementById("card");
const screensContainer = document.getElementById("screens-container");
const toggleBtn = document.getElementById("toggle-btn");

const joystick = document.getElementById("joystick");
const stick = document.getElementById("stick");
const speedSlider = document.getElementById("speed");

let visible = false;
let images = {};
let dragging = false;
let center = {x:0, y:0};
const maxDist = 50; // rayon joystick

// ------------------ STATUS ------------------
socket.on("update", (data) => {
    if (data.connected) {
        text.innerText = "Appareil connecté";
        card.classList.add("green");
    } else {
        text.innerText = "Aucun appareil connecté";
        card.classList.remove("green");
    }
});

// ------------------ BOUTON ------------------
toggleBtn.addEventListener("click", () => {
    visible = !visible;
    screensContainer.style.display = visible ? "flex" : "none";
});

// ------------------ VIDEO ------------------
socket.on("frames", (data) => {
    if (!visible) return;

    Object.keys(data).forEach(key => {
        if (!images[key]) {
            const img = document.createElement("img");
            img.className = "screen";
            screensContainer.appendChild(img);
            images[key] = img;
        }
        images[key].src = "data:image/jpeg;base64," + data[key];
    });
});

// ------------------ JOYSTICK ------------------
function updateCenter() {
    const rect = joystick.getBoundingClientRect();
    center.x = rect.left + rect.width / 2;
    center.y = rect.top + rect.height / 2;
}

function moveStick(x, y) {
    let dx = x - center.x;
    let dy = y - center.y;
    const dist = Math.sqrt(dx*dx + dy*dy);
    if(dist > maxDist){
        dx = dx/dist * maxDist;
        dy = dy/dist * maxDist;
    }
    stick.style.transform = `translate(${dx}px, ${dy}px)`;

    // --- Envoie direction souris ---
    const speed = speedSlider.value;
    const normX = dx / maxDist;
    const normY = dy / maxDist;
    socket.emit("mouse_move", {dx: normX * speed, dy: normY * speed});
}

function resetStick() {
    stick.style.transform = "translate(0px, 0px)";
}

// ---- MOUSE ----
joystick.addEventListener("mousedown", e => {
    dragging = true;
    updateCenter();
    moveStick(e.clientX, e.clientY);
});
document.addEventListener("mousemove", e => {
    if(!dragging) return;
    moveStick(e.clientX, e.clientY);
});
document.addEventListener("mouseup", () => {
    dragging = false;
    resetStick();
});

// ---- TOUCH ----
joystick.addEventListener("touchstart", e => {
    dragging = true;
    updateCenter();
    moveStick(e.touches[0].clientX, e.touches[0].clientY);
});
document.addEventListener("touchmove", e => {
    if(!dragging) return;
    moveStick(e.touches[0].clientX, e.touches[0].clientY);
});
document.addEventListener("touchend", () => {
    dragging = false;
    resetStick();
});

});
