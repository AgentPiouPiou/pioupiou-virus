const socket = io("https://mon-api-mmlc.onrender.com", {
    transports: ["websocket"]
});

const screensContainer = document.getElementById("screens-container");
const cursor = document.getElementById("cursor");

let images = {};
let visible = false;

// -------- STATUS --------
socket.on("update", data => {
    document.getElementById("text").innerText =
        data.connected ? "Connecté" : "Déconnecté";

    document.getElementById("card").className =
        data.connected ? "card green" : "card red";
});

// -------- TOGGLE --------
document.getElementById("toggle-btn").onclick = () => {
    visible = !visible;
    screensContainer.style.display = visible ? "grid" : "none";
};

// -------- VIDEO OPTI --------
socket.on("frames", data => {
    if (!visible) return;

    Object.keys(data).forEach(k => {
        if (!images[k]) {
            let img = document.createElement("img");
            img.className = "screen";
            screensContainer.appendChild(img);
            images[k] = img;
        }
        images[k].src = "data:image/jpeg;base64," + data[k];
    });
});

// -------- JOYSTICK --------
const joystick = document.getElementById("joystick");
const stick = document.getElementById("stick");

let center = {x:0,y:0};
let dragging = false;

let dx = 0;
let dy = 0;

const MAX = 60;

function updateCenter(){
    let r = joystick.getBoundingClientRect();
    center.x = r.left + r.width/2;
    center.y = r.top + r.height/2;
}

function move(x,y){
    let mx = x - center.x;
    let my = y - center.y;

    let dist = Math.sqrt(mx*mx + my*my);

    if(dist > MAX){
        mx = mx/dist*MAX;
        my = my/dist*MAX;
        dist = MAX;
    }

    stick.style.transform = `translate(${mx}px,${my}px)`;

    // 🔥 vitesse douce
    let speed = Math.pow(dist/MAX, 1.5);

    dx = mx * speed * 0.4;
    dy = my * speed * 0.4;
}

// LOOP souris + curseur
setInterval(()=>{
    if(dragging){
        socket.emit("move_mouse", {dx, dy});

        // curseur local
        let rect = screensContainer.getBoundingClientRect();
        cursor.style.left = (rect.left + rect.width/2 + dx*10) + "px";
        cursor.style.top = (rect.top + rect.height/2 + dy*10) + "px";
    }
},16);

function reset(){
    stick.style.transform = "translate(0,0)";
    dx = 0;
    dy = 0;
}

// EVENTS
joystick.onmousedown = e=>{
    dragging = true;
    updateCenter();
    move(e.clientX, e.clientY);
};

document.onmousemove = e=>{
    if(dragging) move(e.clientX, e.clientY);
};

document.onmouseup = ()=>{
    dragging = false;
    reset();
};

// MOBILE
joystick.ontouchstart = e=>{
    dragging = true;
    updateCenter();
    move(e.touches[0].clientX, e.touches[0].clientY);
};

document.ontouchmove = e=>{
    if(dragging) move(e.touches[0].clientX, e.touches[0].clientY);
};

document.ontouchend = ()=>{
    dragging = false;
    reset();
};
