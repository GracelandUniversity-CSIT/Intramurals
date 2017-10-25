(function(){
  'use strict';
  angular.module('app').config(route);
  function route($stateProvider) {
    $stateProvider
      .state('root.matches', {
        url: '/games/{gamesId}/matches',
        views : {
          'mainView': {
            templateUrl: 'js/matches/matches.component.html',
            controller: 'MatchesController',
            controllerAs: 'matchesVm'
          }
        }

      });
  }
  route.$inject = ['$stateProvider'];
}());
