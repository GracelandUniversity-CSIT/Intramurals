(function(){
  'use strict';
  angular.module('app').controller('PersonEditController', PersonEditController);
  function PersonEditController($mdDialog, $scope, MainDS, person, houses, $firebaseObject) {
    var vm = this;
    vm.result = {};
    vm.teamRef = [];
    vm.team = [];
    vm.houses = houses;
    vm.house = '';
    vm.close = close;
    vm.submit = submit;
    vm.deletePerson = deletePerson;

    $firebaseObject(firebase.database().ref('people/'+person)).$loaded().then(function(person) {

      vm.result = person;
      console.log(vm.result);
      angular.forEach(vm.result.team, function(val,key) {
        vm.teamRef = $firebaseObject(firebase.database().ref('team/'+key+'/roster/'+vm.result.$id)).$loaded().then(function(team) {
            vm.team = team;
            // console.log(vm.team)
            // console.log(vm.result);
            // delete vm.team.roster[vm.result.$id];

        });
        // console.log(vm.team);
        // console.log(vm.result);
        //delete vm.team.roster[vm.result.$id];

      });

      // console.log(person);
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

    function deletePerson() {
      if(Object.keys(vm.teamRef).length > 0) {
        vm.team.$remove().then(function(ref) {
          // data has been deleted locally and in the database
          vm.result.$remove().then(function(ref) {
            // data has been deleted locally and in the database

          }, function(error) {
            console.log("Error:", error);
          });
           $mdDialog.hide();
        }, function(error) {
          console.log("Error:", error);
        });
      }
      else {
        vm.result.$remove().then(function(ref) {
          // data has been deleted locally and in the database
           $mdDialog.hide();
        }, function(error) {
          console.log("Error:", error);
        });
      }

    }

  }
  PersonEditController.$inject = ['$mdDialog', '$scope', 'MainDS', 'person', 'houses', '$firebaseObject'];
}());
