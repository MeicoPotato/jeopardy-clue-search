(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
let userHandle = require('./handleUser');

/**
 * Builds data using clues[] array. By using async/await, we can build a database
 * while search through what we already have.
*/
async function buildDatabase() {
    //currently the max offset of the API
    const OFFSET_MAX = 156000;
    let clues = new Array();

    try {
        for (let offset = 0; offset <= OFFSET_MAX; offset += 100) {
            let jServiceLink = `http://jservice.io/api/clues/?offset=${offset}`;
            let queryLink = `https://cors-anywhere.herokuapp.com/${jServiceLink}`;

            userHandle.getClues(queryLink).then(offsetData => {
                offsetData.forEach(clue => {
                    clues.push(clue);
                });
            });
        }

    } catch (error) {
        console.error(error);
    }

    module.exports.clues = clues;
}

module.exports.buildDatabase = buildDatabase;
},{"./handleUser":2}],2:[function(require,module,exports){
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
 * 
 * @param key is user input. If user presses the enter key or clicks the search button,
 * setting up for searchQuestions() begins. 
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
},{}],3:[function(require,module,exports){
/**
 * Jeopardy! clue search using jservice.io API. Builds a database asynchronously,
 * allowing for searching while database is still being built.
 * 
 * @since 1.0
 */
const userHandle = require('./handleUser');
const database = require('./buildDatabase');

userHandle.randomCards();
database.buildDatabase();

let userInput;
let clueDatabase = database.clues;
let searchBar = document.getElementById('search-bar');
let searchBtn = document.getElementById('search-btn');

searchBtn.addEventListener('click', () => {
    userInput = userHandle.createUserObj();
    userHandle.deleteCards();

   clueDatabase.forEach(clue => {
        userHandle.searchQuestion(userInput, clue);
    });

});

searchBar.addEventListener('keypress', (k) => {
    let key = k.which || k.keyCode;

    if (key === 13) {
        userInput = userHandle.createUserObj();
        userHandle.deleteCards();

        clueDatabase.forEach(clue => {
            userHandle.searchQuestion(userInput, clue);
        });
    }
});
},{"./buildDatabase":1,"./handleUser":2}]},{},[3]);
