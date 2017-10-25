(function(){
  'use strict';
  angular.module('app').controller('GamesController', GamesController);
  function GamesController($mdDialog, $state, $firebaseArray, utility, $firebaseAuth) {
    var vm = this;
    vm.sports = [];

    vm.clickEdit = clickEdit;
    vm.clickAdd = clickAdd;
    vm.clickDelete = clickDelete;
    vm.clickGame = clickGame;

    $firebaseArray(firebase.database().ref().child('sport').orderByChild('name')).$loaded().then(function(data) {
        vm.sports = data;
    });

    function clickEdit(ev, obj) {
      return $mdDialog.show({
        controller: 'GameInfoController',
        controllerAs: 'gamesInfoVm',
        templateUrl: 'partials/sport-info.template.html',
        clickOutsideToClose: true,
        parent: angular.element(document.body),
        targetEvent: ev,
        locals: {
          game: obj.$id
        }
      }).then(function(data) {
        if(data && data.type == 'edit') {
          console.log(data.name + ' edited!');
        }
      });
    }
    function clickDelete(ev,obj) {
      console.log(obj);
      return $mdDialog.show({
        controller: 'GameInfoController',
        controllerAs: 'gamesInfoVm',
        templateUrl: 'partials/delete-dialog.template.html',
        clickOutsideToClose: true,
        parent: angular.element(document.body),
        targetEvent: ev,
        locals: {
          game: obj.$id
        }
      });
    }

    function clickAdd(ev) {
      return $mdDialog.show({
        controller: 'GameNewController',
        controllerAs: 'gamesInfoVm',
        templateUrl: 'partials/sport-info.template.html',
        clickOutsideToClose: true,
        parent: angular.element(document.body),
        targetEvent: ev
      }).then(function(data) {
        if(data && data.type == 'add') {
          console.log(data.name + ' added!');
        }
      });
    }

    function clickGame(gameKey) {
      $state.go('root.matches', {gamesId:gameKey});
    }
  }
  GamesController.$inject = ['$mdDialog', '$state', '$firebaseArray', 'utility', '$firebaseAuth'];
}());
