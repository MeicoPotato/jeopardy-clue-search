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