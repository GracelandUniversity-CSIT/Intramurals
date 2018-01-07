(function(){
  'use strict';
  angular.module('app').controller('TeamsController', TeamsController);
  function TeamsController($scope, $mdDialog, $state, $firebaseArray, $firebaseObject) {
    var vm = this;

    vm.clickTeam = clickTeam;
    vm.clickEdit = clickEdit;
    vm.clickNew = clickNew;
    vm.getMembers = getMembers;
    vm.clickDelete = clickDelete;
    vm.teams = $firebaseArray(firebase.database().ref('team').orderByChild('name'));
    vm.houses = $firebaseArray(firebase.database().ref('house').orderByChild('name'));

    function getMembers(members) {
        if(!vm.houses.$resolved) {
            return void(0);
        }
        let temp = [];
        angular.forEach(members, function(val, member) {
            temp.push(vm.houses.$getRecord(member).name);
        });
        return temp.join(',');
    }

    function clickTeam(teamsId) {
      $state.go('root.roster', {teamsId: teamsId});
    }
    function clickDelete(ev,teamId) {
      $mdDialog.show({
        controller:'TeamsEditController',
        controllerAs: 'teamsInfoVm',
        locals: {
          TeamId: teamId
        },
        templateUrl:'partials/team-delete-dialog.template.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true
      }).then(function(data) {
      });
    }
    function clickEdit(ev, teamId) {
      $mdDialog.show({
        controller:'TeamsEditController',
        controllerAs: 'teamsInfoVm',
        locals: {
          TeamId: teamId
        },
        templateUrl:'partials/team-info.template.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true
      }).then(function(data) {
        if(data && data.type === 'edit') {
          console.log(data.name + ' edited!');
        };
      });
    }

    function clickNew(ev) {
      $mdDialog.show({
        controller:'TeamsNewController',
        controllerAs: 'teamsInfoVm',
        templateUrl:'partials/team-info.template.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true
      }).then(function(data) {
        if(data && data.type === 'new') {
          console.log(data.name + ' added!');
        };
      });
    }

  }
  TeamsController.$inject = ['$scope', '$mdDialog', '$state', '$firebaseArray', '$firebaseObject'];
}());
