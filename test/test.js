const fs = require('fs');

const allwords = JSON.parse(fs.readFileSync('words/words.json').toString());
const len = allwords.length;
let presentWord;
let isChanged;

const wordform = document.getElementById('word-display');
const searchResult = document.getElementById('search-result');

document.body.addEventListener('keydown',event => {
    if(event.key === 'ArrowLeft'){
        left();
        next();
    }
});

document.body.addEventListener('keydown',event => {
    if(event.key === 'ArrowRight'){
        right();
        next();
    }
});

document.body.addEventListener('keydown',event => {
    if(event.key === 'ArrowUp') displayMeaning();
});

document.getElementById('save').addEventListener('click',save());

const left = () => {
    searchResult.textContent = '';
    const newP = document.createElement('p');
    const previousWord = presentWord.word;
    presentWord.score++;
    newP.textContent = previousWord;
    document.getElementById('left').prepend(newP);
};

const right = () => {
    searchResult.textContent = '';
    const newP = document.createElement('p');
    const previousWord = presentWord.word;
    presentWord.score++;
    newP.textContent = previousWord;
    document.getElementById('right').prepend(newP);
};

const next = () => {
    const newWord = allwords[Math.floor(len * Math.random())];
    const score = newWord.score;
    if(Math.random() < 1/(score+1) ){
        presentWord = newWord;
        wordform.textContent = newWord.word;
    }else{
        next();
    }
};

const search = async() => {
    const word = wordform.textContent;
    const url = `https://ejje.weblio.jp/content/${encodeURIComponent(word)}`;
    return fetch(url, {mode: 'cors'})
        .then(response => response.text())
        .then(text => new DOMParser().parseFromString(text,'text/html'))
        .then(document => {
            // return document.getElementsByName('twitter:description');
            const result = document.getElementsByName('twitter:description')[0].content;
            searchResult.textContent = result.slice(word.length+2);
        });
};

const displayMeaning = async() => {
    if(presentWord.meaning){
        searchResult.textContent = presentWord.meaning;
        return;
    }else{
        await search();
        presentWord.meaning = searchResult.textContent;
        isChanged = true;
        return;
    }
};

const save = () => {
    if(isChanged){
        const result = JSON.stringify(allwords);
        fs.writeFile('words/words.json', result);
    }else{
        return;
    }
};


window.onload = next();