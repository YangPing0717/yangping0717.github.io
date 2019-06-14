(function ($) {

	var DEFAULT_SETTINGS = {
		overlayBgColor: '#000',
		overlayBgOpacity: 0.8,
		initialBoxWidthPercent: 0.1,
		initialBoxHeightPercent: 0.1,
		setBoxWidthPercent: 0.85,
		setBoxHeightPercent: 0.85,
		maxBoxWidth: 560,
		maxBoxHeightPercent: 0.85,
		sendData: {},
		contentUrl: '',
		contentHtml: '',
		easyClose: true,
		onShown: function() {},
		onHide: function() {}
	};
	
	var LIGHTBOX_DATA_NAME = 'light_box';

	var LightBox = function(settings, callback) {
		this.settings = settings;
		this.callback = callback;		
	}

	LightBox.prototype = {
		create: function() {

			// 取得頁面寬度高度
			var w = window,
			d = document,
			e = d.documentElement,
			g = d.getElementsByTagName('body')[0],
			x = w.innerWidth || e.clientWidth || g.clientWidth,
			y = w.innerHeight|| e.clientHeight|| g.clientHeight;
			var boxWidth = Math.floor(x * this.settings.initialBoxWidthPercent);	
			var boxHeight = Math.floor(y * this.settings.initialBoxHeightPercent);
			
			var overlayCss = {
				'position':'fixed',
				'width':'100%',
				'height':'100%',
				'top':'0',
				'left':'0',
				'margin':'0',
				'overflow':'hidden',
				'z-index': '1038',
				'background': 'url(include/img/loading.gif) ' + this.settings.overlayBgColor + ' no-repeat center center'
			};
			var boxCss = {
				'position':'fixed',
				'top':'50%',
				'left':'50%',
				'overflow-x': 'hidden',
				'overflow-y': 'auto',
				'z-index': '1039',
				'background': 'url(include/img/lightpaperfibers.png) repeat #f7f7f7',
				'-webkit-box-shadow': '1px 0px 20px 0px rgba(255, 255, 255, 0.8)',
				'-moz-box-shadow': '1px 0px 20px 0px rgba(255, 255, 255, 0.8)',
				'box-shadow': '1px 0px 20px 0px rgba(255, 255, 255, 0.8)',
				'box-sizing': 'content-box',
				'-webkit-box-sizing': 'content-box'
			};

			if ($('#lightbox-overlay').length != 1) {
				$('#lightbox-overlay').remove();
				$('<div></div>').attr('id', 'lightbox-overlay').css(overlayCss).css({
					'-moz-opacity': this.settings.overlayBgOpacity,
					'-khtml-opacity': this.settings.overlayBgOpacity,
					'opacity': this.settings.overlayBgOpacity,
					'-ms-filter': '"progid:DXImageTransform.Microsoft.Alpha"(Opacity=' + (this.settings.overlayBgOpacity * 100) + ')',
					'filter': 'progid:DXImageTransform.Microsoft.Alpha(opacity=' + (this.settings.overlayBgOpacity * 100) + ')',
					'filter':'alpha(opacity=' + (this.settings.overlayBgOpacity * 100) + ')'
				}).appendTo('body');
			}
			else {
				$('#lightbox-overlay').css(overlayCss);
			}

			if ($('#lightbox').length != 1) {
				$('#lightbox').remove();
				$('<div></div>').attr('id', 'lightbox').addClass('container').css(boxCss).css({
					'width': boxWidth + 'px',
					'height': boxHeight + 'px',
					'margin-top': '-' + Math.ceil(boxHeight / 2) + 'px',
					'margin-left': '-' + Math.ceil(boxWidth / 2) + 'px',
					'-moz-opacity': '0.00',
					'-khtml-opacity': '0.00',
					'opacity': '0.00',
					'-ms-filter': '"progid:DXImageTransform.Microsoft.Alpha"(Opacity=0)',
					'filter': 'progid:DXImageTransform.Microsoft.Alpha(opacity=0)',
					'filter': 'alpha(opacity=0)'
				}).appendTo('body');
			}
			else {
				$('#lightbox').addClass('container').css(boxCss);
			}
			
			$('#lightbox > .window-content').html('<div class="text-center text-muted">加载中...</div>');

			if (this.settings.contentUrl != '') {
				var _this = this;

				$.ajax({
					url: _this.settings.contentUrl,
					type: 'GET',
					dataType: 'html',
					data: _this.settings.sendData,
					success: function(r) {
						$('#lightbox').html(r).waitForImages(function() {
							_this.resize(function() {
								_this.show();
								_this.resize();
							});	
						});
					}
				});
			}
			else { if (this.settings.contentHtml != '') {
				var _this = this;
				$('#lightbox').html(this.settings.contentHtml);
				_this.resize(function() {
					_this.show();
					_this.resize();
				});
			}}
		},

		show: function() {
			var _this = this;
			$('#lightbox').animate({
				'-moz-opacity': '1',
				'-khtml-opacity': '1',
				'opacity': '1',
				'-ms-filter': '"progid:DXImageTransform.Microsoft.Alpha"(Opacity=100)',
				'filter': 'progid:DXImageTransform.Microsoft.Alpha(opacity=100)',
				'filter': 'alpha(opacity=100)',
			}, 300, function() {
				$('body').css('overflow', 'hidden');
				$('#btn-lightbox-close').click(function() {
					_this.destroy();				
				});
				if (_this.settings.easyClose) {
					$('#lightbox-overlay').click(function() {
						_this.destroy();				
					});
				}
				$('#lightbox-overlay').css('background-image', 'none');

				if (typeof(_this.settings.onShown) == 'function') {
					_this.settings.onShown();
				}
			});
		},

		resize: function(complete) {
			var _this = this;

			// 取得頁面寬度高度
			var w = window,
			d = document,
			e = d.documentElement,
			g = d.getElementsByTagName('body')[0],
			x = w.innerWidth || e.clientWidth || g.clientWidth,
			y = w.innerHeight|| e.clientHeight|| g.clientHeight;
			var boxWidth = Math.floor(x * this.settings.setBoxWidthPercent);	
			var boxHeight = Math.floor(y * this.settings.setBoxBoxHeightPercent);
			var maxWidth = this.settings.maxBoxWidth;
			var maxHeight = Math.floor(y * this.settings.maxBoxHeightPercent);

			if (boxWidth > maxWidth) { boxWidth = maxWidth; }
			if (boxHeight > maxHeight) { boxHeight = maxHeight; }

			var newHeight = $('#lightbox > .window-menu').eq(0).outerHeight() + $('#lightbox > .window-content').eq(0).outerHeight();

			if (newHeight > maxHeight) { newHeight = maxHeight; }

			var boxPadding = 0;
			if (typeof($('#lightbox').css('padding-left')) != 'undefined') {
				boxPadding += parseInt($('#lightbox').css('padding-left').replace('px', ''));
			}
			if (typeof($('#lightbox').css('padding-right')) != 'undefined') {
				boxPadding += parseInt($('#lightbox').css('padding-right').replace('px', ''));
			}

			$('#lightbox').css({
				'width': boxWidth + 'px',
				'margin-left': '-' + Math.ceil((boxWidth + boxPadding) / 2) + 'px',
				'height': newHeight + 'px',
				'margin-top': '-' + Math.ceil(newHeight / 2) + 'px'				
			}).scrollTop(0);

			if (typeof(complete) == 'function') { complete(); }			
		},

		destroy: function() {			
			$('body').css('overflow', 'auto');
			$('#lightbox-overlay, #lightbox').remove();
			if (typeof(this.settings.onHide) == 'function') {
				this.settings.onHide();
			}
		}
	}

	var initial = function(options, callback) {
		var settings = $.extend(DEFAULT_SETTINGS, options);
		var light_box = new LightBox(settings, callback);
		$(window).data(LIGHTBOX_DATA_NAME, light_box);
		light_box.create();
	}

	var callMethod = function(methodName) {
		if (!(methodName in LightBox.prototype)) {
			$.error('Method ' + methodName + ' does not exist on jQuery.lightbox');
		}
		else {
			var light_box = $(window).data(LIGHTBOX_DATA_NAME);
			if (!light_box) {
				// This element hasn't had pie timer constructed yet, so skip it
				return true;
			}
			else {
				return light_box[methodName]();
			}
		}
	};

	$.lightbox = function(options) {
		if (typeof options === 'object' || !options) {
			return initial.apply(this, arguments);
		} else {
			return callMethod.apply(this, arguments);
		}
	}
})(jQuery);

/*! waitForImages jQuery Plugin - v2.0.2 - 2015-06-02
* https://github.com/alexanderdickson/waitForImages
* Copyright (c) 2015 Alex Dickson; Licensed MIT */
;(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // CommonJS / nodejs module
        module.exports = factory(require('jquery'));
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {
    // Namespace all events.
    var eventNamespace = 'waitForImages';

    // CSS properties which contain references to images.
    $.waitForImages = {
        hasImageProperties: [
            'backgroundImage',
            'listStyleImage',
            'borderImage',
            'borderCornerImage',
            'cursor'
        ],
        hasImageAttributes: ['srcset']
    };

    // Custom selector to find all `img` elements with a valid `src` attribute.
    $.expr[':']['has-src'] = function (obj) {
        // Ensure we are dealing with an `img` element with a valid
        // `src` attribute.
        return $(obj).is('img[src][src!=""]');
    };

    // Custom selector to find images which are not already cached by the
    // browser.
    $.expr[':'].uncached = function (obj) {
        // Ensure we are dealing with an `img` element with a valid
        // `src` attribute.
        if (!$(obj).is(':has-src')) {
            return false;
        }

        return !obj.complete;
    };

    $.fn.waitForImages = function () {

        var allImgsLength = 0;
        var allImgsLoaded = 0;
        var deferred = $.Deferred();

        var finishedCallback;
        var eachCallback;
        var waitForAll;

        // Handle options object (if passed).
        if ($.isPlainObject(arguments[0])) {

            waitForAll = arguments[0].waitForAll;
            eachCallback = arguments[0].each;
            finishedCallback = arguments[0].finished;

        } else {

            // Handle if using deferred object and only one param was passed in.
            if (arguments.length === 1 && $.type(arguments[0]) === 'boolean') {
                waitForAll = arguments[0];
            } else {
                finishedCallback = arguments[0];
                eachCallback = arguments[1];
                waitForAll = arguments[2];
            }

        }

        // Handle missing callbacks.
        finishedCallback = finishedCallback || $.noop;
        eachCallback = eachCallback || $.noop;

        // Convert waitForAll to Boolean
        waitForAll = !! waitForAll;

        // Ensure callbacks are functions.
        if (!$.isFunction(finishedCallback) || !$.isFunction(eachCallback)) {
            throw new TypeError('An invalid callback was supplied.');
        }

        this.each(function () {
            // Build a list of all imgs, dependent on what images will
            // be considered.
            var obj = $(this);
            var allImgs = [];
            // CSS properties which may contain an image.
            var hasImgProperties = $.waitForImages.hasImageProperties || [];
            // Element attributes which may contain an image.
            var hasImageAttributes = $.waitForImages.hasImageAttributes || [];
            // To match `url()` references.
            // Spec: http://www.w3.org/TR/CSS2/syndata.html#value-def-uri
            var matchUrl = /url\(\s*(['"]?)(.*?)\1\s*\)/g;

            if (waitForAll) {

                // Get all elements (including the original), as any one of
                // them could have a background image.
                obj.find('*').addBack().each(function () {
                    var element = $(this);

                    // If an `img` element, add it. But keep iterating in
                    // case it has a background image too.
                    if (element.is('img:has-src')) {
                        allImgs.push({
                            src: element.attr('src'),
                            element: element[0]
                        });
                    }

                    $.each(hasImgProperties, function (i, property) {
                        var propertyValue = element.css(property);
                        var match;

                        // If it doesn't contain this property, skip.
                        if (!propertyValue) {
                            return true;
                        }

                        // Get all url() of this element.
                        while (match = matchUrl.exec(propertyValue)) {
                            allImgs.push({
                                src: match[2],
                                element: element[0]
                            });
                        }
                    });

                    $.each(hasImageAttributes, function (i, attribute) {
                        var attributeValue = element.attr(attribute);
                        var attributeValues;

                        // If it doesn't contain this property, skip.
                        if (!attributeValue) {
                            return true;
                        }

                        // Check for multiple comma separated images
                        attributeValues = attributeValue.split(',');

                        $.each(attributeValues, function(i, value) {
                            // Trim value and get string before first
                            // whitespace (for use with srcset).
                            value = $.trim(value).split(' ')[0];
                            allImgs.push({
                                src: value,
                                element: element[0]
                            });
                        });
                    });
                });
            } else {
                // For images only, the task is simpler.
                obj.find('img:has-src')
                    .each(function () {
                    allImgs.push({
                        src: this.src,
                        element: this
                    });
                });
            }

            allImgsLength = allImgs.length;
            allImgsLoaded = 0;

            // If no images found, don't bother.
            if (allImgsLength === 0) {
                finishedCallback.call(obj[0]);
                deferred.resolveWith(obj[0]);
            }

            $.each(allImgs, function (i, img) {

                var image = new Image();
                var events =
                  'load.' + eventNamespace + ' error.' + eventNamespace;

                // Handle the image loading and error with the same callback.
                $(image).one(events, function me (event) {
                    // If an error occurred with loading the image, set the
                    // third argument accordingly.
                    var eachArguments = [
                        allImgsLoaded,
                        allImgsLength,
                        event.type == 'load'
                    ];
                    allImgsLoaded++;

                    eachCallback.apply(img.element, eachArguments);
                    deferred.notifyWith(img.element, eachArguments);

                    // Unbind the event listeners. I use this in addition to
                    // `one` as one of those events won't be called (either
                    // 'load' or 'error' will be called).
                    $(this).off(events, me);

                    if (allImgsLoaded == allImgsLength) {
                        finishedCallback.call(obj[0]);
                        deferred.resolveWith(obj[0]);
                        return false;
                    }

                });

                image.src = img.src;
            });
        });

        return deferred.promise();

    };
}));