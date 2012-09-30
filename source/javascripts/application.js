(function($) {
  "use strict";
  var Mp = {};

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
        source: [],
        onShow: $.noop,
        onHide: $.noop
      }, opts || {});

      if (typeof options.source === 'function') {
        options.source = options.source.call(this);
      }

      $element.bind('keydown.autocomplete', function(e) {
        var func = movementKeys[e.keyCode.toString()];
        if (typeof func === 'function') {
          func.call(this, e);
        }
      }).bind('keyup.autocomplete', function(e) {
        if (typeof movementKeys[e.keyCode.toString()] !== 'undefined') {
          e.preventDefault();
          return;
        }
        search($element.val());
      }).bind('focus.autocomplete', function() {
        if ($.trim($element.val()) !== '') {
          show();
        }
      }).bind('blur.autocomplete', function() {
        focusSuggestion(-1);
      });

      $(window).bind('resize.autocomplete', position);

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

      var html = ['<ul>'];
      $.each(current_suggestions, function(i, c) {
        html.push('<li><a href="'+ c.href +'">'+ c.name +'</a></li>');
      });
      html.push('</ul>');
      $suggest_list.html(html.join(''));
    };

    var show = function() {
      position();
      $suggest_list.show();
      $("#search").addClass("has-results");
      $(document).bind('click.autocomplete', function(e) {
        var el = $suggest_list.get(0);
        if (e.target !== $element.get(0) && e.target !== el && !$.contains(el, e.target)) {
          hide();
          $element.blur();
        }
      });
      options.onShow($element, $suggest_list);
    };

    var hide = function() {
      $suggest_list.hide();
      $("#search").removeClass("has-results");
      $(document).unbind('click.autocomplete');
      options.onHide($element, $suggest_list);
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
      $suggest_list.find('li').removeClass('focused')
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
      $nav.attr('id', 'site-top-navigation').css({
        visibility: 'hidden'
      });

      $nav.append('<a href="#" class="close"><span>Stäng meny</span></a>');
      $nav.find('a.close').bind('click', hide);

      $('body').append($nav);
      var style = document.createElement('style');

      style.id = 'navigation-styles';
      style.type = 'text/css';
      style.innerHTML = calculateRules($nav);

      document.getElementsByTagName("head")[0].appendChild(style);
      setup_run = true;
    }

    var calculateRules = function(element) {
      var offset = element.outerHeight(),
          rules = "#site-top-navigation { margin-top: -"+ offset +"px; }";

      rules += "#site-top-navigation.inactive { margin-top: -"+ offset +"px; }";

      return rules;
    };

    var reset = function() {
      if (!setup_run) {
        setup();
        return;
      }

      var style_element = document.getElementById('navigation-styles');
      style_element.innerHTML = calculateRules(style_element);
    }

    var hide = function(e) {
      e.preventDefault();
      $nav.addClass('inactive').removeClass('active');
    };

    var show = function(e) {
      e.preventDefault();
      $nav.css('visibility', 'visible');
      $nav.addClass('active').removeClass('inactive');
    };

    $toggler.bind('click', show);
    $(document).bind('resize', function() {
      setTimeout(reset, 200);
    });
    setup();
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

  Mp.voting = function() {
    $('div.voting').each(function() {
      var $voting = $(this),
          $votable = $voting.find('div.votable'),
          $results = $voting.find('div.results');
      if ($results.size() == 0) {
        return;
      }

      $results.hide();

      $votable.append('<a href="#" class="show-results toggler">'+ $votable.data('show-results-copy') +'</a>');
      $results.append('<a href="#" class="show-votable toggler">'+ $results.data('show-votable-copy') +'</a>');

      $voting.delegate('button, a.show-results', 'click', function(e) {
        console.log(e);
        e.preventDefault();
        $votable.hide();
        $results.show();
      });

      $voting.delegate('a.show-votable', 'click', function(e) {
        e.preventDefault();
        $results.hide();
        $votable.show();
      });
    });
  }

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
      },
      onShow: function($element) {
        $element.parent().addClass('active-suggestions');
      },
      onHide: function($element) {
        $element.parent().removeClass('active-suggestions');
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

    Mp.focusAndCopy('input.share');
    Mp.voting();
  });

}(jQuery));
