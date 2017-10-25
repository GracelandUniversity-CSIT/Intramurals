(function(){
  'use strict';
  angular.module('app').config(route);
  function route($stateProvider) {
    $stateProvider
      .state('root.games', {
        url: '/games',
        views : {
          'mainView': {
            templateUrl: 'js/games/games.component.html',
            controller: 'GamesController',
            controllerAs: 'gamesVm'
          }
        }

      });
  }
  route.$inject = ['$stateProvider'];
}());
