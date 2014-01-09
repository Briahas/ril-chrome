angular.module('iWillRil').factory('ItemService', function($http, AuthService){
  var CONSUMER_KEY = AuthService.consumer_key;
  var itemService = {};
  itemService.items = []; 
  itemService.getItems = function(){
    return itemService.items; 
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


  function parseToList(pocketListResponse){
    var list = [];
    for(key in pocketListResponse){
      var item = pocketListResponse[key];
      list.push(item);
    }
    itemService.items = list;
  }
  

  return itemService;
});
