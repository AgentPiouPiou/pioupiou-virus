const socket = io("https://mon-api-mmlc.onrender.com", {
    transports: ["websocket"]
});

const trackpad = document.getElementById("trackpad");
const leftBtn = document.getElementById("left-click");
const rightBtn = document.getElementById("right-click");

let lastX = 0;
let lastY = 0;
let touching = false;

// -------- TRACKPAD --------
function move(x, y){
    let dx = x - lastX;
    let dy = y - lastY;

    lastX = x;
    lastY = y;

    // 🔥 accélération douce
    dx *= 1.5;
    dy *= 1.5;

    socket.emit("move_mouse", {dx, dy});
}

// MOBILE
trackpad.addEventListener("touchstart", e=>{
    touching = true;
    lastX = e.touches[0].clientX;
    lastY = e.touches[0].clientY;
});

trackpad.addEventListener("touchmove", e=>{
    if(!touching) return;

    move(
        e.touches[0].clientX,
        e.touches[0].clientY
    );
});

trackpad.addEventListener("touchend", ()=>{
    touching = false;
});

// PC
trackpad.addEventListener("mousedown", e=>{
    touching = true;
    lastX = e.clientX;
    lastY = e.clientY;
});

document.addEventListener("mousemove", e=>{
    if(!touching) return;
    move(e.clientX, e.clientY);
});

document.addEventListener("mouseup", ()=>{
    touching = false;
});

// -------- CLICS --------
leftBtn.onclick = () => {
    socket.emit("click", {button:"left"});
};

rightBtn.onclick = () => {
    socket.emit("click", {button:"right"});
};

// 🔥 DOUBLE CLIC TRACKPAD
trackpad.addEventListener("dblclick", ()=>{
    socket.emit("click", {button:"left", double:true});
});
