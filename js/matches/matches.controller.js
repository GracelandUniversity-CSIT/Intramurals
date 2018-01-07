(function(){

	'use strict';

	angular
		.module('app')
		.controller('MatchesController', MatchesController);

	function MatchesController($firebaseAuth, $scope, $state, $firebaseArray, $firebaseObject, $mdMedia, $mdDialog){
		var vm = this;
		vm.gamesId = $state.params.gamesId;
		vm.entrant = [];
		vm.sport = [];
		vm.matches = [];
		vm.overall = {};
		vm.overallMatches = {};
		vm.tableOrder = "-wlratio";

		vm.prelimRef = [];
		vm.prelimScoreRef = [];
		vm.prelimScore = {};
		vm.prelimSlot = {};
		vm.prelim = {};
		vm.tabIndex = 0;
		vm.rrTable = [];
		vm.prelimSlot = {};
		vm.prelimScore = {};
		vm.showButtons = true;
		vm.selectedTeam = {};
		vm.showTeam = false;
		vm.tabIndex = 0;
		vm.slotIdx = 0;

		vm.clickAddTeams = clickAddTeams;
		vm.clickTeam = clickTeam;
		vm.clickClear = clickClear;
		vm.clickSlot = clickSlot;
		vm.prelimRefIsEmpty = prelimRefIsEmpty;
		vm.formatDate = formatDate;
		vm.addMatch = addMatch;
		vm.getMatchName = getMatchName;
		vm.clickMatch = clickMatch;
		vm.deleteMatch = deleteMatch;

		$firebaseObject(firebase.database().ref('leagues/'+vm.gamesId)).$loaded().then(function(sport) {
			vm.sport = sport;
			$firebaseArray(firebase.database().ref('team').orderByChild('name')).$loaded().then(function(teams) {
				vm.entrant = vm.sport.entrant? Object.keys(vm.sport.entrant).map(function(teamId) {
					vm.overall[teamId] = {wins: 0, losses: 0, wlratio: 0, ties: 0};
					vm.overallMatches[teamId] = [];

					return teams.$getRecord(teamId);
				}) : [];
				$firebaseArray(firebase.database().ref('matches/'+vm.gamesId).orderByChild('date')).$loaded().then(function(matches) {
					vm.matches = matches;
					if(matches.length > 0) {
						// console.log(matches)
						angular.forEach(matches, function(match) {

							for(var i in vm.entrant) {
								if(match[vm.entrant[i].$id]) {
									vm.overallMatches[vm.entrant[i].$id].push(match);
								}
							}
						});
						angular.forEach(vm.overallMatches, function(val, key) {
							for(var i in val) {
								val[i][key].opponentScore = val[i][Object.keys(val[i].teams).filter(function(teamId) {
										return teamId !== key;
								})[0]].score;
								if(val[i][key].result === 'W') {
									vm.overall[key].wins++;
								} else if(val[i][key].result === 'L') {
									vm.overall[key].losses++;
								} else if(val[i][key].result === 'D') {
									vm.overall[key].ties++;
								}
							}
							vm.overall[key].wlratio = (vm.overall[key].wins) / (vm.overall[key].wins + vm.overall[key].losses + vm.overall[key].ties);
							// console.log(vm.overall[key].wlratio);
							if(isNaN(vm.overall[key].wlratio)) {
								vm.overall[key].wlratio = 0;
							}
						});
						angular.forEach(vm.entrant, function(val,key) {
							vm.entrant[key].wins = vm.overall[Object.keys(vm.overall)[key]].wins;
							vm.entrant[key].losses = vm.overall[Object.keys(vm.overall)[key]].losses;
							vm.entrant[key].wlratio = vm.overall[Object.keys(vm.overall)[key]].wlratio;
							vm.entrant[key].ties = vm.overall[Object.keys(vm.overall)[key]].ties;
							// vm.entrant[key].push(vm.overall[Object.keys(vm.overall)[key]]);
						});
					}
				});
			});
		});

		function getMatchName(matchName, teamName) {
			return matchName.replace(teamName.toUpperCase(), '').replace('VS', '').trim();
		}

		function clickMatch(mId,uid) {
			if(uid) {
				$state.go('root.matches-info',{gamesId: vm.gamesId, matchId: mId});
			}
		}

		function addMatch(ev, team) {
			return $mdDialog.show({
				controller: 'MatchNewController',
				controllerAs: 'matchNewVm',
				templateUrl: 'partials/match-new.template.html',
				clickOutsideToClose: true,
				parent: angular.element(document.body),
				targetEvent: ev,
				locals: {
					GameId: vm.gamesId,
					Team: team,
					Entrant: vm.entrant
				}
			}).then(function(data) {
				if(data.key) {
					let temp = vm.matches.$getRecord(data.key);
					for(var i in vm.entrant) {
						if(temp[vm.entrant[i].$id]) {
							vm.overallMatches[vm.entrant[i].$id].push(temp);
						}
					}
				}
			});
		}

		function addNewEntrantSlots(ent, newP){
			for(var i in ent){
				for(var j in ent[i].slots){
					if(ent[i].slots[j] != 'slot0' && newP.p[ent[i].slots[j]] == undefined){
						newP.p[ent[i].slots[j]] = {
							date: '-',
							played: false,
							protest: '-',
							refs: '-',
							scorekeeper: '-'
						}
						newP.p[ent[i].slots[j]][i] = true;
						newP.p[ent[i].slots[j]][vm.entrant[j].id] = true;
						newP.p[ent[i].slots[j]].name = vm.entrant[j].name + ' vs ' + ent[i].name;

						newP.sc[ent[i].slots[j]] = {};
						newP.sc[ent[i].slots[j]][i] = {
							result: '-',
							score: 0,
							spPts: 0
						}
						newP.sc[ent[i].slots[j]][vm.entrant[j].id] = {
							result: '-',
							score: 0,
							spPts: 0
						}
					}
				}
			}
			return newP;
		}

		function clickAddTeams() {
			$state.go('root.entrant', {gamesId:vm.gamesId, leagueId:vm.leagueId});
		}

		function clickTeam(obj, idx) {
			vm.selectedTeam = obj;
			vm.showTeam = true;
			vm.tabIndex = 1;
			vm.slotIdx = idx;
		}

		function clickClear(ev) {
			$mdDialog.show(
				$mdDialog.confirm()
				.title('Clear Preliminaries')
				.textContent('Are you sure you want to clear all games and its information?')
				.ariaLabel('Clear Prelim')
				.targetEvent(ev)
				.ok('Yes')
				.cancel('No')
			).then(function() {
				var update = {};
				update['prelim/'+vm.gamesId+'/'+vm.leagueId+'/'] = {};
				update['prelimScore/'+vm.gamesId+'/'+vm.leagueId+'/'] = {};
				firebase.database().ref().update(update);
				vm.showButtons = true;
			});
		}

		function deleteMatch(ev, matchID) {
			// console.log(matchID);
			$mdDialog.show(
				$mdDialog.confirm()
				.title('Delete Match Confirmation')
				.textContent('Are you sure you want to clear this match and its information?')
				.ariaLabel('Clear Prelim')
				.targetEvent(ev)
				.ok('Yes')
				.cancel('No')
			).then(function() {
				//Insert Delete stuff
				vm.matchRef = $firebaseObject(firebase.database().ref('matches/'+vm.gamesId+"/"+matchID));
				vm.matchRef.$remove().then(function(ref) {
          // data has been deleted locally and in the database
					 $state.go('root.matches', {gamesId: vm.gamesId});
           $mdDialog.hide();
        }, function(error) {
          console.log("Error:", error);
        });
			});
		}

		function clickSlot(ev, slot) {
			$state.go('root.matches-info', {gamesId:vm.gamesId, leagueId:vm.leagueId, slotId:slot.split('slot')[1]});
		}

		function prelimRefIsEmpty() {
			return Object.keys(vm.prelimRef).length == 0;
		}

		function prelimScoreRefIsEmpty() {
			return Object.keys(vm.prelimScoreRef).length == 0;
		}

		function formatDate(d){
			return (d)? new Date(d).toLocaleString([], {month: '2-digit', day: '2-digit', year: '2-digit', hour: '2-digit', minute:'2-digit'}) : 'Not Scheduled';
		}

	}
	MatchesController.$inject = ['$firebaseAuth', '$scope', '$state', '$firebaseArray', '$firebaseObject', '$mdMedia', '$mdDialog'];
}());
