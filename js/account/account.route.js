(function(){
  'use strict';
  angular.module('app').config(route);
  function route($stateProvider) {
    $stateProvider
      .state('root.account', {
        url: '/account',
        views : {
          'mainView': {
            templateUrl: 'js/account/account.component.html',
            controller: 'AccountController',
            controllerAs: 'accountVm'
          }
        }

      });
  }
  route.$inject = ['$stateProvider'];
}());
