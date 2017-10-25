(function(){
  'use strict';
  angular.module('app').controller('PersonNewController', PersonNewController);
  function PersonNewController($mdDialog, $scope, MainDS, houses, people) {
    var vm = this;
    vm.result = {};
    vm.houses = houses;
    vm.people = people;
    vm.close = close;
    vm.submit = submit;

    $scope.$watch(function() {
      return vm.house;
    }, function(newVal) {
      vm.result.house = {};
      vm.result.house[newVal] = true;
    });

    function close() {
      $mdDialog.hide();
    }

    function submit() {
      vm.people.$add(vm.result).then(function(ref) {
        vm.houses.$getRecord(vm.house).members[ref.key] = true;
        vm.houses.$save(vm.houses.$indexFor(vm.house)).then(function() {
          $mdDialog.hide({msg: vm.result.name + ' added!', key: ref.key});
        });
      });
      // firebase.database().ref('people/').push(vm.result).then(function() {
      //   $mdDialog.hide({type: 'new', name: vm.result.name});
      // });
    }
  }
  PersonNewController.$inject = ['$mdDialog', '$scope', 'MainDS', 'houses', 'people'];
}());
