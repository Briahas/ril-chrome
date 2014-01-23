'use strict';

angular.module('iWillRil')
  .controller('ListController', function($scope, ItemService, SettingsService){
    $scope.test = function(){
      console.log('Testing');
    };

    $scope.items = [];
    $scope.orderBy = SettingsService.orderBy;

    $scope.refresh = function(){
      ItemService.refresh();
    }

    $scope.orderItems = function(item){
      if(SettingsService.orderBy == 'oldest')
        return item.getTimeAdded();
      else
        return - item.getTimeAdded();
    }

    $scope.getItems = function(){
      ItemService.getItems(function(items){
        $scope.items = items;
        if(!$scope.$$phase){
          $scope.$digest();
        }
      });
    }

    $scope.updateOrderBy = function(){
      SettingsService.updateOrderBy($scope.orderBy);
    }

    $scope.addUrl = function(){
      chrome.tabs.getSelected(null, function(tab){
        var url = tab.url;
        var title = tab.title;
        ItemService.add(url, title, function(error, data){
          $scope.items.push(data);
        })
      })
    }

    $scope.getItems();
  });
