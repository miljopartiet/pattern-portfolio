$(function() {
  var Mp = {};

  Mp.NavigationToggler = function(element) {
    var $toggler = $(element),
        setup_run = false,
        $nav;

    var setup = function() {
      if (setup_run) {
        return;
      }
      var $original_nav = $('nav[role="site"]');
      $nav = $original_nav.clone();
      $nav.attr('id', 'top-navigation');

      $nav.append('<a href="#" class="close">Stäng meny</span>');
      $nav.on('click', 'a.close', hide);

      $('body').append($nav);
      var se = document.createElement('style');
      se.type = 'text/css';
      var rules = "#top-navigation { margin-top: -"+ $nav.height() +"px; }";
      rules += "#top-navigation.inactive { margin-top: -"+ $nav.height() +"px; }";
      se.innerHTML = rules;

      document.getElementsByTagName("head")[0].appendChild(se);
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
    $toggler.bind('mouseenter', function() {
      setup();
    });
  }

  $(document).ready(function() {
    Mp.NavigationToggler('#skip-to-navigation');
  });

}(jQuery));
