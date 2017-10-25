(function(){
  'use strict';

  angular.module('app').controller('TeamsEditController', TeamsEditController);
  function TeamsEditController($scope, $mdDialog, $firebaseArray, $firebaseObject, TeamId) {
    var vm = this;
    vm.update = [];
    vm.teamRef = $firebaseObject(firebase.database().ref('team/'+TeamId)).$loaded().then(function(team) {
        vm.team = team;
        vm.update = Object.keys(vm.team.members);
    });
    vm.houses = $firebaseArray(firebase.database().ref('house').orderByChild('name'));
    vm.teams = $firebaseArray(firebase.database().ref('team').orderByChild('name'));
    vm.leagues = [
      {value:'N', label:'No'},{value:'A', label:'A'},{value:'B', label:'B'},{value:'C', label:'C'}
    ];

    vm.submit = submit;
    vm.cancel = cancel;
    vm.checkTeamNames = checkTeamNames;

    function getMembers(members) {
        if(!vm.houses.$resolved) {
            return void(0);
        }
        let temp = [];
        angular.forEach(members, function(val, member) {
            temp.push(vm.houses.$getRecord(member).name);
        });
        return temp.length > 0? temp.join(',') : void(0);
    }

    function checkTeamNames() {
        if(!!vm.team.name) {
            return vm.teams.filter(function(team) {
                return team.name.toLowerCase().match(vm.team.name.toLowerCase()) && (vm.team.$id? vm.team.$id !== team.$id : true);
            }).length > 0;
        }
        return false;
    }

    function submit() {
        if(!checkTeamNames()) {
            vm.team.members = {};
            for(var i in vm.update) {
                vm.team.members[vm.update[i]] = true;
                if(i == 0) {
                    vm.team.type = vm.houses.$getRecord(vm.update[i]).gender;
                    continue;
                }
                if(vm.team.type !== vm.houses.$getRecord(vm.update[i]).gender) {
                    vm.team.type = 3;
                }
            }
            vm.team.membersLabel = getMembers(vm.team.members);
            vm.team.$save().then(function() {
                $mdDialog.hide({type:'edit', name:vm.team.name});
            });
        }
    }

    function cancel() {
      $mdDialog.hide();
    }
  }

  TeamsEditController.$inject = ['$scope', '$mdDialog', '$firebaseArray', '$firebaseObject', 'TeamId'];
}());
