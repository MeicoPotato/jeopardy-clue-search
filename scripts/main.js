const searchBtn = document.getElementById("search-btn");
const tip = document.getElementById("tip");
const search = document.getElementById("search");
let clues = new Array();

//fetchURLs();
randomCards();
buildDatabase();

function expandBar() {
    search.style.width = "50%";
    search.style.paddingLeft = "60px";
    search.style.cursor = "text";
    search.focus();
}

function typeWriter() {
    let message = "Search from over 150,000 clues";
    let msgLength = search.getAttribute("placeholder").length;
    let msg = search.getAttribute("placeholder") + message.charAt(msgLength);

    if (msgLength <= message.length) {
        search.setAttribute("placeholder", msg);
        setTimeout(typeWriter, 50);
    }
}
searchBtn.addEventListener("click", () => {
    expandBar();
    typeWriter();
});

search.addEventListener("keydown", () => {
    tip.style.visibility = "visible";
    tip.style.opacity = "1";
});

function handleKeyPress(key) {
    let userInput;

    if (key.keyCode == 13) {
        userInput = document.getElementById("search").value;
        deleteCards();
        searchQuestion(userInput);
    }
}

async function buildDatabase() {
    for (let offset = 0; offset <= 156800; offset += 100) {
        getClues(offset).then(offsetData => {
            offsetData.forEach(clue => {
                clues.push(clue);
            });
        });
    }
}

async function getClues(offset) {
    let response = await fetch(`http://jservice.io/api/clues/?offset=${offset}`);
    let data = await response.json();
    return data;
}

async function searchQuestion(userInput) {
    let formattedInput = userInput.toLowerCase().replace(/[^a-zA-Z0-9]/g, "");

    for (let clue of clues) {
        if (
            clue.question
                .toLowerCase()
                .replace(/[^a-zA-Z0-9]/g, "")
                .includes(formattedInput)
        ) {
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
