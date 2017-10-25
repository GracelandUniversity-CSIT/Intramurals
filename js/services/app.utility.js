(function(){
  'use strict';
  angular.module('app').service('utility', utility);
  function utility() {
    return {
      fixDataForExcel: fixDataForExcel
    }

    function fixDataForExcel(data) {
      var o = "", l = 0, w = 10240;
      for(; l<data.byteLength/w; ++l) o+=String.fromCharCode.apply(null,new Uint8Array(data.slice(l*w,l*w+w)));
      o+=String.fromCharCode.apply(null, new Uint8Array(data.slice(l*w)));
      return o;
    }
  }
  utility.$inject = [];
}());
