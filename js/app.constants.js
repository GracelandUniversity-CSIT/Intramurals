(function(){
  'use strict';

  angular.module('app').constant('imp', {
    //user ids of intramural board, director, advisor
    uids: [
      '9IRIeiwCixN8j9fCS6hvlcAhLeu2',
      '98530ece-cfe8-4528-8e1c-194f12e5d7f2',
      'kESMFjR5R9V4B5PcbNNLGE1A3zp1',
      'CVwCNEyYFrZvrtOFyvLzKh8f82h2',
      'OdDdQOJXPiVFg7w6CMruBvgNXOa2',
      'fr17DonNEOR3a8EyjbOAUHvbsQG3',
      'Ey0M1x2q4jWrgDtvZeLRtIeG43r2',
      'vWTymDmMk8NZKY6sg7KB75L3tyg1',
      'pDKDvcwsKIP8EfIQrapUE1pidIk2',
      'VmTaFDUnvLWeKBfRWv52y9idoAy2',
      'dfDVfDJnBYNndELAPzaXSvvHR363'],
      isUpper: (uid, uids) => {
        // console.log("uid: " + uid);
        if(!uid) {
          // console.log(false);
          return false;
        }
        return uids.indexOf(uid) > -1;
      }
    });
  }());
