const {app, BrowserWindow} = require('electron');

let mainWindow;

app.on('window-all-closed', function() {
	app.quit();
});

app.on('ready', function() {

	mainWindow = new BrowserWindow({width: 1024, height: 768});

	mainWindow.loadURL('file://'+__dirname+'/browser.html');

	//mainWindow.openDevTools();

	//mainWindow.loadURL('http://oneworld.org/');

	//mainWindow.webContents.on('did-finish-load', handleLoadCommit);

});

function handleLoadCommit() {

		let code = `
			var script = document.createElement('script');
			script.type="text/javascript";
			//script.src = "/lib/jquery-3.1.1.min.js";
			script.src = 'https://code.jquery.com/jquery-3.1.1.min.js';
			document.getElementsByTagName('head')[0].appendChild(script);
		`;
		mainWindow.webContents.executeJavaScript(code);

}
