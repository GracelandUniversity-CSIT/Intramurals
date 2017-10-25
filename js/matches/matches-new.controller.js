(function() {
    'use strict';

    angular
        .module('app')
        .controller('MatchNewController', MatchNewController);

    function MatchNewController(GameId, Team, Entrant, $mdDialog, $firebaseArray) {
        var vm = this;
        vm.newGame = {scheDate:new Date()};
        vm.team = Team;
        vm.submit = submit;
        vm.close = close;
        vm.entrant = Entrant.filter(function(entrant) {
            return entrant.$id !== Team.$id;
        });

        function submit() {
            vm.newGame[vm.team.$id] = {score: 0, sPts: 0};
            vm.newGame[vm.opponent.$id] = {score: 0, sPts: 0};
            vm.newGame.name = (vm.team.name + ' VS ' + vm.opponent.name).toUpperCase();
            vm.newGame.touched = false;
            vm.newGame.scheDate = (vm.newGame.scheDate instanceof Date)? vm.newGame.scheDate.getTime() : new Date().getTime();
            vm.newGame.teams = {};
            vm.newGame.teams[vm.team.$id] = true;
            vm.newGame.teams[vm.opponent.$id] = true;
            $firebaseArray(firebase.database().ref('matches/'+GameId)).$loaded().then(function(match) {
                match.$add(vm.newGame).then(function(newGame) {
                    $mdDialog.hide(newGame);
                }, function(err) {
                    console.warn(err);
                });
            });
        }
        function close() {
            $mdDialog.hide();
        }
    }
    MatchNewController.$inject = ['GameId', 'Team', 'Entrant', '$mdDialog', '$firebaseArray'];
})();
