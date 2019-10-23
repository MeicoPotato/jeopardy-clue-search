const searchBtn = document.getElementById('search-btn');
const tip = document.getElementById('tip');
const search = document.getElementById('search');

searchBtn.addEventListener('click', () => {
    search.style.width = '80%';
    search.style.paddingLeft = '60px';
    search.style.cursor = 'text';
    search.focus();

    var i = 0;
    var message = 'Search from 150,000+ clues';

    function typeWriter() {
        if (i < message.length) {
            msg = search.getAttribute('placeholder') + message.charAt(i);
            search.setAttribute('placeholder', msg)
            i++;
            setTimeout(typeWriter, 50);
        }
    }

    typeWriter();
})

search.addEventListener('keydown', () => {
    tip.style.visibility = 'visible';
    tip.style.opacity = '1';
})

function searchKeyPress(e) {
    if (e.keyCode == 13) {
        for (var i = 0; i <= 500; i++) {
            var userInput = document.getElementById("search");
            displayClues(userInput.value, i);
        }

    }
}

function displayClues(input, i) {
    fetch('http://jservice.io/api/clues')
        .then(
            function (response) {
                if (response.status !== 200) {
                    console.log('Looks like there was a problem. Status Code: ' +
                        response.status);
                    return;
                }

                // Examine the text in the response

                response.json().then(function (data) {
                    if (data[i].question.toLowerCase().includes(input)) {
                        const answer = data[i].answer;
                        const question = data[i].question;

                        document.getElementById("question").innerHTML = question;
                        document.getElementById("answer").innerHTML = answer;
                    }


                });

            }
        )
        .catch(function (err) {
            console.log('Fetch Error :-S', err);
        });

}