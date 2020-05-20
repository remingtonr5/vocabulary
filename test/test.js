const fs = require('fs');

const allwords = JSON.parse(fs.readFileSync('words/words.json').toString());
const len = allwords.length;
let presentWord;

const wordform = document.getElementById('word-display');
const searchResult = document.getElementById('search-result');
const count = document.getElementById('count');

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
    const previousWord = presentWord.word;
    presentWord.score++;
    newP.textContent = previousWord;
    document.getElementById('left').prepend(newP);
};

const right = () => {
    searchResult.textContent = '';
    const newP = document.createElement('p');
    const previousWord = presentWord.word;
    newP.textContent = previousWord;
    document.getElementById('right').prepend(newP);
};

const next = () => {
    const newWord = allwords[Math.floor(len * Math.random())];
    const score = newWord.score;
    if(Math.random() < 1/(score+1) ){
        presentWord = newWord;
        wordform.textContent = newWord.word;
        count.textContent++;
    }else{
        next();
    }
};

const search = async() => {
    const word = presentWord.word.replace(/ /g ,'+');
    const url = `https://ejje.weblio.jp/content/${encodeURIComponent(word)}`;
    return fetch(url, {mode: 'cors'})
        .then(response => response.text())
        .then(text => new DOMParser().parseFromString(text,'text/html'))
        .then(document => {
            // return document.getElementsByName('twitter:description');
            const meaning = document.getElementsByName('twitter:description')[0].content;
            if(meaning.includes('weblio')){
                return null;
            }else{
                let level;
                try{
                    level = document.getElementsByClassName('learning-level-content')[0].textContent;
                }catch(err){
                    level = undefined;
                }
                return [meaning.slice(word.length+2),level];
            }
        });
};

const displayMeaning = async() => {
    if(presentWord.meaning && presentWord.level === 99){
        const result = await search();
        try{
            presentWord.level = result[1];
        }catch(err){
            console.log('検索に失敗しました');
        }
        searchResult.textContent = `${presentWord.meaning},level:${presentWord.level}`;
    }else if(presentWord.meaning){
        searchResult.textContent = `${presentWord.meaning},level:${presentWord.level}`;
    }else{
        const result = await search();
        if(result){
            searchResult.textContent = `${result[0]},level:${result[1]}`;
            presentWord.meaning = result[0];
            presentWord.level = result[1];
        }else{
            searchResult.textContent = '検索に失敗しました';
        }
    }
};

const save = () => {
    console.log('保存します');
    const result = JSON.stringify(allwords);
    fs.writeFileSync('words/words.json', result.replace(/},/g,'},\n').replace(/\[/g,'[\n').replace(/\]/g,'\n]')  );
    console.log('保存完了');
};

document.getElementById('save').addEventListener('click',save);

window.onload = next();