const {app, BrowserWindow} = require('electron');
// const fetch = require('node-fetch');

let mainWindow;


function createWindow () {
    mainWindow = new BrowserWindow({
        useContentSize: true,
        webPreferences: {
            nodeIntegration: true
        }
    });

    mainWindow.loadFile('index.html');
    mainWindow.maximize();
    
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
    // mainWindow.webContents.openDevTools();
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    app.quit();
});

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow();
    }
});
