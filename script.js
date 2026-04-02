const joystick = document.getElementById("joystick");
const stick = document.getElementById("stick");

let dragging = false;
let center = { x: 0, y: 0 };
let maxDist = 50;

function updateCenter() {
    const rect = joystick.getBoundingClientRect();
    center.x = rect.left + rect.width / 2;
    center.y = rect.top + rect.height / 2;
}

updateCenter();
window.addEventListener("resize", updateCenter);

// ------------------ MOVE LOOP (ULTRA FLUIDE) ------------------

let dx = 0;
let dy = 0;

setInterval(() => {
    if (dx !== 0 || dy !== 0) {
        socket.emit("move_mouse", { dx, dy });
    }
}, 16); // ~60 FPS

// ------------------ INPUT ------------------

function moveStick(clientX, clientY) {
    let offsetX = clientX - center.x;
    let offsetY = clientY - center.y;

    const dist = Math.sqrt(offsetX * offsetX + offsetY * offsetY);

    if (dist > maxDist) {
        offsetX = (offsetX / dist) * maxDist;
        offsetY = (offsetY / dist) * maxDist;
    }

    stick.style.transform = `translate(${offsetX}px, ${offsetY}px)`;

    // 💥 vitesse proportionnelle (effet analogique)
    dx = Math.round(offsetX * 0.4);
    dy = Math.round(offsetY * 0.4);
}

function resetStick() {
    stick.style.transform = `translate(0px, 0px)`;
    dx = 0;
    dy = 0;
}

// ----- souris -----

joystick.addEventListener("mousedown", (e) => {
    dragging = true;
    moveStick(e.clientX, e.clientY);
});

document.addEventListener("mousemove", (e) => {
    if (!dragging) return;
    moveStick(e.clientX, e.clientY);
});

document.addEventListener("mouseup", () => {
    dragging = false;
    resetStick();
});

// ----- tactile -----

joystick.addEventListener("touchstart", (e) => {
    dragging = true;
    moveStick(e.touches[0].clientX, e.touches[0].clientY);
});

document.addEventListener("touchmove", (e) => {
    if (!dragging) return;
    moveStick(e.touches[0].clientX, e.touches[0].clientY);
});

document.addEventListener("touchend", () => {
    dragging = false;
    resetStick();
});
