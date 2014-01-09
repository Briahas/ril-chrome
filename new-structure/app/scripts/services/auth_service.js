CONSUMER_KEY="11758-a73b85ac41814ed5b483f3a3";
angular.module('iWillRil').factory('AuthService', function(){
  var authService = {};

  authService.consumer_key = CONSUMER_KEY;
  authService.isAuthenticate = function(){
    return localStorage['access_token'] && localStorage['access_token'] != "null";
  }

  authService.authenticate = function(){
    localStorage['access_token'] = null;
    var url = "https://getpocket.com/v3/oauth/request"
    var params = {
      consumer_key: CONSUMER_KEY,
      redirect_uri: window.location.href
    }

    var xhr = new XMLHttpRequest();
    xhr.open("post", url, true);
    xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    xhr.setRequestHeader("X-Accept", "application/json");
    xhr.onreadystatechange = function(){
      if(xhr.readyState == 4 && xhr.status == 200){
        var resp = JSON.parse(xhr.response);
        var code = resp.code;
        localStorage['request_code'] = code;
        authService.redirectToPocket(code);
      }
    }
    xhr.send(JSON.stringify(params));
  }

  authService.redirectToPocket = function(code){
    var redirectUri = chrome.extension.getURL('auth.html');
    chrome.tabs.create({'url': 'https://getpocket.com/auth/authorize?request_token='+code+'&redirect_uri='+redirectUri}, function(tab) {

    });
  }

  authService.getConsumerKey = function(){
    var url = "https://getpocket.com/v3/oauth/authorize"
    var params = {
      consumer_key: CONSUMER_KEY,
      code: localStorage['request_code']
    }

    var xhr = new XMLHttpRequest();
    xhr.open("post", url, true);   
    xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    xhr.setRequestHeader("X-Accept", "application/json");
    xhr.onreadystatechange = function(){
      if(xhr.readyState == 4 && xhr.status == 200){
        var resp = JSON.parse(xhr.response);
        localStorage['access_token'] = resp.access_token;
        localStorage['username'] = resp.username;
      }
    }
    xhr.send(JSON.stringify(params)); 
  }


  return authService;
});
