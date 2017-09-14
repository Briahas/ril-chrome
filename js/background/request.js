import Constants from './../constants.js';

function Request(){}

Request._post = function(url, params, callback){
  const xhr = new XMLHttpRequest();
  xhr.open("post", url, true);
  xhr.setRequestHeader("Content-type", "application/json");
  xhr.onreadystatechange = function(){
    if(xhr.readyState == 4 && callback)
      callback(xhr);
  };
  xhr.send(JSON.stringify(params));
};

Request.add = function(addurl, title, callback){
  const url = "https://getpocket.com/v3/add";

  const params = {
    "url": addurl,
    "title": title,
    "consumer_key": Constants.CONSUMER_KEY,
    "access_token": localStorage['access_token']
  };

  Request._post(url, params, callback);
};

Request.get = function(callback){
  const url = "https://getpocket.com/v3/get";
  const params = {
    "sort": "oldest",
    "consumer_key": Constants.CONSUMER_KEY,
    "access_token": localStorage['access_token']
  };

  Request._post(url, params, callback);
};

Request.archieve = function(item_id, callback){
  const url = "https://getpocket.com/v3/send";
  const actions = [
    {
      "action": "archive",
      "item_id": item_id
    }
  ];

  const params = {
    "consumer_key": Constants.CONSUMER_KEY,
    "access_token": localStorage['access_token'],
    "actions": actions
  };

  Request._post(url, params, callback);
};

Request.delete = function(item_id, callback){
  const url = "https://getpocket.com/v3/send";
  const actions = [
    {
      "action": "delete",
      "item_id": item_id
    }
  ];

  const params = {
    "consumer_key": Constants.CONSUMER_KEY,
    "access_token": localStorage['access_token'],
    "actions": actions
  };

  Request._post(url, params, callback);
};

export default Request;
