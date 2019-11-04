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