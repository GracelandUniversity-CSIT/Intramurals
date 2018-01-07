(function(){
  'use strict';
  angular.module('app').controller('GameInfoController', GameInfoController);
  function GameInfoController($mdDialog, $scope, $firebaseObject, game) {
    var vm = this;
    vm.result = {};
    vm.submit = submit;
    vm.leagueChange = leagueChange;
    vm.close = close;
    vm.deleteGame = deleteGame;

    vm.result = $firebaseObject(firebase.database().ref('leagues/'+game));

    function submit() {
      //   var temp = {};
      //   temp['leagues/'+game] = vm.result;
      //   return firebase.database().ref().update(temp).then(function() {
      //     $mdDialog.hide({type:'edit', name:vm.result.name});
      //   });
      return vm.result.$save().then(function(ref) {
        $mdDialog.hide({type:'edit', name:vm.result.name});
      });
    }
    function deleteGame() {
      vm.result.$remove().then(function(ref) {
        // data has been deleted locally and in the database
        close();
      }, function(error) {
        console.log("Error:", error);
      });

    }
    function close() {
      return $mdDialog.hide();
    }

    function leagueChange() {
      if(vm.result.name.trim().indexOf('league') > -1) {
        vm.result.name = (vm.result.league === 'N')? vm.result.name.replace(/[a-z] league/i, '').trim() : vm.result.name.replace(/[a-z] league/i, vm.result.league + ' league');
      } else {
        vm.result.name = (vm.result.league === 'N')? vm.result.name.trim() : vm.result.name.trim() + ' ' + vm.result.league + ' league';
      }
    }

  }
  GameInfoController.$inject = ['$mdDialog', '$scope', '$firebaseObject', 'game'];
}());
