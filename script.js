const socket = io("https://mon-api-mmlc.onrender.com", {
    transports: ["websocket"],
    reconnection: true,
    reconnectionAttempts: 10
});

const screensContainer = document.getElementById("screens-container");
const text = document.getElementById("text");
const card = document.getElementById("card");
const toggleBtn = document.getElementById("toggle-btn");

let visible = false;
let images = {};

// 🔥 DEBUG (IMPORTANT)
socket.on("connect", () => {
    console.log("✅ CONNECTÉ AU SERVEUR");
    socket.emit("status_check");
});

socket.on("disconnect", () => {
    console.log("❌ DÉCONNECTÉ");
});

// ------------------ STATUS ------------------

socket.on("update", data => {
    console.log("STATUS:", data);

    if (data.connected) {
        text.innerText = "Appareil connecté";
        card.classList.add("green");
    } else {
        text.innerText = "Aucun appareil connecté";
        card.classList.remove("green");
    }
});

// ------------------ TOGGLE ------------------

toggleBtn.onclick = () => {
    visible = !visible;

    screensContainer.style.display = visible ? "grid" : "none";
};

// ------------------ VIDEO ------------------

socket.on("frames", data => {
    console.log("FRAMES REÇUES");

    if (!visible) return;

    // 🔥 nettoyage si nombre d'écrans change
    if (Object.keys(images).length !== Object.keys(data).length) {
        screensContainer.innerHTML = "";
        images = {};
    }

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
