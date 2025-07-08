import jQuery from './jquery';

(function($) {
  (function (factory) {
      if ( typeof define === 'function' && define.amd ) {
          // AMD. Register as an anonymous module.
          define(['jquery'], factory);
      } else if (typeof exports === 'object') {
          // Node/CommonJS style for Browserify
          module.exports = factory;
      } else {
          // Browser globals
          factory(jQuery);
      }
  }(function ($) {

      var toFix  = ['wheel', 'mousewheel', 'DOMMouseScroll', 'MozMousePixelScroll'],
          toBind = ( 'onwheel' in document || document.documentMode >= 9 ) ?
                      ['wheel'] : ['mousewheel', 'DomMouseScroll', 'MozMousePixelScroll'],
          slice  = Array.prototype.slice,
          nullLowestDeltaTimeout, lowestDelta;

      if ( $.event.fixHooks ) {
          for ( var i = toFix.length; i; ) {
              $.event.fixHooks[ toFix[--i] ] = $.event.mouseHooks;
          }
      }

      var special = $.event.special.mousewheel = {
          version: '3.1.12',

          setup: function() {
              if ( this.addEventListener ) {
                  for ( var i = toBind.length; i; ) {
                      this.addEventListener( toBind[--i], handler, false );
                  }
              } else {
                  this.onmousewheel = handler;
              }
              // Store the line height and page height for this particular element
              $.data(this, 'mousewheel-line-height', special.getLineHeight(this));
              $.data(this, 'mousewheel-page-height', special.getPageHeight(this));
          },

          teardown: function() {
              if ( this.removeEventListener ) {
                  for ( var i = toBind.length; i; ) {
                      this.removeEventListener( toBind[--i], handler, false );
                  }
              } else {
                  this.onmousewheel = null;
              }
              // Clean up the data we added to the element
              $.removeData(this, 'mousewheel-line-height');
              $.removeData(this, 'mousewheel-page-height');
          },

          getLineHeight: function(elem) {
              var $elem = $(elem),
                  $parent = $elem['offsetParent' in $.fn ? 'offsetParent' : 'parent']();
              if (!$parent.length) {
                  $parent = $('body');
              }
              return parseInt($parent.css('fontSize'), 10) || parseInt($elem.css('fontSize'), 10) || 16;
          },

          getPageHeight: function(elem) {
              return $(elem).height();
          },

          settings: {
              adjustOldDeltas: true, // see shouldAdjustOldDeltas() below
              normalizeOffset: true  // calls getBoundingClientRect for each event
          }
      };

      $.fn.extend({
          mousewheel: function(fn) {
              return fn ? this.bind('mousewheel', fn) : this.trigger('mousewheel');
          },

          unmousewheel: function(fn) {
              return this.unbind('mousewheel', fn);
          }
      });


      function handler(event) {
          var orgEvent   = event || window.event,
              args       = slice.call(arguments, 1),
              delta      = 0,
              deltaX     = 0,
              deltaY     = 0,
              absDelta   = 0,
              offsetX    = 0,
              offsetY    = 0;
          event = $.event.fix(orgEvent);
          event.type = 'mousewheel';

          // Old school scrollwheel delta
          if ( 'detail'      in orgEvent ) { deltaY = orgEvent.detail * -1;      }
          if ( 'wheelDelta'  in orgEvent ) { deltaY = orgEvent.wheelDelta;       }
          if ( 'wheelDeltaY' in orgEvent ) { deltaY = orgEvent.wheelDeltaY;      }
          if ( 'wheelDeltaX' in orgEvent ) { deltaX = orgEvent.wheelDeltaX * -1; }

          // Firefox < 17 horizontal scrolling related to DOMMouseScroll event
          if ( 'axis' in orgEvent && orgEvent.axis === orgEvent.HORIZONTAL_AXIS ) {
              deltaX = deltaY * -1;
              deltaY = 0;
          }

          // Set delta to be deltaY or deltaX if deltaY is 0 for backwards compatabilitiy
          delta = deltaY === 0 ? deltaX : deltaY;

          // New school wheel delta (wheel event)
          if ( 'deltaY' in orgEvent ) {
              deltaY = orgEvent.deltaY * -1;
              delta  = deltaY;
          }
          if ( 'deltaX' in orgEvent ) {
              deltaX = orgEvent.deltaX;
              if ( deltaY === 0 ) { delta  = deltaX * -1; }
          }

          // No change actually happened, no reason to go any further
          if ( deltaY === 0 && deltaX === 0 ) { return; }

          // Need to convert lines and pages to pixels if we aren't already in pixels
          // There are three delta modes:
          //   * deltaMode 0 is by pixels, nothing to do
          //   * deltaMode 1 is by lines
          //   * deltaMode 2 is by pages
          if ( orgEvent.deltaMode === 1 ) {
              var lineHeight = $.data(this, 'mousewheel-line-height');
              delta  *= lineHeight;
              deltaY *= lineHeight;
              deltaX *= lineHeight;
          } else if ( orgEvent.deltaMode === 2 ) {
              var pageHeight = $.data(this, 'mousewheel-page-height');
              delta  *= pageHeight;
              deltaY *= pageHeight;
              deltaX *= pageHeight;
          }

          // Store lowest absolute delta to normalize the delta values
          absDelta = Math.max( Math.abs(deltaY), Math.abs(deltaX) );

          if ( !lowestDelta || absDelta < lowestDelta ) {
              lowestDelta = absDelta;

              // Adjust older deltas if necessary
              if ( shouldAdjustOldDeltas(orgEvent, absDelta) ) {
                  lowestDelta /= 40;
              }
          }

          // Adjust older deltas if necessary
          if ( shouldAdjustOldDeltas(orgEvent, absDelta) ) {
              // Divide all the things by 40!
              delta  /= 40;
              deltaX /= 40;
              deltaY /= 40;
          }

          // Get a whole, normalized value for the deltas
          delta  = Math[ delta  >= 1 ? 'floor' : 'ceil' ](delta  / lowestDelta);
          deltaX = Math[ deltaX >= 1 ? 'floor' : 'ceil' ](deltaX / lowestDelta);
          deltaY = Math[ deltaY >= 1 ? 'floor' : 'ceil' ](deltaY / lowestDelta);

          // Normalise offsetX and offsetY properties
          if ( special.settings.normalizeOffset && this.getBoundingClientRect ) {
              var boundingRect = this.getBoundingClientRect();
              offsetX = event.clientX - boundingRect.left;
              offsetY = event.clientY - boundingRect.top;
          }

          // Add information to the event object
          event.deltaX = deltaX;
          event.deltaY = deltaY;
          event.deltaFactor = lowestDelta;
          event.offsetX = offsetX;
          event.offsetY = offsetY;
          // Go ahead and set deltaMode to 0 since we converted to pixels
          // Although this is a little odd since we overwrite the deltaX/Y
          // properties with normalized deltas.
          event.deltaMode = 0;

          // Add event and delta to the front of the arguments
          args.unshift(event, delta, deltaX, deltaY);

          // Clearout lowestDelta after sometime to better
          // handle multiple device types that give different
          // a different lowestDelta
          // Ex: trackpad = 3 and mouse wheel = 120
          if (nullLowestDeltaTimeout) { clearTimeout(nullLowestDeltaTimeout); }
          nullLowestDeltaTimeout = setTimeout(nullLowestDelta, 200);

          return ($.event.dispatch || $.event.handle).apply(this, args);
      }

      function nullLowestDelta() {
          lowestDelta = null;
      }

      function shouldAdjustOldDeltas(orgEvent, absDelta) {
          // If this is an older event and the delta is divisable by 120,
          // then we are assuming that the browser is treating this as an
          // older mouse wheel event and that we should divide the deltas
          // by 40 to try and get a more usable deltaFactor.
          // Side note, this actually impacts the reported scroll distance
          // in older browsers and can cause scrolling to be slower than native.
          // Turn this off by setting $.event.special.mousewheel.settings.adjustOldDeltas to false.
          return special.settings.adjustOldDeltas && orgEvent.type === 'mousewheel' && absDelta % 120 === 0;
      }

  }));
  //
  // Detect CSS transform support
  //
  var transform = (function() {
    var vendors = ['webkit', 'moz', 'ms'];
    var style   = document.createElement( "div" ).style;
    var trans   = 'transform' in style ? 'transform' : undefined;

    for( var i = 0, count = vendors.length; i < count; i++ ) {
      var prop = vendors[i] + 'Transform';
      if( prop in style ) {
        trans = prop;
        break;
      }
    }
    return trans;
  })();

  var Item = function( element, options ) {
    element.item = this;
    this.element = element;

    if( element.tagName === 'IMG' ) {
      this.fullWidth = element.width;
      this.fullHeight = element.height;
    } else {
      element.style.display = "inline-block";
      this.fullWidth = element.offsetWidth;
      this.fullHeight = element.offsetHeight;
    }

    element.style.position = 'absolute';

    if( transform && options.transforms )
      this.element.style[transform + "Origin"] = "0 0";

    this.moveTo = function( x, y, scale ) {
      this.width = this.fullWidth * scale;
      this.height = this.fullHeight * scale;
      this.x = x;
      this.y = y;
      this.scale = scale;

      var style = this.element.style;
      style.zIndex = "" + (scale * 100) | 0;

      if( transform && options.transforms ) {
        style[transform] = "translate(" + x + "px, " + y + "px) scale(" + scale + ")";
      } else {
        // The gap between the image and its reflection doesn't resize automatically
        style.width = this.width + "px";
        style.left = x + "px";
        style.top = y + "px";
      }
    }
  }

  var time = !window.performance || !window.performance.now ?
    function() { return +new Date() } :
    function() { return performance.now() };

  //
  // Detect requestAnimationFrame() support
  //
  // Support legacy browsers:
  //   http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
  //
  var cancelFrame = window.cancelAnimationFrame || window.cancelRequestAnimationFrame;
  var requestFrame = window.requestAnimationFrame;

  (function() {
    var vendors = ['webkit', 'moz', 'ms'];

    for( var i = 0, count = vendors.length; i < count && !cancelFrame; i++ ) {
      cancelFrame = window[vendors[i]+'CancelAnimationFrame'] || window[vendors[i]+'CancelRequestAnimationFrame'];
      requestFrame = requestFrame && window[vendors[i]+'RequestAnimationFrame'];
    }
  }());

  var Carousel = function( element, options ) {
    // console.log('~~~~2',element, options);
    var self = this;
    var $container = $(element);
    this.items = [];
    this.xOrigin = (options.xOrigin === null) ? $container.width()  * 0.5 : options.xOrigin;
    this.yOrigin = (options.yOrigin === null) ? $container.height() * 0.1 : options.yOrigin;
    this.xRadius = (options.xRadius === null) ? $container.width()  / 2.3 : options.xRadius;
    this.yRadius = (options.yRadius === null) ? $container.height() / 6   : options.yRadius;
    this.farScale = options.farScale;
    this.rotation = this.destRotation = Math.PI/2; // start with the first item positioned in front
    this.speed = options.speed;
    this.smooth = options.smooth;
    this.fps = options.fps;
    this.timer = 0;
    this.autoPlayAmount = options.autoPlay;
    this.autoPlayDelay = options.autoPlayDelay;
    this.autoPlayTimer = 0;
    this.onLoaded = options.onLoaded;
    this.onRendered = options.onRendered;

    this.itemOptions = {
      transforms: options.transforms
    }

    $container.css( { position: 'relative', overflow: 'hidden' } );

    // Rotation:
    //  *      0 : right
    //  *   Pi/2 : front
    //  *   Pi   : left
    //  * 3 Pi/2 : back
    this.renderItem = function( itemIndex, rotation ) {
      // console.log('~~~renderItem1:',itemIndex, rotation);
      var item = this.items[itemIndex];
      var sin = Math.sin(rotation);
      var farScale = this.farScale;
      var scale = farScale + ((1-farScale) * (sin+1) * 0.5);
      // console.log('~~~renderItem2:',item);
      
      item.moveTo(
        this.xOrigin + (scale * ((Math.cos(rotation) * this.xRadius) - (item.fullWidth * 0.5))),
        this.yOrigin + (scale * sin * this.yRadius),
        scale
      );
    }

    this.render = function() {
      var count = this.items.length;
      var spacing = 2 * Math.PI / count;
      var radians = this.rotation;
      for( var i = 0; i < count; i++ ) {
        this.renderItem( i, radians );
        radians += spacing;
      }

      if( typeof this.onRendered === 'function' )
        this.onRendered( this );
    }

    this.playFrame = function() {
      var rem = self.destRotation - self.rotation;
      var now = time();
      var dt = (now - self.lastTime) * 0.002;
      self.lastTime = now;

      if( Math.abs(rem) < 0.003 ) {
        self.rotation = self.destRotation;
        self.pause();
      } else {
        // Rotate asymptotically closer to the destination
        self.rotation = self.destRotation - rem / (1 + (self.speed * dt));
        self.scheduleNextFrame();
      }

      self.render();
    }

    this.scheduleNextFrame = function() {
      this.lastTime = time();

      this.timer = this.smooth && cancelFrame ?
        requestFrame( self.playFrame ) :
        setTimeout( self.playFrame, 1000 / this.fps );
    }

    this.itemsRotated = function() {
      return this.items.length * ((Math.PI/2) - this.rotation) / (2*Math.PI);
    }

    this.floatIndex = function() {
      var count = this.items.length;
      var floatIndex = this.itemsRotated() % count;

      // Make sure float-index is positive
      return (floatIndex < 0) ? floatIndex + count : floatIndex;
    }

    this.nearestIndex = function() {
      return Math.round( this.floatIndex() ) % this.items.length;
    }

    this.nearestItem = function() {
      return this.items[this.nearestIndex()];
    }

    this.play = function() {
      if( this.timer === 0 )
        this.scheduleNextFrame();
    }

    this.pause = function() {
      this.smooth && cancelFrame ? cancelFrame( this.timer ) : clearTimeout( this.timer );
      this.timer = 0;
    }

    //
    // Spin the carousel.  Count is the number (+-) of carousel items to rotate
    //
    this.go = function( count ) {
      this.destRotation += (2 * Math.PI / this.items.length) * count;
      this.play();
    }

    this.deactivate = function() {
      this.pause();
      clearInterval( this.autoPlayTimer );
      if( options.buttonLeft ) options.buttonLeft.unbind( 'click' );
      if( options.buttonRight ) options.buttonRight.unbind( 'click' );
      $container.unbind( '.cloud9' );
    }

    this.autoPlay = function() {
      this.autoPlayTimer = setInterval(
        function() { self.go( self.autoPlayAmount ) },
        this.autoPlayDelay
      );
    }

    this.enableAutoPlay = function() {
      // Stop auto-play on mouse over
      $container.bind( 'mouseover.cloud9', function() {
        clearInterval( self.autoPlayTimer );
      } );

      // Resume auto-play when mouse leaves the container
      $container.bind( 'mouseout.cloud9', function() {
        self.autoPlay();
      } );

      this.autoPlay();
    }

    this.bindControls = function() {
      if( options.buttonLeft ) {
        options.buttonLeft.bind( 'click', function() {
          self.go( -1 );
          return false;
        } );
      }

      if( options.buttonRight ) {
        options.buttonRight.bind( 'click', function() {
          self.go( 1 );
          return false;
        } );
      }

      // if( options.mouseWheel ) {
      //   $container.bind( 'mousewheel.cloud9', function( event, delta ) {
      //     self.go( (delta > 0) ? 1 : -1 );
      //     return false;
      //   } );
      // }

      // new case for ww
      if( options.mouseWheel ) {
        var t;
        var tLast = 0;
        var tReset = 120;
        var dt;
        var d = 0;

        $container.bind( 'mousewheel.cloud9', function( event, delta ) {
          // console.log( "====== delta: " + delta )
          t = new Date();
          dt = t - tLast;
          tLast = t;
          // console.log( "=== dt: " + dt )

          if( dt > tReset ) {
            d = 0;
            self.go( (delta > 0) ? 1 : -1 );
          } else {
            d += Math.log( Math.abs( delta ) * 20 );

            if( Math.abs( d ) > 40 ) {
              d = 0;
              self.go( (delta > 0) ? 1 : -1 );
            }
          }

          return false;
        } );
      }

      if( options.bringToFront ) {
        $container.bind( 'click.cloud9', function( event ) {
          var hits = $(event.target).closest( '#' + options.itemClass );
          // var hits = $(event.target).closest( '.' + options.itemClass );
          if( hits.length !== 0 ) {
            var idx = self.items.indexOf( hits[0].item );
            var count = self.items.length;
            var diff = idx - (self.floatIndex() % count);

            // Normalise "diff" to represent the shortest way to rotate item to front
            if( 2 * Math.abs(diff) > count )
              diff += (diff > 0) ? -count : count;

            // Suppress default browser action if the item isn't roughly in front
            if( Math.abs(diff) > 0.5 )
              event.preventDefault();

            // Halt any rotation already in progress
            self.destRotation = self.rotation;

            self.go( -diff );
          }
        } );
      }
    }

    // var items = $container.find( '.' + options.itemClass );
    var items = $container.children();
    // console.log("~~~~:items", items);
    this.finishInit = function() {
      //
      // Wait until all images have completely loaded
      //
      for( var i = 0; i < items.length; i++ ) {
        var item = items[i];
        if( (item.tagName === 'IMG') &&
            ((item.width === undefined) || ((item.complete !== undefined) && !item.complete)) )
          return;
      }

      clearInterval( this.initTimer );

      // Init items
      for( i = 0; i < items.length; i++ )
        this.items.push( new Item( items[i], this.itemOptions ) );

      // Disable click-dragging of items
      $container.bind( 'mousedown onselectstart', function() { return false } );

      if( this.autoPlayAmount !== 0 ) this.enableAutoPlay();
      this.bindControls();
      this.render();

      if( typeof this.onLoaded === 'function' )
        this.onLoaded( this );
    };

    this.initTimer = setInterval( function() { self.finishInit() }, 50 );
  }

  //
  // The jQuery plugin
  //
  $.fn.Cloud9Carousel = function( options ) {
    return this.each( function() {
      options = $.extend( {
        xOrigin: null,        // null: calculated automatically
        yOrigin: null,
        xRadius: null,
        yRadius: null,
        farScale: 0.5,        // scale of the farthest item
        transforms: true,     // enable CSS transforms
        smooth: true,         // enable smooth animation via requestAnimationFrame()
        fps: 30,              // fixed frames per second (if smooth animation is off)
        speed: 4,             // positive number
        autoPlay: 0,          // [ 0: off | number of items (integer recommended, positive is clockwise) ]
        autoPlayDelay: 4000,
        bringToFront: false,
        itemClass: 'cloud9-item',
        handle: 'carousel'
      }, options );
      $(this).data( options.handle, new Carousel( this, options ) );
    } );
  }
})(jQuery)

export default jQuery;
