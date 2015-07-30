'use strict';

/**
 * @ngdoc directive
 * @name cardkitApp.directive:snapSvg
 * @description
 * # snapSvg
 */
angular.module('cardkitApp')
  .directive('snapSvg', function (snapSVG) {
    return {
      template: '<svg id="snap-svg" style="max-width: {{width}}px"></svg>',
      restrict: 'E',
      scope: {
        svgConfig: '=',
        svgTheme: '=',
        width: '@width'
      },
      link: function postLink(scope, element) {
        // Check for functions in the config, and resolve them
        function functionise(element) {
          var attrs = {};
          for(var item in element) {
            switch(typeof element[item]) {
              case 'function':
                attrs[item] = element[item]();
                break;
              default:
                attrs[item] = element[item];
                break;
            }
          }

          return attrs;
        }

      	// Destringify the JSON object
        var data = angular.fromJson(scope.svgConfig);

        // Custom SVG Drag function, given that we scale the SVG
        snapSVG.plugin(function(Snap, Element, Paper, global) {
            Element.prototype.altDrag = function(lockX) {
                //option to lock placement on X axis, only allow vertical drag
                this.dragLockX = lockX || false;
                this.drag( dragMove, dragStart, dragEnd );
                return this;
            };
                
            var dragStart = function ( x,y,ev ) {
                    this.data('ot', this.transform().local );
            };
         
            var dragMove = function(dx, dy, ev, x, y) {
                    if(this.dragLockX){
                      dx = 0; //locks dragging elements on x axis (only vertical movement)
                    }
                    var tdx, tdy;
                    var snapInvMatrix = this.transform().diffMatrix.invert();
                    snapInvMatrix.e = snapInvMatrix.f = 0; 
                    tdx = snapInvMatrix.x( dx,dy ); tdy = snapInvMatrix.y( dx,dy );
                    this.transform( this.data('ot') + 't' + [ tdx, tdy ]  );

            };

            var dragEnd = function() {
            };
        });

      	// Setup element
      	var s = snapSVG(element[0].children[0]);
        s.attr({
          height: '100%',
          width: '100%',
          'max-width': '100%',
          'max-height': '100%'
        });

      	// Setup canvas background
        var canvasData = functionise(data.canvas);
      	var background = s.rect(0, 0, canvasData.width, canvasData.height, 0, 0).attr(canvasData);
      	if(canvasData.draggable === true) {
      		background.altDrag();
      	}

      	// Setup some element variables
      	var elements = [],
      		  el;

      	// The function that sets up the element with the required settings
      	function setupElement(element) {
      		var el;
          element = functionise(element);

      		switch(element.type) {
            case 'atext':
      			case 'text':
					    el = s.text(element.x, element.y);
      				break;
      			case 'image':
      				el = s.image(element.src, 0, 0, '100%', element.height);
      				break;
      			case 'rect':
      				el = s.rect(element.x, element.y, element.width, element.height, 0, 0);
      				break;
      			case 'circle':
      				break;
            case 'polygon':
              el = s.polygon(element.points);
              break;
      			case 'group':
      				var gEl;
      				el = '';
      				angular.forEach(element.elements, function(e, k) {
      					gEl = setupElement(e);
                setAttributes(gEl, e);
      				
        			  if(k === 0) {
      						el = s.group(gEl);
    						} else {
      						el.group(gEl);
      					}
      				});
      				break;
      			default: 
      				return false;
      		}

          return el;

        }

        // Setup our atrribtes on the specific element
        function setAttributes(el, element) {
          var attrs = functionise(element);
          var elementData = attrs;
          delete elementData.$$hashKey;
          if(elementData.type === 'text') {
            elementData.text = elementData.text.split('\n');
          }

          el.attr(elementData);

          if(elementData.type === 'text') {
            el.selectAll('tspan').forEach(function(tspan, i){
              var dy = angular.isUndefined(elementData.dy) ? elementData.fontSize*i : elementData.dy*i,
                attrs = {x: elementData.x, y: elementData.y + dy};

              if(angular.isUndefined(elementData.tspan)) {
                tspan.attr({x: elementData.x, y: elementData.y + dy});                
              } else if(Array.isArray(elementData.tspan)){
                tspan.attr( angular.extend({}, attrs, elementData.tspan[i]));
              } else {
                tspan.attr( angular.extend({}, attrs, elementData.tspan));
              }
            });
          }

          return el;
        }

      	// Draw the elements on the SVG
      	function drawElements() {
          // Make changes to the canvas
          var canvasData = functionise(scope.svgConfig.canvas);

          s.attr({
            height: canvasData.width <= canvasData.maxWidth ? canvasData.height : '100%',
            width: canvasData.width <= canvasData.maxWidth ? canvasData.width : '100%',
            viewBox: '0, 0, ' + canvasData.width + ', ' + canvasData.height,
            'data-width': canvasData.width,
            'data-height': canvasData.height
          });
          setAttributes(background, scope.svgConfig.canvas);

          var matrix;

          // Loop through all elements
	      	angular.forEach(scope.svgConfig.elements, function(element, key) {
          	var attrs = functionise(element);
            // Check if we have setup the element already
	      		if(typeof elements[key] !== 'undefined') {
	      			// The element already exists
	      			el = elements[key];

              // If the type is image
              if(el.type === 'image') {
                // Store matrix transformation, we'll need it later to prevent the image moving around the SVG when replaced 
                matrix = el.matrix;
                
                // Create new element based on config
                var newEl = setupElement(scope.svgConfig.elements[key]);

                if(newEl === false) {
                  return;
                }

                // Place new element directly after old one
                el.after(newEl);

                // Apply matrix transformation from previous element
                newEl.transform(matrix);

                // Destroy old element
                el.remove();
                
                el = newEl;

                // Add the created element to a list of elements
                elements[key] = el;
              }

              if(el.type === 'g') {
                // Store matrix transformation, we'll need it later to prevent the group moving around the SVG when replaced 
                matrix = el.matrix;

                // Destroy and recreate
                el.remove();
                
                // Create new element based on config
                el = setupElement(scope.svgConfig.elements[key]);

                if(el === false) {
                  return;
                }

                // Apply matrix transformation from previous element
                el.transform(matrix);

                // Add the created element to a list of elements
                elements[key] = el;
              }
	      		} else {
              // Create new element based on config
      			  el = setupElement(element);

	      			if(el === false) {
	      				return;
	      			}

	      			// Add the created element to a list of elements
	      			elements.push(el);
	      		}

	      		// Update the attributes (e.g. text and colours) based on config data
	      		var elementData = element;
	      		delete elementData.$$hashKey;

	      		// Update the element!
            setAttributes(el, element);

    				// Check if we're to enable dragging
    				if(attrs.draggable) {
    					// We have to 'undrag' the element here, because they can get choppy after a few redraws otherwise
    					el.undrag();

    					// Drag dat
    					el.altDrag(element.dragLockX);
    				} else {
              //in case dragging was previously on, turn it off and reset transformation from dragging in another theme
              el.transform('0').undrag();
            }
    			});
      	}

      	// Watch for changes on the scope and the theme, and redraw
        scope.$watch('svgConfig', drawElements, true);
        scope.$on('changeTheme', drawElements);
        scope.$on('changeSize', drawElements);
      }
    };
  });
