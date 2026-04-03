const socket = io("https://mon-api-mmlc.onrender.com", {transports:["websocket"]});

const joystick = document.getElementById("joystick");
const stick = document.getElementById("stick");

let center = {x:0,y:0};
let dragging = false;

const MAX = 50;

// UPDATE CENTER
function updateCenter(){
    const r = joystick.getBoundingClientRect();
    center.x = r.left + r.width/2;
    center.y = r.top + r.height/2;
}

// MOVE
function move(x,y){
    let dx = x - center.x;
    let dy = y - center.y;

    const dist = Math.sqrt(dx*dx+dy*dy);

    if(dist > MAX){
        dx = dx/dist*MAX;
        dy = dy/dist*MAX;
    }

    stick.style.transform = `translate(${dx}px,${dy}px)`;

    // vitesse dynamique
    const speed = dist / MAX;

    socket.emit("move_mouse", {
        dx: dx * 0.3 * speed * 20,
        dy: dy * 0.3 * speed * 20
    });
}

// RESET
function reset(){
    stick.style.transform = "translate(0,0)";
}

// LOOP CONTINU
setInterval(()=>{
    if(dragging){
        // envoie continu pour fluidité
    }
},16);

// EVENTS
joystick.addEventListener("mousedown", e=>{
    dragging=true;
    updateCenter();
    move(e.clientX,e.clientY);
});
document.addEventListener("mousemove", e=>{
    if(dragging) move(e.clientX,e.clientY);
});
document.addEventListener("mouseup", ()=>{
    dragging=false;
    reset();
});

joystick.addEventListener("touchstart", e=>{
    dragging=true;
    updateCenter();
    move(e.touches[0].clientX,e.touches[0].clientY);
});
document.addEventListener("touchmove", e=>{
    if(dragging) move(e.touches[0].clientX,e.touches[0].clientY);
});
document.addEventListener("touchend", ()=>{
    dragging=false;
    reset();
});
