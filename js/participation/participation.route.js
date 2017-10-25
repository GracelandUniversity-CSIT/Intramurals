(function(){
  'use strict';
  angular.module('app').config(route);
  function route($stateProvider) {
    $stateProvider
      .state('root.participation', {
        url: '/participation',
        views : {
          'mainView': {
            templateUrl: 'js/participation/participation.component.html',
            controller: 'ParticipationController',
            controllerAs: 'participationVm'
          }
        }

      });
  }
  route.$inject = ['$stateProvider'];
}());
