(function(){
  'use strict';
  angular.module('app').config(config);

  function config() {
    var config = {
      apiKey: "insert-key-here",
      authDomain: "graceland-university-ims.firebaseapp.com",
      databaseURL: "https://graceland-university-ims.firebaseio.com",
      projectId: "graceland-university-ims",
      storageBucket: "",
      messagingSenderId: "195787656470"
    };
    firebase.initializeApp(config);
  }

}());
