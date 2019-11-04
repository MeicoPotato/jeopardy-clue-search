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