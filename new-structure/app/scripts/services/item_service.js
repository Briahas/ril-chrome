angular.module('iWillRil').factory('ItemService', function($http, AuthService){
  var CONSUMER_KEY = AuthService.consumer_key;
  var itemService = {};
  itemService.items = [];


  itemService.getItems = function(callback){
    chrome.storage.local.get('itemList', function(data){
      callback(data.itemList);
    })
  }

  itemService.addItem = function(item){
    chrome.storage.local.get('itemList', function(data){
      data.itemList.push(item);
    })
    
  }

  itemService.refresh = function(){
    var url = "https://getpocket.com/v3/get";
    var params = {
      "sort": "oldest",
      "consumer_key": CONSUMER_KEY,
      "access_token": localStorage['access_token']
    }
    $http.post(url, params)
      .success(function(data, status){
        parseToList(data.list);
      })
      .error(function(data, status){

      })
  }

  itemService.add = function(addurl, title, callback){
    var url = "https://getpocket.com/v3/add";
    var params = {
      "url": addurl,
      "title": title,
      "consumer_key": CONSUMER_KEY,
      "access_token": localStorage['access_token']
    }

    $http.post(url, params)
      .success(function(data, status){
        itemService.addItem(data.item);
        callback(null, data.item);
      })
      .error(function(data, status){
        callback("Error");
      })
  }


  function parseToList(pocketListResponse){
    var list = [];
    for(key in pocketListResponse){
      var item = pocketListResponse[key];
      list.push(item);
    }
    itemService.items = list;
    chrome.storage.local.set({itemList: list});
  }

  return itemService;
});
