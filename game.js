let currentEntry = "1";
let entries;

window.onload = () => {
if (typeof gameEntries !== "undefined") {
entries = gameEntries;
showEntry(currentEntry);
} else {
document.getElementById("entry-text").innerText = "Error loading entries.";
}

// Unmute & play audio on first user gesture
document.body.addEventListener("click", () => {
const audio = document.getElementById("bg-audio");
if (audio.paused || !audio.src) {
audio.src = "layer-crumb.mp3";
audio.load();
audio.play().catch(() => {});
}
}, { once: true });
};

function showEntry(entryId) {
const entry = entries[entryId];
if (!entry) {
document.getElementById("entry-text").innerText = "This path crumbled...";
document.getElementById("choices").innerHTML = "";
return;
}

document.getElementById("entry-number").innerText = `Entry ${entryId}`;
document.getElementById("entry-text").innerText = entry.text;

updateBenFace(entryId);
updateBackgroundLayer(entryId);
updateAmbientAudio(entryId);

const choicesDiv = document.getElementById("choices");
choicesDiv.innerHTML = "";

if (entry.ending) {
const endNote = document.createElement("p");
endNote.innerText = "🍰 THE END 🍰";
endNote.style.fontWeight = "bold";
choicesDiv.appendChild(endNote);
return;
}

if (entry.choices && Object.keys(entry.choices).length > 0) {
for (let [choiceText, nextEntry] of Object.entries(entry.choices)) {
const btn = document.createElement("button");
btn.innerText = choiceText;
btn.onclick = () => {
currentEntry = nextEntry.toString();
showEntry(currentEntry);
};
choicesDiv.appendChild(btn);
}
} else {
const btn = document.createElement("button");
btn.innerText = "Restart";
btn.onclick = () => {
currentEntry = "1";
showEntry(currentEntry);
};
choicesDiv.appendChild(btn);
}
}

function updateBenFace(entryId) {
const benFace = document.getElementById("ben-face");
const moodMap = {
glitch: ["4", "19", "36", "82", "88", "97", "129", "148"],
smile: ["21", "43", "56", "71", "91", "105", "118", "133", "73"],
worried: ["13", "33", "60", "94", "115", "145", "14", "93"],
angry: ["12", "44", "78", "80", "130", "140"],
neutral: ["1", "3", "11", "26", "50", "100", "200"]
};

benFace.className = "";
benFace.src = "ben-neutral.png";

for (const [mood, ids] of Object.entries(moodMap)) {
if (ids.includes(entryId)) {
benFace.src = `ben-${mood}.png`;
benFace.className = `ben-${mood}`;
return;
}
}

const fallbackMoods = ["glitch", "smile", "worried", "neutral"];
const randomMood = fallbackMoods[Math.floor(Math.random() * fallbackMoods.length)];
benFace.src = `ben-${randomMood}.png`;
benFace.className = `ben-${randomMood}`;
}

function updateBackgroundLayer(entryId) {
const body = document.body;
body.classList.remove("layer-crumb", "layer-filling", "layer-crust");

const id = parseInt(entryId);
if (id >= 1 && id <= 50) {
body.classList.add("layer-crumb");
} else if (id <= 100) {
body.classList.add("layer-filling");
} else {
body.classList.add("layer-crust");
}
}

function updateAmbientAudio(entryId) {
const audio = document.getElementById("bg-audio");
const id = parseInt(entryId);

let src = "layer-crumb.mp3";
if (id > 50 && id <= 100) {
src = "layer-filling.mp3";
} else if (id > 100) {
src = "layer-crust.mp3";
}

if (!audio.src.includes(src)) {
audio.pause();
audio.src = src;
audio.load();
audio.play().catch(() => {});
}
}