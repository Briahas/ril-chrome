'use strict';

angular.module('iWillRil', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute'
])
.config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'views/list.html',
      controller: 'ListController'
    })
    .otherwise({
      redirectTo: '/'
    });
})
.run(function(AuthService){
  if(AuthService.isAuthenticate()){
    console.log('Authenticated');
  }else{
    AuthService.authenticate();
  }
});
