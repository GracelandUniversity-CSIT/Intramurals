(function(){
  'use strict';
  angular.module('app').controller('rootController', rootController);
  function rootController(MainDS, $scope, $mdDialog, $rootScope, $state, imp, $firebaseObject, $firebaseAuth) {
    var vm = this;
    vm.imp = imp;
    vm.goto = goto;
    vm.signOut = signOut;
    vm.signIn = signIn;
    vm.isUpper = imp.isUpper;
    vm.uids = imp.uids;
    vm.state = $state.current.name;
    vm.account = {};
    vm.currentUser = {};
    $firebaseAuth().$onAuthStateChanged(function(data) {
      if(data) {
        $firebaseObject(firebase.database().ref('account/'+data.uid)).$loaded().then(function(user) {
          vm.currentUser = user;
        });
      }
    });
    // MainDS.getDataFrom().then(function(data) {
    //   vm.account = data.account;
    //   vm.people = data.people;
    //
    //
    //   $scope.$watch('currentUser', function(d) {
    //     if(d && d.uid && vm.account[d.uid]) {
    //       $scope.accountInfo = Object.assign({}, vm.account[d.uid], vm.people[d.id]);
    //       // console.log($scope.accountInfo);
    //     }
    //   });
    //
    //   firebase.auth().onAuthStateChanged(function(user) {
    //     $scope.currentUser = user;
    //     // $state.go('root.leagues');
    //   });
    // });

    function goto(state) {
      $state.go(state);
      vm.state = $state.current.name;
      console.log($state.current.name)
    }

    function signOut() {
      $firebaseAuth().$signOut().then(function() {
        vm.currentUser = {};
        $state.go('root.leagues');
      });
    }

    function signIn(ev) {
      $mdDialog.show({
        controller: 'LoginController',
        controllerAs: 'loginVm',
        templateUrl: 'partials/login.template.html',
        targetEvent: ev,
        parent: angular.element(document.body),
        clickOutsideToClose: true
      }).then(function(data) {
        if(data) {
          $firebaseObject(firebase.database().ref('account/'+data.uid)).$loaded().then(function(user) {
            vm.currentUser = user;
          });
        }
      });
      // $state.go('root.account');

    }

  }
  rootController.$inject = ['MainDS', '$scope', '$mdDialog', '$rootScope', '$state', 'imp', '$firebaseObject', '$firebaseAuth'];
}());
