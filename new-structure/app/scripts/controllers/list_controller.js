'use strict';

angular.module('iWillRil')
  .controller('ListController', function($scope, ItemService){
    $scope.test = function(){
      console.log('Testing');
    };

    $scope.items = [];

    $scope.refresh = function(){
      ItemService.refresh();
    }

    $scope.getItems = function(){
      ItemService.getItems(function(items){
        $scope.items = items;
        if(!$scope.$$phase){
          $scope.$digest();
        }
      });
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
