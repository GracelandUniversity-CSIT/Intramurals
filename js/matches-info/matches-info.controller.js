(function(){
  'use strict';
  angular.module('app').controller('MatchesInfoController', MatchesInfoController);
  function MatchesInfoController($firebaseAuth, $scope, $state, MainDS, $mdDialog, $firebaseObject, $firebaseArray) {
    $firebaseAuth().$onAuthStateChanged(function(data) {
      if(data) {

      } else {
        $state.go('root.leagues');
      }
    });
    var vm = this;
    vm.gamesId = $state.params.gamesId;
    vm.matchId = $state.params.matchId;
    vm.teams = [{},{}];
    vm.attendance = {};
    vm.sport = {};
    vm.score = {};
    vm.people = {};
    vm.staff = [];
    vm.peopleList = [];
    vm.dateSet = false;
    vm.scheDate = new Date();
    vm.datepicker = "";

    vm.getPersonName = getPersonName;
    vm.selectedStaffChange = selectedStaffChange;
    vm.saveDate = saveDate;
    vm.saveScoreCard = saveScoreCard;
    vm.saveAttendance = saveAttendance;
    vm.clickTeamRoster = clickTeamRoster;
    vm.queryPeople = queryPeople;
    vm.clickPaid = clickPaid;
    vm.clickVol = clickVol;
    vm.clickSck = clickSck;
    vm.sckRemove = sckRemove;
    vm.volRemove = volRemove;
    vm.paidRemove = paidRemove;
    vm.saveStaff = saveStaff;
    vm.roster = {};
    vm.tabIndex = 0;
    vm.paid = [];
    vm.vol = [];
    vm.sck = [];

    // startup(true);
    $firebaseObject(firebase.database().ref('matches/'+vm.gamesId+'/'+vm.matchId)).$loaded().then(function(match) {
        vm.match = match;
        if(!vm.match.scheDate) vm.match.scheDate = new Date();
        else vm.match.scheDate = new Date(vm.match.scheDate);
        // console.log(vm.match.scheDate);
        $firebaseObject(firebase.database().ref('leagues/'+vm.gamesId)).$loaded().then(function(sport) {
            vm.sport = sport;
            $firebaseArray(firebase.database().ref('team')).$loaded().then(function(teams) {
                let team1 = vm.match.name.split(' VS ')[0].trim();
                let team2 = vm.match.name.split(' VS ')[1].trim();
                vm.teams = teams.filter(function(team) {
                    return vm.match.teams[team.$id];
                });
                if(vm.teams[0].name.toUpperCase() === team2) {
                    vm.teams = [vm.teams[1], vm.teams[0]];
                }
                $firebaseArray(firebase.database().ref('people').orderByChild('name')).$loaded().then(function(people) {
                    vm.people = people;
                    angular.forEach(vm.match.referee, function(val, key) {
                        vm.people.$getRecord(key).included = true;
                        vm.staff.push(vm.people.$getRecord(key));
                    });
                    angular.forEach(vm.match.scorekeeper, function(val, key) {
                        if(!vm.people.$getRecord(key).included) {
                            vm.people.$getRecord(key).included = true;
                            vm.staff.push(vm.people.$getRecord(key));
                        }
                    });
                    angular.forEach(vm.match.paid, function(val, key) {
                        if(!vm.people.$getRecord(key).included) {
                            vm.people.$getRecord(key).included = true;
                            vm.staff.push(vm.people.$getRecord(key));
                        }
                    });
                    angular.forEach(vm.match.volunteer, function(val, key) {
                        if(!vm.people.$getRecord(key).included) {
                            vm.people.$getRecord(key).included = true;
                            vm.staff.push(vm.people.$getRecord(key));
                        }
                    });
                })
            });
        })
    });

    function selectedStaffChange() {
        if(vm.selectedStaff) {
            if(vm.selectedStaff.included) {
                vm.selectedStaff = void(0);
                vm.searchText = void(0);
            } else {
                vm.selectedStaff.included = true;
                vm.staff.push(vm.selectedStaff);
                vm.selectedStaff = void(0);
                vm.searchText = void(0);
            }
        }
    }

    function getPersonName(id) {
        if(!vm.people) return void(0);
        return (vm.people.$indexFor(id) > -1)? vm.people.$getRecord(id).name : void(0);
    }

    function clickTeamRoster(teamId) {
      $state.go('root.roster', {teamsId: teamId});
    }

    function saveDate(val) {
      var value = new Date(val);
      // console.log("saveDate before loop: " + val);
      // console.log(value instanceof Date);
      if(value instanceof Date) {
          // console.log(val);
          vm.match.scheDate = value.getTime();
          vm.match.$save().then(function() {
              vm.tabIndex++;
             console.log('Edit schedule date');
          });
      }
    }

    function saveScoreCard() {
        if(vm.match[vm.teams[0].$id].score > vm.match[vm.teams[1].$id].score) {
            vm.match[vm.teams[0].$id].result = 'W';
            vm.match[vm.teams[1].$id].result = 'L';
        } else if(vm.match[vm.teams[0].$id].score < vm.match[vm.teams[1].$id].score) {
            vm.match[vm.teams[1].$id].result = 'W';
            vm.match[vm.teams[0].$id].result = 'L';
        } else {
            vm.match[vm.teams[1].$id].result = 'D';
            vm.match[vm.teams[0].$id].result = 'D';
        }
        vm.match.touched = true;
        vm.match.scheDate = (vm.match.scheDate instanceof Date)? vm.match.scheDate.getTime() : vm.match.scheDate;
        vm.match.$save().then(function() {
            vm.tabIndex++;
            console.log('Save score card');
        });
    }

    function saveAttendance() {
      if(vm.match.attendance) {
        angular.forEach(vm.match.attendance, function(val, key) {
           if(!val) delete vm.match.attendance[key];
        });
        vm.match.touched = true;
        vm.match.scheDate = (vm.match.scheDate instanceof Date)? vm.match.scheDate.getTime() : vm.match.scheDate;
        vm.match.participations = (vm.match.participations)? vm.match.participations + Object.keys(vm.match.attendance).length : Object.keys(vm.match.attendance).length;
        vm.match.$save().then(function() {
           vm.tabIndex++;
           console.log('Attendance saved');
        });
      } else {
        vm.tabIndex++;
      }
    }

    function queryPeople(text, forStaff) {
      return vm.people.filter(function(obj) {
        return obj.name.toLowerCase().indexOf(text.toLowerCase()) > -1;
      });
    }

    function clickPaid() {
      if(!vm.selectedPaid || vm.paid.indexOf(vm.selectedPaid.id) > -1) return;
      vm.paid.push(vm.selectedPaid.id);
      vm.selectedPaid = void(0);
    }

    function clickVol() {
      if(!vm.selectedVol || vm.vol.indexOf(vm.selectedVol.id) > -1) return;
      vm.vol.push(vm.selectedVol.id);
      vm.selectedVol = void(0);
    }

    function clickSck() {
      if(!vm.selectedSck  || vm.sck.indexOf(vm.selectedSck.id) > -1) return;
      vm.sck.push(vm.selectedSck.id);
      vm.selectedSck = void(0);
    }

    function sckRemove(id) {
      vm.sck.splice(vm.sck.indexOf(id));
    }

    function volRemove(id) {
      vm.vol.splice(vm.vol.indexOf(id));
    }

    function paidRemove(id) {
      vm.paid.splice(vm.paid.indexOf(id));
    }

    function saveStaff() {
        let staff = [];
        angular.forEach(vm.match.referee, function(val, key) {
            if(!val) delete vm.match.referee[key];
            else {
                if(staff.indexOf(key) < 0) staff.push(key);
            }
        });

        angular.forEach(vm.match.scorekeeper, function(val, key) {
            if(!val) delete vm.match.scorekeeper[key];
            else {
                if(staff.indexOf(key) < 0) staff.push(key);
            }
        });

        angular.forEach(vm.match.paid, function(val, key) {
            if(!val) delete vm.match.paid[key];
            else {
                if(staff.indexOf(key) < 0) staff.push(key);
            }
        });

        angular.forEach(vm.match.volunteer, function(val, key) {
            if(!val) delete vm.match.volunteer[key];
            else {
                if(staff.indexOf(key) < 0) staff.push(key);
            }
        });

        vm.match.touched = true;
        vm.match.scheDate = (vm.match.scheDate instanceof Date)? vm.match.scheDate.getTime() : vm.match.scheDate;
        vm.match.participations = (vm.match.participations)? vm.match.participations + staff.length : staff.length;
        vm.match.$save().then(function() {
           vm.tabIndex = 0;
           console.log('Staff saved');
        });
    }

    function startup(bool) {
      return MainDS.getDataFrom().then(function(data) {
        vm.sport = data.sport[vm.gamesId];
        vm.people = data.people;
        vm.peopleList = Object.keys(data.people).map(function(peopleId) {
          return Object.assign({id:peopleId}, data.people[peopleId]);
        })
        vm.slot = data.prelim[vm.gamesId][vm.leagueId][vm.slotId];
        if(vm.slot.date !== null && vm.slot.date !== '-') {
          vm.dateSet = true;
          vm.scheDate = new Date(vm.slot.date);
        }
        vm.score = data.prelimScore[vm.gamesId][vm.leagueId][vm.slotId];
        vm.teams = Object.keys(vm.score).map(function(teamId) {
          return Object.assign({id:teamId}, data.team[teamId]);
        });

        angular.forEach(vm.teams, function(teamObj) {
          vm.roster[teamObj.id] = data.roster[teamObj.id];
        });

        if(data.attendance && data.attendance.prelim[vm.gamesId]) {
          if(data.attendance.prelim[vm.gamesId][vm.leagueId]) {
            if(data.attendance.prelim[vm.gamesId][vm.leagueId][vm.slotId]) {
              vm.attendance = data.attendance.prelim[vm.gamesId][vm.leagueId][vm.slotId];
            }
          }
        } else {
          vm.attendance = {};
        }

        if(data.staff && data.staff.prelim[vm.gamesId]) {
          if(data.staff.prelim[vm.gamesId][vm.leagueId]) {
            if(data.staff.prelim[vm.gamesId][vm.leagueId][vm.slotId]) {
              vm.staff = data.staff.prelim[vm.gamesId][vm.leagueId][vm.slotId];
              vm.paid = Object.keys(vm.staff.paid || {});
              vm.vol = Object.keys(vm.staff.volunteer || {});
              vm.sck = Object.keys(vm.staff.scoreKeeper || {});
            }
          }
        } else {
          vm.staff = {};
        }

        if(bool) {
          $scope.$watch(function() {
            return vm.score[vm.teams[0].id].score;
          }, function(newVal) {
            if(newVal > vm.score[vm.teams[1].id].score) {
              vm.score[vm.teams[0].id].result = 'W';
              vm.score[vm.teams[1].id].result = 'L';
            } else if(newVal === vm.score[vm.teams[1].id].score) {
              vm.score[vm.teams[0].id].result = 'D';
              vm.score[vm.teams[1].id].result = 'D';
            }
          });

          $scope.$watch(function() {
            return vm.score[vm.teams[1].id].score;
          }, function(newVal) {
            if(newVal > vm.score[vm.teams[0].id].score) {
              vm.score[vm.teams[1].id].result = 'W';
              vm.score[vm.teams[0].id].result = 'L';
            } else if(newVal === vm.score[vm.teams[0].id].score) {
              vm.score[vm.teams[1].id].result = 'D';
              vm.score[vm.teams[0].id].result = 'D';
            }
          });
        }

        vm.tabIndex = 0;
      });
    }
  }
  MatchesInfoController.$inject = ['$firebaseAuth', '$scope', '$state', 'MainDS', '$mdDialog', '$firebaseObject', '$firebaseArray'];
}());
