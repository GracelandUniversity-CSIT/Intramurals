(function(){
  'use strict';
  angular.module('app').config(route);
  function route($stateProvider) {
    $stateProvider
      .state('root.leagues', {
        url: '/leagues',
        views : {
          'mainView': {
            templateUrl: 'js/leagues/leagues.component.html',
            controller: 'GamesController',
            controllerAs: 'gamesVm'
          }
        }

      });
  }
  route.$inject = ['$stateProvider'];
}());
