const socket = io("https://mon-api-mmlc.onrender.com", {
    transports: ["websocket"]
});

const trackpad = document.getElementById("trackpad");

let lastX = 0;
let lastY = 0;
let touching = false;
let dragging = false;

// -------- MOVE --------
function move(x, y){
    let dx = x - lastX;
    let dy = y - lastY;

    lastX = x;
    lastY = y;

    dx *= 1.4;
    dy *= 1.4;

    socket.emit("move_mouse", {dx, dy});
}

// -------- TOUCH --------
trackpad.addEventListener("touchstart", e=>{
    touching = true;
    lastX = e.touches[0].clientX;
    lastY = e.touches[0].clientY;
});

trackpad.addEventListener("touchmove", e=>{
    if(!touching) return;
    move(e.touches[0].clientX, e.touches[0].clientY);
});

trackpad.addEventListener("touchend", ()=>{
    touching = false;

    if(dragging){
        socket.emit("click", {button:"left", up:true});
        dragging = false;
    }
});

// -------- DOUBLE CLICK HOLD = DRAG --------
let clickTimeout;

trackpad.addEventListener("dblclick", ()=>{
    socket.emit("click", {button:"left", down:true});
    dragging = true;
});

// -------- PC --------
trackpad.addEventListener("mousedown", e=>{
    touching = true;
    lastX = e.clientX;
    lastY = e.clientY;
});

document.addEventListener("mousemove", e=>{
    if(touching) move(e.clientX, e.clientY);
});

document.addEventListener("mouseup", ()=>{
    touching = false;

    if(dragging){
        socket.emit("click", {button:"left", up:true});
        dragging = false;
    }
});

// -------- BUTTONS --------
document.getElementById("left-click").onclick = ()=>{
    socket.emit("click", {button:"left"});
};

document.getElementById("right-click").onclick = ()=>{
    socket.emit("click", {button:"right"});
};
