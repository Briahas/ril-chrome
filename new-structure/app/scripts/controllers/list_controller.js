'use strict';

angular.module('iWillRil')
  .controller('ListController', function($scope, ItemService){
    $scope.test = function(){
      console.log('Testing');
    };

    $scope.refresh = function(){
      ItemService.refresh();
    }

    $scope.getItems = function(){
      return ItemService.getItems();
    }
  });
