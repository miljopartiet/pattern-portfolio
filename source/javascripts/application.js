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

    Mp.focusAndCopy('input.share');
  });


  if (! ('Mp' in window)) {
    window.Mp = Mp;
  }
}(jQuery));
