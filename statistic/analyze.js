const fs = require('fs');
let words = fs.readFileSync('10000_filtered.txt').toString();

words = words.split('\n').map( value => value.split(' '));

// const counter = new Array(31);
// for(let i = 0; i < counter.length; i++){
//     counter[i] = 0;
// }

// words.forEach((word, ind) => {
//     ++counter[+word[1]];
// });

// let sum = 0;

// counter.forEach( (value) => console.log(sum += value));

const erCount = () => {
    let count = 0;
    words.forEach((word) => {
        if(word[0].slice(-2) === 'er') count++;
    });
    console.log(count);
};

// const ionCount = () => {

// }

erCount();