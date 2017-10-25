(function(){
  'use strict';
  angular.module('app').config(route);
  function route($stateProvider) {
    $stateProvider
      .state('root.people', {
        url: '/people',
        views : {
          'mainView': {
            templateUrl: 'js/people/people.component.html',
            controller: 'PeopleController',
            controllerAs: 'peopleVm'
          }
        }

      });
  }
  route.$inject = ['$stateProvider'];
}());
