(function() {
  "use strict";
  var namespace = function(name) {
    if (! (name in window)) {
      return window[name] = {};
    }
  }
  window['namespace'] = namespace;
}(this));
/*! A fix for the iOS orientationchange zoom bug.
  Script by @scottjehl, rebound by @wilto.
  MIT / GPLv2 License.
  */

(function(w){

  // This fix addresses an iOS bug, so return early if the UA claims it's something else.
  var ua = navigator.userAgent;
  if( !( /iPhone|iPad|iPod/.test( navigator.platform ) && /OS [1-5]_[0-9_]* like Mac OS X/i.test(ua) && ua.indexOf( "AppleWebKit" ) > -1 ) ){
    return;
  }

  var doc = w.document;

  if( !doc.querySelector ){ return; }

  var meta = doc.querySelector( "meta[name=viewport]" ),
  initialContent = meta && meta.getAttribute( "content" ),
  disabledZoom = initialContent + ",maximum-scale=1",
  enabledZoom = initialContent + ",maximum-scale=10",
  enabled = true,
  x, y, z, aig;

  if( !meta ){ return; }

  function restoreZoom(){
    meta.setAttribute( "content", enabledZoom );
    enabled = true;
  }

  function disableZoom(){
    meta.setAttribute( "content", disabledZoom );
    enabled = false;
  }

  function checkTilt( e ){
    aig = e.accelerationIncludingGravity;
    x = Math.abs( aig.x );
    y = Math.abs( aig.y );
    z = Math.abs( aig.z );

    // If portrait orientation and in one of the danger zones
    if ( (!w.orientation || w.orientation === 180) && ( x > 7 || ( ( z > 6 && y < 8 || z < 8 && y > 6 ) && x > 5 ) ) ){
      if ( enabled ) {
        disableZoom();
      }
    }
    else if( !enabled ){
      restoreZoom();
    }
  }

  w.addEventListener( "orientationchange", restoreZoom, false );
  w.addEventListener( "devicemotion", checkTilt, false );

})(this);
/*
 * Natural Sort algorithm for Javascript - Version 0.6 - Released under MIT license
 * Author: Jim Palmer (based on chunking idea from Dave Koelle)
 * Contributors: Mike Grier (mgrier.com), Clint Priest, Kyle Adams, guillermo
 */

function naturalSort(a, b) {
  var re = /(^-?[0-9]+(\.?[0-9]*)[df]?e?[0-9]?$|^0x[0-9a-f]+$|[0-9]+)/gi,
    sre = /(^[ ]*|[ ]*$)/g,
    dre = /(^([\w ]+,?[\w ]+)?[\w ]+,?[\w ]+\d+:\d+(:\d+)?[\w ]?|^\d{1,4}[\/\-]\d{1,4}[\/\-]\d{1,4}|^\w+, \w+ \d+, \d{4})/,
    hre = /^0x[0-9a-f]+$/i,
    ore = /^0/,
    // convert all to strings and trim()
    x = a.toString().replace(sre, '') || '',
    y = b.toString().replace(sre, '') || '',
    // chunk/tokenize
    xN = x.replace(re, '\0$1\0').replace(/\0$/,'').replace(/^\0/,'').split('\0'),
    yN = y.replace(re, '\0$1\0').replace(/\0$/,'').replace(/^\0/,'').split('\0'),
    // numeric, hex or date detection
    xD = parseInt(x.match(hre)) || (xN.length != 1 && x.match(dre) && Date.parse(x)),
    yD = parseInt(y.match(hre)) || xD && y.match(dre) && Date.parse(y) || null;
  // first try and sort Hex codes or Dates
  if (yD) {
    if ( xD < yD ) {
      return -1;
    } else if ( xD > yD ) {
      return 1;
    }
  }
  // natural sorting through split numeric strings and default strings
  for (var cLoc=0, numS=Math.max(xN.length, yN.length); cLoc < numS; cLoc++) {
    // find floats not starting with '0', string or 0 if not defined (Clint Priest)
    oFxNcL = !(xN[cLoc] || '').match(ore) && parseFloat(xN[cLoc]) || xN[cLoc] || 0;
    oFyNcL = !(yN[cLoc] || '').match(ore) && parseFloat(yN[cLoc]) || yN[cLoc] || 0;
    // handle numeric vs string comparison - number < string - (Kyle Adams)
    if (isNaN(oFxNcL) !== isNaN(oFyNcL)) {
      return (isNaN(oFxNcL)) ? 1 : -1;
    // rely on string comparison if different types - i.e. '02' < 2 != '02' < '2'
    } else if (typeof oFxNcL !== typeof oFyNcL) {
      oFxNcL += '';
      oFyNcL += '';
    }
    if (oFxNcL < oFyNcL) {
      return -1;
    }
    if (oFxNcL > oFyNcL) {
      return 1;
    }
  }
  return 0;
}
;
(function($) {
  "use strict";
  namespace('Mp');
  namespace('Mp.Ajax');

  Mp.AjaxQueuer = (function() {
    function Queuer(element) {
      this.element = $(element);
    }

    Queuer.prototype.enqueue = function(options) {
      var success = options.success;
      this.element.queue(function(next) {
        options.success = function() {
          if (success) {
            success.apply(this, arguments);
          }
          next();
        };

        $.ajax(options);
      });
    };

    return Queuer;
  }());

  Mp.searchAsYouType = (function() {
    var Suggest = function(element, options) {
      var self = this;
      this.element = $(element);
      if (this.element.size() == 0) {
        return;
      }

      if (! 'suggestion_instances' in Mp) {
        Mp.suggestion_instances = -1;
      };
      Mp.suggestion_instances += 1;

      this._id = Mp.suggestion_instances;
      this.focused = -1;
      this.current_suggestions = [];

      this.options = $.extend({
        limit: false,
        source: this.element.data('source') || [],
        remote: false,
        onShow: $.noop,
        onHide: $.noop,
        onNoResults: self.hide,
        onSetup: $.noop,
        itemTemplate: function(item) {
          return '<li><a href="'+ item.href +'">'+ item.name +'</a></li>';
        },
        sortFunction: this.defaultSortFunction,
        inlined: false
      }, options || {});

      this.setup();
    };

    Suggest.prototype.defaultSortFunction = function(one, other) {
      return one.name.search(this.query()) > other.name.search(this.query()) ? 1 : -1;
    };

    Suggest.prototype.setup = function() {
      if (typeof this.options.source === 'function') {
        var self = this;
        setTimeout(function() {
          self.options.source.call(self);
        }, 20);
      } else {
        this.source = this.options.source;
      }

      this.container = $('<div id="suggestions-'+ this._id +'" class="suggestions" style="display:none;position:absolute;"></div>');

      if (!this.options.inlined) {
        this.container.css({
          width: this.element.outerWidth() + 'px'
        });

        var $body = $('body');
        this.offsets = {
          x: parseInt($body.css('paddingLeft'), 10),
          y: parseInt($body.css('paddingTop'), 10) + this.element.outerHeight()
        };
        $body.append(this.container);
      } else {
        this.offsets = { x: 0, y: 0 };
        this.element.parent('form').append(this.container);
      }

      this.setupListeners();
      this.options.onSetup.call(this);
    };

    Suggest.prototype.setupListeners = function() {
      var self = this,
          namespaced = function(event) {
            return event +'.autocomplete'+ self._id;
          };
      this.element.bind(namespaced('keydown'), function(e) {
        var func = self.movementKeys[e.keyCode.toString()];

        if (typeof func === 'function') {
          func.call(self, e);
        }
      });

      this.element.bind(namespaced('keyup'), function(e) {
        if (typeof self.movementKeys[e.keyCode.toString()] !== 'undefined') {
          e.preventDefault();
          return;
        }
        self._query = null;
        self.search(self.query());
      });

      this.element.bind(namespaced('focus'), function() {
        if (self.query() !== '') {
          self.search(self.query());
        }
      });

      this.element.bind(namespaced('blur'), function() {
        self.focusSuggestion(-1);
      });

      if (!this.options.inlined) {
        $(window).bind(namespaced('resize'), function() {
          self.position();
        });
      }
    };

    Suggest.prototype.query = function() {
      if (!this._query) {
        this._query = $.trim(this.element.val());
      }

      return this._query;
    };

    Suggest.prototype.movementKeys = {
      '16': null, // Shift
      '27': function() { // esc
        this.hide();
        this.element.blur();
      },
      '37': null, // Arrow left
      '38': function(e) { // Arrow up
        this.focusPrevious();
        e.preventDefault(e);
      },
      '39': null, // Arrow right
      '40': function(e) { // Arrow down
        this.focusNext();
        e.preventDefault();
      },
      '9': function(e) { // tab
        !e.shiftKey ? this.focusNext() : this.focusPrevious();
        e.preventDefault();
      },
      '13': function(e) { // enter
        var link = this.container.find("li.focused a").get(0);
        if (link) {
          e.preventDefault();
          window.location = link.href;
        } else if (!this.options.remote) {
          e.preventDefault();
        }
      }
    };

    Suggest.prototype.search = function(value) {
      var value = this.query();
      if (value === '') {
        this.render([]);
        this.hide();
      } else {
        this.searchSources(value);
      }
    };

    Suggest.prototype.searchSources = function(value) {
      if (this.options.remote) {
        this.remoteSearch(value);
      } else {
        this.localSearch(value);
      }
    };

    Suggest.prototype.remoteSearch = function(value) {
      if (!this.queuer) {
        this.queuer = new Mp.AjaxQueuer(this.element);
      }

      if (value.length >= 2) {
        var self = this,
            params = {}

        params[this.element.attr('name')] = value;

        this.queuer.enqueue({
          url: this.options.source,
          data: $.param(params),
          method: "GET",
          dataType: "json",
          success: function(data) {
            self.update(data);
          }
        });
      }
    };

    Suggest.prototype.localSearch = function(value) {
      var self = this,
          pattern = [],
          values, test, results;

      values = value.replace(/\s+/, ' ').split(' ');
      if (values.length > 1) {
        for (var i = 0, j = values.length; i < j; i++) {
          pattern.push('(?=.*'+values[i]+')');
        }
      } else {
        pattern.push(value);
      }

      test = new RegExp(pattern.join(''), 'gi');

      results = $.grep(this.source, function(match) {
        var result = test.exec(match.name) !== null;
        test.lastIndex = 0;
        return result;
      }).sort(function(one, other) {
        return self.options.sortFunction.call(self, one, other);
      });

      this.update(results);
    };

    Suggest.prototype.update = function(matches) {
      if (matches.length !== 0) {
        if (this.options.limit !== false) {
          matches = matches.splice(0, this.options.limit);
        }
        this.render(matches);
        if (this.container.is(':hidden')) {
          this.show();
        }
      } else {
        this.options.onNoResults.call(this);
      }
    };

    Suggest.prototype.render = function(matches) {
      this.current_suggestions = matches;
      this.focused = -1;

      var self = this,
          html = ['<ul>'];
      $.each(this.current_suggestions, function(i, item) {
        html.push(self.options.itemTemplate.call(self, item, self.query()));
      });
      html.push('</ul>');

      this.container.html(html.join(''));
    };

    Suggest.prototype.show = function() {
      this.position();
      this.container.show();
      var self = this;
      $(document).bind(('click.autocomplete'+ this._id), function(e) {
        var el = self.container.get(0);
        if (e.target !== self.element.get(0) && e.target !== el && !$.contains(el, e.target)) {
          self.hide();
          self.element.blur();
        }
      });
      this.options.onShow.call(this);
    };

    Suggest.prototype.hide = function() {
      this.container.hide();
      $(document).unbind('click.autocomplete-'+ this._id);
      this.options.onHide.call(this);
    };

    Suggest.prototype.focusNext = function() {
      var num = this.current_suggestions.length;
      if (num > 0 && this.focused < (num - 1)) {
        this.focusSuggestion(this.focused + 1);
      } else if (this.focused === (num - 1)) {
        this.focusSuggestion(0);
      }
    };

    Suggest.prototype.focusPrevious = function() {
      if (this.focused !== -1) {
        this.focusSuggestion(this.focused - 1);
      } else {
        this.focusSuggestion(this.current_suggestions.length - 1);
      }
    };

    Suggest.prototype.focusSuggestion = function(num) {
      this.container.find('li').removeClass('focused')
        .filter(':nth-child('+ (num + 1) +')')
        .addClass('focused');
      this.focused = num;
    };

    Suggest.prototype.position = function() {
      if (this.options.inlined) {
        return;
      }
      var position = this.element.offset();
      this.container.css({
        'top': Math.round(position.top + this.offsets.y) + 'px',
        'left': Math.round(position.left + this.offsets.x) + 'px'
      });
    };

    return function(selector, options) {
      new Suggest(selector, options);
    };
  }());
}(jQuery));
(function($,sr){
  "use strict";
  var debounce = function (func, threshold, execAsap) {
    var timeout;

    return function debounced () {
      var obj = this, args = arguments;
      function delayed () {
        if (!execAsap) {
          func.apply(obj, args);
        }
        timeout = null;
      };

      if (timeout)
        clearTimeout(timeout);
      else if (execAsap)
        func.apply(obj, args);

      timeout = setTimeout(delayed, threshold || 100);
    };
  }
  // smartresize
  jQuery.fn[sr] = function(fn) {
    return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr);
  };
})(jQuery,'smartresize');
(function($) {
  "use strict";
  namespace('Mp');

  Mp.suggestion_instances = -1;

  Mp.CookieChecker = function() {
    var cookie = $.cookie('allow-cookies'),
        $message;
    if (! cookie) {
      $message = $('#cookies');
      $message.bind('click', 'a.confirm', function(e) {
        e.preventDefault();
        $message.hide();
        $.cookie('allow-cookies', true, { expires: 365, path: '/' });
      });
      $('body').prepend($message.show());
    }
  };


  Mp.NavigationToggler = function(element) {
    var $toggler = $(element),
        $body = $('body'),
        setup_run = false,
        $nav;

    var hide = function(e) {
      e.preventDefault();
      $nav.slideUp(150, 'easeInOutSine', function() {
        $nav.addClass('hidden');
      });
    };

    var show = function(e) {
      e.preventDefault();
      $nav.slideDown(250, 'easeInOutSine', function() {
        $nav.removeClass('hidden');
      });
    };

    var setup = function() {
      if (setup_run) {
        return;
      }
      var $original_nav = $('#site-navigation');
      $nav = $original_nav.clone();
      $nav.attr('id', 'site-top-navigation')
        .addClass('hidden')
        .css('display', 'none');

      $nav.append('<a href="#" class="close"><span>Stäng meny</span></a>');
      $nav.find('a.close').bind('click', hide);

      $body.append($nav);
      setup_run = true;
    };

    $toggler.bind('click', show);
    setup();

    $(window).smartresize(function() {
      if ($body.width() >= 768) {
        $nav.hide();
      } else if (!$nav.hasClass('hidden')) {
        $nav.show();
      }
    });
  };

  Mp.focusAndCopy = function(selector) {
    var selectIt = function() {
      var input = this;
      window.setTimeout(function(){
        input.select();
      }, 5);
    };
    $(selector).bind('focus', selectIt).bind('click', selectIt);
  };

  Mp.placeholderFallback = function() {
    var setPlaceholder = function(element) {
      var $element = $(element),
          value    = $.trim($element.val()),
          placeholder = $element.attr('placeholder');
      if (value !== '') {
        return;
      }
      $element.addClass('placeholder').val(placeholder);
    };

    var removePlaceholder = function(element) {
      var $element = $(element),
          value    = $.trim($element.val()),
          placeholder = $element.attr('placeholder');

      if (value === placeholder) {
        $element.val('').removeClass('placeholder');
      }
    };

    $('input[placeholder], textarea[placeholder]').filter(function() {
      return $.trim($(this).val()) === '';
    }).bind('focus.placeholder', function() {
      removePlaceholder(this);
    }).bind('blur.placeholder', function() {
      setPlaceholder(this);
    }).each(function() {
      setPlaceholder(this);
    });
  };

  // Fallback for browsers not supporting css columns
  // This is only targeted towards lists for now
  Mp.columnsFallback = function(element, column_count) {
    var $container = $(element);
    if ($container.size() === 0) {
      return;
    }

    $container.each(function() {
      var $element    = $(this),
          $items      = $element.find('li'),
          size        = $items.size(),
          break_point = Math.ceil(size / column_count) - 1,
          html        = [],
          columns     = [];

      for (var i = 0; i < column_count; i++) {
        columns.push(['<div class="column c'+column_count+'"><ul>']);
      }

      var index = 0,
          column = 0;
      for (var i = 0; i < size; i++) {
        columns[column].push($items[i].outerHTML);

        if (index !== break_point) {
          index++;
        } else {
          index = 0;
          column++;
        }
      }

      for (var i = 0; i < column_count; i++) {
        columns[i].push('</ul></div>');
        columns[i] = columns[i].join("");
      }

      html.push('<div class="grid"><div class="container">');
      html.push(columns.join(""));
      html.push('</div></div>');

      $element.replaceWith(html.join(""));
    });
  };

  Mp.SideNavigationToggler = function() {
    var $nav      = $('#secondary-navigation'),
        limit     = ($nav.data('limit') || 3) - 1,
        show_more = $nav.data('show-more-copy'),
        show_less = $nav.data('show-less-copy'),
        hidden = false;

    var targets = function() {
      return $nav.find('li:gt('+ limit +'):not(.more)');
    }

    var show = function() {
      targets().show();
      $nav.find('li.more a').text(show_less).addClass('show-less');
      hidden = false;
    };

    var hide = function() {
      targets().hide();
      $nav.find('li.more a').text(show_more).removeClass('show-less');
      hidden = true;
    }

    $nav.find('ul.menu')
      .append('<li class="leaf more"><a href="#site-navigation">'+ show_more +'</a></li>');
    $nav.delegate('li.more a', 'click', function(e) {
      e.preventDefault();
      if (hidden) {
        show();
      } else {
        hide();
      }
    });
    hide();
  };

  Mp.conversationWidths = function() {
    var getRandom = function(samples, ignore) {
          var sample = samples[Math.floor(Math.random()*steps.length)];
          return sample !== ignore ? sample : getRandom(samples, ignore);
        },
        conversations = $("div.conversations div.question"),
        max_width = $(conversations[0]).width(),
        min_width = max_width * 0.8,
        last_step,
        steps = [];

    for (var i = min_width; i <= max_width; i += 20) {
      steps.push(i);
    }
    steps.push(max_width);

    conversations.each(function() {
      var step = getRandom(steps, last_step);
      last_step = step;
      $(this).css({
        width: step + 'px'
      });
    });
  };

  $(document).ready(function() {
    var $html = $('html');

    if (! $html.hasClass('lte8')) {
      Mp.NavigationToggler('#skip-to-navigation');
    }

    if ($html.hasClass('lte9')) {
      Mp.placeholderFallback();
      Mp.columnsFallback('ol.labeled-list ol', 3);
    }

    Mp.CookieChecker();

    Mp.SideNavigationToggler();

    // Suggestions for lists (topics and localities)
    Mp.searchAsYouType('#list-search', {
      source: function() {
        var target   = this.element.data('target-list'),
            selector = (target ? (target + ' a') : 'div.labeled-list-container a'),
            items    = $.map($(selector), function(link) {
              return {
                name: $(link).text(),
                href: link.href
              };
            });

        this.source = items.sort(function(self, other) {
          return self.name.localeCompare(other.name);
        });
      },
      onShow: function() {
        this.element.parent().addClass('active-suggestions');
      },
      onHide: function() {
        this.element.parent().removeClass('active-suggestions');
      }
    });

    Mp.searchAsYouType('#main-search', {
      limit: 25,
      remote: true,
      inlined: true,
      itemTemplate: function(item, query) {
        var html = ['<li><a href="'+item.href+'">'],
        name = item.name,
        matches = [],
        words = query.split(' ');

        for (var i = 0, j = words.length; i < j; i++) {
          var word_matches = name.match(new RegExp(words[i], 'gi'));
          if (word_matches) {
            matches = matches.concat(word_matches);
          }
        }

        if (matches.length > 0) {
          for (var i = 0, j = matches.length; i < j; i++) {
            name = name.replace(matches[i], '<em>'+ matches[i] +'</em>');
          }
        }

        html.push('<span class="name">');
        html.push(name);
        html.push('</span>');
        html.push('<span class="category">');
        html.push(item.category);
        html.push('</span>');
        html.push('</a></li>');

        return html.join('');
      },
      onSetup: function() {
        this.container.addClass('main-search');
      },
      onShow: function() {
        this.element.addClass('has-suggestions');
      },
      onHide: function() {
        this.element.removeClass('has-suggestions');
      }
    });


    $('section.tabbed').tabs();
    $('#conversation-form').hide();
    $('#go-to-form').bind('click', function(e) {
      e.preventDefault();
      var $form = $('#conversation-form');
      if ($form.is(':visible')) {
        $('#conversation-form').slideUp();
      } else {
        $('#conversation-form').slideDown();
      }
    });

    Mp.conversationWidths();

    Mp.focusAndCopy('input.share');
  });


  if (! ('Mp' in window)) {
    window.Mp = Mp;
  }
}(jQuery));






