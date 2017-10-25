(function(){
  'use strict';
  angular.module('app').config(route);
  function route($stateProvider) {
    $stateProvider
      .state('root.teams', {
        url: '/teams',
        views : {
          'mainView': {
            templateUrl: 'js/teams/teams.component.html',
            controller: 'TeamsController',
            controllerAs: 'teamsVm'
          }
        }

      });
  }
  route.$inject = ['$stateProvider'];
}());
