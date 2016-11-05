import Constants from './../constants.js';

function Auth(){}
Auth.isAuthenticate = function(){
  return localStorage['access_token'] && localStorage['access_token'] != "null";
};

Auth.authenticate = function(){
  localStorage['access_token'] = null;
  const url = "https://getpocket.com/v3/oauth/request";
  const params = {
    consumer_key: Constants.CONSUMER_KEY,
    redirect_uri: window.location.href
  };

  const xhr = new XMLHttpRequest();
  xhr.open("post", url, true);
  xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
  xhr.setRequestHeader("X-Accept", "application/json");
  xhr.onreadystatechange = function(){
    if(xhr.readyState == 4 && xhr.status == 200){
      const resp = JSON.parse(xhr.response);
      const code = resp.code;
      localStorage['request_code'] = code;
      Auth.redirectToPocket(code);
    }
  };
  xhr.send(JSON.stringify(params));
};

Auth.redirectToPocket = function(code){
  const url = 'https://getpocket.com/auth/authorize?request_token=';
  const redirectUri = chrome.extension.getURL('html/auth.html');
  chrome.tabs.create({'url': `${url}${code}&redirect_uri=${redirectUri}`}, (tab) => {

  });
};

Auth.getConsumerKey = function(){
  const url = "https://getpocket.com/v3/oauth/authorize";
  const params = {
    consumer_key: Constants.CONSUMER_KEY,
    code: localStorage['request_code']
  };

  const xhr = new XMLHttpRequest();
  xhr.open("post", url, true);
  xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
  xhr.setRequestHeader("X-Accept", "application/json");
  xhr.onreadystatechange = function(){
    if(xhr.readyState == 4 && xhr.status == 200){
      const resp = JSON.parse(xhr.response);
      localStorage['access_token'] = resp.access_token;
      localStorage['username'] = resp.username;
    }
  };
  xhr.send(JSON.stringify(params));
};

export default Auth;
