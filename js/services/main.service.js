(function(){
  'use strict';
  angular.module('app').service('MainDS', MainDS);
  function MainDS($q) {
    return {
      getRef:getRef,
      getDataFrom:getDataFrom
    }

    function getRef(path) {
      return firebase.database().ref(path);
    }

    function getDataFrom(path) {
      return $q(function(resolve, reject) {
        var ref = firebase.database().ref(path);
        ref.on('value', function(snapshot) {
          if(snapshot.val()) {
            resolve(snapshot.val());
          } else {
            reject('Unable to resolve request');
          }
        });
      }).then(success).catch(fail);
    }

    function success(response) {
      return response;
    }

    function fail(err) {
      console.warn('Something went wrong!');
      console.log(err);
    }
  }
  MainDS.$inject = ['$q'];
}());
