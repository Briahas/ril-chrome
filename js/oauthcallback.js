import Auth from './background/auth.js';

window.addEventListener("load", endAuthentication);

function endAuthentication(){
	Auth.getConsumerKey();
}
