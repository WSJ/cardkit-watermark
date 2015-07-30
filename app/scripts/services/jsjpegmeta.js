'use strict';

/**
 * @ngdoc service
 * @name cardkitApp.jsjpegmeta
 * @description
 * # jsjpegmeta
 * Service in the cardkitApp.
 */
angular.module('cardkitApp')
  .service('jsjpegmeta', function ($window) {
    return $window.JpegMeta;
  });
