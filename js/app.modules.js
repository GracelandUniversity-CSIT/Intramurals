(function(){
  'use strict';
  angular.module('app', [
    'ui.router',
    'ngMaterial',
    'md.data.table',
    'scDateTime',
    'ngMessages',
    'firebase',
    'moment-picker',
  ])
  .config(function($mdThemingProvider) {
    var customPrimary = {
      '50': '#005ddb',
      '100': '#0052c2',
      '200': '#0047a8',
      '300': '#003d8f',
      '400': '#003275',
      '500': '#00275C',
      '600': '#001c42',
      '700': '#001129',
      '800': '#00070f',
      '900': '#000000',
      'A100': '#0068f5',
      'A200': '#0f75ff',
      'A400': '#2984ff',
      'A700': '#000000',
      'contrastDefaultColor': 'light',
    };
    $mdThemingProvider
    .definePalette('customPrimary',
    customPrimary);
    $mdThemingProvider.theme('default')
    .primaryPalette('customPrimary')
    .warnPalette('red')
    .accentPalette('blue');

  });
}());
