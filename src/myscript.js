window.addEventListener('keyup', keyboardShortCut, false);//Keyboard ShortCut

function keyboardShortCut(e){
	if(e.altKey && e.ctrlKey){
		chrome.extension.sendMessage({name : 'keyShortCut', keyCode : e.keyCode, url: window.location.href, title: document.title});
	}
}
