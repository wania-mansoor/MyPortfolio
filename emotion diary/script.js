
// GET SAVED DATA

let entries = JSON.parse(localStorage.getItem("entries")) || [];

let points = Number(localStorage.getItem("points")) || 0;

let fed = Number(localStorage.getItem("fed")) || 0;

let selectedMood = "";


// SELECT MOOD

function selectMood(button) {

    let moods = document.querySelectorAll(".mood");

    moods.forEach(function(mood) {
        mood.classList.remove("active");
    });

    button.classList.add("active");

    selectedMood = button.dataset.mood;

}


// SAVE DIARY ENTRY

function saveEntry() {

    let date = document.getElementById("entryDate").value;

    let story = document.getElementById("story").value.trim();

    if (date === "") {
        alert("Please select a date!");
        return;
    }

    if (selectedMood === "") {
        alert("Please select your mood!");
        return;
    }

    if (story === "") {
        alert("Please write something about your day!");
        return;
    }

    let entry = {
        date: date,
        mood: selectedMood,
        story: story
    };

    entries.unshift(entry);

    points += 5;

    localStorage.setItem("entries", JSON.stringify(entries));

    localStorage.setItem("points", points);

    alert("Your diary has been saved! 🎉 You earned 5 points!");

    document.getElementById("story").value = "";

    document.getElementById("entryDate").value = getToday();

    selectedMood = "";

    document.querySelectorAll(".mood").forEach(function(mood) {
        mood.classList.remove("active");
    });

    updateWebsite();

}


// FEED THE CAT

function feedCat() {

    if (points < 10) {
        alert("You need 10 points to feed Mochi! Write another diary entry 💜");
        return;
    }

    points -= 10;

    fed++;

    localStorage.setItem("points", points);

    localStorage.setItem("fed", fed);

    document.getElementById("cat").innerHTML = "😻";

    document.getElementById("catMessage").innerText =
        "Mochi is so happy! Thank you! 💗";

    alert("Mochi enjoyed the treat! 🥛");

    updateWebsite();

}


// DELETE ENTRY

function deleteEntry(index) {

    let confirmDelete = confirm("Are you sure you want to delete this entry?");

    if (confirmDelete) {

        entries.splice(index, 1);

        localStorage.setItem("entries", JSON.stringify(entries));

        updateWebsite();

    }

}


// MOOD EMOJIS

function getEmoji(mood) {

    let emojis = {
        Happy: "😊",
        Sad: "😢",
        Angry: "😠",
        Anxious: "😟",
        Calm: "😌",
        Excited: "🤩"
    };

    return emojis[mood] || "💭";

}


// DISPLAY DIARY HISTORY

function displayHistory() {

    let history = document.getElementById("history");

    history.innerHTML = "";

    if (entries.length === 0) {

        history.innerHTML =
            '<p class="empty">Your diary entries will appear here.</p>';

        return;

    }

    entries.forEach(function(entry, index) {

        let div = document.createElement("div");

        div.className = "history-entry";

        let heading = document.createElement("h3");
        heading.textContent = getEmoji(entry.mood) + " " + entry.mood;

        let date = document.createElement("small");
        date.textContent = entry.date;

        let story = document.createElement("p");
        story.textContent = entry.story;

        let deleteButton = document.createElement("button");
        deleteButton.className = "delete-btn";
        deleteButton.textContent = "Delete Entry";

        deleteButton.onclick = function() {
            deleteEntry(index);
        };

        div.appendChild(heading);
        div.appendChild(date);
        div.appendChild(story);
        div.appendChild(deleteButton);

        history.appendChild(div);

    });

}


// CALCULATE MOOD INSIGHTS

function calculateInsights() {

    if (entries.length === 0) {

        document.getElementById("commonMood").innerText =
            "No data yet";

        document.getElementById("moodInsight").innerText =
            "Start writing!";

        document.getElementById("insightDescription").innerText =
            "Your mood patterns will appear here.";

        return;

    }

    let moodCount = {};

    entries.forEach(function(entry) {

        if (moodCount[entry.mood] === undefined) {
            moodCount[entry.mood] = 1;
        } else {
            moodCount[entry.mood]++;
        }

    });

    let mostCommon = Object.keys(moodCount).reduce(function(a, b) {

        return moodCount[a] >= moodCount[b] ? a : b;

    });

    document.getElementById("commonMood").innerText =
        getEmoji(mostCommon) + " " + mostCommon;

    let recentEntries = entries.slice(0, 7);

    let happyCount = recentEntries.filter(function(entry) {

        return entry.mood === "Happy" ||
               entry.mood === "Excited" ||
               entry.mood === "Calm";

    }).length;

    let reflection = "";
    let description = "";

    if (happyCount >= 5) {

        reflection = "Positive moments 🌈";

        description =
            "Many of your recent entries recorded happy, excited or calm moods.";

    } else if (happyCount >= 3) {

        reflection = "A mixed week 🌷";

        description =
            "Your recent entries show a variety of feelings. Every emotion is valid.";

    } else {

        reflection = "Take it gently 💜";

        description =
            "Your recent entries include more difficult moments. Remember to give yourself time and kindness.";

    }

    document.getElementById("moodInsight").innerText = reflection;

    document.getElementById("insightDescription").innerText = description;

}


// SAVE TOMORROW'S INTENTION

function saveIntention() {

    let intention = document.getElementById("intention").value;

    localStorage.setItem("intention", intention);

    document.getElementById("tomorrowMood").innerText =
        intention || "Choose a goal";

}


// UPDATE ACHIEVEMENTS

function updateRewards() {

    if (entries.length >= 1) {
        document.getElementById("badge1").classList.add("unlocked");
    }

    if (entries.length >= 5) {
        document.getElementById("badge2").classList.add("unlocked");
    }

    if (entries.length >= 10) {
        document.getElementById("badge3").classList.add("unlocked");
    }

    if (fed >= 5) {
        document.getElementById("badge4").classList.add("unlocked");
    }

}


// UPDATE CAT LEVEL

function updateCat() {

    let level = Math.floor(fed / 3) + 1;

    let progress = (fed % 3) / 3 * 100;

    document.getElementById("loveLevel").innerText = level;

    document.getElementById("loveProgress").style.width =
        progress + "%";

    if (fed === 0) {

        document.getElementById("cat").innerText = "🐈";

        document.getElementById("catMessage").innerText =
            "Mochi is waiting for you!";

    } else if (fed < 3) {

        document.getElementById("catMessage").innerText =
            "Mochi is getting comfortable! 💗";

    } else if (fed < 6) {

        document.getElementById("catMessage").innerText =
            "Mochi loves spending time with you! 😻";

    } else {

        document.getElementById("catMessage").innerText =
            "You and Mochi are best friends! 💜";

    }

}


// UPDATE WEBSITE

function updateWebsite() {

    document.getElementById("points").innerText = points;

    document.getElementById("totalEntries").innerText =
        entries.length;

    document.getElementById("totalFed").innerText = fed;

    let uniqueDays = new Set(
        entries.map(function(entry) {
            return entry.date;
        })
    );

    document.getElementById("totalDays").innerText =
        uniqueDays.size;

    displayHistory();

    calculateInsights();

    updateRewards();

    updateCat();

}


// GET TODAY'S DATE

function getToday() {

    let today = new Date();

    let year = today.getFullYear();

    let month = String(today.getMonth() + 1).padStart(2, "0");

    let day = String(today.getDate()).padStart(2, "0");

    return year + "-" + month + "-" + day;

}


// LOAD SAVED DATA WHEN WEBSITE OPENS

document.addEventListener("DOMContentLoaded", function() {

    document.getElementById("entryDate").value = getToday();

    let savedIntention = localStorage.getItem("intention") || "";

    document.getElementById("intention").value = savedIntention;

    document.getElementById("tomorrowMood").innerText =
        savedIntention || "Choose a goal";

    updateWebsite();

});
