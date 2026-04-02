const joystick = document.getElementById("joystick");
const stick = document.getElementById("stick");

let dragging = false;
let center = { x: 0, y: 0 };
let maxDist = 50;

let dx = 0;
let dy = 0;

// recalcul centre
function updateCenter() {
    const rect = joystick.getBoundingClientRect();
    center.x = rect.left + rect.width / 2;
    center.y = rect.top + rect.height / 2;
}
updateCenter();
window.addEventListener("resize", updateCenter);

// ------------------ LOOP FLUIDE (60 FPS) ------------------

function loop() {
    if (dragging) {
        socket.emit("move_mouse", { dx, dy });
    }
    requestAnimationFrame(loop);
}
loop();

// ------------------ LOGIQUE JOYSTICK ------------------

function moveStick(clientX, clientY) {
    let offsetX = clientX - center.x;
    let offsetY = clientY - center.y;

    const dist = Math.sqrt(offsetX * offsetX + offsetY * offsetY);

    // limite dans le cercle
    if (dist > maxDist) {
        offsetX = (offsetX / dist) * maxDist;
        offsetY = (offsetY / dist) * maxDist;
    }

    // déplacement visuel
    stick.style.transform = `translate(${offsetX}px, ${offsetY}px)`;

    // 🔥 vitesse progressive (effet trackpad)
    const power = dist / maxDist;

    dx = Math.round(offsetX * 0.6 * power);
    dy = Math.round(offsetY * 0.6 * power);
}

// reset
function resetStick() {
    stick.style.transform = `translate(0px, 0px)`;
    dx = 0;
    dy = 0;
}

// ------------------ EVENTS SOURIS ------------------

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

// ------------------ EVENTS MOBILE ------------------

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
