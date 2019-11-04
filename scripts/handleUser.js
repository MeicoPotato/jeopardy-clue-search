/**
 * Fetches an API link to get data.
 * 
 * @param {type} queryLink is the link to request
 */

async function getClues(queryLink) {
    try {
        let response = await fetch(queryLink);
        return await response.json();
    } catch (error) {
        console.error(error);
    }
}

/**
 * Gets random clues and displays them.
 */
async function randomCards() {
    try {
        let randomCluesLink = 'http://jservice.io/api/random/?count=5';
        let queryLink = `https://cors-anywhere.herokuapp.com/${randomCluesLink}`;

        getClues(queryLink).then(offsetData => {
            offsetData.forEach(clue => {
                addCard(clue);
            });
        });
    } catch (error) {
        console.error(error);
    }
}

/**
 * Adds a clue to the page in a card display.
 * 
 * @param {type} clue is the clue to be added.
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
    ans.style.color = "rgb(221, 156, 74)";
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
 * Deletes clues. Needed to update searches.
 */
function deleteCards() {
    document.querySelectorAll(".card").forEach(function (c) {
        c.remove();
    });
}

/**
 * Toggles clue answer on/off.
 * 
 * @param {var} clueNumber is the clue to hide.
 * @bug CURRENTLY DOES NOT WORK!
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
 * Searches through the existing database and compares to check for valid clues.
 * 
 * @param userInput is an array of objects, with user search parameters.
 */
function searchQuestion(userInput, clue) {
    let validClue = false;

    let clueDifficulty = clue.value;
    let clueQuestion = formatValue(clue.question);
    let clueCategory = formatValue(clue.category.title);
    let clueAirdate = convertTime(clue.airdate);

    let userMinDate;
    let userMaxDate;
    let userQuestion;
    let userCategory;
    let userDifficulty = userInput.value;
    
    if (userInput.question) {
        userQuestion = userInput.question;

        if ((clueQuestion) && (clueQuestion.includes(userQuestion))) {
            validClue = true;
        }
    }

    if (userInput.category) {
        userCategory = userInput.category;

        if ((userCategory.includes(clueCategory)) && (validClue)) {
            validClue = true;
        } else {
            validClue = false;
        }
    }

    if ((userDifficulty != 'all') && (userDifficulty.includes(clueDifficulty))) {
        validClue = true;
    } else if ((userDifficulty != 'all') && (!userDifficulty.includes(clueDifficulty))) {
        validClue = false;
    }

    if (userInput.minDate) {
        userMinDate = userInput.minDate;
    }

    if (userInput.maxDate) {
        userMaxDate = userInput.maxDate;
    }

    if ((userMinDate) && (userMaxDate)) {
        if (userMinDate > userMinDate) {
            let swap = userMinDate;
            userMinDate = userMaxDate;
            userMaxDate = swap;
        }
    }

    if ((userMinDate) && (userMaxDate)) {
        if ((clueAirdate >= userMinDate) && (clueAirdate <= userMaxDate)) {
            validClue = true;
        } else {
            validClue = false;
        }
    } else if ((userMinDate) && (!userMaxDate)) {
        if ((clueAirdate >= userMinDate)) {
            validClue = true;
        } else {
            validClue = false;
        }
    } else if (!(userMinDate) && (userMaxDate)) {
        if ((clueAirdate <= userMaxDate)) {
            validClue = true;
        } else {
            validClue = false;
        }
    }

    if (validClue) {
        addCard(clue);
    }

}

/**
 * Formats a given value, removing special characters and spaces, and
 * convering to lower case for more practical testing.
 * 
 * @param {type} val
 */
function formatValue(val) {
    //We can deal with null or empty strings with if (val)
    if (val) {
        return val.toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
    } else {
        return null;
    }
}

/**
 * Converts a time to an integer for easy computation.
 * 
 * @param time is the time to be converted.
 */
function convertTime(time) {
    if (time) {
        let date = new Date(time);
        let day = date.getDate();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let airDate = `${year}${month}${day}`;

        return (airDate);
    } else {
        return null;
    }
}

/**
 * Handles user actions, waiting for enter key or clicking on search button.
 */
function createUserObj() {
    let userInput = {
        question: formatValue(document.getElementById("search-bar").value),
        category: formatValue(document.getElementById("category-search").value),
        value: formatValue(document.getElementById("difficulty").value),
        minDate: formatValue(document.getElementById("min-date").value),
        maxDate: formatValue(document.getElementById("max-date").value)
    }

    return userInput;
}

module.exports = {
    getClues: getClues,
    randomCards: randomCards,
    addCard: addCard,
    deleteCards: deleteCards,
    toggleAnswer: toggleAnswer,
    convertTime: convertTime,
    createUserObj: createUserObj,
    searchQuestion: searchQuestion
};