# jeopardy-clue-search

![Demo](demo/demo.gif)

# Introduction

This is my attempt at the Jeopardy! Clue Search app for Capital One MindSumo challenge.
This app has advanced search filters and the user can search while the database is still
being built.

### Initial plan

My initial plan for this application was to pull the JSON objects and insert
them into a trie tree by the question value. Then, I would implement a live
search or autocomplete feature. By using a trie tree, we can search through
a database with ***O(nm)*** time complexity. However, this implementation
was more difficult than I anticpated. To my understanding, trie trees must
require exact values and must be prefixes to what you're searching for. That is,
if you have a string *S* that contains "My dog ate my pasta" and want to search a
substring *x* "my pasta" within *S*, it would not be possible
since "My dog " comes before that substring.

Comparing with .includes() with a trie tree database did not seem like a smart
solution to me. My thinking was that I would have to iterate through my database
and compare, which goes against what I was trying to accomplish in the first place.

Eventually, I settled on attempting the Aho-Corasick algorithm. Because
I would be able to make one pass through the database, it would be extremely useful
for this application. The time complexity of this algorithm would be ***O(m)***, where
***m*** is the largest string in the database.

This is what I had in mind:
* Fetch the API using ***offset*** from the provided API to iterate through the data.
* Build an Aho-Corasick database using ***[questions]*** from the JSON data.
* Implement a live search that changes the clues on screen as the user types.
* Implement a fuzzy string matching algorithm using the Levenshtein distance. This
allows for further and faster result searching.

### main.js

My main method script file. Uses require() to load other modules. I have one array,
called ***clueDatabse*** that contains an array of clues. Then, I can use the array
to compare attributes.


### buildDatabase.js

Builds a database of clues. Uses async/await to allow the user to search whilst the
database is still being built.

### handleUser.js

Handles user inputs, adds/removes clues from the page. Contains the bulk of the scripting
portion of this web application. Currently, button toggling to show/hide answer is a bug
in this application.

### index.html and style.scss

A relatively simple main and only page. I created cards and used appropiate colors that
would stay true to the game show's colors. My ***scrolling-wrapper*** allows me to scroll
horizontally, but not the entire page, allowing the user to scroll through clues as they please.

The search bar has built in advanced search filters, with category, min date, max date,
and value. Because dates are bounded and so are the values, I decided to go for
a date selector and drop menu for values (there aren't many different values).

### Images and SVG

I only have two files in my ***images*** directory, ***background.png***, which I stole
from Google Images (I'm kidding, I checked usage rights), and ***search-icon.svg***.
***search-icon.svg*** was created by me with SVG-edit. I did not know what SVG files were
before this project, but am happy to learn of its applications. Because it's vector based,
this allows for better integration in web applications. Although my app only uses it for
a search icon/button, it is something that I will be using in the future from now on.

### Conclusion

This is my version of a clue searching web app from the game show Jeopardy! Although it's
not perfect, this was my first real web project and I learned a significant amount throughout
the process, such as how to request APIs and common issues associated with it, how to handle
JSON objects, and the JavaScript, CSS, and HTML languages on their own. If I were to redo this
web app, I would try to minimize API calling bugs, and create a proper search algorithm.
