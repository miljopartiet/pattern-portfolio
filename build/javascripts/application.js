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
      console.log($original_nav);

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
      console.log(e);
      e.preventDefault();
      $nav.addClass('inactive').removeClass('active');
    };

    var show = function(e) {
      e.preventDefault();
      $nav.addClass('active').removeClass('inactive');
    };

    $toggler.bind('click', show);
    $toggler.bind('mouseenter', function() {
      setup();
    });
  }

  $(document).ready(function() {
    Mp.NavigationToggler('#skip-to-navigation');
    Mp.CookieChecker();
  });

}(jQuery));
