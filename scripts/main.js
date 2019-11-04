/**
 * Jeopardy! clue search using jservice.io API. Builds a database asynchronously,
 * allowing for searching while database is still being built.
 * 
 * @since 1.0
 */
const userHandle = require('./handleUser');
const database = require('./buildDatabase');

//Get random clues on the page first, then start building a clue database.
userHandle.randomCards();
database.buildDatabase();

let userInput;
let clueDatabase = database.clues;
let searchBar = document.getElementById('search-bar');
let searchBtn = document.getElementById('search-btn');

/**
 * Checks if user clicks on the search button.
 */
searchBtn.addEventListener('click', () => {
    userInput = userHandle.createUserObj();
    userHandle.deleteCards();

   clueDatabase.forEach(clue => {
        userHandle.searchQuestion(userInput, clue);
    });

});

/**
 * Checks if user presses enter to search.
 */
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