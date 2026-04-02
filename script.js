const socket = io("https://mon-api-mmlc.onrender.com", { transports: ["websocket"] });

const text = document.getElementById("text");
const card = document.getElementById("card");
const screensContainer = document.getElementById("screens-container");

let images = {};

socket.on("update", (data) => {
    if (data.connected) {
        text.innerText = "Appareil connecté";
        card.className = "card green";
    } else {
        text.innerText = "Aucun appareil connecté";
        card.className = "card red";
        screensContainer.innerHTML = "";
        images = {};
    }
});

socket.on("frames", (data) => {
    for (let key in data) {

        if (!images[key]) {
            const img = document.createElement("img");
            img.className = "screen";
            screensContainer.appendChild(img);
            images[key] = img;
        }

        images[key].src = "data:image/jpeg;base64," + data[key];
    }
});
