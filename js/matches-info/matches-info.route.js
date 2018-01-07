(function(){
  'use strict';
  angular.module('app').config(route);
  function route($stateProvider) {
    $stateProvider
      .state('root.matches-info', {
        url: '/leagues/{gamesId}/matches/{matchId}',
        views : {
          'mainView': {
            templateUrl: 'js/matches-info/matches-info.component.html',
            controller: 'MatchesInfoController',
            controllerAs: 'matchesInfoVm'
          }
        }

      });
  }
  route.$inject = ['$stateProvider'];
}());
