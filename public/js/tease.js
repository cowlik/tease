var Tease = Tease || {};

/*
 *
 * Tease
 *
 */

Tease = {
    VIEWPORT_MIN: 320,
    VIEWPORT_MED: 760,
    VIEWPORT_MAX: 1200,
    SPACING_MIN: 20,
    SPACING_MAX: 40,
    currPage: '',
    isMobileDevice: false,
    isTouchDevice: false,
    init: function() {
        var tease = this;

        tease.currPage = Tease.Utils.getPageName().toLowerCase();

        if (tease.Utils.isMobileDevice()) {
            tease.isMobileDevice = true;
            tease.Utils.addCSSClass(document.getElementsByTagName('html')[0], 'mobile');
        }

        if (tease.Utils.isTouchDevice()) {
            tease.isTouchDevice = true;
            tease.Utils.addCSSClass(document.getElementsByTagName('html')[0], 'touch');
        }

        //tease.nav = new tease.Nav();
    }
};

$(function() {
    Tease.init();
});


/*
 *
 * map
 *
 */

Tease.Map = function(elem) {
    var map = this;

        map.elem = elem;
        map.center = { lat: 47.6677807505495, lng: -122.37450279999996 };
        map.styles = [ { "elementType": "geometry", "stylers": [ { "color": "#f5f5f5" } ] }, { "elementType": "labels.icon", "stylers": [ { "visibility": "off" } ] }, { "elementType": "labels.text.fill", "stylers": [ { "color": "#616161" } ] }, { "elementType": "labels.text.stroke", "stylers": [ { "color": "#f5f5f5" } ] }, { "featureType": "administrative.land_parcel", "elementType": "labels.text.fill", "stylers": [ { "color": "#bdbdbd" } ] }, { "featureType": "poi", "elementType": "geometry", "stylers": [ { "color": "#eeeeee" } ] }, { "featureType": "poi", "elementType": "labels.text.fill", "stylers": [ { "color": "#757575" } ] }, { "featureType": "poi.park", "elementType": "geometry", "stylers": [ { "color": "#e5e5e5" } ] }, { "featureType": "poi.park", "elementType": "labels.text.fill", "stylers": [ { "color": "#9e9e9e" } ] }, { "featureType": "road", "elementType": "geometry", "stylers": [ { "color": "#ffffff" } ] }, { "featureType": "road.arterial", "elementType": "labels.text.fill", "stylers": [ { "color": "#757575" } ] }, { "featureType": "road.highway", "elementType": "geometry", "stylers": [ { "color": "#dadada" } ] }, { "featureType": "road.highway", "elementType": "labels.text.fill", "stylers": [ { "color": "#616161" } ] }, { "featureType": "road.local", "elementType": "labels.text.fill", "stylers": [ { "color": "#9e9e9e" } ] }, { "featureType": "transit.line", "elementType": "geometry", "stylers": [ { "color": "#e5e5e5" } ] }, { "featureType": "transit.station", "elementType": "geometry", "stylers": [ { "color": "#eeeeee" } ] }, { "featureType": "water", "elementType": "geometry", "stylers": [ { "color": "#c9c9c9" } ] }, { "featureType": "water", "elementType": "labels.text.fill", "stylers": [ { "color": "#9e9e9e" } ] } ];
        map.zoom = function() { return (Tease.Utils.getViewportBreakpoint() >= Tease.VIEWPORT_MED) ? 15 : 14; };

        map.init();
};

Tease.Map.prototype = {
    init: function() {
        var map = this,
            googleMap = new google.maps.Map(map.elem, {
                center: map.center,
                disableDefaultUI: true,
                scrollwheel: false,
                styles: map.styles,
                zoom: map.zoom()
            }),
            googleMarker = new google.maps.Marker({
                icon: {
                    //scaledSize: new google.maps.Size(46,40),
                    scaledSize: new google.maps.Size(35,30),
                    url: "../imgs/heart.svg"
                },
                map: googleMap,
                position: map.center
            });

        google.maps.event.addListener(googleMap, "resize", function() {
            googleMap.setCenter(map.center);
            googleMap.setZoom(map.zoom());
        });

        $(window).resize(function(event) {
            google.maps.event.trigger(googleMap, "resize");
        })
    }
};


/*
 *
 * modal
 *
 */

Tease.Modal = function() {
    var modal = this;

    modal.elem = document.getElementById('modal');
    modal.openBtns = document.querySelectorAll('.modal-open-btn');
    modal.closeBtns = document.querySelectorAll('.modal-close-btn');
    modal.selectedElem = null;
    modal.selectedClass = '';

    modal.init();
};

Tease.Modal.prototype = {
    init: function() {
        var modal = this;

        // open btns
        for (var i = 0; i < modal.openBtns.length; i++) {
            $(modal.openBtns[i]).on('click', function(event) {
                var id = $(this).data('modal'),
                    hash = $(this).data('hash');

                event.preventDefault();
                event.stopPropagation();

                modal.open(id, hash);
            });
        }

        // close btns
        for (var j = 0; j < modal.closeBtns.length; j++) {
            $(modal.closeBtns[j]).on('click', function(event) {
                event.preventDefault();
                event.stopPropagation();

                modal.checkHash();
            });
        }

        $(modal.elem).on('click', function(event) {
            modal.checkHash();
        });

        window.addEventListener('hashchange', function(event) {
            var hash = window.location.hash;

            if (hash == '' || hash == '#') {
                modal.close();
            }
        });
    },
    checkHash: function() {
        var modal = this,
            hash = window.location.hash;

        if (hash == '' || hash == '#') {
            modal.close();
        } else {
            window.location.hash = '';
        }
    },
    open: function(id, hash) {
        var modal = this;

        if (hash) {
            window.location.hash = hash;
        }

        modal.selectedElem = document.getElementById(id);
        modal.selectedClass = (modal.selectedElem.className != '') ? modal.selectedElem.className + '-selected' : id + '-selected';

        tease.Utils.addCSSClass(modal.elem, 'modal-open');

        if (id == 'nav') {
            tease.Utils.addCSSClass(modal.selectedElem, modal.selectedClass);
        }

        window.setTimeout(function(event) {
            window.scrollTo(0, 0);

            tease.Utils.addCSSClass(modal.elem, 'modal-visible');

            if (id != 'nav') {
                tease.Utils.addCSSClass(modal.selectedElem, modal.selectedClass);
            }
        }, 300);
    },
    close: function() {
        var modal = this;

        tease.Utils.transitionEndListener(modal.elem, function() {
            tease.Utils.removeCSSClass(modal.elem, 'modal-visible');
            tease.Utils.removeCSSClass(modal.selectedElem, modal.selectedClass);

            modal.selectedElem = null;
            modal.selectedClass = '';
        });

        tease.Utils.removeCSSClass(modal.elem, 'modal-open');
    }
};


/*
 *
 * nav
 *
 */

Tease.Nav = function() {
    var nav = this;

    nav.elem = document.getElementById('nav');
    nav.itemElems = nav.elem.getElementsByTagName('li');

    nav.init();
};

Tease.Nav.prototype = {
    init: function() {
        var nav = this;

        // menu btns
        for (var i = 0; i < nav.itemElems.length; i++) {
            var itemBtn = nav.itemElems[i].getElementsByTagName('a');

            $(itemBtn).on('touchstart click', { id: i }, function(event) {
                event.stopPropagation();
                tease.Utils.addCSSClass(nav.itemElems[event.data.id], 'nav-item-selected');
            });

            $(itemBtn).on('touchend', { id: i }, function(event) {
                event.stopPropagation();
                tease.Utils.removeCSSClass(nav.itemElems[event.data.id], 'nav-item-selected');
            });
        }
    }
};


/*
 *
 * utils
 *
 */

Tease.Utils = {
    getViewportBreakpoint: function() {
        var windowWidth = window.innerWidth || $(window).width(),
            breakpoint = Tease.VIEWPORT_MIN;

        if (windowWidth >= Tease.VIEWPORT_MED && windowWidth < Tease.VIEWPORT_MAX) {
            breakpoint = Tease.VIEWPORT_MED;
        } else if (windowWidth >= Tease.VIEWPORT_MAX) {
            breakpoint = Tease.VIEWPORT_MAX;
        }

        return breakpoint;
    },
    getPageName: function() {
        var fileName = window.location.pathname.substring(location.pathname.lastIndexOf("/") + 1);

        return fileName.substr(0, fileName.lastIndexOf('.'));
    },
    getQueryValue: function(query) {
        query = query.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");

        var regex = new RegExp("[\\?&]" + query + "=([^&#]*)"),
            value = regex.exec(location.search);

        return value === null ? "" : decodeURIComponent(value[1].replace(/\+/g, " "));
    },
    hasCSSClass: function(elem, className) {
        return (' ' + elem.className + ' ').indexOf(' ' + className + ' ') > -1;
    },
    addCSSClass: function(elem, className) {
        if (document.documentElement.classList) {
            elem.classList.add(className);
        } else {
            elem.className += ' ' + className;
        }
    },
    removeCSSClass: function(elem, className) {
        if (document.documentElement.classList) {
            elem.classList.remove(className);
        } else {
            elem.className = elem.className.replace(new RegExp('(\\s|^)' + className + '(\\s|$)'), '');
        }
    },
    removeCSSClassByPrefix: function(elem, classPrefix) {
        var classes = elem.className.split(' ').filter(function(c) {
            return c.lastIndexOf(classPrefix, 0) !== 0;
        });

        elem.className = $.trim(classes.join(' '));
    },
    getCSSPropValue: function(elem, prop) {
        var style = window.getComputedStyle(elem);
        return style.getPropertyValue(prop);
    },
    isTouchDevice: function() {
        return (('ontouchstart' in window) || (navigator.MaxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0));
    },
    isMobileDevice: function() {
        var isMobile = false,
            userAgent = navigator.userAgent || navigator.vendor || window.opera;

        if (/android/i.test(userAgent)) {
            isMobile = true;
        }

        if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
            isMobile = true;
        }

        return isMobile;
    },
    hasCanvasSupport: function() {
        var elem = document.createElement('canvas');
        return !!(elem.getContext && elem.getContext('2d'));
    },
    hasTransitionSupport: function() {
        /*
     	 * check if browser supports CSS Transitions
     	 */
        var s = document.createElement('p').style, // 's' for style. better to create an element if body yet to exist
			v = ['ms', 'O', 'Moz', 'Webkit']; // 'v' for vendor

        if (s.transition === '') return true; // check first for prefeixed-free support
        while (v.length) // now go over the list of vendor prefixes and check support until one is found
            if (v.pop() + 'Transition' in s)
                return true;
        return false;
    },
    has3DSupport: function() {
        var el = document.createElement('p'),
		 	has3d,
			transforms = {
			    'webkitTransform': '-webkit-transform',
			    'OTransform': '-o-transform',
			    'msTransform': '-ms-transform',
			    'MozTransform': '-moz-transform',
			    'transform': 'transform'
			};

        // Add it to the body to get the computed style
        document.body.insertBefore(el, null);

        for (var t in transforms) {
            if (el.style[t] !== undefined) {
                el.style[t] = 'translate3d(1px,1px,1px)';
                has3d = window.getComputedStyle(el).getPropertyValue(transforms[t]);
            }
        }

        document.body.removeChild(el);

        return (has3d !== undefined && has3d.length > 0 && has3d !== 'none');
    },
    applyCSSTransforms: function(elem, props) {
        var transforms = {
            'webkitTransform': '-webkit-transform',
            'OTransform': '-o-transform',
            'msTransform': '-ms-transform',
            'MozTransform': '-moz-transform',
            'transform': 'transform'
        };

        for (var t in transforms) {
            elem.style[t] = props;
        }
    },
    transitionEndListener: function(elem, callback, params) {
        var base = this,
			transitionEvent = base.getTransitionEvent();

        //listener for onComplete CSS transitions
        if (tease.Utils.hasTransitionSupport) {
            onTransitionComplete = function(event) {
                elem.removeEventListener(transitionEvent, onTransitionComplete, false);
                callback(params);
            };
            elem.addEventListener(transitionEvent, onTransitionComplete, false);
        } else {
            callback(params);
        }
    },
    getTransitionEvent: function() {
        var t,
			elem = document.createElement('fake-elem'),
			transitions = {
			    'transition': 'transitionend',
			    'OTransition': 'oTransitionEnd',
			    'MozTransition': 'transitionend',
			    'WebkitTransition': 'webkitTransitionEnd'
			};

        for (t in transitions) {
            if (elem.style[t] !== undefined) {
                return transitions[t];
            }
        }
    },
    nextElementSibling: function(elem) {
        // IE8 fallback for nextElementSibling selector
        do { elem = elem.nextSibling; } while (elem && elem.nodeType !== 1);
        return elem;
    },
    previousElementSibling: function(elem) {
        // IE8 fallback for previousElementSibling selector
        do { elem = elem.previousSibling; } while (elem && elem.nodeType !== 1);
        return elem;
    },
    isNumber: function(number) {
        return number === parseFloat(number);
    },
    isEven: function(number) {
        return tease.Utils.isNumber(number) && (number % 2 === 0);
    },
    isOdd: function(number) {
        return tease.Utils.isNumber(number) && (Math.abs(number) % 2 == 1);
    },
    hasSVGSupport: function() {
        return !!document.createElementNS && !!document.createElementNS('http://www.w3.org/2000/svg', "svg").createSVGRect;
    },
    replaceSVGImgs: function() {
        var elems = document.getElementsByTagName("img");

        if (!elems.length) {
            elems = document.getElementsByTagName("IMG");
        }

        for (var i = 0, n = elems.length; i < n; i++) {
            var img = elems[i],
                src = img.getAttribute("src");

            if (src.match(/svgz?$/)) {
                /* URL ends in svg or svgz */
                img.setAttribute("src", img.getAttribute("data-no-svg"));
            }
        }
    }
};