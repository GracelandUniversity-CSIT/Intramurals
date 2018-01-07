(function(){
  'use strict';
  angular.module('app').controller('entrantController', entrantController);
  function entrantController($state, $firebaseObject, $firebaseArray, $firebaseAuth) {
    $firebaseAuth().$onAuthStateChanged(function(data) {
      if(data) {

      } else {
        $state.go('root.leagues');
      }
    });
    var vm = this;
    vm.gamesId = $state.params.gamesId;
    vm.sport = {};
    vm.teams = [];
    vm.teamsToDisable = {};

    vm.clickSave = clickSave;

    $firebaseObject(firebase.database().ref('leagues/'+vm.gamesId)).$loaded().then(function(sport) {
        vm.sport = sport;
        $firebaseArray(firebase.database().ref('team').orderByChild('name')).$loaded().then(function(teams) {
            vm.teams = teams.filter(function(team) {
                return (team.type == vm.sport.type || team.type == 4) && team.league == vm.sport.league;
            });
        });
    });

    function clickSave() {
        angular.forEach(vm.sport.entrant, function(val, key) {
            if(!val) delete vm.sport.entrant[key];
        });
        return vm.sport.$save().then(function() {
            $state.go('root.matches', {gamesId: vm.gamesId});
        }, function(err) {
            console.warn('Something went wrong. Unable to save entrants.');
        });
    }
  }
  entrantController.$inject = ['$state', '$firebaseObject', '$firebaseArray', '$firebaseAuth'];
}());
