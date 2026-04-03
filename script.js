const socket = io("https://mon-api-mmlc.onrender.com", {
    transports: ["websocket"],
    upgrade: false
});

const text = document.getElementById("text");
const card = document.getElementById("card");
const screensContainer = document.getElementById("screens-container");
const toggleBtn = document.getElementById("toggle-btn");

const joystick = document.getElementById("joystick");
const stick = document.getElementById("stick");

let visible = false;
let images = {};
let dragging = false;

let center = {x:0, y:0};
let lastDX = 0;
let lastDY = 0;

const MAX = 50;
const DEADZONE = 8; // zone morte

// ---------------- STATUS FIX MOBILE ----------------
socket.on("connect", () => {
    console.log("connecté");
});

socket.on("update", (data) => {
    if (data.connected) {
        text.innerText = "Appareil connecté";
        card.classList.add("green");
    } else {
        text.innerText = "Aucun appareil connecté";
        card.classList.remove("green");
    }
});

// ---------------- BOUTON ----------------
toggleBtn.addEventListener("click", () => {
    visible = !visible;
    screensContainer.style.display = visible ? "flex" : "none";
});

// ---------------- VIDEO FIX MOBILE ----------------
socket.on("frames", (data) => {
    if (!visible) return;

    screensContainer.innerHTML = ""; // reset (fix bug écrans fantômes)

    Object.keys(data).forEach(key => {
        const img = document.createElement("img");
        img.className = "screen";
        img.src = "data:image/jpeg;base64," + data[key];
        screensContainer.appendChild(img);
    });
});

// ---------------- JOYSTICK ----------------
function updateCenter(){
    const r = joystick.getBoundingClientRect();
    center.x = r.left + r.width / 2;
    center.y = r.top + r.height / 2;
}

function move(x,y){
    let dx = x - center.x;
    let dy = y - center.y;

    let dist = Math.sqrt(dx*dx + dy*dy);

    if(dist > MAX){
        dx = dx / dist * MAX;
        dy = dy / dist * MAX;
        dist = MAX;
    }

    // zone morte (précision)
    if(dist < DEADZONE){
        dx = 0;
        dy = 0;
        dist = 0;
    }

    stick.style.transform = `translate(${dx}px, ${dy}px)`;

    // NORMALISATION
    let nx = dx / MAX;
    let ny = dy / MAX;

    // COURBE (accélération douce)
    let speed = Math.pow(dist / MAX, 2); // exponentiel

    // VITESSE FINALE
    lastDX = nx * speed * 25;
    lastDY = ny * speed * 25;
}

// envoi CONTINU = ultra fluide
setInterval(() => {
    if(dragging){
        socket.emit("move_mouse", {
            dx: lastDX,
            dy: lastDY
        });
    }
}, 16); // ~60 FPS

function reset(){
    stick.style.transform = "translate(0,0)";
    lastDX = 0;
    lastDY = 0;
}

// ---- DESKTOP ----
joystick.addEventListener("mousedown", e=>{
    dragging = true;
    updateCenter();
    move(e.clientX, e.clientY);
});

document.addEventListener("mousemove", e=>{
    if(dragging) move(e.clientX, e.clientY);
});

document.addEventListener("mouseup", ()=>{
    dragging = false;
    reset();
});

// ---- MOBILE (FIX TOTAL) ----
joystick.addEventListener("touchstart", e=>{
    dragging = true;
    updateCenter();
    move(e.touches[0].clientX, e.touches[0].clientY);
}, {passive:false});

document.addEventListener("touchmove", e=>{
    if(!dragging) return;
    move(e.touches[0].clientX, e.touches[0].clientY);
}, {passive:false});

document.addEventListener("touchend", ()=>{
    dragging = false;
    reset();
});
