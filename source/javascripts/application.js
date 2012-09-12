$(function() {
  "use strict";
  var Mp = {};

  Mp.CookieChecker = function() {
    var cookie = Cookies.get('allow-cookies'),
        $message;
    if (! cookie) {
      $message = $('#cookies');
      $message.on('click', 'a.confirm', function(e) {
        e.preventDefault();
        $message.hide();
        Cookies.set('allow-cookies', true);
      });
      $message.show();
    }
  };

  Mp.searchAsYouType = (function() {
    var $element, $suggest_list,
    positionOffsetX, positionOffsetY,
    options,
    focused = -1, current_suggestions = [];

    var movementKeys = {
      '16': null, // Shift
      '27': function() { // esc
        hide();
        $element.blur();
      },
      '37': null, // Arrow left
      '38': function(e) { // Arrow up
        focusPrevious();
        e.preventDefault(e);
      },
      '39': null, // Arrow right
      '40': function(e) { // Arrow down
        focusNext();
        e.preventDefault();
      },
      '9': function(e) { // tab
        !e.shiftKey ? focusNext() : focusPrevious();
        e.preventDefault();
      },
      '13': function(e) { // enter
        e.preventDefault();
        $suggest_list.find("a.focused").trigger("click");
      }
    };

    var init = function(element, opts) {
      $element = $(element);
      if ($element.size() == 0) {
        return;
      }
      $suggest_list = $('<div id="search-suggestions" class="suggestions" style="display:none;position:absolute;"></div>');
      $suggest_list.css({
        width: $element.outerWidth() + 'px'
      });
      var $body = $('body');
      positionOffsetX = parseInt($body.css('paddingLeft'), 10);
      positionOffsetY = parseInt($body.css('paddingTop'), 10) + $element.outerHeight();

      options = $.extend({
        source: []
      }, opts || {});

      if (typeof options.source === 'function') {
        options.source = options.source.call(this);
      }

      $element.on('keydown.autocomplete', function(e) {
        var func = movementKeys[e.keyCode.toString()];
        if (typeof func === 'function') {
          func.call(this, e);
        }
      }).on('keyup.autocomplete', function(e) {
        if (typeof movementKeys[e.keyCode.toString()] !== 'undefined') {
          e.preventDefault();
          return;
        }
        search($element.val());
      }).on('focus.autocomplete', function() {
        if ($.trim($element.val()) !== '') {
          show();
        }
      }).on('blur.autocomplete', function() {
        focusSuggestion(-1);
      });

      $(window).on('resize.autocomplete', position);

      $suggest_list.appendTo('body');
    };

    var search = function(value) {
      var value = $.trim(value);
      if (value === '') {
        update([]);
        hide();
      } else if (value !== '') {
        update(searchSources(value));
        if ($suggest_list.is(':hidden')) {
          show();
        }
      }
    };

    var searchSources = function(value) {
      var test = new RegExp('^' + value + '|\\s' + value, 'i');
      return $.grep(options.source, function(company) {
        return test.exec(company.name) !== null;
      });
    };

    var update = function(matches) {
      current_suggestions = matches;
      focused = -1;

      if (current_suggestions.length == 0) {
        current_suggestions.push(notFound());
      }

      var html = [];
      $.each(current_suggestions, function(i, c) {
        html.push('<a href="'+ c.href +'">'+ c.name +'</a>');
      });
      $suggest_list.html(html.join(''));
    };

    var show = function() {
      position();
      $suggest_list.show();
      $("#search").addClass("has-results");
      $(document).on('click.autocomplete', function(e) {
        var el = $suggest_list.get(0);
        if (e.target !== $element.get(0) && e.target !== el && !$.contains(el, e.target)) {
          hide();
          $element.blur();
        }
      });
    };

    var hide = function() {
      $suggest_list.hide();
      $("#search").removeClass("has-results");
      $(document).off('click.autocomplete');
    };

    var focusNext = function() {
      var num = current_suggestions.length;
      if (num > 0 && focused < (num - 1)) {
        focusSuggestion(focused + 1);
      } else if (focused === (num - 1)) {
        focusSuggestion(0);
      }
    };

    var focusPrevious = function() {
      if (focused !== -1) {
        focusSuggestion(focused - 1);
      } else {
        focusSuggestion(current_suggestions.length - 1);
      }
    };

    var focusSuggestion = function(num) {
      $suggest_list.find('a').removeClass('focused')
      .filter(':nth-child('+ (num + 1) +')')
      .addClass('focused');
      focused = num;
    };

    var position = function() {
      var position = $element.offset();
      $suggest_list.css({
        'top': Math.round(position.top + positionOffsetY) + 'px',
        'left': Math.round(position.left + positionOffsetX) + 'px'
      });
    };

    var notFound = function () {
      return {
        name: 'No matches found',
        id: null
      }
    };

    return init;
  })();

  Mp.NavigationToggler = function(element) {
    var $toggler = $(element),
        setup_run = false,
        $nav;

    var setup = function() {
      if (setup_run) {
        return;
      }
      var $original_nav = $('#site-navigation');
      $nav = $original_nav.clone();
      $nav.attr('id', 'site-top-navigation');

      $nav.append('<a href="#" class="close"><span>Stäng meny</span></a>');
      $nav.on('click', 'a.close', hide);

      $('body').append($nav);
      var offset = $nav.outerHeight(),
          style = document.createElement('style'),
          rules = "#site-top-navigation { margin-top: -"+ offset +"px; }";

      rules += "#site-top-navigation.inactive { margin-top: -"+ offset +"px; }";
      style.type = 'text/css';
      style.innerHTML = rules;

      document.getElementsByTagName("head")[0].appendChild(style);
      setup_run = true;
    }

    var hide = function(e) {
      e.preventDefault();
      $nav.addClass('inactive').removeClass('active');
    };

    var show = function(e) {
      e.preventDefault();
      $nav.addClass('active').removeClass('inactive');
    };

    $toggler.bind('click', show);
    setup();
  };

  $(document).ready(function() {
    Mp.NavigationToggler('#skip-to-navigation');
    Mp.CookieChecker();
    Mp.searchAsYouType('#topics-search', {
      source: function() {
        var items = $.map($('#topics a'), function(link) {
          return {
            name: $(link).text(),
            href: link.href
          };
        });

        return items.sort(function(self, other) {
          return naturalSort(self.name, other.name);
        });
      }
    })
  });

}(jQuery));
