(function(){
  'use strict';
  angular.module('handle.excel', []).directive('handleExcel', handleExcel);
  function handleExcel($scope) {
    return {
      link: function($scope, el) {
        el.bind('change', function(e) {
          $scope.file = (e.srcEle,emt || e.target).files[0];
        });
      }
    }
  }
  handeExcel.$inject = ['$scope'];
}());
