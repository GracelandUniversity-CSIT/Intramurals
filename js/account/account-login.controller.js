(function(){
  'use strict';
  angular.module('app').controller('LoginController', LoginController);

  function LoginController($state, $firebaseAuth, $mdDialog) {
    var vm = this;
    vm.submit = submit;
    vm.close = close;

    function close() {
      $mdDialog.hide();
    }

    function submit() {
      $firebaseAuth().$signInWithEmailAndPassword(vm.email, vm.password)
        .then(function(data) {
          $mdDialog.hide(data);
          //console.log('Sign in successful');
          //$state.go('root.leagues');
        }).catch(function(err) {
          vm.errors[err.code] = true;
        });
    }
  }

  LoginController.$inject = ['$state', '$firebaseAuth', '$mdDialog'];
}());
