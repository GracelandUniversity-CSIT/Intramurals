(function(){
  'use strict';
  angular.module('app').config(route);
  function route($stateProvider) {
    $stateProvider
      .state('root.roster', {
        url: '/teams/{teamsId}/roster',
        views : {
          'mainView': {
            templateUrl: 'js/roster/roster.component.html',
            controller: 'RosterController',
            controllerAs: 'rosterVm'
          }
        }

      });
  }
  route.$inject = ['$stateProvider'];
}());
