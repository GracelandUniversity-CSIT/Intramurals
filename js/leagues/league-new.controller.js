(function(){
  'use strcit';
  angular.module('app').controller('GameNewController', GameNewController);
  function GameNewController($mdDialog, $scope, $firebaseArray) {
    var vm = this;
    vm.fireRef = $firebaseArray(firebase.database().ref().child('leagues'));
    vm.result = {
      league: {
        A:false,
        B:false,
        C:false,
        N:false
      }
    };
    vm.disableLeague = disableLeague;
    vm.submit = submit;
    vm.close = close;

	vm.leagues = [
        {
			value: 'N',
			label: 'No League'
    	},{
			value: 'A',
			label: 'A League'
		},{
			value: 'B',
			label: 'B League'
		},{
			value: 'C',
			label: 'C League'
		}
	];

    function disableLeague(l) {
      return (l === 'N')? (vm.result.league.A || vm.result.league.B || vm.result.league.C) : vm.result.league.N;
    }

    function submit() {
        for(var league in vm.leagues) {
            console.log(vm.result.league[vm.leagues[league].value]);

            if(vm.result.league[vm.leagues[league].value]) {
                console.log(vm.result);
                var temp = {
                    inSeason: vm.result.inSeason || false,
                    league: vm.leagues[league].value,
                    name: vm.result.name + ((vm.leagues[league].value !== 'N')? ` ${vm.leagues[league].value} league` : ''),
                    type: vm.result.type
                }
                vm.fireRef.$add(temp);
            }
        }
        $mdDialog.hide({type:'add', name: vm.result.name});
    }
    function close() {
      return $mdDialog.hide();
    }

  }
  GameNewController.$inject = ['$mdDialog','$scope', '$firebaseArray'];
}());
