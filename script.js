const joystick = document.getElementById("joystick");
const stick = document.getElementById("stick");

let dragging = false;

let center = { x: 0, y: 0 };
let maxDist = 50;

// recalcul du centre
function updateCenter() {
    const rect = joystick.getBoundingClientRect();
    center.x = rect.left + rect.width / 2;
    center.y = rect.top + rect.height / 2;
}

updateCenter();
window.addEventListener("resize", updateCenter);

// ------------------ MOUVEMENT VISUEL ------------------

function moveStick(clientX, clientY) {

    let offsetX = clientX - center.x;
    let offsetY = clientY - center.y;

    const dist = Math.sqrt(offsetX * offsetX + offsetY * offsetY);

    // limite dans le cercle
    if (dist > maxDist) {
        offsetX = (offsetX / dist) * maxDist;
        offsetY = (offsetY / dist) * maxDist;
    }

    // déplacement fluide
    stick.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
}

// retour centre
function resetStick() {
    stick.style.transition = "0.2s";
    stick.style.transform = `translate(0px, 0px)`;

    setTimeout(() => {
        stick.style.transition = "0.05s";
    }, 200);
}

// ------------------ EVENTS SOURIS ------------------

joystick.addEventListener("mousedown", (e) => {
    dragging = true;
    updateCenter();
    moveStick(e.clientX, e.clientY);
});

document.addEventListener("mousemove", (e) => {
    if (!dragging) return;
    moveStick(e.clientX, e.clientY);
});

document.addEventListener("mouseup", () => {
    if (!dragging) return;
    dragging = false;
    resetStick();
});

// ------------------ EVENTS MOBILE ------------------

joystick.addEventListener("touchstart", (e) => {
    dragging = true;
    updateCenter();
    moveStick(e.touches[0].clientX, e.touches[0].clientY);
});

document.addEventListener("touchmove", (e) => {
    if (!dragging) return;
    moveStick(e.touches[0].clientX, e.touches[0].clientY);
});

document.addEventListener("touchend", () => {
    if (!dragging) return;
    dragging = false;
    resetStick();
});
