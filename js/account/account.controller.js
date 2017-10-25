(function(){
  'use strict';
  angular.module('app').controller('AccountController', AccountController);
  function AccountController($state, $firebaseArray, $mdDialog, $firebaseAuth, $firebaseObject, imp) {
    var vm = this;
    $firebaseAuth().$onAuthStateChanged(function(data) {
      if(data && imp.isUpper(data.uid, imp.uids)) {

      } else {
        $state.go('root.games');
      }
    });

    vm.accounts = [];
    vm.errors = {};
    vm.accountPeople = [];
    vm.people = {};
    vm.peopleRef = [];
    vm.houses = {};
    vm.positions = {
        adm: 'Admin',
        dir: 'Director',
        boa: 'Board',
        rep: 'Rep'
    }
    vm.clickCreate = clickCreate;
    vm.queryPeople = queryPeople;

    // startUp();

    $firebaseArray(firebase.database().ref('account')).$loaded().then(function(accounts) {
        vm.accounts = accounts;
        $firebaseArray(firebase.database().ref('people')).$loaded().then(function(people) {
            vm.peopleRef = people;
            angular.forEach(vm.accounts, function(account) {
              if(account.person !== 'admin') {
                vm.accountPeople.push(vm.peopleRef.$getRecord(account.person));
              }
            });
        });
    });

    // firebase.auth().onAuthStateChanged(function(user) {
    //   vm.currentUser = user;
    // });

    vm.wlogin = wlogin;
    vm.wforgotPwd = wforgotPwd;

    function queryPeople(text) {
      return vm.peopleRef.filter(function(obj) {
        return obj.name.toLowerCase().indexOf(text.toLowerCase()) > -1 && !obj.position;
      });
    }

    function clickCreate(obj) {
      if(Object.keys(obj).length == 0) {
        // var update = {};
        // update['people/'+vm.selectedPerson.id+'/'] = vm.selectedPerson;
        // firebase.auth().createUserWithEmailAndPassword(vm.selectedPerson.Email, 'ims2016').then(function(data) {
        //   update['account/'+data.uid] = {
        //     id: vm.selectedPerson.id,
        //     position: vm.newAccount.position
        //   }
        //   firebase.database().ref().update(update).then(function(data) {
        //     vm.selectedPerson = void(0);
        //     vm.newAccount.position = '';
        //     startUp();
        //   });
        // });
        $firebaseAuth().$createUserWithEmailAndPassword(vm.selectedPerson.Email, 'ims2016').then(function(newUser) {
          $firebaseObject(firebase.database().ref('account')).$loaded().then(function(ref) {
            console.log(newUser.uid);
            ref[newUser.uid] = {person: vm.selectedPerson.$id};
            ref.$save().then(function() {
              vm.peopleRef.$save(vm.peopleRef.$indexFor(vm.selectedPerson.$id)).then(function() {
                vm.accountPeople.push(vm.selectedPerson);
                vm.selectedPerson = void(0);
              }, function(err) {
                console.log(err);
              });
            }, function(err) {
              console.log(err);
            });
          }, function(err) {
            console.log(err);
          });
        }, function(err) {
          console.log(err);
        });
      }
    }

    function wlogin() {
      $firebaseAuth().$signInWithEmailAndPassword(vm.loginPage.email, vm.loginPage.password)
        .then(function(data) {
          console.log('Sign in successful');
          $state.go('root.games');
        }).catch(function(err) {
          vm.errors[err.code] = true;
        });
    }

    function wforgotPwd(obj) {
      if(obj) {
        firebase.auth().sendPasswordResetEmail(vm.loginPage.email).then(function() {
          vm.errors['forgotSent'] = true;
        }).catch(function(err) {
          console.log(err);
          vm.errors[err.code];
        });
      }
    }

    function startUp() {
      MainDS.getDataFrom().then(function(data) {
        vm.account = data.account;
        vm.accountPeople = Object.keys(data.account).map(function(uid) {
          return {id:data.account[uid].id, uid:uid};
        }).filter(function(obj) {
          return data.people[obj.id];
        });
        vm.people = data.people;
        vm.peopleRef = Object.keys(vm.people).map(function(peopleId) {
          return Object.assign({id: peopleId}, vm.people[peopleId]);
        }).filter(function(obj) {
          for(var i = 0; i < vm.accountPeople.length; i++) {
            if(obj.id === vm.accountPeople[i].id) return false;
          }
          return true;
        });
        vm.houses = data.house;
      });
    }

  }
  AccountController.$inject = ['$state', '$firebaseArray', '$mdDialog', '$firebaseAuth', '$firebaseObject', 'imp'];
}());
