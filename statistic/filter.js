const fs = require('fs');
const fetch = require('node-fetch');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const path = '10000_filtered.txt';

const allwords = fs.readFileSync(path).toString();
const words = allwords.split('\n');

const evaluate = (word) => {
    const url = `https://ejje.weblio.jp/content/${encodeURIComponent(word)}`;
    const result = fetch(url, {mode: 'cors'})
        .then(response => response.text())
        .then(text => new JSDOM(text))
        .then(dom => {
            const lemma = dom.window.document.querySelector('.lemmaAnc');
            const excep = !lemma || lemma.parentElement.innerHTML.includes('原形');
            return !!lemma && !excep;
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

(async() => {
    for(let i = words.length-1; i >= 0; i--){
        if(i%100 === 0){
            console.log(i);
            block(3000);
        }

        const word = words[i].split(' ')[0];
        const isRejected = await evaluate(word);
        if(isRejected){
            console.log(word);
            words.splice(i,1);
        }

        if(i%1000 === 0) fs.writeFileSync(path, words.join('\n'));

    }
})();