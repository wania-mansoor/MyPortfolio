
let points = Number(localStorage.getItem("points")) || 0;
let totalEarned = Number(localStorage.getItem("totalEarned")) || 0;
let entries = JSON.parse(localStorage.getItem("entries")) || [];
let petName = localStorage.getItem("petName") || "Your Little Dragon";
let accessory = localStorage.getItem("accessory") || "";
let selectedMood = "";

const egg = document.getElementById("egg");
const dragon = document.getElementById("dragon");

function saveData() {
    localStorage.setItem("points", points);
    localStorage.setItem("totalEarned", totalEarned);
    localStorage.setItem("entries", JSON.stringify(entries));
    localStorage.setItem("petName", petName);
    localStorage.setItem("accessory", accessory);
}

function chooseMood(mood) {
    selectedMood = mood;
    document.getElementById("selectedMood").textContent =
        "Selected mood: " + mood;
}

function updatePet() {
    document.getElementById("points").textContent = points;
    document.getElementById("petName").textContent =
        petName + " " + accessory;

    let health = Math.min(totalEarned, 100);
    document.getElementById("health").textContent = health;
    document.getElementById("healthBar").style.width = health + "%";

    if (totalEarned < 10) {
        egg.classList.remove("hidden");
        dragon.classList.add("hidden");
        document.getElementById("petStage").textContent = "Magical Egg 🥚";
        document.getElementById("petMessage").textContent =
            "Your little dragon is growing inside its egg!";
    } else {
        egg.classList.add("hidden");
        dragon.classList.remove("hidden");

        if (totalEarned < 25) {
            document.getElementById("petStage").textContent = "Baby Dragon 🐉";
        } else if (totalEarned < 50) {
            document.getElementById("petStage").textContent = "Growing Dragon ✨";
        } else if (totalEarned < 75) {
            document.getElementById("petStage").textContent = "Healthy Dragon 💜";
        } else {
            document.getElementById("petStage").textContent = "Legendary Dragon 👑";
        }

        dragon.style.fontSize = (115 + health * 0.25) + "px";
        document.getElementById("petMessage").textContent =
            "Your dragon is growing healthier with every diary entry!";
    }
}

function feedPet() {
    if (points >= 10) {
        points -= 10;
        document.getElementById("feedMessage").textContent =
            "Your dragon enjoyed its treat! 💜";
    } else {
        document.getElementById("feedMessage").textContent =
            "You need 10 points. Write another diary entry to earn points!";
    }

    saveData();
    updatePet();
}

function customisePet() {
    const name = document.getElementById("nameInput").value.trim();
    petName = name || "Your Little Dragon";
    accessory = document.getElementById("accessory").value;
    saveData();
    updatePet();
}

function saveEntry() {
    const story = document.getElementById("story").value.trim();

    if (!selectedMood) {
        document.getElementById("saveMessage").textContent =
            "Please select your mood first.";
        return;
    }

    if (!story) {
        document.getElementById("saveMessage").textContent =
            "Please write your daily story first.";
        return;
    }

    const intensity = Number(document.getElementById("intensity").value);

    const entry = {
        mood: selectedMood,
        story: story,
        intensity: intensity,
        date: new Date().toISOString(),
        answers: [
            document.getElementById("q1").value,
            document.getElementById("q2").value,
            document.getElementById("q3").value,
            document.getElementById("q4").value
        ]
    };

    entries.push(entry);
    points += 5;
    totalEarned += 5;

    saveData();
    updatePet();
    showHistory();
    showChart();

    document.getElementById("saveMessage").textContent =
        "Your diary entry has been saved! You earned 5 points. ⭐";

    document.getElementById("story").value = "";
    document.getElementById("q1").value = "";
    document.getElementById("q2").value = "";
    document.getElementById("q3").value = "";
    document.getElementById("q4").value = "";
    selectedMood = "";
    document.getElementById("selectedMood").textContent =
        "Selected mood: None";
}

function showHistory() {
    const history = document.getElementById("history");
    history.innerHTML = "";

    if (entries.length === 0) {
        history.textContent = "Your diary entries will appear here.";
        return;
    }

    entries.slice().reverse().forEach(entry => {
        const div = document.createElement("div");
        div.className = "entry";

        const title = document.createElement("h3");
        title.textContent = entry.mood + " · " +
            new Date(entry.date).toLocaleDateString();

        const story = document.createElement("p");
        story.textContent = entry.story;

        const intensity = document.createElement("p");
        intensity.textContent = "Mood intensity: " + entry.intensity + "/10";

        div.append(title, story, intensity);

        entry.answers.forEach((answer, index) => {
            if (answer.trim()) {
                const response = document.createElement("p");
                response.textContent = answer;
                div.appendChild(response);
            }
        });

        history.appendChild(div);
    });
}

function showChart() {
    const chart = document.getElementById("weeklyChart");
    chart.innerHTML = "";

    const today = new Date();
    const lastSevenDays = [];

    for (let i = 6; i >= 0; i--) {
        const day = new Date(today);
        day.setDate(today.getDate() - i);

        const dayEntry = entries.filter(entry =>
            new Date(entry.date).toDateString() === day.toDateString()
        ).slice(-1)[0];

        lastSevenDays.push({
            label: day.toLocaleDateString("en", { weekday: "short" }),
            intensity: dayEntry ? dayEntry.intensity : 0
        });
    }

    lastSevenDays.forEach(day => {
        const column = document.createElement("div");
        column.className = "chart-column";

        const bar = document.createElement("div");
        bar.className = "chart-bar";
        bar.style.height = (day.intensity * 10) + "%";

        const label = document.createElement("span");
        label.textContent = day.label;

        column.append(bar, label);
        chart.appendChild(column);
    });
}

document.getElementById("intensity").addEventListener("input", function() {
    document.getElementById("intensityValue").textContent = this.value;
});

document.getElementById("nameInput").value =
    petName === "Your Little Dragon" ? "" : petName;
document.getElementById("accessory").value = accessory;

updatePet();
showHistory();
showChart();
