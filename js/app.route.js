(function(){
  'use strict';
  angular.module('app').config(routes);
  function routes($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/leagues');
    $stateProvider
      .state('root', {
        url: '',
        abstract: true,
        templateUrl: 'js/root/root.component.html',
        controller: 'rootController',
        controllerAs: 'rootVm'
      });
  }
  routes.$inject = ['$stateProvider', '$urlRouterProvider'];
}());
