(function(){
  'use strict';
  angular.module('app').config(route);
  function route($stateProvider) {
    $stateProvider
      .state('root.entrant', {
        url: '/leagues/{gamesId}/league/{leagueId}/entrants',
        views : {
          'mainView': {
            templateUrl: 'js/entrant/entrant.component.html',
            controller: 'entrantController',
            controllerAs: 'entrantVm'
          }
        }

      });
  }
  route.$inject = ['$stateProvider'];
}());
