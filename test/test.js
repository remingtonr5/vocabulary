const fs = require('fs');

const allwords = JSON.parse(fs.readFileSync('words/words.json').toString());
const len = allwords.length;
const done = [];
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

const left = () => {
    searchResult.textContent = '';
    const newP = document.createElement('p');
    const word = wordform.textContent;
    newP.textContent = word;
    document.getElementById('left').prepend(newP);
};

const right = () => {
    searchResult.textContent = '';
    const newP = document.createElement('p');
    const word = wordform.textContent;
    newP.textContent = word;
    document.getElementById('right').prepend(newP);
};

const next = () => {
    done.length = done.length === len ? 0: done.length;
    presentWord = allwords[Math.floor(len * Math.random())];
    const word = presentWord.word;
    if(done.includes(word)){
        next();
    }else{
        wordform.textContent = word;
        done.push(word);
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

const overwriteJSON = () => {
    console.log('hello');
    if(isChanged){
        const result = JSON.stringify(allwords);
        fs.writeFile('words/words.json', result);
    }else{
        return;
    }
};


window.onload = next();

//window閉じたときに書き込もうと思ってたけど安定しないしコンソール見えないから都度更新する方がいいわ
window.onclose = overwriteJSON();