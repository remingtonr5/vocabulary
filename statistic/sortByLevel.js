const fs = require('fs');
let words = fs.readFileSync('10000_filtered.txt').toString();

words = words.split('\n');

const sorted = new Array(31);
for(let i = 0; i<sorted.length; i++){
    sorted[i] = [];
}
console.log(sorted);

words.forEach(value => {
    const level = parseInt(value.slice(-2),10);
    sorted[level].push(value);
});

words.push(words.shift());

sorted.push(sorted.shift());

fs.writeFileSync('10000_sorted.txt', sorted.flat().join('\n'));