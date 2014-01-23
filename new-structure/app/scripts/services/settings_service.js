angular.module('iWillRil').factory('SettingsService', function($http, AuthService){
  var settings = {};

  settings.orderBy = 'oldest';

  settings.updateOrderBy = function(value){
    if(!value) return;
    if(value != 'oldest' && value != 'newest') return;

    settings.orderBy = value;
    chrome.storage.local.set({orderBy: value});
  }

  return settings;
});
