(function($) {
  "use strict";
  var Mp = {};

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
        source: [],
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
    }

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
        e.preventDefault();
        this.container.find("a.focused").trigger("click");
      }
    };

    Suggest.prototype.search = function(value) {
      var value = this.query();
      if (value === '') {
        this.update([]);
        this.hide();
      } else {
        var matches = this.searchSources(value);
        if (matches.length !== 0) {
          if (this.options.limit !== false) {
            matches = matches.splice(0, this.options.limit);
          }
          this.update(matches);
          if (this.container.is(':hidden')) {
            this.show();
          }
        } else {
          this.options.onNoResults.call(this);
        }
      }
    };

    Suggest.prototype.searchSources = function(value) {
      var self = this,
          pattern = [],
          values, test;

      values = value.replace(/\s+/, ' ').split(' ');
      if (values.length > 1) {
        for (var i = 0, j = values.length; i < j; i++) {
          pattern.push('(?=.*'+values[i]+')');
        }
      } else {
        pattern.push(value);
      }

      test = new RegExp(pattern.join(''), 'gi');

      return $.grep(this.source, function(match) {
        return test.exec(match.name) !== null;
      }).sort(function(one, other) {
        return self.options.sortFunction.call(self, one, other);
      });
    };

    Suggest.prototype.update = function(matches) {
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
  });


  if (! ('Mp' in window)) {
    window.Mp = Mp;
  }
}(jQuery));
