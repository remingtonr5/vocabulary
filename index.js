

const wordBox =  document.getElementById('word');

wordBox.addEventListener('keydown', event => {
    if(event.key === 'Enter'){
        const word = wordBox.value;
        getDocument(word);
    }
});



const getDocument = async(word) => {
    const url = `https://ejje.weblio.jp/content/${encodeURIComponent(word)}`;
    const meaning = fetch(url, {mode: 'cors'})
        .then(response => response.text())
        .then(text => new DOMParser().parseFromString(text,'text/html'))
        .then(document => {
            // return document.getElementsByName('twitter:description');
            console.log(document.getElementsByName('twitter:description')[0].content);
        });
    console.log(meaning);
};

// const getMeaning = (doc) => {
//     const meaning = doc.getElementByName('twitter:description').content;
//     return meaning;
// };


// const userId = 'js-primer-example';
// fetch(`https://api.github.com/users/${encodeURIComponent(userId)}`)
//     .then(response => {
//         console.log(response.status); // => 200
//         return response.json().then(userInfo => {
//             // JSONパースされたオブジェクトが渡される
//             console.log(userInfo); // => {...}
//         });
//     });