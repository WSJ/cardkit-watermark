(function() {
'use strict';

/**
 * @ngdoc overview
 * @name cardkitApp
 * @description
 * # cardkitApp
 *
 * Main module of the application.
 */
angular
  .module('cardkitApp', [
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'colorpicker.module',
    'draganddrop',
    'colorpicker.module',
    'ui.router'
  ])
  .config(function ($stateProvider, $urlRouterProvider) {
    // For any unmatched url, redirect to /
    $urlRouterProvider.otherwise('/watermark');
    // Now set up the states
    $stateProvider
      .state('watermark', {
        url: '/watermark',
        templateUrl: 'views/watermark.html',
        controller: 'SettingsFormCtrl as form',
        name: 'watermark',
        resolve: {
          themeConfig: function($state, themeConfigProvider) {
            $state.current.newname = this.name;
            return themeConfigProvider();
          }
        }
      });
  })
  .run(['$rootScope', '$state', '$stateParams', function($rootScope, $state, $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
  }]);
})();
