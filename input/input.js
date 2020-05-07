const fs = require('fs');
const vision = require('@google-cloud/vision');

const imageDir = 'C:/Users/remin/Googledrive/vocabulary';
const files = fs.readdirSync(imageDir);

files.forEach((name, ind)=> {
    const div = document.createElement('div');
    const image = document.createElement('img');
    const textarea = document.createElement('textarea');
    div.appendChild(image);
    div.appendChild(textarea);

    image.setAttribute('src', `${imageDir}/${name}`);
    image.setAttribute('width', '200px');
    image.setAttribute('height', '480px');
    textarea.setAttribute('id', `meanings-${ind}`);
    // textarea.setAttribute('width', '130px');
    // textarea.rows = 20;
    
    document.getElementById('images').appendChild(div);
});


const accent = {
    'á':'a',
    'é':'e',
    'í':'i',
    'ó':'o',
    'ú':'u'
};

const replace = (string) => {
    Object.keys(accent).forEach(value => {
        string = string.replace(value, accent[value]);
    });
    return string;
};


const detect = async() => {
    await Promise.all(files.map(async(name,ind) => {
        const client = new vision.ImageAnnotatorClient();
        const [result] = await client.textDetection(`${imageDir}/${name}`);
        const detections = result.textAnnotations;
        let meaning = detections[0].description;
        meaning = replace(meaning);
        const textarea = document.getElementById(`meanings-${ind}`);
        textarea.value = meaning;
    }));
};

(async() => {
    await detect();
})();

const words = [];

document.getElementById('add').addEventListener('click', () => {
    files.forEach((name,ind) => {
        const textarea = document.getElementById(`meanings-${ind}`);
        words.push.apply(words, textarea.value.split('\n'));
    });
    const filtWords = words.filter(value => value !== '');
    const objWords = filtWords.map(value => {
        return {
            'word': value,
            'level': 99,
            'meaning': null,
            'score': 0
        };
    });
    console.log(objWords);
    writeJSON('words/words.json', objWords);
});


const writeJSON = (path,addWords) => {
    const present = JSON.parse(fs.readFileSync(path).toString());
    console.log(present);
    console.log(addWords);
    console.log(JSON.stringify(present.concat(addWords)));
    const result = JSON.stringify(present.concat(addWords));
    fs.writeFileSync(path, result);
};