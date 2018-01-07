(function(){
  angular.module('app').controller('PeopleController', PeopleController);

  function PeopleController($firebaseAuth, $state, $mdDialog, $scope, $q, utility, MainDS, $firebaseArray) {

    $firebaseAuth().$onAuthStateChanged(function(data) {
      if(data) {

      } else {
        $state.go('root.leagues');
      }
    });

    var vm = this;
    vm.people = [];
    vm.houses = {};
    vm.filterParam = {};

    // $firebaseArray(firebase.database().ref('people').orderByChild('name')).$loaded().then(function(people) {
    //     $firebaseArray(firebase.database().ref('team')).$loaded().then(function(teams) {
    //         people.map(function(person) {
    //             if(person.team) {
    //                 person.teamName = teams.$getRecord(Object.keys(person.team)[0]).name;
    //                 people.$save(person);
    //                 if(!teams.$getRecord(Object.keys(person.team)[0]).roster) teams.$getRecord(Object.keys(person.team)[0]).roster = {};
    //                 teams.$getRecord(Object.keys(person.team)[0]).roster[person.$id] = true;
    //                 teams.$save(teams.$getRecord(Object.keys(person.team)[0]));
    //             }
    //         });
    //     });
    // });

    vm.teams = [];

    vm.addPeopleWithFile = addPeopleWithFile;
    vm.peopleInfoDialog = peopleInfoDialog;

    // MainDS.getDataFrom('people/', 'Box ').then(function(data) {
    //   vm.people = Object.keys(data).map(function(k) {
    //     return Object.assign({key: k, houseKey: Object.keys(data[k].house)[0]}, data[k]);
    //   });
    // });
    //
    // MainDS.getDataFrom('house/').then(function(data) {
    //   vm.houses = data;
    // });

    $firebaseArray(firebase.database().ref('people').orderByChild('name')).$loaded().then(function(people) {
      vm.people = people;
      $firebaseArray(firebase.database().ref('house').orderByChild('name')).$loaded().then(function(houses) {
        vm.houses = houses;
        angular.forEach(vm.people, function(person) {
          if(person.house) {
            person.houseName = vm.houses.$getRecord(Object.keys(person.house)[0]).name;
          }
        });
      });
    });

    function addPeopleWithFile() {
      var files = document.getElementById('xlsFile').files;
      angular.forEach(files, function(f) {
        var name = f.name.split('.xl')[0];
        var houseObj = {};
        var reader = new FileReader();
        reader.onload = function(e) {
          var data = e.target.result;
          var workbook = XLSX.read(data, {type: 'binary'});
          if(workbook.SheetNames.length > 0) {
              var sheetName = workbook.SheetNames[16];
              var sheet = workbook.Sheets[sheetName];
              newPeople(XLSX.utils.sheet_to_json(sheet).map(function(r) {
		               console.log(r);

                r.name = r['Mailing Name'];
                delete r['Mailing Name'];
                houseObj[angular.lowercase(r['House'])] = true;
                return Object.assign(r, {house: houseObj});
              }), name);
          }
        };
        reader.readAsBinaryString(f);
      });
    }

    function newPeople(roster, houseName){
      var entries = {};
      angular.forEach(roster, function(r) {
	console.log(r);
        var stdId = r.Email.split('@')[0];
        entries['/people/'+stdId] = r;
        entries['/house/'+houseName+'/member'] = {};
        entries['/house/'+houseName+'/members/'+stdId] = true;
      });
      return MainDS.getRef().update(entries).then(function() {
        console.log(houseName + ' updated. New roster submitted');
      });
    }

    function peopleInfoDialog(ev, key) {
      if(key) {
        return $mdDialog.show({
          controller:'PersonEditController',
          controllerAs: 'peopleInfoVm',
          templateUrl:'partials/people-info.template.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true,
          locals: {
            person: key,
            houses: vm.houses
          }
        }).then(function(data) {
          if(data) {
            console.log(data);
            vm.people.$getRecord(key).houseName = vm.houses.$getRecord(Object.keys(vm.people.$getRecord(key).house)[0]).name;
          }
        });
      } else {
        return $mdDialog.show({
          controller:'PersonNewController',
          controllerAs: 'peopleInfoVm',
          templateUrl:'partials/people-info.template.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true,
          locals: {
            houses: vm.houses,
            people: vm.people
          }
        }).then(function(data) {
          if(data) {
            console.log(data.msg);
            vm.people.$getRecord(data.key).houseName = vm.houses.$getRecord(Object.keys(vm.people.$getRecord(data.key).house)[0]).name;
          }
        });
      }
    }

    function fixdata(data) {
    	var o = "", l = 0, w = 10240;
    	for(; l<data.byteLength/w; ++l) o+=String.fromCharCode.apply(null,new Uint8Array(data.slice(l*w,l*w+w)));
    	o+=String.fromCharCode.apply(null, new Uint8Array(data.slice(l*w)));
    	return o;
    }
  }
  PeopleController.$inject = ['$firebaseAuth', '$state', '$mdDialog', '$scope', '$q', 'utility', 'MainDS', '$firebaseArray'];
}());
