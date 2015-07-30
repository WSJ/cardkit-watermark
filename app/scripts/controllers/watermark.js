(function() {
'use strict';

/**
 * @ngdoc function
 * @name cardkitApp.controller:SettingsFormCtrl
 * @description
 * # SettingsFormCtrl
 * Controller of the cardkitApp
 */
angular.module('cardkitApp')
  .controller('SettingsFormCtrl', function ($scope, saveSvgAsPng, jsjpegmeta, themeConfig, $filter, $timeout) {
    //$scope.config = extend(themeConfig);

    $scope.config = {
    themes: themeConfig,
      output: {
        scale: 1,
        editable: {
          scale: false
        }
      },
      svg: {
    		canvas: {
    			height: function() {
            return $scope.size.height;
          },
    			width: function() {
            return $scope.size.width;
          },
    			fill: '#fff'
    		},
    		elements: [
          {
            name: 'Background',
            type: 'rect',
            height: function() {
              return $scope.size.height;
            },
            width: function() {
              return $scope.size.width;
            },
            hide: true,//collapse options by default
            fill: '',
            defaultFill: function() { return '#000'; },
            editable: {
              fill: {
                'White': '#fff',
                'Black': '#000'
              }
            }
          },
          {
            name: 'Image',
            type: 'image',
            width: function() {
              return $scope.size.width;
            },
            height: function() {
              var ratio = isDefined($scope.image, 'ratio', 1);
              return ratio * functionise($scope.imageEl.width);
            },
            src: '',
            x: '0%',
            y: '0%',
            preserveAspectRatio: 'xMinYMin slice',
            draggable: true,
            dragLockX: true,
            editable: {
              src: true,
              width: true,
              dragLockX: true
            }
          },
          {
            name: 'Shadow',
            type: 'text',
            text: function() { return functionise($scope.credit.text); },
            fill: function() {
              //return $scope.credit.fill===$scope.theme.colors.Black ? $scope.theme.colors.White  : $scope.theme.colors.Black ;
              return isDefined($scope.theme, 'shadow.'+$scope.credit.fill, '#000');
            },
            fontSize: function() { return isDefined($scope.theme, 'fontSize', '12'); },
            fontFamily: function() { return isDefined($scope.theme, 'fontFamily', 'helvetica'); },
            fontWeight: function() { return isDefined($scope.theme, 'fontWeight', 'normal'); },
            fontStyle: function() { return isDefined($scope.theme, 'fontStyle', 'normal'); },
            opacity: function() { return isDefined($scope.theme, 'opacity', 0.9); },
            x: function() { return functionise($scope.credit.x)+1; },
            y: function(){  return functionise($scope.credit.y)+1; },
            textAnchor: function(){ return functionise($scope.credit.textAnchor); }
          },
          {
            name: 'Credit',
            type: 'text',
            text: function() { return isDefined($scope.theme, 'defaultText', ''); },
            value: function() { return isDefined($scope.theme, 'defaultText', ''); },
            change: function() {
              var text = ( functionise(this.value) + (this.suffix ? isDefined($scope.theme, 'suffix.value') : '' ));
              this.text = isDefined($scope.theme, 'uppercase') ? text.toUpperCase() : text;
            },
            fill: function() { return isDefined($scope.theme, 'colors.'+isDefined($scope.theme, 'defaultColor', 'White'), '#fff'); },
            defaultFill: function() { return isDefined($scope.theme, 'colors.'+isDefined($scope.theme, 'defaultColor', 'White'), '#fff'); },
            helpText: function(){ return isDefined($scope.theme, 'helpText', ''); },
            fontSize: function() { return isDefined($scope.theme, 'fontSize', '12'); },
            fontFamily: function() { return isDefined($scope.theme, 'fontFamily', 'helvetica'); },
            fontWeight: function() { return isDefined($scope.theme, 'fontWeight', 'normal'); },
            fontStyle: function() { return isDefined($scope.theme, 'fontStyle', 'normal'); },
            opacity: function() { return isDefined($scope.theme, 'opacity', 0.9); },
            x: function() { return isDefined($scope.theme, 'margin', 20); },
            defaultX: function() { return isDefined($scope.theme, 'margin', 20); },
            y: function(){  return $scope.size.height - isDefined($scope.theme, 'margin', 20); },
            textAnchor: function(){ return functionise($scope.credit.x)!==isDefined($scope.theme, 'margin', 20) ? 'end' : 'start'; },
            suffix: false,
            //draggable: true,
            editable: {
              /*fontSize: {
                'Small': 12,
                'Medium': 18,
                'Large': 22,
                'Extra Large': 36,
              },*/
              fill: themeConfig[0].colors,
              x: {
                'Left': themeConfig[0].margin,
                'Right': function(){
                  return $scope.size.width-isDefined($scope.theme, 'margin', 20);
                }
              },
              suffix: {
                'Off': false,
                'On': true
              },
              text: true
            },
          },
          {
            name: 'Logo',
            type: 'image',
            //hide: true,
            enabled: function() { return isDefined($scope.theme, 'logo.enabled', false); },
            width: function() { return isDefined($scope.theme, 'logo.width', 0); },
            height: function() { return isDefined($scope.theme, 'logo.height', 0); },
            //src: function() { return isDefined($scope.theme, 'logo.src'); },
            //use one file (src) or choose file based on credit color
            src: function() {
              if(typeof isDefined($scope.theme, 'logo.src') === "string") {
                return $scope.theme.logo.src;
              } else if(typeof isDefined($scope.theme, 'logo.src') === "object") {
                return $scope.theme.logo.src[$scope.credit.fill];
              }
            },
            opacity: function() { return isDefined($scope.theme, 'logo.opacity', 0.5); },
            x: function(){  return $scope.size.width-isDefined($scope.theme, 'margin', 20)-this.width(); },
            //x: function() { return isDefined($scope.theme, 'margin', 20); },
            y: function() { return isDefined($scope.theme, 'margin', 20); },
            //y: function(){  return $scope.size.height-isDefined($scope.theme, 'margin', 20)-this.height; },
            preserveAspectRatio: 'xMinYMin slice',
            //draggable: true,
            //display: function() { return $scope.credit.suffix ? this.display : 'none'; },
            //to set logo always on/off
            display: function() { return isDefined($scope.theme, 'logo.display', 'none'); },
            defaultDisplay: function() { return isDefined($scope.theme, 'logo.display', 'none'); },
            editable: {
              display: {
                'Off': 'none',
                'On': 'block'
              }
            }
          }
    		],
      }
  	};

    // return property value in object if undefined
    // or else a default value (fallback) or fail gracefully
    // target is base object, path is what to test (can be multilevel path, not just a property)
    function isDefined(target, path, fallback) {
      fallback = angular.isUndefined(fallback) ? false : fallback;
      if (typeof target !== 'object' || target === null) {
          return fallback;
      }
      var parts = path.split('.');
      while(parts.length) {
          var branch = parts.shift();
          if (!(branch in target)) {
              return fallback;
          }
          target = target[branch];
      }
      return target;
    }

    // return function result, if a function
    // otherwise return value
    function functionise(element) {
      switch(typeof element) {
        case 'function':
          return element();
        default:
          return element;
      }
    }

    /*if(typeof $scope.config.themes !== 'undefined') {
      $scope.theme = ($scope.config.themes.length > 1) ? null : $scope.config.themes[0];
    }*/
    $scope.theme = $scope.config.themes[0];

    //shorthand reference to primary image element. This way adding/removing elements doesn't effect code
    $scope.imageEl = $filter('filter')($scope.config.svg.elements, {name: 'Image'})[0];
    $scope.credit = $filter('filter')($scope.config.svg.elements, {name: 'Credit'})[0];

    $scope.config.sizes = $scope.theme.sizes;
    if(typeof $scope.config.sizes !== 'undefined') {
      $scope.size = ($scope.config.sizes.length < 1) ? null : $scope.config.sizes[0];
    }
    this.size = $scope.config.sizes[0];

    $scope.$watch('theme', function() {
      $scope.$broadcast('changeTheme');
    });

    //watch size field in custom (repeats for width, but needed to respect locked aspect ratio)
    $scope.$watchGroup(['size.width','size.height'], function() {
      if(isDefined($scope.size, 'locked')) {
        customResize();
      }
      $scope.$broadcast('changeSize');
    });

    //reset aspect ratio when checked
    $scope.$watch('size.locked', function() {
      if(isDefined($scope.size, 'locked')) {
        customResize();
      }
      //$scope.$broadcast('changeSize');
    });

    $scope.warning = {
      tooBig: false,
      tooSmall: false
    };

    //warn if image width/height is less than output size or image is larger than original
    $scope.$watchGroup(['size','imageEl.width','imageEl.src'], function() {
      checkSizeWarnings();
    });

    //auto lock/unlock horizontal dragging
    $scope.$watchGroup(['size','imageEl.width'], function() {
      $scope.imageEl.dragLockX = false;
    });
    $scope.$watch('imageEl.src', function() {
      $scope.imageEl.dragLockX = true;
    });


    function checkSizeWarnings() {
      //but only if image is uploaded
      if(isDefined($scope, 'image')) {
        warnTooBig();
        $scope.warning.tooSmall = warnTooSmall('width') || warnTooSmall('height');
      }
    }

    // Drop handler.
    $scope.onDrop = function (data, event) {
      var dataTransfer = getDataTransfer(event);
      readFile(dataTransfer.files[0]);
    };

    $scope.fileChanged = function(file) {
      readFile(angular.element(file)[0].files[0]);
    };

    // Read the supplied file (from DataTransfer API)
    function readFile(file) {
      var reader = new FileReader();

      reader.onload = function() { 
        var img = new Image();
        img.onload = function() {
          $scope.image = {
            width: this.width,
            height: this.height,
            ratio: this.height/this.width
          };
          $scope.imageEl.src = reader.result;
          customResize();
          $scope.$apply();
        };
        img.src = reader.result;

        //get credit from meta data
        try {
          var jpeg = new JpegMeta.JpegFile(atob(reader.result.replace(/^.*?,/,'')),file);
          //console.info("File metadata:",jpeg);
          var credit = jpeg.metaGroups.iptc.credit.value;
          $scope.metadata = credit;
          //write data directly to credit
          //$scope.credit.value = credit;
        } catch (e) {
          //reset credit
          $scope.metadata = '';
          //$scope.credit.value = isDefined($scope.theme, 'defaultText', '');
          //catch to suppress errors of no jpg or no credit, etc.
          //console.info("Can't retrieve credit from IPTC data:",e);
        }
      };

      reader.readAsDataURL(file);
    }

    //resize output size to match aspect ratio in image
    function customResize() {
      if($scope.size.name==='Custom') {
        var ratio = isDefined($scope.image, 'ratio', 0.6);
        //adjust width to match source up to set max width (after that, it scales)
        var imageWidth = isDefined($scope.image, 'width');
        //if image width exists and is less than custom's set width
        //need filter to access custom's set width
        if(imageWidth && imageWidth < $filter('filter')($scope.config.sizes, {name: 'Custom'})[0].width) {
          $scope.size.width = imageWidth;
        }
        //change height to match original aspect ratio
        $scope.size.height = floor(ratio * $scope.size.width, 10);
        //make sure filling (takes care of rounding errors) on custom
        if(isDefined($scope.size, 'locked') && isDefined($scope.image, 'width')) {
          $scope.fitImage();
        }
      }
      delete $scope.imageEl.transform;
    }

    //set image width = crop width
    //fit image into space
    $scope.fitImage = function() {
      var yOffset = 0,
          xOffset = 0;
      //compare original to crop ratio
      //if original > crop, fit width, else height
      if($scope.image.ratio < ($scope.size.height/$scope.size.width)) {
        $scope.imageEl.width = $scope.size.width;
        //calculate how to center vertically
        //difference between heights (new height has to be calculated, divided by 2
        yOffset = ( $scope.size.height - ( $scope.imageEl.width * $scope.image.ratio ) ) / 2;
      } else {
        $scope.imageEl.width = $scope.size.height/$scope.image.ratio;
        //calculate how to center horizontally
        //difference between widths, divided by 2
        xOffset = ( $scope.size.width - $scope.imageEl.width ) / 2;
      }
      //center x and y
      $scope.imageEl.transform = 'matrix(1, 0, 0, 1, '+xOffset+', '+yOffset+')';
      checkSizeWarnings();
      //$scope.$broadcast('changeSize');
      $timeout(function(){
        delete $scope.imageEl.transform;
      }, 0);
    };

    //set image width = crop width
    //fill space with image
    $scope.fillImage = function() {
      //compare original to crop ratio
      //if original > crop, fit width, else height
      if($scope.image.ratio > ($scope.size.height/$scope.size.width)) {
        $scope.imageEl.width = $scope.size.width;
      } else {
        $scope.imageEl.width = $scope.size.height/$scope.image.ratio;
      }
      $scope.imageEl.transform = 'matrix(1, 0, 0, 1, 0, 0)';
      checkSizeWarnings();
      //$scope.$broadcast('changeSize');
      $timeout(function(){
        delete $scope.imageEl.transform;
      }, 0);
    };

    // Get the data transfer
    function getDataTransfer(event) {
      event.stopPropagation();
      event.preventDefault();
      return event.dataTransfer || null;
    }

    $scope.removeImage = function() {
      $scope.imageEl.src = '';
    };


    $scope.downloadSvg = function() {
      //calculate maximum scale output (max-width set in theme, min scale = 1)
      var scale = maxScale();
      saveSvgAsPng(document.getElementById('snap-svg'), isDefined($scope.theme, 'name', 'Watermark')+'.png', {
        scale: scale,
        width: $scope.size.width,
        height: $scope.size.height
      });
    };

    //output best scale
    function maxScale() {
      if(isDefined($scope, 'image')) {
        var originalWidth = $scope.image.width;
        //maximum output width set in theme, 1274px (16h), unless manually set larger
        if(isDefined($scope.theme, 'maxWidth') && $scope.size.width <= $scope.theme.maxWidth && $scope.image.width > $scope.theme.maxWidth) {
          originalWidth = $scope.theme.maxWidth;
        }
        //calculate scale
        var scale = originalWidth / functionise($scope.imageEl.width);
        //don't scale down
        if(scale >= 2) {
          return 2;
        } else if(scale > 1) {
          return floor(scale,10);
        } else {
          return 1;
        }
      } else {
        return 1;
      }
    }

    function floor(value, decimals) {
      return Math.floor(value*decimals)/decimals;
    }

    //notify if image is stretched
    function warnTooBig() {
      var actualSize = functionise($scope.imageEl.width);
      if(actualSize > $scope.image.width) {
        //console.warn('Image is larger than the original file. Quality will be lost.');
        $scope.warning.tooBig = true;
      } else {
        $scope.warning.tooBig = false;
      }
    }

    function warnTooSmall(side) {
      var actualSize = functionise($scope.imageEl[side]);
      //if actualSize <, but with a small margin of error due to error warning on custom Fit imgae
      if((actualSize - functionise($scope.size[side])) < -.1) {
        //console.warn('Image',side,'is less than the set size');
        return true;
      } else {
        return false;
      }
    }

    //return true if browser can download an attribute
    $scope.canIDownload = function() {
      var a = document.createElement('a');
      if (typeof a.download != "undefined") {
          return true;
      }
      return false;
    };

  });
})();
