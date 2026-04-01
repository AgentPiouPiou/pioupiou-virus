const socket = io("https://mon-api-mmlc.onrender.com", { transports: ["websocket"] });

const text = document.getElementById("text");
const card = document.getElementById("card");
const screensContainer = document.getElementById("screens-container");

socket.on("update", (data) => {
    if (data.connected) {
        text.innerText = "Appareil connecté";
        card.className = "card green";
    } else {
        text.innerText = "Aucun appareil connecté";
        card.className = "card red";
        screensContainer.innerHTML = "";
    }
});

socket.on("frames", (data) => {
    screensContainer.innerHTML = "";

    // Compter les écrans
    const screenKeys = Object.keys(data).filter(k => k !== "mouse");
    const screenCount = screenKeys.length;
    document.documentElement.style.setProperty('--screen-count', screenCount);

    for (let i of screenKeys) {
        const img = document.createElement("img");
        img.src = "data:image/jpeg;base64," + data[i];
        img.className = "screen";
        screensContainer.appendChild(img);
    }
});
