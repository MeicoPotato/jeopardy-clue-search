(function() {
    clues = new Array;

   

    async function buildDatabase() {
        const offsetMax = 156000;
    
        for (let offset = 0; offset <= offsetMax; offset += 100) {
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
    
})

