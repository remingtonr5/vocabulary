const fs = require('fs');
const fetch = require('node-fetch');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const allwords = fs.readFileSync('10000.txt').toString();

const url = 'http://sherwoodschool.ru/vocabulary/proficiency/';

let words = [];

words = allwords.split('\n');

const search = (word) => {
    const url = `https://ejje.weblio.jp/content/${encodeURIComponent(word)}`;
    const result = fetch(url, {mode: 'cors'})
        .then(response => response.text())
        .then(text => new JSDOM(text))
        .then(dom => {
            try{
                const level = dom.window.document.querySelector('.learning-level-content').textContent;
                return level;
            }catch(err){
                return '0';
            }
        });
    return result;
};

const block = (timeout) => { 
    const startTime = Date.now();
    while (true) {
        const diffTime = Date.now() - startTime;
        if (diffTime >= timeout) {
            return;
        }
    }
};


const skip = 5;

(async() => {
    for(let i = 0; i<words.length; i += skip){
        if(i % 200 === 0){
            fs.writeFileSync('10000.txt', words.join('\n'));
        }
        
        await Promise.all(words.slice(i, i+skip).map( value => {
            return search(value);
        })).then( results => {
            results.forEach( (value, index) => {
                console.log(`${i + index} ${words[i + index]} level:${value}`);
                words[i + index] = `${words[i + index]} ${value}`;
            });
        });
        block(1000);
    }
    fs.writeFileSync('10000.txt', words.join('\n'));
})();
