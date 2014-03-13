//= require lib/_fastclick
//= require _navigation

(function($) {
  "use strict";
  namespace('Mp');

  Mp.suggestion_instances = -1;

  Mp.CookieChecker = function() {
    var cookie = $.cookie('allow-cookies'),
        $message;
    if (! cookie) {
      $message = $('#cookies');
      $message.find('a.confirm').bind('click', function(e) {
        e.preventDefault();
        $message.hide();
        $.cookie('allow-cookies', true, { expires: 365, path: '/' });
      });
      $('#site-banner').prepend($message.show());
    }
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

  $(document).ready(function() {
    var $html = $('html');

    // Get rid of those pesky 300ms on mobile clicks
    FastClick.attach(document.body);

    Mp.NavigationToggler("#site-banner");

    if ($html.hasClass('lte9')) {
      Mp.placeholderFallback();
      Mp.columnsFallback('ol.labeled-list ol', 3);
    }

    Mp.CookieChecker();

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
      limit: 5,
      remote: true,
      inlined: true,
      itemTemplate: function(item, query) {
        var html = ['<li><a href="'+item.href+'">'];

        html.push('<span class="name">');
        html.push(item.name);
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
      },

      onRender: function() {
        var searchAllHTML = ['<li>'];
        searchAllHTML.push('<a href="#" class="search-all">');
        searchAllHTML.push('<span class="name">Sök efter ”<span class="query">'+this.query()+'</span>”</span>');
        searchAllHTML.push('<span class="category">Sök i allt</span>');
        searchAllHTML.push('</a>');
        searchAllHTML.push('</li>');

        // We want an extra suggestion for focus to work
        this.current_suggestions.push("Sök allt");

        this.container.find("ul").append(searchAllHTML.join(""));

        this.container.delegate(".search-all", "click", $.proxy(function(event) {
          event.preventDefault();
          this.element.parent("form").submit();
        }, this));
      }
    });

    $('.tabbed').tabs();
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
