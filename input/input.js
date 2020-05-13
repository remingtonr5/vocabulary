const fs = require('fs');
const vision = require('@google-cloud/vision');

const imageDir = 'C:/Users/remin/Googledrive/vocabulary/crop';
const files = fs.readdirSync(imageDir);

const newWords =[];

files.forEach((name, ind)=> {
    const outerdiv = document.createElement('div');
    const innerdiv = document.createElement('div');
    const button = document.createElement('button');
    const image = document.createElement('img');
    const textarea = document.createElement('textarea');
    
    outerdiv.appendChild(innerdiv);
    outerdiv.appendChild(button);
    innerdiv.appendChild(image);
    innerdiv.appendChild(textarea);
    
    button.textContent = '一時保存';
    button.setAttribute('id',`button-${ind}`);
    image.setAttribute('src', `${imageDir}/${name}`);
    image.setAttribute('height', '480px');
    textarea.setAttribute('id', `meanings-${ind}`);
    // textarea.setAttribute('width', '130px');
    // textarea.rows = 20;
    
    document.getElementById('images').appendChild(outerdiv);
});


const accent = {
    'á':'a',
    'é':'e',
    'í':'i',
    'ó':'o',
    'ú':'u'
};

const filter = (string) => {
    Object.keys(accent).forEach(value => {
        string = string.replace(value, accent[value]);
    });
    const array = string.split('\n');
    for(let i=array.length-1; i>=0; i--){
        console.log(array[i]);
        if(array[i].length < 4){
            array.splice(i,1);
            continue;
        }
        const result = array[i].toLowerCase().replace('1','l').replace(/\s+/g,'_').replace(/[^a-z_]/g,'');
        array[i] = result;
    }
    return array.join('\n');
};



const detect = async() => {
    await Promise.all(files.map(async(name,ind) => {
        const client = new vision.ImageAnnotatorClient();
        const [result] = await client.textDetection(`${imageDir}/${name}`);
        const detections = result.textAnnotations;
        let meaning = detections[0].description;
        meaning = filter(meaning);
        const textarea = document.getElementById(`meanings-${ind}`);
        textarea.value = meaning;
    }));
};

(async() => {
    await detect();
})();


const tmpSave = (ind) => {
    console.log(`tmpSave:${ind}`);
    const words = [];
    const textarea = document.getElementById(`meanings-${ind}`);
    words.push.apply(words, textarea.value.split('\n'));
    const filtWords = words.filter(value => value !== '');
    newWords.push.apply(
        newWords,
        filtWords.map(value => {
            if(value.includes('=')){
                const wordAndMeaning = value.split('=');
                console.log(`成功:${wordAndMeaning[0]}(${wordAndMeaning[1]})`);
                return {
                    'word': wordAndMeaning[0],
                    'level': 99,
                    'meaning': wordAndMeaning[1],
                    'score': 0
                };
            }else{
                console.log(`成功:${value}`);
                return {
                    'word': value,
                    'level': 99,
                    'meaning': null,
                    'score': 0
                };
            }
        })
    );
    textarea.style.color = '#808080';
};

files.forEach((value,ind) => {
    document.getElementById(`button-${ind}`).addEventListener('click', () => {
        tmpSave(ind);
    });
});

document.getElementById('add').addEventListener('click', () => {
    const presentJSON = JSON.parse(fs.readFileSync('words/words.json').toString());
    const newJSON = presentJSON.concat(newWords);
    writeJSON(newJSON);
});

const writeJSON = (newjson) => {
    const result = JSON.stringify(newjson);
    fs.writeFileSync('words/words.json', result);
};