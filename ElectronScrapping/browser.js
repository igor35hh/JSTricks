
onload = function () {
	var webview = document.querySelector('webview');

	document.querySelector('#location-form').onsubmit = function(e) {
		e.preventDefault();
		navigateTo(document.querySelector('#location').value);
	};

	//webview.addEventListener('close', handleExit);
	//webview.addEventListener('did-start-loading', handleLoadStart);
	//webview.addEventListener('did-stop-loading', handleLoadStop);
	//webview.addEventListener('did-fail-load', handleLoadAbort);
	//webview.addEventListener('did-gen-redirect-request', handleLoadRedirect);
	webview.addEventListener('did-finish-load', handleLoadCommit);

};

function navigateTo(url) {
	document.querySelector('webview').src = url;
}


function handleLoadCommit() {
	
	 var webview = document.getElementById("foo");
	 webview.addEventListener("dom-ready", function(){ webview.openDevTools(); });
	 if(webview.getURL() == 'http://oneworld.org/') {
	 //if(webview.getURL() == 'http://hotline.ua/computer/besprovodnoe-oborudovanie/4485/') {
	 	let code1 = `
		 	//var div1 = document.getElementById("tab-democracy-and-governance");
		 	//var a1 = div1.getElementsByTagName("a");
		 	//window.location.replace(a1[0].href);
		 	window.location.replace('http://oneworld.org/democracy-and-governance');
		 `;
	 	webview.executeJavaScript(code1);
	 }
	 
	 if(webview.getURL() == 'http://oneworld.org/democracy-and-governance') {
	 	let code2 = `
			var script = document.createElement('script');
			script.type="text/javascript";
			//script.src = "/lib/jquery-3.1.1.min.js";
			script.src = 'https://code.jquery.com/jquery-3.1.1.min.js';
			document.getElementsByTagName('head')[0].appendChild(script);
		`;
		webview.executeJavaScript(code2);
	 	let code3 = `
		 	var div2 = document.getElementById("block-widget-0-0");
		 	var p1 = div2.getElementsByTagName("p");
		 	for(i=0; i<p1.length; i++) {
		 		console.log(p1[i].textContent);
		 	}
		 	console.log(p1);
		 `;
	 	webview.executeJavaScript(code3);
	 }

}