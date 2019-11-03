/**
 * Jeopardy! clue search using jservice.io API. Builds a database asynchronously,
 * allowing for searching while database is still being built.
 * 
 * @since 1.0
 */

/**
 * Builds a data using clues[] array. By using async/await, we can build a database
 * while search through what we already have.
*/

async function buildDatabase() {
    const offsetMax = 156000; //currently the max offset of the API
    for (let offset = 0; offset <= offsetMax; offset += 100) {
        getClues(offset).then(offsetData => {
            offsetData.forEach(clue => {
                clues.push(clue);
            });
        });
    }

    async function getClues(offset) {
        let response = await fetch(`http://jservice.io/api/clues/?offset=${offset}`);
        let data = await response.json();
        return data.then(Promise.all(response, data));
    }

}

/**
 * Handles user actions, waiting for enter key or clicking on search button.
 * 
 * @param key is user input. If user presses the enter key or clicks the search button,
 * setting up for searchQuestions() begins. 
 */
function handleKeyPress(key) {
    let searchInput;
    let categoryInput;
    let minDateInput;
    let maxDateInput;
    let difficultyInput;

    if (key.keyCode == 13 || key.keyCode == undefined) {
        minDateInput = document.getElementById("min-date").value;
        maxDateInput = document.getElementById("max-date").value;
        searchInput = document.getElementById("search-bar").value;
        difficultyInput = document.getElementById("difficulty").value;

        if ((document.getElementById("category-search").value)) {
            categoryInput = document.getElementById("category-search").value;
        }

        let userInput = {
            search: searchInput,
            category: categoryInput,
            minDate: minDateInput,
            maxDate: maxDateInput,
            difficulty: difficultyInput
        }

        deleteCards();
        searchQuestion(userInput);
    }
}

/**
 * Searches through the existing database and compares to check for valid clues.
 * 
 * @param userInput is an array of objects, with user search parameters.
 */
async function searchQuestion(userInput) {
    for (let clue of clues) {
        let validClue = false;
        let formattedQuestion = clue.question.toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
        let formattedCategory = clue.category.title.toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
        let formattedDifficulty = clue.value;
        let formattedDate;
        let formattedMinDate;
        let formattedMaxDate;
        let formattedSearchInput;
        let formattedCategoryInput;
        let formattedDifficultyInput = userInput.difficulty.toLowerCase();

        if (userInput.search) {
            formattedSearchInput = userInput.search.toLowerCase().replace(/[^a-zA-Z0-9]/g, '');

            if (formattedQuestion.includes(formattedSearchInput)) {
                validClue = true;
            }
        }


        if (userInput.category) {
            formattedCategoryInput = userInput.category.toLowerCase().replace(/[^a-zA-Z0-9]/g, '');

            if ((formattedCategoryInput.includes(formattedCategory)) && (validClue)) {
                validClue = true;
            } else {
                validClue = false;
            }
        }

        if ((formattedDifficultyInput != 'all') && (formattedDifficultyInput.includes(formattedDifficulty))) {
            validClue = true;
        } else if ((formattedDifficultyInput != 'all') && (!formattedDifficultyInput.includes(formattedDifficulty))) {
            validClue = false;
        }

        if (convertTime(clue.airdate)) {
            formattedDate = convertTime(clue.airdate);
        }

        if (userInput.minDate) {
            formattedMinDate = userInput.minDate.replace(/[^a-zA-Z0-9]/g, '');
        }

        if (userInput.maxDate) {
            formattedMaxDate = userInput.maxDate.replace(/[^a-zA-Z0-9]/g, '');
        }

        if ((formattedMinDate) && (formattedMaxDate)) {
            if (formattedMinDate > formattedMinDate) {
                let swap = formattedMinDate;
                formattedMinDate = formattedMaxDate;
                formattedMaxDate = swap;
            }
        }

        if ((formattedMinDate) && (formattedMaxDate)) {
            if ((formattedDate >= formattedMinDate) && (formattedDate <= formattedMaxDate)) {
                validClue = true;
            } else {
                validClue = false;
            }
        } else if ((formattedMinDate) && (!formattedMaxDate)) {
            if ((formattedDate >= formattedMinDate)) {
                validClue = true;
            } else {
                validClue = false;
            }
        } else if (!(formattedMinDate) && (formattedMaxDate)) {
            if ((formattedDate <= formattedMaxDate)) {
                validClue = true;
            } else {
                validClue = false;
            }
        }

        if (validClue) {
            addCard(clue);
        }

    }
}

/**
 * Converts a time to an integer for easy computation.
 * 
 * @param time is the time to be converted.
 */
function convertTime(time) {
    let date = new Date(time);
    let day = date.getDate();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let formattedDate = `${year}${month}${day}`;

    return (formattedDate);
}

/**
 * Gets random clues and displays them.
 */
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

/**
 * Fetches random clues.
 */
async function getRandomClues() {
    let response = await fetch("http://jservice.io/api/random/?count=5");
    let data = await response.json();
    return data;
}

/**
 * Adds clues. Changes many elements in index.html
 * 
 * @param clue is the clue to be added.
 */
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

/**
 * Toggles answer display on/off
 * 
 * @param clueNumber is the clue to toggle the answer on/off 
 */
function toggleAnswer(clueNumber) {
    let ans = document.getElementById(`answer${clueNumber}`);

    if (ans.style.color === "rgb(3, 17, 116)") {
        ans.style.color = "rgb(221, 156, 74)";
    } else {
        ans.style.color = "rgb(3, 17, 116)";
    }
}

/**
 * Deletes clues. Needed to update searches.
 */
function deleteCards() {
    document.querySelectorAll(".card").forEach(function (c) {
        c.remove();
    });
}

/**
 * "Main method". At the time being, I cannot figure out how to use require()
 * or import for a better organized workplace.
 */
randomCards();
buildDatabase();
let clues = new Array;