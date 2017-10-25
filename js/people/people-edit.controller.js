(function(){
  'use strict';
  angular.module('app').controller('PersonEditController', PersonEditController);
  function PersonEditController($mdDialog, $scope, MainDS, person, houses, $firebaseObject) {
    var vm = this;
    vm.result = {};
    vm.houses = houses;
    vm.house = '';
    vm.close = close;
    vm.submit = submit;

    $firebaseObject(firebase.database().ref('people/'+person)).$loaded().then(function(person) {
      vm.result = person;
      vm.house = Object.keys(vm.result.house)[0];
    });

    function close() {
      $mdDialog.hide();
    }

    function submit() {
      if(!vm.result.house[vm.house]) {
        delete vm.houses.$getRecord(Object.keys(vm.result.house)[0]).members[vm.result.$id];
        vm.houses.$save(vm.houses.$indexFor(Object.keys(vm.result.house)[0]));
        vm.result.house = {};
        vm.result.house[vm.house] = true;
        vm.houses.$getRecord(vm.house).members[vm.result.$id] = true;
        vm.houses.$save(vm.houses.$indexFor(vm.house));
      }
      //Show toast
      vm.result.$save().then(function() {
        $mdDialog.hide(vm.result.name + ' info updated!');
      });
    }

  }
  PersonEditController.$inject = ['$mdDialog', '$scope', 'MainDS', 'person', 'houses', '$firebaseObject'];
}());
