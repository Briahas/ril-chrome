app.ItemsController = function($scope, itemsFactory){
  $scope.getItems = function(){
    return itemsFactory.all();
  };
  
  $scope.refresh = function(){
    itemsFactory.refresh();
  }

  $scope.addItem = function(){
    itemsFactory.create(item);
  };

  $scope.markAsRead = function(){
    itemsFactory.delete(item);
  };
};

app.controller('ItemsController', app.ItemsController);
