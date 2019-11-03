let test = require('ahocorasick.js');

let clues = AhoCorasick.prototype.search;

randomCards();
buildDatabase();

function clickEnter() {
    let searchInput = document.getElementById("search-bar").value;
    deleteCards();
    searchQuestion(searchInput);
}

function handleKeyPress(key) {
    if (key.keyCode == 13) {
        let searchInput = document.getElementById("search-bar").value;
        let categoryInput = document.getElementById("category-search").value;
        let minDateInput = document.getElementById("min-date").value;
        let maxDateInput = document.getElementById("max-date").value;
        let difficultyInput = document.getElementById("difficulty").value;

        let userInput = {
            search : searchInput,
            category : categoryInput,
            minDate : minDateInput,
            maxDate : maxDateInput,
            difficulty : difficultyInput
        }

        deleteCards();
        searchQuestion(userInput);
    }
}

async function searchQuestion(userInputObj) {
    let formattedSearchInput = userInput.search.toLowerCase().replace(/[^a-zA-Z0-9]/g, "");
    let formattedCategoryInput = userInput.category.toLowerCase().replace(/[^a-zA-Z0-9]/g, "");
    let formattedMinDateInput = userInput.minDate.replace(/[^a-zA-Z0-9]/g, "");
    let formattedMaxDateInput = userInput.maxDate.replace(/[^a-zA-Z0-9]/g, "");
    let formattedDifficultyInput = userInput.difficulty;

    for (let clue of clues) {
        if (clue.question.toLowerCase().replace(/[^a-zA-Z0-9]/g, "")
                .includes(formattedSearchInput)) {
            addCard(clue);
        }
    }
}


function randomCards() {
    getRandomClues().then(data => {
        data.forEach(clue => {
            if (clue.question !== "") {
                addCard(clue);
            } else {
                randomCards();
            }
        });
    });
}

async function getRandomClues() {
    let response = await fetch("http://jservice.io/api/random/?count=5");
    let data = await response.json();
    return data;
}

function addCard(clue) {
    const card = document.createElement("div");
    card.setAttribute("class", "card");

    const quest = document.createElement("h1");
    quest.id = "question";
    quest.textContent = clue.question;

    const category = document.createElement("p");
    category.id = "category";
    category.textContent = `category: ${clue.category.title}`;

    const ans = document.createElement("p");
    ans.id = `answer${clue.id}`;
    ans.textContent = clue.answer;
    ans.style.fontSize = "1vw";
    ans.style.color = "rgb(3, 17, 116)";
    ans.style.marginBottom = "5em";

    const value = document.createElement("p");
    value.id = "value";
    value.textContent = `difficulty: ${clue.value}`;

    const airDate = document.createElement("p");
    airDate.id = "airDate";
    airDate.textContent = `Airdate: ${clue.airdate}`;

    const revealButton = document.createElement("button");
    revealButton.setAttribute("onclick", `toggleAnswer(${clue.id})`);
    revealButton.id = "toggleButton";
    revealButton.textContent = "Click to hide/reveal answer";

    card.appendChild(quest);
    card.appendChild(ans);
    card.appendChild(category);
    card.appendChild(value);
    card.appendChild(airDate);
    card.appendChild(revealButton);

    document.getElementById("container").appendChild(card);
}

function toggleAnswer(clueNumber) {
    let ans = document.getElementById(`answer${clueNumber}`);

    if (ans.style.color === "rgb(3, 17, 116)") {
        ans.style.color = "rgb(221, 156, 74)";
    } else {
        ans.style.color = "rgb(3, 17, 116)";
    }
}

function deleteCards() {
    document.querySelectorAll(".card").forEach(function (c) {
        c.remove();
    });
}

//http://jservice.io/api/clues/?min_date=1990-01-01&max_date=2016-01-01
//jeopardy values: 100, 200, 400, 600, 800, 1000
