(function(){
  'use strict';
  angular.module('app').controller('TeamsNewController', TeamsNewController);
  function TeamsNewController($scope, $mdDialog, $firebaseArray, $firebaseObject) {
    var vm = this;
    vm.team = {members: {}};
    vm.houses = $firebaseArray(firebase.database().ref('house').orderByChild('name'));
    vm.teams = $firebaseArray(firebase.database().ref('team').orderByChild('name'));
    vm.update = [];
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
                return team.name.toLowerCase().match(vm.team.name.toLowerCase());
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
            return vm.teams.$add(vm.team).then(function() {
                $mdDialog.hide({type:'new', name:vm.team.name});
            });
        }
    }

    function cancel() {
      $mdDialog.hide();
    }

  }
  TeamsNewController.$inject = ['$scope', '$mdDialog', '$firebaseArray', '$firebaseObject'];
}());
