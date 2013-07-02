app.ItemsFactory = function($http){
  CONSUMER_KEY="11758-a73b85ac41814ed5b483f3a3";
  var factory = {};
  var items = [];

  factory.refresh = function(){
    var url = "https://getpocket.com/v3/get";
    var params = {
      "sort": "oldest",
      "consumer_key": CONSUMER_KEY,
      "access_token": localStorage['access_token']
    }
    
    $http.post(url, params).
    success(function(data, status){
      if (status == 200) {
        for(var key in data.list){
          items.push(data.list[key]);
        }

      localStorage['lastResponse'] = JSON.stringify(items);
      }
    });
  }

  factory.all = function(orderBy){
    var items = JSON.parse(localStorage['lastResponse'])
    var itemsModelList = []
    for(var i = 0; i < items.length; i++){
      itemsModelList.push(new app.Item(items[i]))
    }
    return itemsModelList;
  };

  factory.markAsRead = function del(item){
    var actions = [
      {
        "action": "archive",
        "item_id": item.id
      }
    ];

    $http.post('https://getpocket.com/v3/send', {
      "consumer_key": CONSUMER_KEY,
      "access_token": localStorage['access_token'],
      "actions": actions
    }).
    success(function(data, status){
      return data;
    })
  };

  factory.addItem = function(item){
    var url = "https://getpocket.com/v3/add";

    var params = {
      "url": addurl,
      "title": title,
      "consumer_key": CONSUMER_KEY,
      "access_token": localStorage['access_token']
    };

    $http.post(url, params).
    success(function(data, status){
      return data;
    });

  };
  return factory; 
};

app.factory('itemsFactory', app.ItemsFactory);
