(function(){
  'use strict';
  angular.module('app').controller('RosterController', RosterController);
  function RosterController($firebaseAuth, $scope, $state, $firebaseObject, $firebaseArray, $mdDialog) {

    $firebaseAuth().$onAuthStateChanged(function(data) {
      if(data) {

      } else {
        $state.go('root.leagues');
      }
    });

    var vm = this;
    vm.teamsId = $state.params.teamsId;
    vm.teamRef = $firebaseObject(firebase.database().ref('team/'+vm.teamsId)).$loaded().then(function(team) {
        vm.team = team;
        vm.peopleRef = $firebaseArray(firebase.database().ref('people').orderByChild('name')).$loaded().then(function(people) {
            vm.people = people;
            vm.houseMembers = people.filter(function(person) {
                for(var i in vm.team.members) {
                    if(person.house[i]) return true;
                }
                return false;
            });
            vm.roster = vm.team.roster? Object.keys(vm.team.roster) : [];
        });
    });

    vm.selectedPeople = [];

    vm.queryName = queryName;
    vm.clickAdd = clickAdd;
    vm.clickRemove = clickRemove;
    vm.clickSave = clickSave;
    vm.getPersonName = getPersonName;
    vm.clearRoster = clearRoster;

    // MainDS.getDataFrom().then(function(data) {
    //   vm.teams = data.team;
    //   vm.team = data.team[vm.teamsId];
    //   vm.houses = data.house;
    //   vm.people = data.people;
    //   vm.teamMembers = (data.teamMember && data.teamMember[vm.teamsId])? Object.keys(data.teamMember[vm.teamsId]) : [];
    //   vm.team.members = vm.teamMembers.map(function(houseId) {
    //     return vm.houses[houseId].name;
    //   }).join(', ');
    //   vm.backUpRoster = (!data.roster[vm.teamsId])? [] : Object.keys(data.roster[vm.teamsId]);
    //   vm.roster = (!data.roster[vm.teamsId])? [] : Object.keys(data.roster[vm.teamsId]);
    //   angular.forEach(vm.teamMembers, function(memberId) {
    //     vm.houseMembers = vm.houseMembers.concat(
    //       Object.keys(vm.houses[memberId].members).map(function(id) {
    //         return Object.assign({id: id}, vm.people[id]);
    //       })
    //     );
    //   });
    //   vm.houseMembers = vm.houseMembers.filter(function(memberObj) {
    //     return !vm.people[memberObj.id].team && vm.roster.indexOf(memberObj.id) < 0;
    //   });
    //   vm.roster = vm.roster.map(function(personId) {
    //     return Object.assign({id: personId}, vm.people[personId]);
    //   });
    // });

    function clearRoster(e) {
        return $mdDialog.show(
            $mdDialog.confirm()
                .title('Are you sure you want to remove this roster?')
                .textContent('Roster will be cleared.')
                .ariaLabel('Clear Roster Dialog')
                .targetEvent(e)
                .ok('Yes')
                .cancel('No')
        ).then(function() {
            vm.roster = [];
            clickSave();
        });
    }

    function queryName(text) {
      return vm.houseMembers.filter(function(obj) {
        return obj.name.toLowerCase().indexOf(text.toLowerCase()) > -1 && vm.roster.indexOf(obj.$id);
      });
    }

    function getPersonName(id) {
        if(!vm.people) {
            return void(0);
        } else {
            return (vm.people.$indexFor(id) > -1)? vm.people.$getRecord(id).name : void(0);
        }
    }

    function clickAdd(people) {
      vm.roster = vm.roster.concat(people);
      vm.selectedPeople = [];
    }

    function clickRemove(person) {
      vm.roster.splice(vm.roster.indexOf(person), 1);
      let temp = vm.people.$getRecord(person);
      delete temp.team;
    }

    function clickSave() {
        angular.forEach(vm.team.roster, function(val, key) {
            if(vm.roster.indexOf(key) < 0) {
                delete vm.people.$getRecord(key).team;
                delete vm.people.$getRecord(key).teamName;
                delete vm.team.roster[key];
                // console.log(delete vm.team.roster[key]);
                vm.people.$save(vm.people.$indexFor(key));
            }
        });

        if(!vm.team.roster || vm.roster.length === 0) vm.team.roster = {};
        let temp = {};
        angular.forEach(vm.roster, function(id) {
            vm.team.roster[id] = true;
            temp = vm.people.$getRecord(id);
            temp.team = {};
            temp.team[vm.team.$id] = true;
            temp.teamName = vm.team.name;
            vm.people.$save(temp);
        });

        vm.team.$save().then(function() {
            console.log('Update ' + vm.team.name + ' roster.');
            $state.go('root.teams');
        }, function(err) {
            console.warn(err);
        });
    }

  }
  RosterController.$inject = ['$firebaseAuth', '$scope', '$state', '$firebaseObject', '$firebaseArray', '$mdDialog'];
}());
