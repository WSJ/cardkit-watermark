'use strict';

/**
 * @ngdoc directive
 * @name cardkitApp.directive:imageEditor
 * @description
 * # imageEditor
 */
angular.module('cardkitApp')
  .directive('imageEditor', function () {
    return {
      template: '<div>' +
            '<div class="dropzone" drop="onDrop($data, $event)" drop-effect="copy" drop-accept="\'Files\'" drag-over-class="drag-over-accept">' +
              
              '<div class="fileInputWrapper btn btn-primary">' +
                'or select an image' +
                '<input onchange="angular.element(this).scope().$parent.fileChanged(this, event)" type="file" accept="image/*" />' +
              '</div>' +

            '</div>' +
          '</div>',
      restrict: 'E',
      scope: {
        key: '=',
        onDrop: '='
      }
    };
  });
