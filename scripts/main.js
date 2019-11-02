const searchBtn = document.getElementById('search-btn');
const tip = document.getElementById('tip');
const search = document.getElementById('search');

function expandBar() {
    search.style.width = '80%';
    search.style.paddingLeft = '60px';
    search.style.cursor = 'text';
    search.focus();
}

function typeWriter() {
    let message = 'Search from over 150,000 clues';
    let msgLength = search.getAttribute('placeholder').length;
    let msg = search.getAttribute('placeholder') + message.charAt(msgLength);

    if (msgLength <= message.length) {
        search.setAttribute('placeholder', msg);
        setTimeout(typeWriter, 50);
    }
}
searchBtn.addEventListener('click', () => {
    expandBar();
    typeWriter();
});

search.addEventListener('keydown', () => {
    tip.style.visibility = 'visible';
    tip.style.opacity = '1';
})

function handleKeyPress(key) {
    let userInput;

    if (key.keyCode == 13) {
        userInput = document.getElementById('search');
        buildDatabase();
    }
}

function buildDatabase() {
    const app = document.getElementById('scrolling-wrapper'); 
    const container = document.createElement('div');

    container.setAttribute('class', 'container');
    app.appendChild(container);
    var numOffset = 0;
    
    while (numOffset <= 1000) {
        var request = new XMLHttpRequest();
        request.open('GET', `http://jservice.io/api/clues/?offset=${numOffset}`, true)
        request.onload = function() {
          // Begin accessing JSON data here
          var data = JSON.parse(this.response);
          if (request.status >= 200 && request.status < 400) {
            data.forEach(clue => {
                if (clue.question == "") {
                    console.log("hi");
                } else {
                    const card = document.createElement('div');
                    card.setAttribute('class', 'card');
              
                    const quest = document.createElement('h1');
                    quest.id='question';
                    quest.textContent = clue.question;
              
                    const ans = document.createElement('p');
                    ans.id = 'answer';
                    ans.textContent = clue.answer;
              
                    container.appendChild(card);
                    card.appendChild(quest);
                    card.appendChild(ans);
                }
    
            })
          } else {
            const errorMessage = document.createElement('marquee');
            errorMessage.textContent = 'Something went wrong.';
            app.appendChild(errorMessage);
          }
        }
        
        request.send();
        numOffset = numOffset + 50;
    }
    
}
