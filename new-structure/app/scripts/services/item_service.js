angular.module('iWillRil').factory('ItemService', function($http, AuthService){
  var CONSUMER_KEY = AuthService.consumer_key;
  var itemService = {};
  itemService.items = [];

  itemService.getItems = function(callback){
    chrome.storage.local.get('itemList', function(data){
      var list = []
      for(var i = 0; i < data.itemList.length; i++){
        var item = new Item(data.itemList[i]);
        list.push(item);
      }
      callback(list);
    });
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
      var item = new Item(data.item);
        itemService.addItem(item);
        callback(null, item);
      })
      .error(function(data, status){
        callback("Error");
      })
  }

  function parseToList(pocketListResponse){
    var list = [];
    for(key in pocketListResponse){
      var itemApi = pocketListResponse[key];
      list.push(itemApi);
    }
    itemService.items = list;
    chrome.storage.local.set({itemList: list});
  }

  return itemService;
});
