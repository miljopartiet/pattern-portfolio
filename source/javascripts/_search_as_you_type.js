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
        onRender: $.noop,
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

      this.container = $('<div id="suggestions-'+ this._id +'" class="suggestions" style="display:none;"></div>');

      if (!this.options.inlined) {
        this.container.css({
          position: "absolute",
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
        var $target = $(this.element.data("suggestions-target") || this.element.parent("form"));
        $target.append(this.container);
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
      var value = value || this.query();
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
      this.options.onRender.call(this);
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
      return new Suggest(selector, options);
    };
  }());
}(jQuery));
