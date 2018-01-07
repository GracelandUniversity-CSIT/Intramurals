(function(){
  'use strict';
  angular.module('app').controller('ParticipationController', ParticipationController);
  function ParticipationController($firebaseAuth, $firebaseArray, $firebaseObject, imp, $scope, $state) {

    $firebaseAuth().$onAuthStateChanged(function(data) {
      if(data && imp.isUpper(data.uid, imp.uids)) {

      } else {
        $state.go('root.leagues');
      }
    });

    var vm = this;
    vm.sports = {};

    $firebaseArray(firebase.database().ref('leagues').orderByChild('name')).$loaded().then(function(sports) {
        vm.sports = sports;
        $firebaseObject(firebase.database().ref('matches')).$loaded().then(function(matches) {
            angular.forEach(vm.sports, function(obj) {
                if(matches[obj.$id]) {
                    obj.totalParticipation = Object.keys(matches[obj.$id]).map(function(matchId) {
                        return matches[obj.$id][matchId];
                    }).reduce(function(accum, current) {
                        return accum + (current.participations || 0);
                    }, 0);
                } else {
                    obj.totalParticipation = 0;
                }
            });
        });
    });


  }

  ParticipationController.$inject= ['$firebaseAuth', '$firebaseArray', '$firebaseObject', 'imp', '$scope', '$state'];
}());
