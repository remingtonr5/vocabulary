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
        if(value.includes('=')){
            const wordAndMeaning = value.split('=');
            return {
                'word': wordAndMeaning[0],
                'level': 99,
                'meaning': wordAndMeaning[1],
                'score': 0
            };
        }else{
            return {
                'word': value,
                'level': 99,
                'meaning': null,
                'score': 0
            };
        }
    });
    const presentJSON = JSON.parse(fs.readFileSync('words/words.json').toString());
    const newJSON = presentJSON.concat(objWords);
    writeJSON(newJSON);
});


const writeJSON = (newjson) => {
    const result = JSON.stringify(newjson);
    fs.writeFileSync('words/words.json', result);
};

module.exports = writeJSON();