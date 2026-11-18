
// DRIVER DATABASE

const drivers = [

    {
        id: 1,
        name: "Max Verstappen",
        number: 1,
        team: "Red Bull",
        color: "#3671c6",
        country: "Netherlands 🇳🇱",
        wins: 65,
        podiums: 112,
        points: 575,
        age: 28,
        emoji: "🏎️",
        description: "Known for his aggressive racing style, consistency and multiple world championship titles."
    },

    {
        id: 2,
        name: "Lewis Hamilton",
        number: 44,
        team: "Ferrari",
        color: "#ed2939",
        country: "United Kingdom 🇬🇧",
        wins: 105,
        podiums: 202,
        points: 420,
        age: 41,
        emoji: "🏎️",
        description: "A seven-time world champion known for his speed, experience and record-breaking career."
    },

    {
        id: 3,
        name: "Charles Leclerc",
        number: 16,
        team: "Ferrari",
        color: "#ed2939",
        country: "Monaco 🇲🇨",
        wins: 8,
        podiums: 43,
        points: 300,
        age: 29,
        emoji: "🏎️",
        description: "A talented driver recognised for his qualifying pace and racing skills."
    },

    {
        id: 4,
        name: "Lando Norris",
        number: 4,
        team: "McLaren",
        color: "#ff8000",
        country: "United Kingdom 🇬🇧",
        wins: 11,
        podiums: 44,
        points: 374,
        age: 26,
        emoji: "🏎️",
        description: "A fast and competitive driver known for his smooth driving and strong performances."
    },

    {
        id: 5,
        name: "Oscar Piastri",
        number: 81,
        team: "McLaren",
        color: "#ff8000",
        country: "Australia 🇦🇺",
        wins: 9,
        podiums: 26,
        points: 292,
        age: 25,
        emoji: "🏎️",
        description: "An impressive young driver with a calm approach and excellent racecraft."
    },

    {
        id: 6,
        name: "George Russell",
        number: 63,
        team: "Mercedes",
        color: "#27f4d2",
        country: "United Kingdom 🇬🇧",
        wins: 5,
        podiums: 25,
        points: 245,
        age: 28,
        emoji: "🏎️",
        description: "Known for his precision, determination and technical driving ability."
    },

    {
        id: 7,
        name: "Fernando Alonso",
        number: 14,
        team: "Aston Martin",
        color: "#358c75",
        country: "Spain 🇪🇸",
        wins: 32,
        podiums: 106,
        points: 230,
        age: 45,
        emoji: "🏎️",
        description: "A two-time world champion with decades of experience and exceptional racecraft."
    },

    {
        id: 8,
        name: "Carlos Sainz",
        number: 55,
        team: "Williams",
        color: "#3584d9",
        country: "Spain 🇪🇸",
        wins: 4,
        podiums: 27,
        points: 200,
        age: 32,
        emoji: "🏎️",
        description: "A skilled and consistent driver known for his strategy and adaptability."
    }

];


// FAVOURITES DATABASE

let favourites = JSON.parse(localStorage.getItem("favourites")) || [];


// DISPLAY DRIVER CARDS

function displayDrivers(list) {

    let grid = document.getElementById("driverGrid");

    grid.innerHTML = "";

    document.getElementById("visibleCount").innerText =
        String(list.length).padStart(2, "0");

    document.getElementById("noResults").style.display =
        list.length === 0 ? "block" : "none";


    list.forEach(function(driver) {

        let isFavourite = favourites.includes(driver.id);

        let card = document.createElement("div");

        card.className = "driver-card";

        card.style.setProperty("--team-color", driver.color);

        let top = document.createElement("div");
        top.className = "driver-top";

        let photo = document.createElement("div");
        photo.className = "driver-photo";

        let number = document.createElement("span");
        number.className = "driver-number";
        number.textContent = driver.number;

        let emoji = document.createElement("span");
        emoji.textContent = driver.emoji;

        let favouriteButton = document.createElement("button");
        favouriteButton.className =
            "favourite-btn" + (isFavourite ? " active" : "");

        favouriteButton.textContent =
            isFavourite ? "★" : "☆";

        favouriteButton.setAttribute("aria-label",
            "Toggle favourite for " + driver.name);

        favouriteButton.onclick = function() {
            toggleFavourite(driver.id);
        };

        photo.appendChild(number);
        photo.appendChild(emoji);
        photo.appendChild(favouriteButton);

        let info = document.createElement("div");
        info.className = "driver-info";

        let team = document.createElement("span");
        team.className = "driver-team";
        team.textContent = driver.team.toUpperCase();

        let name = document.createElement("h2");
        name.textContent = driver.name;

        let country = document.createElement("p");
        country.textContent = driver.country;

        let details = document.createElement("div");
        details.className = "driver-details";

        let wins = document.createElement("span");
        wins.innerHTML = "WINS <b>" + driver.wins + "</b>";

        let points = document.createElement("span");
        points.innerHTML = "PTS <b>" + driver.points + "</b>";

        details.appendChild(wins);
        details.appendChild(points);

        let viewButton = document.createElement("button");
        viewButton.className = "view-btn";
        viewButton.textContent = "VIEW DRIVER PROFILE →";

        viewButton.onclick = function() {
            openProfile(driver.id);
        };

        info.appendChild(team);
        info.appendChild(name);
        info.appendChild(country);
        info.appendChild(details);
        info.appendChild(viewButton);

        card.appendChild(top);
        card.appendChild(photo);
        card.appendChild(info);

        grid.appendChild(card);

    });

}


// SEARCH AND FILTER DRIVERS

function filterDrivers() {

    let search = document.getElementById("searchInput")
        .value.toLowerCase();

    let selectedTeam = document.getElementById("teamFilter").value;

    let filtered = drivers.filter(function(driver) {

        let matchesName =
            driver.name.toLowerCase().includes(search);

        let matchesTeam =
            selectedTeam === "All" ||
            driver.team === selectedTeam;

        return matchesName && matchesTeam;

    });

    displayDrivers(filtered);

}


// TOGGLE FAVOURITES

function toggleFavourite(id) {

    if (favourites.includes(id)) {

        favourites = favourites.filter(function(item) {
            return item !== id;
        });

    } else {

        favourites.push(id);

    }

    localStorage.setItem(
        "favourites",
        JSON.stringify(favourites)
    );

    filterDrivers();

    displayFavourites();

}


// DISPLAY FAVOURITES

function displayFavourites() {

    let box = document.getElementById("favourites");

    box.innerHTML = "";

    if (favourites.length === 0) {

        box.textContent =
            "No favourites yet. Tap the ☆ on a driver card!";

        return;

    }

    favourites.forEach(function(id) {

        let driver = drivers.find(function(item) {
            return item.id === id;
        });

        if (!driver) return;

        let item = document.createElement("div");

        item.className = "favourite-item";

        let name = document.createElement("strong");
        name.textContent = "★ " + driver.name;

        let team = document.createElement("small");
        team.textContent = driver.team;

        item.appendChild(name);
        item.appendChild(team);

        box.appendChild(item);

    });

}


// OPEN DRIVER PROFILE

function openProfile(id) {

    let driver = drivers.find(function(item) {
        return item.id === id;
    });

    if (!driver) return;

    let modal = document.getElementById("driverModal");

    let details = document.getElementById("modalDetails");

    details.innerHTML = `
        <span class="eyebrow">${driver.team.toUpperCase()}</span>

        <div class="modal-photo">${driver.emoji}</div>

        <h2>${driver.name}</h2>

        <p>
            DRIVER NUMBER: #${driver.number}<br>
            NATIONALITY: ${driver.country}<br>
            TEAM: ${driver.team}<br>
            AGE: ${driver.age}
        </p>

        <p>${driver.description}</p>

        <div class="modal-stats">

            <div>
                <h3>${driver.wins}</h3>
                <small>RACE WINS</small>
            </div>

            <div>
                <h3>${driver.podiums}</h3>
                <small>PODIUMS</small>
            </div>

            <div>
                <h3>${driver.points}</h3>
                <small>DEMO POINTS</small>
            </div>

        </div>
    `;

    modal.classList.add("show");

}


// CLOSE PROFILE

function closeModal() {

    document.getElementById("driverModal")
        .classList.remove("show");

}


// CLOSE MODAL WHEN CLICKING OUTSIDE

document.getElementById("driverModal").addEventListener(
    "click",
    function(event) {

        if (event.target === this) {
            closeModal();
        }

    }
);


// LEADERBOARD

function displayLeaderboard() {

    let sortedDrivers = [...drivers];

    sortedDrivers.sort(function(a, b) {

        return b.points - a.points;

    });

    let table = document.getElementById("leaderboardBody");

    table.innerHTML = "";

    sortedDrivers.forEach(function(driver, index) {

        let row = document.createElement("tr");

        let values = [
            index + 1,
            driver.name,
            driver.team,
            driver.wins,
            driver.podiums,
            driver.points
        ];

        values.forEach(function(value, columnIndex) {

            let cell = document.createElement("td");

            cell.textContent = value;

            if (columnIndex === 0) {
                cell.className = "rank";
            }

            if (columnIndex === 1) {
                cell.className = "driver-name";
            }

            if (columnIndex === 5) {
                cell.className = "points-cell";
            }

            row.appendChild(cell);

        });

        table.appendChild(row);

    });

}


// INITIALIZE WEBSITE

document.addEventListener("DOMContentLoaded", function() {

    displayDrivers(drivers);

    displayLeaderboard();

    displayFavourites();

    document.getElementById("driverCount").innerText =
        drivers.length;

});
